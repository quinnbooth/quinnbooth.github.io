import { site } from '../content/site.js';

// FormSubmit relays the message to my inbox without a backend.
// The first submission from a new domain triggers a one-time confirmation email.
const ENDPOINT = `https://formsubmit.co/ajax/${site.email}`;

export function mountContactForm(root) {
  root.innerHTML = `
    <form class="contact" novalidate>
      <div class="field">
        <label for="c-name">Your name</label>
        <input id="c-name" name="name" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="c-email">Email</label>
        <input id="c-email" name="email" type="email" autocomplete="email" required />
      </div>
      <div class="field">
        <label for="c-msg">Message</label>
        <textarea id="c-msg" name="message" rows="5" required></textarea>
      </div>
      <input type="text" name="_honey" class="contact__honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <div class="contact__actions">
        <button type="submit" class="button button--primary">Send it</button>
        <p class="contact__status" role="status" aria-live="polite"></p>
      </div>
    </form>`;

  const form = root.querySelector('form');
  const status = root.querySelector('.contact__status');
  const button = form.querySelector('button');

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    if (!data.name.trim() || !/^\S+@\S+\.\S+$/.test(data.email) || !data.message.trim()) {
      status.dataset.tone = 'warn';
      status.textContent = 'Need a name, a real email, and a message.';
      return;
    }
    button.disabled = true;
    status.dataset.tone = '';
    status.textContent = 'Transmitting…';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Website message from ${data.name}`, _template: 'box' }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.dataset.tone = 'ok';
      status.textContent = 'Signal received. I’ll get back to you soon.';
    } catch {
      status.dataset.tone = 'warn';
      status.innerHTML = `That didn’t go through. Email me directly at <a href="mailto:${site.email}">${site.email}</a>.`;
    } finally {
      button.disabled = false;
    }
  };

  form.addEventListener('submit', onSubmit);
  return () => form.removeEventListener('submit', onSubmit);
}
