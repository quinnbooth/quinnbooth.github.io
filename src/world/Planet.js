import * as THREE from 'three';
import {
  SURFACE,
  planetVertex,
  planetFragment,
  atmosphereVertex,
  atmosphereFragment,
  ringVertex,
  ringFragment,
} from './shaders/planet.js';
import { glowSprite } from './glow.js';
import { damp } from '../lib/math.js';

const SPHERE = new THREE.SphereGeometry(1, 96, 64);
const SPHERE_LOW = new THREE.SphereGeometry(1, 32, 24);

function surfaceMaterial(look, seed) {
  const [c1, c2, c3] = look.colors.map((c) => new THREE.Color(c));
  return new THREE.ShaderMaterial({
    vertexShader: planetVertex,
    fragmentShader: planetFragment,
    uniforms: {
      uType: { value: SURFACE[look.surface] },
      uC1: { value: c1 },
      uC2: { value: c2 },
      uC3: { value: c3 },
      uAtmo: { value: new THREE.Color(look.atmosphere ?? '#ffffff') },
      uSeed: { value: seed },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uBands: { value: look.bands ?? 14 },
    },
  });
}

function orbitLine(radius) {
  const segments = 256;
  const pts = new Float32Array((segments + 1) * 3);
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.set([Math.cos(a) * radius, 0, Math.sin(a) * radius], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  return new THREE.Line(
    geo,
    new THREE.LineBasicMaterial({ color: '#e8dccb', transparent: true, opacity: 0.1, depthWrite: false }),
  );
}

export class Planet {
  constructor(def, index) {
    this.def = def;
    this.id = def.id;
    const look = def.look;
    this.size = look.size;
    this.orbitRadius = def.orbit.radius;
    this.period = def.orbit.period;
    this.phase = def.orbit.phase ?? index * 2.4;
    this.spinSpeed = look.spin ?? 0.12;
    this.hover = 0;
    this.hoverGoal = 0;
    this.pulse = 0;
    this.pulseGoal = 0;

    // group: travels along the orbit. tilt: axial tilt. mesh: spins.
    this.group = new THREE.Group();
    this.tilt = new THREE.Group();
    this.tilt.rotation.z = look.tilt ?? 0.2;
    this.group.add(this.tilt);

    this.material = surfaceMaterial(look, index * 7.31 + 1.7);
    this.mesh = new THREE.Mesh(SPHERE, this.material);
    this.mesh.scale.setScalar(this.size);
    this.tilt.add(this.mesh);

    this.atmo = new THREE.Mesh(
      SPHERE,
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uColor: { value: new THREE.Color(look.atmosphere ?? '#ffffff') },
          uStrength: { value: 0.9 },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.atmo.scale.setScalar(this.size * 1.18);
    this.tilt.add(this.atmo);

    if (look.rings) this.#addRings(look.rings, index);
    if (look.moons) this.#addMoons(look.moons, index);
    if (look.beacon) this.#addBeacon(look.beacon);

    this.orbitLine = orbitLine(this.orbitRadius);
  }

  #addRings(rings, index) {
    const inner = this.size * rings.inner;
    const outer = this.size * rings.outer;
    this.ringUniforms = {
      uInner: { value: inner },
      uOuter: { value: outer },
      uC1: { value: new THREE.Color(rings.colors[0]) },
      uC2: { value: new THREE.Color(rings.colors[1]) },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uSeed: { value: index * 3.1 },
    };
    this.rings = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 160, 1),
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        uniforms: this.ringUniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.rings.rotation.x = -Math.PI / 2;
    this.tilt.add(this.rings);
  }

  #addMoons(moons, index) {
    this.moons = moons.map((m, i) => {
      const mat = surfaceMaterial(
        { surface: 'rocky', colors: m.colors ?? ['#b9b2a6', '#5d5953', '#d8d2c6'], atmosphere: '#ffffff' },
        index * 11.3 + i * 5.7,
      );
      mat.uniforms.uAtmo.value.setScalar(0.25);
      const mesh = new THREE.Mesh(SPHERE_LOW, mat);
      mesh.scale.setScalar(m.size);
      const pivot = new THREE.Group();
      pivot.rotation.x = m.incline ?? (i - moons.length / 2) * 0.12;
      pivot.add(mesh);
      this.group.add(pivot);
      return { mesh, pivot, radius: this.size * m.distance, speed: m.speed, angle: i * 1.9 };
    });
  }

  #addBeacon(color) {
    this.beacon = glowSprite(new THREE.Color(color), this.size * 2.2, 0.9);
    this.beacon.position.set(0, this.size * 1.02, 0);
    this.tilt.add(this.beacon);
  }

  get position() {
    return this.group.position;
  }

  setHover(on) {
    this.hoverGoal = on ? 1 : 0;
  }

  /** 0..1, used by the music planet's rings. */
  setPulse(v) {
    this.pulseGoal = v;
  }

  /**
   * @param dt     real seconds since last frame
   * @param orbitT accumulated orbit time (slows down while you're reading)
   * @param time   real elapsed time, for shimmer that shouldn't slow down
   */
  update(dt, orbitT, time, spinDt, orbitAlpha = 1) {
    const a = this.phase + (orbitT / this.period) * Math.PI * 2;
    this.group.position.set(Math.cos(a) * this.orbitRadius, 0, -Math.sin(a) * this.orbitRadius);
    this.mesh.rotation.y += spinDt * this.spinSpeed;

    this.hover = damp(this.hover, this.hoverGoal, 8, dt);
    this.material.uniforms.uHover.value = this.hover;
    this.material.uniforms.uTime.value = time;
    this.orbitLine.material.opacity = (0.09 + this.hover * 0.28) * orbitAlpha;

    if (this.rings) {
      this.pulse = damp(this.pulse, this.pulseGoal, 12, dt);
      this.ringUniforms.uTime.value = time;
      this.ringUniforms.uPulse.value = this.pulse;
      this.rings.rotation.z += spinDt * 0.02;
    }

    if (this.moons) {
      for (const m of this.moons) {
        m.angle += spinDt * m.speed;
        m.mesh.position.set(Math.cos(m.angle) * m.radius, 0, Math.sin(m.angle) * m.radius);
        m.mesh.rotation.y += spinDt * 0.3;
      }
    }

    if (this.beacon) {
      const blink = Math.pow(Math.max(0, Math.sin(time * 2.2)), 12);
      this.beacon.material.opacity = 0.15 + blink * 0.95;
    }
  }
}
