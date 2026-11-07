import * as THREE from 'three';
import { clamp, damp } from '../lib/math.js';

/**
 * A spherical camera around a moving target. Scripted moves (intro, flights,
 * focusing a planet) and the visitor's dragging/zooming all write to the same
 * "goal" values, and everything eases toward its goal with `damp`, so nothing
 * ever snaps or fights.
 *
 *   phi   = angle down from straight overhead
 *   theta = angle around the vertical axis
 */
export class CameraRig extends EventTarget {
  constructor(camera, dom) {
    super();
    this.camera = camera;
    this.dom = dom;

    this.target = new THREE.Vector3();
    this.goalTarget = new THREE.Vector3();
    this.follow = null; // () => Vector3, overrides goalTarget each frame

    this.r = 260;
    this.theta = 0.5;
    this.phi = 0.62;
    this.goal = { r: this.r, theta: this.theta, phi: this.phi };
    this.limits = { rMin: 6, rMax: 320, phiMin: 0.18, phiMax: 1.48 };
    this.speed = { target: 4, orbit: 3 };

    // Viewport inset (px) so the focused planet sits beside the panel, not under it.
    this.inset = { x: 0, y: 0 };
    this.goalInset = { x: 0, y: 0 };

    this.interactive = false;
    this.#bindInput();
  }

  /** Jump straight to the current goals (no easing). */
  snap() {
    if (this.follow) this.goalTarget.copy(this.follow());
    this.target.copy(this.goalTarget);
    this.r = this.goal.r;
    this.theta = this.goal.theta;
    this.phi = this.goal.phi;
    this.#apply();
  }

  setGoal({ r, theta, phi } = {}) {
    if (r !== undefined) this.goal.r = r;
    if (theta !== undefined) this.goal.theta = theta;
    if (phi !== undefined) this.goal.phi = phi;
  }

  setInset(x, y) {
    this.goalInset.x = x;
    this.goalInset.y = y;
  }

  update(dt) {
    if (this.follow) this.goalTarget.copy(this.follow());
    const kt = 1 - Math.exp(-this.speed.target * dt);
    this.target.lerp(this.goalTarget, kt);
    this.r = damp(this.r, this.goal.r, this.speed.orbit, dt);
    this.theta = damp(this.theta, this.goal.theta, this.speed.orbit * 1.4, dt);
    this.phi = damp(this.phi, this.goal.phi, this.speed.orbit * 1.4, dt);
    this.inset.x = damp(this.inset.x, this.goalInset.x, 5, dt);
    this.inset.y = damp(this.inset.y, this.goalInset.y, 5, dt);
    this.#apply();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.#apply();
  }

  #apply() {
    const { camera, target, r, theta, phi } = this;
    const s = Math.sin(phi);
    camera.position.set(
      target.x + r * s * Math.sin(theta),
      target.y + r * Math.cos(phi),
      target.z + r * s * Math.cos(theta),
    );
    camera.lookAt(target);

    const w = this.width ?? window.innerWidth;
    const h = this.height ?? window.innerHeight;
    if (Math.abs(this.inset.x) > 0.5 || Math.abs(this.inset.y) > 0.5) {
      camera.setViewOffset(w, h, this.inset.x, this.inset.y, w, h);
    } else if (camera.view?.enabled) {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }

  // ---- input ---------------------------------------------------------------

  #bindInput() {
    const pointers = new Map();
    let downAt = null;
    let moved = 0;
    let pinchDist = 0;

    const onDown = (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        downAt = { x: e.clientX, y: e.clientY };
        moved = 0;
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        moved = 99; // a pinch is never a tap
      }
      this.dom.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
      const p = pointers.get(e.pointerId);
      if (!p) {
        this.dispatchEvent(new CustomEvent('hover', { detail: { x: e.clientX, y: e.clientY } }));
        return;
      }
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (downAt) moved = Math.max(moved, Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y));
      if (!this.interactive) return;

      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0) this.#zoom(pinchDist / d);
        pinchDist = d;
      } else if (moved > 4) {
        this.goal.theta -= dx * 0.0055;
        this.goal.phi = clamp(this.goal.phi - dy * 0.0045, this.limits.phiMin, this.limits.phiMax);
        this.dom.classList.add('is-dragging');
      }
    };

    const onUp = (e) => {
      const wasTap = pointers.size === 1 && moved <= 4;
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) {
        this.dom.classList.remove('is-dragging');
        downAt = null;
      }
      if (wasTap && e.type === 'pointerup') {
        this.dispatchEvent(new CustomEvent('tap', { detail: { x: e.clientX, y: e.clientY } }));
      }
    };

    this.dom.addEventListener('pointerdown', onDown);
    this.dom.addEventListener('pointermove', onMove);
    this.dom.addEventListener('pointerup', onUp);
    this.dom.addEventListener('pointercancel', onUp);
    this.dom.addEventListener('pointerleave', () => {
      this.dispatchEvent(new CustomEvent('hover', { detail: null }));
    });
    this.dom.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        if (!this.interactive) return;
        this.#zoom(Math.exp(e.deltaY * 0.0012));
      },
      { passive: false },
    );
  }

  #zoom(factor) {
    this.goal.r = clamp(this.goal.r * factor, this.limits.rMin, this.limits.rMax);
  }
}
