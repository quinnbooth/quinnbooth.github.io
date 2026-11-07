import { icons } from './icons.js';

let dialog;

function build() {
  dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = `
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="" />
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
    <button class="lightbox__btn lightbox__prev" type="button" aria-label="Previous photo">${icons.prev}</button>
    <button class="lightbox__btn lightbox__next" type="button" aria-label="Next photo">${icons.next}</button>
    <button class="lightbox__btn lightbox__close" type="button" aria-label="Close">${icons.close}</button>`;
  document.body.appendChild(dialog);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
  return dialog;
}

export function isLightboxOpen() {
  return Boolean(dialog?.open);
}

export function openLightbox(items, start, returnFocus) {
  const d = dialog ?? build();
  const img = d.querySelector('.lightbox__img');
  const cap = d.querySelector('.lightbox__caption');
  let i = start;

  const show = () => {
    img.src = items[i].src;
    cap.textContent = `${String(i + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}  ${items[i].caption}`;
  };
  const step = (n) => {
    i = (i + n + items.length) % items.length;
    show();
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };
  const prev = d.querySelector('.lightbox__prev');
  const next = d.querySelector('.lightbox__next');
  prev.onclick = () => step(-1);
  next.onclick = () => step(1);
  d.addEventListener('keydown', onKey);
  d.addEventListener(
    'close',
    () => {
      d.removeEventListener('keydown', onKey);
      returnFocus?.focus();
    },
    { once: true },
  );

  show();
  d.showModal();
}
