import './styles/base.css';
import './styles/hud.css';
import './styles/panel.css';

import { bodies } from './content/bodies.js';
import { site } from './content/site.js';
import { Panel } from './ui/Panel.js';
import { Labels, HoverCard, SystemIndex } from './ui/overlays.js';
import { isLightboxOpen } from './ui/lightbox.js';
import { icons } from './ui/icons.js';
import { prefersReducedMotion } from './lib/math.js';

const $ = (sel) => document.querySelector(sel);
const indexOf = Object.fromEntries(bodies.map((b, i) => [b.id, i]));
const isTouch = window.matchMedia('(hover: none)').matches;

const state = {
  phase: 'loading', // loading -> intro -> descending -> explore
  hovered: null,
  focused: null, // body whose panel is open
  flyingTo: null,
  hasFlown: false,
};

// ---- world (or a stand-in if WebGL isn't available) ------------------------

let world;
try {
  const { World } = await import('./world/World.js');
  world = new World($('#scene'), bodies);
} catch (err) {
  console.warn('3D unavailable, falling back to the flat site.', err);
  document.body.classList.add('no-webgl');
  world = {
    rig: new EventTarget(),
    byId: {},
    load: async () => {},
    intro: async () => {},
    takeOff: async () => {},
    skipIntro() {},
    flyTo: async () => {},
    release() {},
    pick: () => null,
    setHovered() {},
    setInset() {},
    setMusicLevel() {},
    screenInfo: () => ({ visible: false }),
  };
}

if (import.meta.env.DEV) window.__world = world; // handy in the console

// ---- static chrome ----------------------------------------------------------

$('#topbar-links').innerHTML = `
  <a class="topbar__link" href="${site.resume}" target="_blank" rel="noopener">${icons.doc}<span>Résumé</span></a>
  <a class="topbar__icon" href="${site.links.github}" target="_blank" rel="noopener" aria-label="GitHub">${icons.github}</a>
  <a class="topbar__icon" href="${site.links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icons.linkedin}</a>
  <a class="topbar__icon" href="mailto:${site.email}" aria-label="Email">${icons.mail}</a>`;

$('#intro').innerHTML = `
  <p class="intro__eyebrow">${site.intro.eyebrow}</p>
  <h1 class="intro__title">${site.intro.title}</h1>
  <p class="intro__blurb">${site.intro.blurb}</p>
  <button class="button button--primary intro__cta" type="button" disabled>
    <span class="intro__cta-label">Fueling up</span>
    <span class="intro__cta-meter" aria-hidden="true"><span></span></span>
  </button>`;

$('#hint').textContent = isTouch
  ? 'Tap a planet to fly there'
  : 'Drag to look around · Scroll to zoom · Click a planet to fly there';

// ---- UI pieces ---------------------------------------------------------------

const hoverCard = new HoverCard($('#hovercard'));

const panel = new Panel($('#panel'), {
  onClose: () => release(),
  onNavigate: (id) => go(id),
  ctx: { onLevel: (v) => world.setMusicLevel(v) },
});

const labels = new Labels($('#labels'), bodies, {
  onSelect: (id) => go(id),
  onHover: (id) => setHover(id),
});

const systemIndex = new SystemIndex($('#index'), bodies, {
  onSelect: (id) => go(id),
  onHover: (id) => setHover(id),
});

// ---- behaviour -------------------------------------------------------------

function setPhase(phase) {
  state.phase = phase;
  document.body.dataset.phase = phase;
}

function setHover(id) {
  if (state.phase !== 'explore') id = null;
  state.hovered = id;
  world.setHovered(id);
  document.body.classList.toggle('is-pointing', Boolean(id));
  if (id) hoverCard.show(bodies[indexOf[id]], indexOf[id], id === state.focused);
  else hoverCard.hide();
}

function updateInset() {
  if (!panel.isOpen) return world.setInset(0, 0);
  if (window.innerWidth >= 900) world.setInset(panel.width / 2, 0);
  else world.setInset(0, window.innerHeight * 0.3);
}

