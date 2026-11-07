import * as THREE from 'three';
import { noise } from './shaders/noise.js';
import { glowSprite } from './glow.js';
import { damp } from '../lib/math.js';

const vertex = /* glsl */ `
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vObj = position;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform float uHover;
varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;
${noise}
void main() {
  vec3 p = normalize(vObj);
  float big = fbm(p * 2.4 + vec3(0.0, uTime * 0.04, 0.0));
  float cells = fbm(p * 9.0 - vec3(uTime * 0.07));
  float heat = smoothstep(-0.5, 0.7, big + cells * 0.45);
  vec3 col = mix(vec3(1.0, 0.3, 0.06), vec3(1.0, 0.74, 0.4), heat);
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  float mu = max(dot(N, V), 0.0);
  col *= 0.5 + 0.5 * pow(mu, 0.45);   // limb darkening
  col *= 1.9 + uHover * 0.6;           // above 1.0 so the bloom pass picks it up
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** The sun. It's also me (see content/bodies.js), so it's clickable like a planet. */
export class Sun {
  constructor(def) {
    this.def = def;
    this.id = def.id;
    this.size = def.look.size;
    this.group = new THREE.Group();
    this.hover = 0;
    this.hoverGoal = 0;

    this.uniforms = { uTime: { value: 0 }, uHover: { value: 0 } };
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 64),
      new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: this.uniforms }),
    );
    this.mesh.scale.setScalar(this.size);
    this.group.add(this.mesh);

    this.corona = glowSprite(new THREE.Color('#ff9a4a'), this.size * 5, 0.75);
    this.halo = glowSprite(new THREE.Color('#ff7b2e'), this.size * 13, 0.1);
    this.group.add(this.corona, this.halo);
  }

  get position() {
    return this.group.position;
  }

  setHover(on) {
    this.hoverGoal = on ? 1 : 0;
  }

  update(dt, time) {
    this.hover = damp(this.hover, this.hoverGoal, 8, dt);
    this.uniforms.uTime.value = time;
    this.uniforms.uHover.value = this.hover;
    this.mesh.rotation.y += dt * 0.03;
    const breathe = 1 + Math.sin(time * 0.6) * 0.02;
    this.corona.scale.setScalar(this.size * 5 * breathe * (1 + this.hover * 0.15));
  }
}
