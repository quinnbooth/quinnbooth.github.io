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
  { label: 'Resume', href: site.resume, icon: 'doc', note: 'PDF' },
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

  // Two photos side by side, same shape, no captions.
  pair: (s) => `
    <div class="pair">
      ${s.items
        .map(
          (p) => `
        <figure>
          <img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" />
          ${p.caption ? `<figcaption>${p.caption}</figcaption>` : ''}
        </figure>`,
        )
        .join('')}
    </div>`,

  // Hobbies as a tidy grid: a name, and an optional favorite or note under it.
  interests: (s) => `
    ${heading(s)}
    <ul class="interests">
      ${s.items
        .map(
          (i) => `
        <li class="interest${i.wide ? ' interest--wide' : ''}">
          ${
            // In-site links (#/music) fly you there; outside links open a new tab.
            i.href && !i.linkLabel
              ? `<a class="interest__name interest__name--link" href="${i.href}">${i.name}<span aria-hidden="true">→</span></a>`
              : `<span class="interest__name">${i.name}</span>`
          }
          ${i.note ? `<span class="interest__note">${i.note}</span>` : ''}
          ${
            i.href && i.linkLabel
              ? `<a class="interest__link" href="${i.href}" target="_blank" rel="noopener">${i.linkLabel}${icons.external}</a>`
              : ''
          }
        </li>`,
        )
        .join('')}
    </ul>`,

  // A company mark, floated on a soft glow instead of boxed like a photo.
  logo: (s) => `
    <div class="logo"${s.glow ? ` style="--logo-glow: ${s.glow}"` : ''}>
      <img src="${s.src}" alt="${esc(s.alt)}" decoding="async" />
    </div>`,

  facts: (s) => `
    ${heading(s)}
    <dl class="facts">
      ${s.items.map(([k, v]) => `<div class="facts__row"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
    </dl>`,

  bullets: (s) => `
    ${heading(s)}
    <ul class="bullets">${s.items.map((i) => `<li>${i}</li>`).join('')}</ul>`,

  roles: (s) => `
    ${heading(s)}${note(s)}
    <ol class="roles">
      ${s.items
        .map(
          (r) => `
        <li class="role">
          <div class="role__top">
            <span class="role__title">${r.title}</span>
            <span class="role__when">${r.when}</span>
          </div>
          ${r.org ? `<div class="role__org">${r.org}${r.where ? ` · ${r.where}` : ''}</div>` : ''}
          ${r.body ? `<p class="role__body">${r.body}</p>` : ''}
        </li>`,
        )
        .join('')}
    </ol>`,

  projects: (s) => `
    ${heading(s)}
    <ul class="projects">
      ${s.items
        .map((p) => {
          // Cards without a link (works in progress) render as plain blocks.
          const tag = p.href ? 'a' : 'div';
          const link = p.href ? ` href="${p.href}" target="_blank" rel="noopener"` : '';
          const cls = ['project', p.featured && 'project--featured', p.status && 'project--active', !p.href && 'project--static']
            .filter(Boolean)
            .join(' ');
          return `
        <li>
          <${tag} class="${cls}"${link}>
            ${p.image ? `<div class="project__media"><img src="${p.image}" alt="${esc(p.imageAlt ?? '')}" loading="lazy" decoding="async" />${p.featured ? `<span class="project__badge">${p.featured}</span>` : ''}${
                p.inset
                  ? `<figure class="project__inset"><img src="${p.inset}" alt="${esc(p.insetAlt ?? '')}" loading="lazy" decoding="async" />${p.insetLabel ? `<figcaption>${p.insetLabel}</figcaption>` : ''}</figure>`
                  : ''
              }</div>` : ''}
            <div class="project__top">
              <span class="project__name">${p.name}</span>
              ${
                p.status
                  ? `<span class="project__status"><span class="project__pulse" aria-hidden="true"></span>${p.status}</span>`
                  : `<span class="project__year">${p.year}</span>`
              }
            </div>
            <p class="project__blurb">${p.blurb}</p>
            <div class="project__foot">
              <span class="tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</span>
              ${p.href ? `<span class="project__go">${icons.external}</span>` : ''}
            </div>
          </${tag}>
        </li>`;
        })
        .join('')}
    </ul>`,

  figures: (s) => `
    ${heading(s)}
    <div class="figures">
      ${s.items
        .map(
          (f, i) => `
        <figure class="figure">
          <button class="figure__btn" type="button" data-index="${i}" aria-label="Enlarge photo: ${esc(f.caption)}">
            <img src="${f.src}" alt="${esc(f.alt ?? '')}" loading="lazy" decoding="async" />
          </button>
          <figcaption>${f.caption}</figcaption>
        </figure>`,
        )
        .join('')}
    </div>`,

  papers: (s) => `
    ${heading(s)}
    <ol class="papers">
      ${s.items
        .map(
          (p) => `
        <li>
          <a class="paper${p.featured ? ' paper--featured' : ''}" href="${p.href}" target="_blank" rel="noopener">
            <div class="paper__venue"><span>${p.venue}</span><span>${p.year}</span></div>
            <div class="paper__title">${p.title}</div>
            <p class="paper__blurb">${p.blurb}</p>
            <div class="paper__foot">
              <span class="paper__authors">${p.authors}</span>
              <span class="paper__go">${p.position}${icons.external}</span>
            </div>
          </a>
        </li>`,
        )
        .join('')}
    </ol>`,

  // Launch footage: muted clips stacked one above the other. Each one loads
  // and plays only while it's on screen (see hydrateSections).
  launch: (s) => `
    ${heading(s)}
    <div class="launch">
      <div class="launch__head">
        <span class="launch__title">${s.title}</span>
        <span class="launch__when">${s.when}</span>
      </div>
      ${s.clips
        .map(
          (c, i) => `
        <figure class="clip${c.vertical ? ' clip--vertical' : ''}" aria-label="${esc(c.label)}">
          <div class="clip__frame" data-clip="${i}"></div>
          <span class="clip__tag"><span class="clip__stamp">${c.stamp}</span>${c.label}</span>
        </figure>`,
        )
        .join('')}
      ${s.note ? `<p class="launch__note">${s.note}</p>` : ''}
    </div>`,

  // Click-to-load: nothing from YouTube is fetched until someone presses play.
  video: (s) => `
    ${heading(s)}
    <figure class="video">
      <button class="video__poster" type="button" data-youtube="${s.youtube}" aria-label="Play video: ${esc(s.title)}">
        <img src="https://i.ytimg.com/vi/${s.youtube}/hqdefault.jpg" alt="" loading="lazy" decoding="async" />
        <span class="video__play">${icons.play}</span>
        <span class="video__title">${s.title}</span>
      </button>
      ${s.caption ? `<figcaption>${s.caption}</figcaption>` : ''}
    </figure>`,

  courses: (s) => `
    ${heading(s)}${note(s)}
    <div class="courses">
      ${s.items
        .map(
          (g) => `
        <div class="courses__group">
          <div class="courses__name">${g.group}</div>
          <ul class="courses__list">
            ${g.courses
              .map(
                ([name, code, aside]) => `
              <li class="course">
                <span class="course__name">${name}${aside ? `<span class="course__aside">${aside}</span>` : ''}</span>
                <span class="course__code">${code}</span>
              </li>`,
              )
              .join('')}
          </ul>
        </div>`,
        )
        .join('')}
    </div>`,

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

  const figureSets = sections.filter((s) => s.type === 'figures');
  root.querySelectorAll('.figures').forEach((grid, gi) => {
    const items = figureSets[gi].items;
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.figure__btn');
      if (btn) openLightbox(items, Number(btn.dataset.index), btn);
    });
  });

  // Launch clips: create the (muted, controls-free) player the first time a
  // clip scrolls into view, then pause and resume it as it leaves and returns.
  const launches = sections.filter((s) => s.type === 'launch');
  const frames = [];
  root.querySelectorAll('.launch').forEach((el, li) => {
    el.querySelectorAll('.clip__frame').forEach((frame) => frames.push([frame, launches[li].clips[frame.dataset.clip]]));
  });
  if (frames.length) {
    const command = (iframe, func) =>
      iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const frame = entry.target;
          const clip = frame._clip;
          let iframe = frame.querySelector('iframe');
          if (entry.isIntersecting) {
            if (!iframe) {
              const params = new URLSearchParams({
                autoplay: '1',
                mute: '1',
                controls: '0',
                playsinline: '1',
                rel: '0',
                disablekb: '1',
                iv_load_policy: '3',
                cc_load_policy: '0',
                enablejsapi: '1',
                origin: location.origin,
              });
              // YouTube's own loop ignores start times, so clips with a window
              // loop by hand (see onPlayerMessage); the rest use the built-in one.
              if (clip.start) params.set('start', String(clip.start));
              else params.set('loop', '1'), params.set('playlist', clip.youtube);
              iframe = document.createElement('iframe');
              iframe.src = `https://www.youtube-nocookie.com/embed/${clip.youtube}?${params}`;
              iframe.title = clip.label;
              iframe.allow = 'autoplay; encrypted-media';
              iframe.tabIndex = -1;
              // Ask the player to report its time, so windowed clips can loop.
              iframe.addEventListener('load', () => {
                let tries = 0;
                const ask = setInterval(() => {
                  if (iframe._heard || ++tries > 20 || !iframe.isConnected) return clearInterval(ask);
                  iframe.contentWindow?.postMessage(
                    JSON.stringify({ event: 'listening', id: clip.youtube, channel: 'widget' }),
                    '*',
                  );
                }, 500);
              });
              frame.appendChild(iframe);
            } else {
              command(iframe, 'playVideo');
            }
          } else if (iframe) {
            command(iframe, 'pauseVideo');
          }
        }
      },
      { root: root.closest('.panel__scroll'), threshold: 0.35 },
    );
    for (const [frame, clip] of frames) {
      frame._clip = clip;
      io.observe(frame);
    }
    const onPlayerMessage = (e) => {
      if (!String(e.origin).includes('youtube')) return;
      let data;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      const t = data?.info?.currentTime;
      const ended = data?.info?.playerState === 0;
      for (const [frame, clip] of frames) {
        const iframe = frame.querySelector('iframe');
        if (!clip.start || !iframe || e.source !== iframe.contentWindow) continue;
        iframe._heard = true;
        // One jump per loop: the player keeps reporting the old time for a
        // moment after a seek, and a burst of seeks makes YouTube error out.
        if (performance.now() < (iframe._seekedAt ?? 0) + 3000) continue;
        if (ended || (typeof t === 'number' && t >= (clip.end ?? Infinity))) {
          iframe._seekedAt = performance.now();
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [clip.start, true] }), '*');
          command(iframe, 'playVideo');
        }
      }
    };
    window.addEventListener('message', onPlayerMessage);
    cleanups.push(() => {
      io.disconnect();
      window.removeEventListener('message', onPlayerMessage);
    });
  }

  root.querySelectorAll('.video__poster').forEach((btn) => {
    btn.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.className = 'video__frame';
      frame.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.youtube}?autoplay=1&rel=0`;
      frame.title = btn.getAttribute('aria-label').replace('Play video: ', '');
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      btn.replaceWith(frame);
      frame.focus();
    });
  });

  return () => cleanups.forEach((fn) => fn?.());
}
