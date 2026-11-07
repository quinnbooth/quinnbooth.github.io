import { icons } from './icons.js';
import { site } from '../content/site.js';
import { mountTracks } from './tracks.js';
import { mountContactForm } from './contact.js';
import { openLightbox } from './lightbox.js';

/** Plain-text escaping for values that should never be HTML (alt text, etc). */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const heading = (s) => (s.heading ? `<h3 class="sec__heading">${s.heading}</h3>` : '');
const note = (s) => (s.note ? `<p class="sec__note">${s.note}</p>` : '');

const standardLinks = () => [
  { label: 'Résumé', href: site.resume, icon: 'doc', note: 'PDF' },
  { label: 'GitHub', href: site.links.github, icon: 'github' },
  { label: 'LinkedIn', href: site.links.linkedin, icon: 'linkedin' },
  { label: site.email, href: `mailto:${site.email}`, icon: 'mail' },
];

const renderers = {
  lead: (s) => `<p class="sec__lead">${s.text}</p>`,

  text: (s) => `${heading(s)}<div class="sec__text">${s.html}</div>`,

  photo: (s) => `
    <figure class="photo photo--${s.shape ?? 'wide'}">
      <img src="${s.src}" alt="${esc(s.alt)}" loading="lazy" decoding="async" />
      ${s.caption ? `<figcaption>${s.caption}</figcaption>` : ''}
    </figure>`,

  facts: (s) => `
    ${heading(s)}
    <dl class="facts">
      ${s.items.map(([k, v]) => `<div class="facts__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
    </dl>`,

  bullets: (s) => `
    ${heading(s)}
    <ul class="bullets">${s.items.map((i) => `<li>${i}</li>`).join('')}</ul>`,

  roles: (s) => `
    ${heading(s)}
    <ol class="roles">
      ${s.items
        .map(
          (r) => `
        <li class="role">
          <div class="role__top">
            <span class="role__title">${r.title}</span>
            <span class="role__when">${r.when}</span>
          </div>
          <div class="role__org">${r.org}${r.where ? ` · ${r.where}` : ''}</div>
          <p class="role__body">${r.body}</p>
        </li>`,
        )
        .join('')}
    </ol>`,

  projects: (s) => `
    ${heading(s)}
    <ul class="projects">
      ${s.items
        .map(
          (p) => `
        <li>
          <a class="project" href="${p.href}" target="_blank" rel="noopener">
            <div class="project__top">
              <span class="project__name">${p.name}</span>
              <span class="project__year">${p.year}</span>
            </div>
            <p class="project__blurb">${p.blurb}</p>
            <div class="project__foot">
              <span class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</span>
              <span class="project__go">${icons.external}</span>
            </div>
          </a>
        </li>`,
        )
        .join('')}
    </ul>`,

  tracks: (s) => `${heading(s)}${note(s)}<div class="tracks" data-mount="tracks"></div>`,

  gallery: (s) => `
    ${heading(s)}${note(s)}
    <ol class="gallery">
      ${s.items
        .map(
          (g, i) => `
        <li>
          <button class="gallery__item" type="button" data-index="${i}" aria-label="Open photo ${i + 1}: ${esc(g.caption)}">
            <img src="${g.src}" alt="" loading="lazy" decoding="async" />
            <span class="gallery__step">${String(i + 1).padStart(2, '0')}</span>
          </button>
          <p class="gallery__caption">${g.caption}</p>
        </li>`,
        )
        .join('')}
    </ol>`,

  links: (s) => {
    const items = s.items === 'standard' ? standardLinks() : s.items;
    return `
      ${heading(s)}
      <ul class="linklist">
        ${items
          .map((l) => {
            const ext = l.href.startsWith('http');
            return `<li><a href="${l.href}" ${ext ? 'target="_blank" rel="noopener"' : ''}>
              <span class="linklist__icon">${icons[l.icon] ?? ''}</span>
              <span class="linklist__label">${l.label}</span>
              ${l.note ? `<span class="linklist__note">${l.note}</span>` : ''}
              <span class="linklist__go">${icons.external}</span>
            </a></li>`;
          })
          .join('')}
      </ul>`;
  },

  contact: () => `<div data-mount="contact"></div>`,
};

/** Render a body's sections to HTML. */
export function renderSections(sections) {
  return sections
    .map((s) => {
      const render = renderers[s.type];
      if (!render) {
        console.warn(`Unknown section type "${s.type}"`);
        return '';
      }
      return `<section class="sec sec--${s.type}">${render(s)}</section>`;
    })
    .join('');
}

/**
 * Wire up the interactive bits after the HTML is in the page.
 * Returns a cleanup function (stops audio, etc).
 */
export function hydrateSections(root, sections, ctx) {
  const cleanups = [];
  const mounts = root.querySelectorAll('[data-mount]');
  let mi = 0;
  const interactive = sections.filter((s) => s.type === 'tracks' || s.type === 'contact');
  for (const s of interactive) {
    const el = mounts[mi++];
    if (!el) break;
    if (s.type === 'tracks') cleanups.push(mountTracks(el, s.items, ctx));
    if (s.type === 'contact') cleanups.push(mountContactForm(el));
  }

  const galleries = sections.filter((s) => s.type === 'gallery');
  root.querySelectorAll('.gallery').forEach((list, gi) => {
    const items = galleries[gi].items;
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.gallery__item');
      if (btn) openLightbox(items, Number(btn.dataset.index), btn);
    });
  });

  return () => cleanups.forEach((fn) => fn?.());
}
