import { icons } from './icons.js';

let audioCtx;
let analyser;
const sources = new WeakMap();

function connect(audio) {
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (!analyser) {
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.connect(audioCtx.destination);
    }
    if (!sources.has(audio)) {
      const src = audioCtx.createMediaElementSource(audio);
      src.connect(analyser);
      sources.set(audio, src);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return true;
  } catch {
    return false; // Audio still plays; the rings just won't dance.
  }
}

const fmt = (s) => {
  if (!Number.isFinite(s)) return '–:––';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

/**
 * A small custom player. While something plays, it reports a 0..1 loudness
 * to `ctx.onLevel`, which drives the music planet's rings.
 */
export function mountTracks(root, tracks, ctx) {
  const buf = new Uint8Array(1024);
  let raf = 0;
  let current = null;

  const rows = tracks.map((t, i) => {
    const row = document.createElement('div');
    row.className = 'track';
    row.innerHTML = `
      <button class="track__play" type="button" aria-label="Play ${t.title}">${icons.play}</button>
      <div class="track__main">
        <div class="track__top">
          <span class="track__title">${t.title}${t.by ? `<span class="track__by">${t.by}</span>` : ''}</span>
          <span class="track__time">–:––</span>
        </div>
        <div class="track__bar" role="slider" tabindex="0" aria-label="Seek ${t.title}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span class="track__fill"></span>
        </div>
      </div>`;
    root.appendChild(row);

    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = t.src;
    const btn = row.querySelector('.track__play');
    const time = row.querySelector('.track__time');
    const bar = row.querySelector('.track__bar');
    const fill = row.querySelector('.track__fill');

    const sync = () => {
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = `${pct}%`;
      bar.setAttribute('aria-valuenow', Math.round(pct));
      time.textContent = audio.paused && audio.currentTime === 0 ? fmt(audio.duration) : fmt(audio.currentTime);
    };
    audio.addEventListener('loadedmetadata', sync);
    audio.addEventListener('timeupdate', sync);
    audio.addEventListener('play', () => {
      row.classList.add('is-playing');
      btn.innerHTML = icons.pause;
      btn.setAttribute('aria-label', `Pause ${t.title}`);
    });
    audio.addEventListener('pause', () => {
      row.classList.remove('is-playing');
      btn.innerHTML = icons.play;
      btn.setAttribute('aria-label', `Play ${t.title}`);
    });
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      const next = rows[i + 1];
      if (next) play(next.audio);
    });

    btn.addEventListener('click', () => (audio.paused ? play(audio) : audio.pause()));

    const seek = (clientX) => {
      const r = bar.getBoundingClientRect();
      if (audio.duration) audio.currentTime = ((clientX - r.left) / r.width) * audio.duration;
    };
    bar.addEventListener('pointerdown', (e) => {
      seek(e.clientX);
      const move = (ev) => seek(ev.clientX);
      const up = () => window.removeEventListener('pointermove', move);
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up, { once: true });
    });
    bar.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    });

    return { audio, row };
  });

  function play(audio) {
    for (const r of rows) if (r.audio !== audio) r.audio.pause();
    current = audio;
    const analysed = connect(audio);
    audio.play().catch(() => {});
    if (analysed) loop();
  }

  function loop() {
    cancelAnimationFrame(raf);
    const tick = () => {
      if (!current || current.paused) {
        ctx.onLevel?.(0);
        return;
      }
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length);
      ctx.onLevel?.(Math.min(1, rms * 5));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  return () => {
    cancelAnimationFrame(raf);
    for (const r of rows) {
      r.audio.pause();
      r.audio.removeAttribute('src');
      r.audio.load();
    }
    ctx.onLevel?.(0);
  };
}
