import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { CameraRig } from './CameraRig.js';
import { Sky } from './Sky.js';
import { Sun } from './Sun.js';
import { Planet } from './Planet.js';
import { Ship } from './Ship.js';
import { clamp, damp, lerp, prefersReducedMotion } from '../lib/math.js';

const SHIP_URL = `${import.meta.env.BASE_URL}models/spaceship.glb`;
const ORIGIN = new THREE.Vector3();
const tmp = new THREE.Vector3();
const tmp2 = new THREE.Vector3();

const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * The 3D scene. It knows nothing about HTML; the UI talks to it through
 * intro() / takeOff() / flyTo(id) / release() and listens for events:
 *   'arrive'  { id }  ship reached a body
 */
export class World extends EventTarget {
  constructor(canvas, defs) {
    super();
    this.canvas = canvas;
    this.reducedMotion = prefersReducedMotion();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(this.pixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    this.renderer = renderer;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#020308');
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 4000);
    this.scene.add(this.camera);
    this.rig = new CameraRig(this.camera, canvas);

    // Lights only matter for the ship; planets light themselves in their shaders.
    const sunLight = new THREE.PointLight('#fff0dc', 3.2, 0, 0);
    const ambient = new THREE.AmbientLight('#8796b8', 0.55);
    const fill = new THREE.DirectionalLight('#a9bcff', 0.7);
    fill.position.set(-1, 1, 2);
    this.camera.add(fill);
    this.scene.add(sunLight, ambient);

    this.sky = new Sky({ pixelRatio: this.pixelRatio });
    this.scene.add(this.sky.object);

    const [sunDef, ...planetDefs] = defs;
    this.sun = new Sun(sunDef);
    this.planets = planetDefs.map((d, i) => new Planet(d, i + 1));
    this.bodies = [this.sun, ...this.planets];
    this.byId = Object.fromEntries(this.bodies.map((b) => [b.id, b]));
    this.scene.add(this.sun.group);
    for (const p of this.planets) this.scene.add(p.group, p.orbitLine);
    this.systemRadius = Math.max(...this.planets.map((p) => p.orbitRadius + p.size));

    this.ship = new Ship();
    this.scene.add(this.ship.group);

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.7, 0.5, 0.95);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.mode = 'loading';
    this.focus = null;
    this.time = 0;
    this.orbitTime = 0;
    this.timeScale = 1;
    this.timeScaleGoal = 1;
    this.clock = new THREE.Clock();
    this.onFrame = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    renderer.setAnimationLoop(() => this.#tick());
  }

