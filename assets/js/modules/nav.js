/**
 * Navigation: the mobile slide-in menu and the "active section" highlight.
 * Used by both pages (the highlight only does something on the home page).
 */
import { lockScroll } from './dom.js';

const MOBILE_QUERY = '(max-width: 900px)';
const CLOSE_ANIMATION_MS = 700; // must match the closing animation in header.css

export function initMobileMenu() {
  const nav = document.querySelector('.site-nav');
  const navWrap = document.querySelector('.nav-wrap');
  const menuButton = document.querySelector('.menu-btn');
  if (!nav || !navWrap || !menuButton) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  // On phones the nav is moved to <body> so the full-screen menu can sit above everything.
  const mobile = window.matchMedia(MOBILE_QUERY);
  const placeNav = () => {
    if (mobile.matches) {
      if (nav.parentElement !== document.body) document.body.appendChild(nav);
    } else if (nav.parentElement !== navWrap) {
      navWrap.insertBefore(nav, menuButton);
    }
  };
  placeNav();
  mobile.addEventListener('change', placeNav);

  const openMenu = () => {
    nav.classList.add('open');
    overlay.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    lockScroll(true);
  };

  const closeMenu = () => {
    nav.classList.add('closing');
    overlay.classList.add('closing');
    nav.classList.remove('open');
    overlay.classList.remove('open');

    setTimeout(() => {
      nav.classList.remove('closing');
      overlay.classList.remove('closing');
      menuButton.setAttribute('aria-expanded', 'false');
      lockScroll(false);
    }, CLOSE_ANIMATION_MS);
  };

  menuButton.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && mobile.matches) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
}

/** Highlights the nav link of the section currently on screen. */
export function initActiveNav() {
  const links = [...document.querySelectorAll('.site-nav a')];
  const sections = [...document.querySelectorAll('section[id]')];
  if (!sections.length || !links.length) return;

  const update = () => {
    const position = window.scrollY + 100;
    const atPageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    const lastId = sections[sections.length - 1].id;

    let activeId = null;
    for (const section of sections) {
      const inside = position >= section.offsetTop && position < section.offsetTop + section.offsetHeight;
      if (inside || (atPageBottom && section.id === lastId)) activeId = section.id;
    }
    if (activeId === null) return;

    for (const link of links) {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    }
  };

  // Run at most once per frame while scrolling.
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
