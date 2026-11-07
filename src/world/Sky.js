import * as THREE from 'three';
import { noise } from './shaders/noise.js';

// The galactic plane: a tilted great circle that stars and dust crowd toward.
const GALAXY_NORMAL = new THREE.Vector3(0.35, 1, -0.2).normalize();

const starVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vTwinkle;
void main() {
  vColor = aColor;
  vTwinkle = 0.72 + 0.28 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0);
  gl_PointSize = aSize * uPixelRatio;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const starFragment = /* glsl */ `
varying vec3 vColor;
varying float vTwinkle;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 2.2) * vTwinkle;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor * a, a);
  #include <colorspace_fragment>
}
`;

const dustVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const dustFragment = /* glsl */ `
uniform vec3 uNormal;
varying vec3 vDir;
${noise}
void main() {
  float band = pow(1.0 - abs(dot(vDir, uNormal)), 6.0);
  float n = fbm(vDir * 2.2) * 0.5 + 0.5;
  float n2 = fbm(vDir * 6.0 + 3.0) * 0.5 + 0.5;
  vec3 cool = vec3(0.10, 0.16, 0.32);
  vec3 warm = vec3(0.36, 0.20, 0.14);
  vec3 col = mix(cool, warm, smoothstep(0.35, 0.75, n2));
  float lanes = smoothstep(0.45, 0.62, n2);   // dark dust lanes
  float glow = band * smoothstep(0.25, 0.85, n) * (1.0 - lanes * 0.7);
  gl_FragColor = vec4(col * glow * 0.55 + vec3(0.006, 0.008, 0.018), 1.0);
  #include <colorspace_fragment>
}
`;

function randomOnSphere(v) {
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return v.set(s * Math.cos(t), u, s * Math.sin(t));
}

export class Sky {
  constructor({ count = 7000, pixelRatio = 1 } = {}) {
    this.object = new THREE.Group();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const dir = new THREE.Vector3();
    const tint = new THREE.Color();
    const palette = ['#ffffff', '#cfdcff', '#aac4ff', '#fff1d6', '#ffd2a1'];

    for (let i = 0; i < count; i++) {
      randomOnSphere(dir);
      // Pull ~45% of the stars toward the galactic plane.
      if (Math.random() < 0.45) {
        const d = dir.dot(GALAXY_NORMAL);
        dir.addScaledVector(GALAXY_NORMAL, -d * (0.75 + Math.random() * 0.25)).normalize();
      }
      const r = 700 + Math.random() * 400;
      positions.set([dir.x * r, dir.y * r, dir.z * r], i * 3);
      tint.set(palette[Math.floor(Math.random() * palette.length)]);
      const bright = 0.35 + Math.pow(Math.random(), 3) * 0.9;
      colors.set([tint.r * bright, tint.g * bright, tint.b * bright], i * 3);
      sizes[i] = 1.2 + Math.pow(Math.random(), 6) * 4.5;
      phases[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.starUniforms = { uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } };
    this.stars = new THREE.Points(
      geo,
      new THREE.ShaderMaterial({
        vertexShader: starVertex,
        fragmentShader: starFragment,
        uniforms: this.starUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.stars.frustumCulled = false;

    this.dust = new THREE.Mesh(
      new THREE.SphereGeometry(1400, 64, 32),
      new THREE.ShaderMaterial({
        vertexShader: dustVertex,
        fragmentShader: dustFragment,
        uniforms: { uNormal: { value: GALAXY_NORMAL } },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );
    this.dust.renderOrder = -1;

    this.object.add(this.dust, this.stars);
  }

  setPixelRatio(pr) {
    this.starUniforms.uPixelRatio.value = pr;
  }

  update(dt, time) {
    this.starUniforms.uTime.value = time;
    this.object.rotation.y += dt * 0.0025;
  }
}
