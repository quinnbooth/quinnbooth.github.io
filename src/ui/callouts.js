const FIRST_DELAY = 2.2; // seconds after landing before the first one
const HOLD = 5.5; // how long each one stays up
const GAP = 3; // quiet time between them
const READING_PAUSE = 4; // no new callouts for this long after the panel scrolls
const MIN_ROOM = 150; // px of open space beside the planet needed to show one
const EDGE = 16; // keep labels this far from the edges of the open area

const dir = { x: 0, y: 0, z: 0 };

/**
 * Readouts that pop off the planet you've landed on: a dot on the surface, a
 * line out to the side, and a short label. One at a time, quietly, and never
 * while someone is scrolling through the panel.
 *
 * The dot is pinned to a spot on the (spinning) surface, so it turns with the
 * planet; if that spot rolls around to the far side, the callout bows out early.
 */
export class Callouts {
  constructor(root) {
    this.root = root;
    this.target = null;
    this.current = null;
    this.timer = 0;
    this.index = 0;
    this.quietUntil = 0;
    this.clock = 0;
  }

  /** Start cycling through a body's tidbits, or stop (null). */
  setTarget(def) {
    this.#dismiss();
    this.target = def?.tidbits?.length ? def : null;
    this.index = 0;
    this.timer = FIRST_DELAY;
  }

  /** Someone's reading: hold off on new callouts for a bit. */
  noteReading() {
    this.quietUntil = this.clock + READING_PAUSE;
  }

  update(world, dt) {
    this.clock += dt;
    if (!this.target || !world.surfacePoint) return;
    const c = this.current;

    if (!c) {
      this.timer -= dt;
      if (this.timer > 0 || this.clock < this.quietUntil) return;
      if (!this.#spawn(world)) this.timer = 0.4; // no good spot right now; try again shortly
      return;
    }

    c.age += dt;
    const sp = world.surfacePoint(this.target.id, c.dir, c.sp);
    const body = world.screenInfo(world.byId[this.target.id], c.body);
    if (!sp || sp.facing < 0.12 || c.age > HOLD) {
      this.#dismiss();
      this.timer = GAP;
      return;
    }
    this.#layout(c, sp, body, world.freeArea);
  }

  #spawn(world) {
    const id = this.target.id;
    const body = world.screenInfo(world.byId[id], {});
    const free = world.freeArea;
    const roomLeft = body.x - body.r;
    const roomRight = free.width - (body.x + body.r);
    // Go out the side the ship isn't on, if there's room; otherwise the roomier side.
    const ship = world.shipOnScreen?.() ?? { x: body.x };
    const away = ship.x > body.x ? -1 : 1;
    const side = (away > 0 ? roomRight : roomLeft) >= MIN_ROOM ? away : roomRight >= roomLeft ? 1 : -1;
    if ((side > 0 ? roomRight : roomLeft) < MIN_ROOM) return false;

    // Find a spot on the planet that faces us and sits on the open side.
    const sp = {};
    for (let i = 0; i < 40; i++) {
      dir.x = Math.random() * 2 - 1;
      dir.y = Math.random() * 1.4 - 0.7;
      dir.z = Math.random() * 2 - 1;
      if (!world.surfacePoint(id, dir, sp)) return false;
      const dx = (sp.x - body.x) * side;
      const dy = Math.abs(sp.y - body.y);
      if (sp.facing > 0.5 && dx > body.r * 0.2 && dy < body.r * 0.65) {
        this.current = this.#build(this.target.tidbits[this.index], { ...dir }, side);
        this.index = (this.index + 1) % this.target.tidbits.length;
        this.#layout(this.current, sp, body, free);
        return true;
      }
    }
    return false;
  }

  #build(tidbit, localDir, side) {
    const el = document.createElement('div');
    el.className = `callout callout--${side > 0 ? 'right' : 'left'}`;
    el.innerHTML = `
      <svg class="callout__svg" aria-hidden="true">
        <path class="callout__line" pathLength="1" />
        <circle class="callout__dot" r="3" />
      </svg>
      <div class="callout__label"><span class="callout__k">${tidbit.label}</span><span class="callout__v">${tidbit.value}</span></div>`;
    this.root.appendChild(el);
    const label = el.querySelector('.callout__label');
    return {
      // Measured once here. Reading it every frame forced a full-page layout
      // per frame, which is what made scrolling the panel stutter.
      labelWidth: label.offsetWidth,
      el,
      dir: localDir,
      side,
      age: 0,
      sp: {},
      body: {},
      path: el.querySelector('.callout__line'),
      dot: el.querySelector('.callout__dot'),
      label,
    };
  }

  #layout(c, sp, body, free) {
    const { side } = c;
    // Diagonal out to just past the planet's edge, then flat.
    const up = sp.y <= body.y ? -1 : 1;
    const ex = body.x + side * (body.r + 24);
    const run = Math.abs(ex - sp.x);
    const ey = sp.y + up * Math.min(run * 0.75, 70);
    const tail = 36;
    let lx = ex + side * tail;
    lx = side > 0 ? Math.min(lx, free.width - EDGE - c.labelWidth) : Math.max(lx, EDGE + c.labelWidth);
    const ly = Math.max(EDGE + 10, Math.min(free.height - EDGE, ey));

    c.path.setAttribute('d', `M${sp.x.toFixed(1)} ${sp.y.toFixed(1)} L${ex.toFixed(1)} ${ly.toFixed(1)} L${lx.toFixed(1)} ${ly.toFixed(1)}`);
    c.dot.setAttribute('cx', sp.x.toFixed(1));
    c.dot.setAttribute('cy', sp.y.toFixed(1));
    const tx = side > 0 ? lx + 8 : lx - 8;
    c.label.style.transform = `translate(${tx.toFixed(1)}px, ${ly.toFixed(1)}px) translate(${side > 0 ? 0 : -100}%, -50%)`;
  }

  #dismiss() {
    const c = this.current;
    if (!c) return;
    this.current = null;
    c.el.classList.add('is-out');
    setTimeout(() => c.el.remove(), 600);
  }
}
