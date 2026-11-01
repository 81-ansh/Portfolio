/**
 * PROJECT PAGE entry point (project.html?id=<project id>).
 * Looks the project up in data/projects.js and fills in the page.
 */
import { initMobileMenu } from './modules/nav.js';
import { initGallery } from './modules/media-gallery.js';
import { el } from './modules/dom.js';
import { projects } from './data/projects.js';

initMobileMenu();

const id = new URLSearchParams(window.location.search).get('id');
const project = projects.find((p) => p.id === id);

if (project) renderProject(project);
else renderNotFound();

function fillList(listId, headingId, items) {
  const list = document.getElementById(listId);
  const heading = document.getElementById(headingId);
  list.replaceChildren(...items.map((text) => el('li', { text })));
  list.classList.toggle('hidden', items.length === 0);
  heading.classList.toggle('hidden', items.length === 0);
}

function renderProject(p) {
  document.title = `${p.title} | Ansh Sharma – Game Developer`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', p.description.split('. ')[0].replace(/\.$/, '') + '.');

  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailDesc').textContent = p.description;

  const gameType = document.getElementById('detailGameType');
  gameType.textContent = p.gameType;
  gameType.classList.toggle('hidden', !p.gameType);

  fillList('detailTech', 'techHeading', p.tech);
  fillList('detailFeatures', 'featuresHeading', p.features);

  // Show a link button only if the project has that link.
  const links = [
    ['githubLinkDetail', p.links.github],
    ['itchioLinkDetail', p.links.itchio],
  ];
  for (const [elementId, url] of links) {
    const link = document.getElementById(elementId);
    if (url) {
      link.href = url;
      link.hidden = false;
    }
  }

  initGallery(p);
}

function renderNotFound() {
  document.title = 'Project not found | Ansh Sharma';
  document.querySelector('.project-detail-layout').replaceChildren(
    el('div', { class: 'project-not-found' }, [
      el('h2', { class: 'accent-title', text: 'Project not found' }),
      el('p', { class: 'grey-text', text: "That project doesn't exist (or the link is old)." }),
      el('a', { class: 'btn btn-primary', href: 'index.html#projects', text: 'BACK TO PROJECTS' }),
    ])
  );
}
