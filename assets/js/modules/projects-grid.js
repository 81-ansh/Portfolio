/** Builds the project cards on the home page from data/projects.js. */
import { el } from './dom.js';
import { projects } from '../data/projects.js';

export function renderProjects(container) {
  if (!container) return;

  const cards = projects.map((project) =>
    el('a', { class: 'project-tile', href: `project.html?id=${encodeURIComponent(project.id)}` }, [
      el('img', {
        src: `assets/images/projects/${project.id}/logo.webp`,
        alt: `${project.title} project logo`,
        width: 400,
        height: 400,
        loading: 'lazy',
        decoding: 'async',
      }),
      el('h3', { text: project.title }),
      el('p', { class: 'project-tech', text: project.cardTech }),
    ])
  );

  container.replaceChildren(...cards);
}
