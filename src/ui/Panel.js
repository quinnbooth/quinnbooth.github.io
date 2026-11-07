import { icons } from './icons.js';
import { renderSections, hydrateSections } from './sections.js';

const pad = (n) => String(n).padStart(2, '0');

/**
 * The info panel that slides in when you land. Replaces v1's separate pages,
 * so you never leave the solar system.
 */
export class Panel {
  constructor(root, { onClose, onNavigate, ctx }) {
    this.root = root;
    this.onClose = onClose;
    this.onNavigate = onNavigate;
    this.ctx = ctx;
    this.cleanup = null;
    this.id = null;

    root.innerHTML = `
      <div class="panel__scroll">
        <header class="panel__head">
          <div class="panel__meta">
            <span class="panel__index"></span>
            <span class="panel__kicker"></span>
          </div>
          <button class="panel__close" type="button" aria-label="Close and zoom back out">${icons.close}</button>
          <h2 class="panel__title" id="panel-title" tabindex="-1"></h2>
          <p class="panel__subtitle"></p>
        </header>
        <div class="panel__body"></div>
        <nav class="panel__foot" aria-label="Neighboring planets">
          <button class="panel__nav panel__nav--prev" type="button"></button>
          <button class="panel__nav panel__nav--next" type="button"></button>
        </nav>
      </div>`;

    this.el = {
      scroll: root.querySelector('.panel__scroll'),
      index: root.querySelector('.panel__index'),
      kicker: root.querySelector('.panel__kicker'),
      title: root.querySelector('.panel__title'),
      subtitle: root.querySelector('.panel__subtitle'),
      body: root.querySelector('.panel__body'),
      prev: root.querySelector('.panel__nav--prev'),
      next: root.querySelector('.panel__nav--next'),
    };
    root.querySelector('.panel__close').addEventListener('click', () => this.onClose());
    this.el.prev.addEventListener('click', () => this.onNavigate(this.el.prev.dataset.id));
    this.el.next.addEventListener('click', () => this.onNavigate(this.el.next.dataset.id));
  }

  get isOpen() {
    return this.root.classList.contains('is-open');
  }

  /** Inner width in px, for the camera inset. */
  get width() {
    return this.root.getBoundingClientRect().width;
  }

  open(def, index, all) {
    this.cleanup?.();
    this.id = def.id;
    const { el } = this;
    el.index.textContent = `${pad(index)} / ${pad(all.length - 1)}`;
    el.kicker.textContent = def.kicker;
    el.title.textContent = def.title;
    el.subtitle.textContent = def.subtitle ?? '';
    el.body.innerHTML = renderSections(def.sections);
    this.cleanup = hydrateSections(el.body, def.sections, this.ctx);

    const prev = all[(index - 1 + all.length) % all.length];
    const next = all[(index + 1) % all.length];
    el.prev.dataset.id = prev.id;
    el.next.dataset.id = next.id;
    el.prev.innerHTML = `${icons.prev}<span><small>Previous</small>${prev.label}</span>`;
    el.next.innerHTML = `<span><small>Next</small>${next.label}</span>${icons.next}`;

    el.scroll.scrollTop = 0;
    this.root.classList.toggle('is-draft', import.meta.env.DEV && Boolean(def.todo));
    this.root.setAttribute('aria-hidden', 'false');
    this.root.removeAttribute('inert');
    this.root.classList.add('is-open');
    el.title.focus({ preventScroll: true });
  }

  close() {
    if (!this.isOpen) return;
    this.cleanup?.();
    this.cleanup = null;
    this.id = null;
    if (this.root.contains(document.activeElement)) document.activeElement.blur();
    this.root.classList.remove('is-open');
    this.root.setAttribute('aria-hidden', 'true');
    this.root.setAttribute('inert', '');
  }
}