  async load(onProgress) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_url, loaded, total) => onProgress?.(loaded / total);
    await this.ship.load(new GLTFLoader(manager), SHIP_URL);
    onProgress?.(1);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.width = w;
    this.height = h;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.composer.setPixelRatio(this.pixelRatio);
    this.rig.resize(w, h);
    if (this.mode === 'overview') this.rig.setGoal({ r: this.overviewRadius() });
  }

  /** Far enough back that the whole system fits, within reason on phones. */
  overviewRadius() {
    const R = this.systemRadius + 4;
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const tanH = tanV * this.camera.aspect;
    return clamp(Math.max(R / tanH, (R * 0.7) / tanV) * 1.25, 70, 210);
  }

  // ---- choreography ---------------------------------------------------------

  /** Opening shot: the system far below, the ship sliding into frame. */
  intro() {
    this.mode = 'intro';
    const rig = this.rig;
    rig.interactive = false;
    rig.follow = null;
    rig.goalTarget.set(0, 0, 0);
    rig.setGoal({ r: 250, theta: 0.5, phi: 0.6 });
    rig.snap();

    const { right, up, fwd } = this.#cameraBasis();
    const cam = this.camera.position;
    const narrow = this.camera.aspect < 1;
    const anchor = cam
      .clone()
      .addScaledVector(fwd, 9)
      .addScaledVector(right, narrow ? 0.6 : 2.3)
      .addScaledVector(up, narrow ? 1.7 : -0.7);
    const start = cam.clone().addScaledVector(fwd, 14).addScaledVector(right, -16).addScaledVector(up, -8);
    const look = anchor.clone().addScaledVector(right, -1).addScaledVector(fwd, 1.1).addScaledVector(up, 0.15);

    this.ship.hoverAt(start, anchor);
    return this.ship.flyTo(() => anchor, { duration: this.#dur(3.2), arc: 0.08, lookAtOnArrive: look });
  }

  /** "Take off": dive from the opening shot down to the system overview. */
  async takeOff() {
    this.mode = 'descending';
    const rig = this.rig;
    const r = this.overviewRadius();
    const theta = rig.theta + 0.4;
    rig.speed.orbit = 0.9;
    rig.setGoal({ r, theta, phi: 0.92 });

    const dock = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta))
      .multiplyScalar(this.systemRadius + 3)
      .add(tmp.set(0, 1.2, 0));
    await this.ship.flyTo(() => dock, { duration: this.#dur(4.2), arc: 0.25, lookAtOnArrive: ORIGIN });

    rig.speed.orbit = 3;
    this.#toOverview();
  }

  /** Skip the intro entirely (deep links, reduced motion). */
  skipIntro() {
    const rig = this.rig;
    rig.follow = null;
    rig.goalTarget.set(0, 0, 0);
    rig.setGoal({ r: this.overviewRadius(), theta: 0.9, phi: 0.92 });
    rig.snap();
    const dock = new THREE.Vector3(Math.sin(0.9), 0, Math.cos(0.9))
      .multiplyScalar(this.systemRadius + 3)
      .add(tmp.set(0, 1.2, 0));
    this.ship.hoverAt(dock, ORIGIN);
    this.#toOverview();
  }

  /**
   * Fly the ship (and the camera) to a body. Resolves on arrival; rejects if
   * another flight starts first.
   */
  async flyTo(id) {
    const body = this.byId[id];
    if (!body) throw new Error(`No body "${id}"`);
    const rig = this.rig;
    this.mode = 'flying';
    this.focus = body;
    this.timeScaleGoal = 0.35;

    // Look at the planet from roughly the sun's side so we see its day face.
    let theta = rig.theta;
    if (body !== this.sun) {
      const p = body.position;
      theta = rig.theta + wrapAngle(Math.atan2(-p.x, -p.z) + 0.6 - rig.theta);
    }
    const focusR = this.#focusRadius(body);

    // Park beside the planet on the camera's side so the ship stays in view.
    const park = {
      body,
      // Angle of the camera's direction from the planet, nudged toward screen-right.
      angle: Math.atan2(Math.cos(theta), Math.sin(theta)) - 0.55,
      radius: body.size * (body === this.sun ? 1.6 : 1.5) + 0.5,
    };
    const end = new THREE.Vector3();
    const getEnd = () => this.ship.parkPoint(park, end);
    const dist = this.ship.position.distanceTo(getEnd());

    this.flightCam = { r0: rig.r, r1: focusR, bump: Math.min(dist * 0.12, 18) };
    rig.speed.target = 3.2;
    rig.follow = () => tmp2.lerpVectors(this.ship.position, body.position, 0.25 + 0.75 * this.ship.progress);
    rig.setGoal({ theta, phi: 1.16 });
    rig.limits.rMin = body.size * 1.8;

    await this.ship.flyTo(getEnd, {
      duration: this.#dur(clamp(1.3 + dist * 0.024, 1.5, 3.4)),
      arc: 0.18,
      park,
    });
    if (this.focus !== body) throw new Error('cancelled'); // released mid-flight

    this.mode = 'focused';
    this.timeScaleGoal = 0.06;
    rig.follow = () => body.position;
    rig.speed.target = 6;
    rig.setGoal({ r: focusR });
    this.dispatchEvent(new CustomEvent('arrive', { detail: { id } }));
  }

  /** Back out to the whole-system view. The ship stays parked where it is. */
  release() {
    this.focus = null;
    this.#toOverview();
  }

  #toOverview() {
    const rig = this.rig;
    this.mode = 'overview';
    this.timeScaleGoal = 1;
    rig.follow = null;
    rig.goalTarget.set(0, 0, 0);
    rig.speed.target = 2.5;
    rig.limits.rMin = 18;
    rig.setGoal({ r: this.overviewRadius(), phi: clamp(rig.goal.phi, 0.7, 1.05) });
    rig.interactive = true;
  }

  #focusRadius(body) {
    if (body === this.sun) return body.size * 8;
    const look = body.def.look;
    const extent = body.size * (look.rings ? look.rings.outer * 0.8 : look.moons ? 2.4 : 1.25);
    return extent * 3.6 + 2;
  }

  #dur(seconds) {
    return this.reducedMotion ? seconds * 0.45 : seconds;
  }

  #cameraBasis() {
    const m = this.camera.matrixWorld;
    return {
      right: new THREE.Vector3().setFromMatrixColumn(m, 0).normalize(),
      up: new THREE.Vector3().setFromMatrixColumn(m, 1).normalize(),
      fwd: new THREE.Vector3().setFromMatrixColumn(m, 2).normalize().negate(),
    };
  }

  // ---- queries for the UI ---------------------------------------------------

  /** Where a body is on screen, and roughly how big (px radius). */
  screenInfo(body, out = {}) {
    const pos = body.position;
    tmp.copy(pos).project(this.camera);
    out.visible = tmp.z > -1 && tmp.z < 1;
    out.x = ((tmp.x + 1) / 2) * this.width;
    out.y = ((1 - tmp.y) / 2) * this.height;
    out.dist = this.camera.position.distanceTo(pos);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    out.r = (body.size / (out.dist * tanV)) * (this.height / 2);
    return out;
  }

  /** The body under a screen point, generous on small/far planets. */
  pick(x, y) {
    let best = null;
    const s = {};
    for (const body of this.bodies) {
      this.screenInfo(body, s);
      if (!s.visible) continue;
      const hitR = Math.max(s.r * 1.15, 16);
      if (Math.hypot(s.x - x, s.y - y) < hitR && (!best || s.dist < best.dist)) {
        best = { body, dist: s.dist };
      }
    }
    return best?.body ?? null;
  }

  setHovered(id) {
    for (const b of this.bodies) b.setHover(b.id === id);
  }

  /** Pixels to shift the view so the focused planet clears the panel. */
  setInset(x, y) {
    this.rig.setInset(x, y);
  }

  /** 0..1 audio level; makes the music planet's rings ripple. */
  setMusicLevel(level) {
    this.bodies.find((b) => b.def.look.rings)?.setPulse(level);
  }

  // ---- loop -----------------------------------------------------------------

  #tick() {
    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.time += dt;
    this.timeScale = damp(this.timeScale, this.timeScaleGoal, 2, dt);
    this.orbitTime += dt * this.timeScale;
    const spinDt = dt * Math.max(this.timeScale, 0.35);

    this.sky.update(dt, this.time);
    this.sun.update(dt, this.time);
    // Orbit lines fade out up close, where they'd slice across the planet.
    this.orbitAlpha = damp(this.orbitAlpha ?? 1, this.mode === 'focused' || this.mode === 'flying' ? 0.15 : 1, 3, dt);
    for (const p of this.planets) p.update(dt, this.orbitTime, this.time, spinDt, this.orbitAlpha);
    this.ship.update(dt, this.time);

    if (this.mode === 'flying' && this.flightCam) {
      const e = this.ship.progress;
      const { r0, r1, bump } = this.flightCam;
      this.rig.setGoal({ r: lerp(r0, r1, e) + Math.sin(Math.PI * e) * bump });
    }
    this.rig.update(dt);

    this.composer.render();
    this.onFrame?.(dt);
  }
}
