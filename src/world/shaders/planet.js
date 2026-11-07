import { noise } from './noise.js';

export const SURFACE = { rocky: 0, gas: 1, ocean: 2, ice: 3 };

// Planets are unit spheres scaled up, so `vObj` is a point on the unit sphere in
// the planet's own frame. Sampling noise there means the pattern spins with the
// planet instead of sliding across it.
export const planetVertex = /* glsl */ `
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

export const planetFragment = /* glsl */ `
uniform int uType;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uAtmo;
uniform float uSeed;
uniform float uTime;
uniform float uHover;
uniform float uBands;

varying vec3 vObj;
varying vec3 vNormalW;
varying vec3 vPosW;

${noise}

vec3 surface(vec3 p) {
  vec3 s = p + uSeed;

  vec3 col;
  if (uType == 0) {
    // Rocky: big continental shapes, fine grit, and ridged "crater rims".
    float n = fbm(s * 2.2);
    float fine = fbm(s * 8.0);
    col = mix(uC2, uC1, smoothstep(-0.45, 0.45, n));
    col = mix(col, uC3, smoothstep(-0.2, 0.7, fine) * 0.3);
    col *= 0.85 + 0.3 * fine;
    float ridge = 1.0 - abs(snoise(s * 4.0));
    col *= 0.86 + 0.14 * pow(ridge, 4.0);
  } else if (uType == 1) {
    // Gas giant: latitude bands, warped by turbulence, plus one storm.
    float warp = fbm(s * vec3(1.6, 4.5, 1.6) + vec3(0.0, 0.0, uTime * 0.01)) * 0.22;
    float lat = p.y + warp;
    float b1 = sin(lat * uBands) * 0.5 + 0.5;
    float b2 = sin(lat * uBands * 2.7 + 1.3) * 0.5 + 0.5;
    col = mix(uC1, uC2, smoothstep(0.2, 0.8, b1));
    col = mix(col, uC3, smoothstep(0.55, 0.95, b2) * 0.5);
    vec3 stormCenter = normalize(vec3(0.8, -0.32, 0.5));
    float storm = smoothstep(0.24, 0.0, distance(p, stormCenter) + warp * 0.3);
    col = mix(col, uC2 * 0.75 + uC3 * 0.25, storm * 0.8);
  } else if (uType == 2) {
    // Ocean world: water, land, ice caps, and a drifting cloud layer.
    float n = fbm(s * 1.7);
    float land = smoothstep(0.03, 0.09, n);
    vec3 ocean = mix(uC1 * 0.55, uC1, smoothstep(-0.55, 0.05, n));
    vec3 ground = mix(uC2, uC3, smoothstep(-0.2, 0.5, fbm(s * 4.5)));
    col = mix(ocean, ground, land);
    float caps = smoothstep(0.78, 0.9, abs(p.y) + n * 0.12);
    col = mix(col, vec3(0.92, 0.95, 1.0), caps);
    float clouds = fbm(s * 2.6 + vec3(uTime * 0.015, 0.0, uTime * 0.008));
    col = mix(col, vec3(1.0), smoothstep(0.12, 0.5, clouds) * 0.75);
  } else {
    // Ice: soft gradients with thin bright fractures.
    float n = fbm(s * 2.3);
    col = mix(uC2, uC1, smoothstep(-0.5, 0.55, n));
    float crack = 1.0 - smoothstep(0.0, 0.018, abs(snoise(s * 3.0)));
    float crack2 = 1.0 - smoothstep(0.0, 0.012, abs(snoise(s * 7.0 + 4.0)));
    float frost = smoothstep(0.1, 0.8, fbm(s * 5.0 + 2.0));
    col = mix(col, uC3, frost * 0.35);
    col = mix(col, uC3, max(crack, crack2 * 0.5) * 0.22);
  }
  return col;
}

void main() {
  vec3 p = normalize(vObj);
  vec3 col = surface(p);

  vec3 N = normalize(vNormalW);
  vec3 L = normalize(-vPosW);             // the sun sits at the origin
  vec3 V = normalize(cameraPosition - vPosW);
  float NdotL = dot(N, L);

  // Soft terminator, a touch of light bleeding past it, near-black night side.
  float day = smoothstep(-0.12, 0.55, NdotL);
  vec3 lit = col * (0.035 + 1.05 * day);

  // Sun glint on water.
  if (uType == 2) {
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 60.0) * day;
    lit += vec3(1.0, 0.9, 0.75) * spec * 0.6;
  }

  // Atmospheric rim, stronger on the lit side, brighter when hovered.
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  lit += uAtmo * fres * (0.15 + 0.9 * day);
  lit += uAtmo * fres * uHover * 0.9;

  gl_FragColor = vec4(lit, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

// A slightly larger back-faced shell that glows at the limb.
export const atmosphereVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const atmosphereFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uStrength;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(-vPosW);
  // Back faces of a shell 1.18x the planet: x is 0 at the shell's outer edge
  // and ~0.53 where the view ray grazes the planet's surface. Glow peaks at the
  // surface and fades to nothing at the edge, so there's no hard ring.
  float x = clamp(-dot(N, V), 0.0, 1.0);
  float glow = pow(smoothstep(0.0, 0.53, x), 3.0);
  float day = smoothstep(-0.35, 0.6, dot(N, L));
  gl_FragColor = vec4(uColor * glow * uStrength * (0.08 + day), 1.0);
  #include <colorspace_fragment>
}
`;

export const ringVertex = /* glsl */ `
varying vec2 vLocal;
varying vec3 vPosW;
void main() {
  vLocal = position.xy;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const ringFragment = /* glsl */ `
uniform float uInner;
uniform float uOuter;
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uTime;
uniform float uPulse;
uniform float uSeed;
varying vec2 vLocal;
varying vec3 vPosW;

${noise}

void main() {
  float r = (length(vLocal) - uInner) / (uOuter - uInner);
  float bands = snoise(vec3(r * 24.0, uSeed, 1.0)) * 0.5 + 0.5;
  bands = mix(bands, snoise(vec3(r * 85.0, uSeed + 3.0, 1.0)) * 0.5 + 0.5, 0.4);
  float edge = smoothstep(0.0, 0.06, r) * smoothstep(1.0, 0.88, r);
  float gap = 1.0 - smoothstep(0.035, 0.0, abs(r - 0.63)) * 0.92;
  float alpha = edge * gap * (0.18 + 0.62 * bands);

  vec3 col = mix(uC1, uC2, bands);

  // Music planet: rings ripple outward with whatever's playing.
  float wave = pow(0.5 + 0.5 * sin(r * 34.0 - uTime * 9.0), 6.0) * uPulse;
  col += vec3(1.0, 0.78, 0.5) * wave * 1.8;
  alpha = min(1.0, alpha + wave * 0.35 * edge);

  float sunFacing = 0.55 + 0.45 * smoothstep(-1.0, 1.0, -normalize(vPosW).y);
  gl_FragColor = vec4(col * sunFacing, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
