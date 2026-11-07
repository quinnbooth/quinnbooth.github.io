const pad = (n) => String(n).padStart(2, '0');

/**
 * Floating labels pinned under each planet. They're real buttons, so the
 * whole map works with a keyboard and a screen reader.
 */
export class Labels {
  constructor(root, defs, { onSelect, onHover }) {
    this.root = root;
    this.items = defs.map((def, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'label';
      b.dataset.id = def.id;
      b.setAttribute('aria-label', `Fly to ${def.label}: ${def.kicker}`);
      b.innerHTML = `<span class="label__num">${pad(i)}</span><span class="label__name">${def.label}</span>`;
      b.addEventListener('click', () => onSelect(def.id));
      b.addEventListener('pointerenter', () => onHover(def.id));
      b.addEventListener('pointerleave', () => onHover(null));
      b.addEventListener('focus', () => onHover(def.id));
      b.addEventListener('blur', () => onHover(null));
      root.appendChild(b);
      return { def, el: b, s: {} };
    });
  }

  update(world, { hovered, focused }) {
    const placed = [];
    for (const item of this.items) {
      const body = world.byId?.[item.def.id];
      item.on = false;
      if (!body) continue;
      const s = world.screenInfo(body, item.s);
      item.on = s.visible && item.def.id !== focused;
      if (item.on) {
        item.x = s.x;
        item.y = s.y + Math.max(s.r, 3) + 10;
        item.w ||= item.el.offsetWidth;
        item.h ||= item.el.offsetHeight;
        placed.push(item);
      }
    }

    // Planets bunch up near the sun, so when two labels would overlap, the
    // hovered one wins, then whichever planet is closer to the camera.
    placed.sort((a, b) => (b.def.id === hovered) - (a.def.id === hovered) || a.s.dist - b.s.dist);
    const shown = [];
    for (const item of placed) {
      const clash = shown.some(
        (o) => Math.abs(o.x - item.x) * 2 < o.w + item.w + 6 && Math.abs(o.y - item.y) * 2 < o.h + item.h + 4,
      );
      if (clash) item.on = false;
      else shown.push(item);
    }

    for (const item of this.items) {
      item.el.classList.toggle('is-hidden', !item.on);
      item.el.classList.toggle('is-hovered', item.def.id === hovered);
      if (item.on) {
        item.el.style.transform = `translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0) translateX(-50%)`;
      }
    }
  }
}

/** The "what's on this planet" preview that follows a hovered planet. */
export class HoverCard {
  constructor(root) {
    this.root = root;
    this.id = null;
    this.s = {};
  }

  show(def, index, isHere) {
    if (this.id !== def.id) {
      this.id = def.id;
      this.root.innerHTML = `
        <div class="hovercard__meta"><span>${pad(index)}</span><span>${def.kicker}</span></div>
        <div class="hovercard__title">${def.title}</div>
        <p class="hovercard__teaser">${def.teaser}</p>
        <div class="hovercard__cta">${isHere ? 'You’re here' : 'Click to fly there'}</div>`;
    }
    this.root.classList.add('is-visible');
  }

  hide() {
    this.id = null;
    this.root.classList.remove('is-visible');
  }

  /** Keep it beside the planet, flipping sides near the screen edge. */
  follow(world, body) {
    const s = world.screenInfo(body, this.s);
    if (!s.visible) return this.root.classList.remove('is-visible');
    const w = this.root.offsetWidth;
    const h = this.root.offsetHeight;
    const gap = Math.max(s.r, 6) + 18;
    let x = s.x + gap;
    if (x + w > window.innerWidth - 16) x = s.x - gap - w;
    x = Math.max(16, x);
    const y = Math.min(Math.max(16, s.y - h / 2), window.innerHeight - h - 16);
    this.root.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }
}

/** A plain list of every stop. Doubles as the whole site when WebGL is unavailable. */
export class SystemIndex {
  constructor(root, defs, { onSelect, onHover }) {
    this.root = root;
    root.innerHTML = `
      <p class="index__title">System index</p>
      <ol class="index__list">
        ${defs
          .map(
            (d, i) => `
          <li><button type="button" class="index__item" data-id="${d.id}">
            <span class="index__num">${pad(i)}</span>
            <span class="index__name">${d.label}</span>
            <span class="index__kicker">${d.kicker}</span>
          </button></li>`,
          )
          .join('')}
      </ol>`;
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.index__item');
      if (b) onSelect(b.dataset.id);
    });
    root.addEventListener('pointerover', (e) => {
      const b = e.target.closest('.index__item');
      onHover(b ? b.dataset.id : null);
    });
    root.addEventListener('pointerleave', () => onHover(null));
  }

  setCurrent(id) {
    this.root.querySelectorAll('.index__item').forEach((b) => {
      if (b.dataset.id === id) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }
}
