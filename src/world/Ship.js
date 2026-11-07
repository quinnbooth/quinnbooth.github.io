import * as THREE from 'three';
import { glowSprite } from './glow.js';
import { clamp, damp, easeInOutCubic, quadBezier } from '../lib/math.js';

const UP = new THREE.Vector3(0, 1, 0);
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();
const lookHelper = new THREE.Object3D();

/**
 * The ship I modeled in Blender for v1 of this site, now with a working autopilot.
 *
 * The old version chased planets by nudging toward them each frame, which meant
 * a fast planet could outrun it forever. Here a flight is a curve parameterized
 * by time: t goes 0 -> 1 over a fixed duration, and the end of the curve is
 * re-evaluated every frame from wherever the planet is *now*. Arrival is
 * guaranteed, on schedule, at any frame rate.
 */
export class Ship {
  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;
    this.bank = new THREE.Group();
    this.group.add(this.bank);

    this.length = 1.15;
    this.state = 'hidden';
    this.anchor = new THREE.Vector3();
    this.idleLook = new THREE.Vector3();
    this.prev = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.thrust = 0.3;
    this.roll = 0;

    this.flame = glowSprite(new THREE.Color('#ffb070'), 0.9, 1);
    this.flameCore = glowSprite(new THREE.Color('#fff2dc'), 0.35, 1);
    this.bank.add(this.flame, this.flameCore);
  }

  async load(loader, url) {
    const gltf = await loader.loadAsync(url);
    const model = gltf.scene;

    // The Blender model's nose points down +X. Object3D.lookAt aims +Z, so turn it.
    model.rotation.y = -Math.PI / 2;
    const wrap = new THREE.Group();
    wrap.add(model);
    wrap.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(wrap);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const scale = this.length / Math.max(size.x, size.y, size.z);
    wrap.scale.setScalar(scale);

    model.traverse((o) => {
      if (o.isMesh && o.material) {
        o.material.metalness = 0.35;
        o.material.roughness = 0.45;
      }
    });

    const tail = (box.min.z - center.z) * scale;
    this.flame.position.set(0, 0, tail - 0.05);
    this.flameCore.position.set(0, 0, tail + 0.02);
    this.bank.add(wrap);
  }

  get position() {
    return this.group.position;
  }

  /** Put the ship somewhere and let it hover there, nose toward `lookAt`. */
  hoverAt(point, lookAt) {
    this.state = 'idle';
    this.group.visible = true;
    this.anchor.copy(point);
    this.idleLook.copy(lookAt);
    this.group.position.copy(point);
    this.#faceToward(tmp.copy(lookAt).sub(point), 1);
    this.prev.copy(point);
  }

  /**
   * Fly to a (possibly moving) point.
   * @param getEnd   () => Vector3, called every frame
   * @param opts.duration seconds
   * @param opts.arc  how much the path bows out (fraction of distance)
   * @param opts.park { body, angle, radius } to orbit on arrival; omit to hover
   * @returns Promise that resolves on arrival (or rejects if superseded)
   */
  flyTo(getEnd, { duration, arc = 0.22, park = null, lookAtOnArrive = null } = {}) {
    this.flight?.reject?.(new Error('superseded'));
    this.group.visible = true;

    const start = this.group.position.clone();
    const end0 = getEnd().clone();
    const dist = start.distanceTo(end0);
    const dir = tmp.copy(end0).sub(start).normalize();
    const side = tmp2.crossVectors(dir, UP).normalize();
    if (!Number.isFinite(side.x) || side.lengthSq() < 0.01) side.set(1, 0, 0);
    const ctrl = start
      .clone()
      .lerp(end0, 0.5)
      .addScaledVector(UP, dist * arc)
      .addScaledVector(side, dist * arc * 0.6);

    return new Promise((resolve, reject) => {
      this.state = 'flying';
      this.flight = {
        start,
        ctrl,
        getEnd,
        t: 0,
        duration: Math.max(0.3, duration),
        park,
        lookAtOnArrive,
        resolve,
        reject,
      };
    });
  }

  /** 0..1 progress of the current flight (eased), or 1 if not flying. */
  get progress() {
    return this.state === 'flying' ? easeInOutCubic(this.flight.t) : 1;
  }

  update(dt, time) {
    if (this.state === 'hidden') return;
    const pos = this.group.position;
    this.prev.copy(pos);

    if (this.state === 'flying') {
      const f = this.flight;
      f.t = Math.min(1, f.t + dt / f.duration);
      quadBezier(pos, f.start, f.ctrl, f.getEnd(), easeInOutCubic(f.t));
      if (f.t >= 1) this.#arrive();
    } else if (this.state === 'parked') {
      const p = this.park;
      p.angle += dt * p.speed;
      pos.copy(p.body.position).add(this.#parkOffset(p, tmp));
    } else if (this.state === 'idle') {
      pos.copy(this.anchor);
      pos.y += Math.sin(time * 1.3) * 0.06;
    }

    // Derive velocity from actual movement (frame-rate independent).
    if (dt > 0) this.velocity.copy(pos).sub(this.prev).divideScalar(dt);
    const speed = this.velocity.length();

    // Orientation: face where we're going; when idle, face the idle target.
    if (this.state === 'idle') {
      this.#faceToward(tmp.copy(this.idleLook).sub(pos), 1 - Math.exp(-3 * dt));
    } else if (this.state === 'parked') {
      const p = this.park;
      tmp.set(-Math.sin(p.angle), 0, Math.cos(p.angle)).multiplyScalar(Math.sign(p.speed));
      this.#faceToward(tmp, 1 - Math.exp(-4 * dt));
    } else if (speed > 0.05) {
      this.#faceToward(tmp.copy(this.velocity), 1 - Math.exp(-7 * dt));
    }

    // Bank into turns a little; bob a little when idle.
    const turn = this.state === 'flying' ? clamp(this.velocity.x * 0.01, -0.5, 0.5) : 0;
    this.roll = damp(this.roll, turn, 3, dt);
    this.bank.rotation.z = this.roll + Math.sin(time * 0.9) * 0.06;

    // Engine glow follows speed.
    const goal = clamp(0.35 + speed / 18, 0.35, 1.6);
    this.thrust = damp(this.thrust, goal, 6, dt);
    const flicker = 1 + Math.sin(time * 40) * 0.05 + Math.sin(time * 23) * 0.05;
    this.flame.scale.setScalar(0.55 * this.thrust * flicker);
    this.flameCore.scale.setScalar(0.22 * this.thrust * flicker);
  }

  #arrive() {
    const f = this.flight;
    this.flight = null;
    if (f.park) {
      this.state = 'parked';
      this.park = { speed: 0.1, ...f.park };
    } else {
      this.state = 'idle';
      this.anchor.copy(this.group.position);
      if (f.lookAtOnArrive) this.idleLook.copy(f.lookAtOnArrive);
      else this.idleLook.copy(this.group.position).add(this.velocity);
    }
    f.resolve();
  }

  #parkOffset(p, out) {
    return out.set(
      Math.cos(p.angle) * p.radius,
      p.radius * 0.18 + Math.sin(p.angle * 2) * 0.08,
      Math.sin(p.angle) * p.radius,
    );
  }

  /** Where the ship will sit when parked at `body` starting at `angle`. */
  parkPoint(park, out = new THREE.Vector3()) {
    return out.copy(park.body.position).add(this.#parkOffset(park, tmp2));
  }

  #faceToward(dir, alpha) {
    if (dir.lengthSq() < 1e-6) return;
    lookHelper.position.set(0, 0, 0);
    lookHelper.lookAt(dir);
    this.group.quaternion.slerp(lookHelper.quaternion, alpha);
  }
}
