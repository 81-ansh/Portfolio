/** Certificate cards (built from data/certificates.js) and the full-size certificate pop-up. */
import { el, lockScroll } from './dom.js';
import { certificates } from '../data/certificates.js';

export function renderCertificates(container) {
  if (!container) return;

  const cards = certificates.map((cert) =>
    el('div', { class: 'certificate-tile' }, [
      el('h3', { text: cert.title }),
      el('p', { text: cert.issuer }),
      // The href points at the image, so the link still works if JavaScript is off.
      el('a', { class: 'view-cert-btn', href: cert.image, 'data-verify': cert.verifyUrl, text: 'View Certificate' }),
    ])
  );

  container.replaceChildren(...cards);
}

export function initCertificatePopup(container) {
  const popup = document.getElementById('certPopup');
  const image = document.getElementById('certImage');
  const verifyLink = document.getElementById('verifyBtn');
  const closeButton = popup?.querySelector('.cert-close');
  if (!container || !popup || !image || !verifyLink || !closeButton) return;

  let savedScroll = 0;
  let opener = null;

  const open = (trigger) => {
    opener = trigger;
    savedScroll = window.scrollY;
    image.src = trigger.getAttribute('href');
    verifyLink.href = trigger.dataset.verify;
    lockScroll(true);
    popup.inert = false;
    popup.classList.add('active');
    closeButton.focus();
  };

  const close = () => {
    popup.classList.remove('active');
    popup.inert = true; // not focusable or clickable while hidden
    lockScroll(false);
    window.scrollTo(0, savedScroll);
    opener?.focus({ preventScroll: true });
  };

  container.addEventListener('click', (event) => {
    const trigger = event.target.closest('.view-cert-btn');
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });

  closeButton.addEventListener('click', close);
  popup.addEventListener('click', (event) => {
    if (event.target === popup) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('active')) close();
  });
}
