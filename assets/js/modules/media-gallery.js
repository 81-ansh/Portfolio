/**
 * The media viewer on the project page: a big viewer (video or image),
 * a strip of thumbnails, previous/next arrows, and click-to-zoom on images.
 */
import { el, lockScroll } from './dom.js';

/** Pulls the video id out of a youtube.com/watch?v=... or youtu.be/... link. */
function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
  } catch {
    /* not a valid URL */
  }
  return null;
}

const youTubeEmbedUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
};
const youTubeThumbUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

/** Full-screen zoomed image. Click or press Escape to close. */
function openZoom(src, alt) {
  const overlay = el('div', { class: 'image-zoom', role: 'dialog', 'aria-modal': 'true', 'aria-label': alt }, [
    el('img', { src, alt }),
  ]);

  const close = () => {
    overlay.remove();
    lockScroll(false);
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (event) => { if (event.key === 'Escape') close(); };

  overlay.addEventListener('click', close);
  document.addEventListener('keydown', onKey);
  document.body.append(overlay);
  lockScroll(true);
}

export function initGallery(project) {
  const main = document.getElementById('mediaMain');
  const strip = document.getElementById('mediaStrip');
  const prevButton = document.querySelector('.media-arrow-left');
  const nextButton = document.querySelector('.media-arrow-right');
  if (!main || !strip) return;

  const folder = `assets/images/projects/${project.id}`;

  // Build the list: the video first (if any), then every screenshot.
  const items = [];
  if (project.video) items.push({ type: 'video', src: project.video });
  for (let n = 1; n <= project.screenshots; n++) {
    items.push({
      type: 'image',
      src: `${folder}/shot-${n}.webp`,
      thumb: `${folder}/thumb-${n}.webp`,
      alt: `${project.title} screenshot ${n}`,
    });
  }
  if (!items.length) items.push({ type: 'image', src: `${folder}/logo.webp`, thumb: `${folder}/logo.webp`, alt: `${project.title} logo` });

  let current = 0;

  function renderMain() {
    const item = items[current];
    if (item.type === 'video') {
      main.replaceChildren(el('iframe', {
        class: 'media-main-frame',
        src: youTubeEmbedUrl(item.src),
        title: `${project.title} gameplay video`,
        frameborder: '0',
        allowfullscreen: true,
        referrerpolicy: 'strict-origin-when-cross-origin',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      }));
      return;
    }

    const image = el('img', { class: 'media-main-image', src: item.src, alt: item.alt, decoding: 'async' });
    image.addEventListener('click', () => openZoom(item.src, item.alt));
    main.replaceChildren(image);
  }

  function renderStrip() {
    const buttons = items.map((item, index) => {
      const button = el('button', {
        type: 'button',
        class: `media-thumb-button${index === current ? ' active' : ''}`,
        'aria-label': item.type === 'video' ? 'Show gameplay video' : `Show screenshot ${index + (items[0].type === 'video' ? 0 : 1)}`,
      });

      if (item.type === 'video') {
        button.append(el('div', { class: 'media-thumb-video' }, [
          el('img', { class: 'media-thumb-image', src: youTubeThumbUrl(item.src), alt: '' }),
          el('div', { class: 'media-thumb-icon' }, [el('i', { class: 'fa-solid fa-play', 'aria-hidden': 'true' })]),
        ]));
      } else {
        const thumb = el('img', { class: 'media-thumb-image', src: item.thumb, alt: '', loading: 'lazy', decoding: 'async' });
        // If a small thumbnail file is missing, fall back to the full-size screenshot.
        thumb.addEventListener('error', () => { thumb.src = item.src; }, { once: true });
        button.append(thumb);
      }

      button.addEventListener('click', () => show(index));
      return button;
    });

    strip.replaceChildren(...buttons);

    // Keep the selected thumbnail centred in the strip.
    const active = strip.querySelector('.media-thumb-button.active');
    if (active) {
      strip.scrollTo({ left: active.offsetLeft - strip.offsetWidth / 2 + active.offsetWidth / 2, behavior: 'smooth' });
    }
  }

  function show(index) {
    current = (index + items.length) % items.length;
    renderMain();
    renderStrip();
  }

  prevButton?.addEventListener('click', () => show(current - 1));
  nextButton?.addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', (event) => {
    if (document.querySelector('.image-zoom')) return; // the zoom view handles its own keys
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });

  show(0);
}