async function go(id) {
  if (!(id in indexOf) || state.phase !== 'explore') return;
  if (state.flyingTo === id || (state.focused === id && panel.isOpen)) return;

  panel.close();
  state.focused = null;
  state.flyingTo = id;
  setHover(null);
  updateInset();
  systemIndex.setCurrent(id);
  document.body.classList.add('is-traveling');
  if (!state.hasFlown) {
    state.hasFlown = true;
    document.body.classList.add('has-flown');
  }

  try {
    await world.flyTo(id);
  } catch {
    return; // Another flight took over, or the visitor bailed out.
  }
  if (state.flyingTo !== id) return;

  state.flyingTo = null;
  state.focused = id;
  document.body.classList.remove('is-traveling');
  panel.open(bodies[indexOf[id]], indexOf[id], bodies);
  requestAnimationFrame(updateInset);
  history.replaceState(null, '', `#/${id}`);
}

function release() {
  if (!panel.isOpen && !state.flyingTo) return;
  panel.close();
  state.focused = null;
  state.flyingTo = null;
  document.body.classList.remove('is-traveling');
  systemIndex.setCurrent(null);
  world.release();
  updateInset();
  history.replaceState(null, '', location.pathname + location.search);
}

async function takeOff() {
  if (state.phase !== 'intro') return;
  setPhase('descending');
  await world.takeOff();
  setPhase('explore');
}

const idFromHash = () => {
  const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  return id in indexOf ? id : null;
};

// ---- input -----------------------------------------------------------------

world.rig.addEventListener('hover', (e) => {
  if (state.phase !== 'explore') return;
  const body = e.detail ? world.pick(e.detail.x, e.detail.y) : null;
  if ((body?.id ?? null) !== state.hovered) setHover(body?.id ?? null);
});

world.rig.addEventListener('tap', (e) => {
  if (state.phase === 'intro') return takeOff();
  if (state.phase !== 'explore') return;
  const body = world.pick(e.detail.x, e.detail.y);
  if (body) go(body.id);
});

$('#intro').addEventListener('click', (e) => {
  if (e.target.closest('.intro__cta')) takeOff();
});

$('#wordmark').addEventListener('click', (e) => {
  e.preventDefault();
  release();
});

window.addEventListener('keydown', (e) => {
  if (isLightboxOpen()) return;
  if (state.phase === 'intro' && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('a, button')) {
    e.preventDefault();
    takeOff();
  } else if (e.key === 'Escape') {
    release();
  } else if (panel.isOpen && !e.target.closest('input, textarea, [role="slider"]')) {
    const i = indexOf[state.focused];
    if (e.key === 'ArrowRight') go(bodies[(i + 1) % bodies.length].id);
    if (e.key === 'ArrowLeft') go(bodies[(i - 1 + bodies.length) % bodies.length].id);
  }
});

window.addEventListener('hashchange', () => {
  const id = idFromHash();
  if (id) go(id);
  else release();
});

window.addEventListener('resize', updateInset);

world.onFrame = () => {
  labels.update(world, state);
  if (state.hovered) hoverCard.follow(world, world.byId[state.hovered]);
};

// ---- boot ------------------------------------------------------------------

setPhase('loading');
const cta = $('.intro__cta');
const meter = $('.intro__cta-meter span');

try {
  await world.load((p) => {
    meter.style.transform = `scaleX(${p})`;
  });
} catch (err) {
  console.error('Ship failed to load', err);
}

const deepLink = idFromHash();
if (deepLink || prefersReducedMotion() || document.body.classList.contains('no-webgl')) {
  world.skipIntro();
  setPhase('explore');
  if (deepLink) go(deepLink);
} else {
  setPhase('intro');
  world.intro();
  cta.disabled = false;
  $('.intro__cta-label').textContent = site.intro.cta;
  cta.focus({ preventScroll: true });
}
