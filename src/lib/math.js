// Small, frame-rate-independent helpers. Everything that moves goes through
// `damp` or a time-parameterized curve, so it looks the same at 30fps or 144fps.

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Exponential smoothing toward `goal`. `lambda` ~ "how snappy" (per second). */
export const damp = (current, goal, lambda, dt) =>
  lerp(current, goal, 1 - Math.exp(-lambda * dt));

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Quadratic Bézier into `out` (a THREE.Vector3). */
export function quadBezier(out, a, b, c, t) {
  const u = 1 - t;
  return out
    .set(0, 0, 0)
    .addScaledVector(a, u * u)
    .addScaledVector(b, 2 * u * t)
    .addScaledVector(c, t * t);
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
