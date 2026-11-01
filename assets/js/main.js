/**
 * HOME PAGE entry point (index.html).
 * Each feature lives in its own file under modules/. This file just switches them on.
 */
import { initMobileMenu, initActiveNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initAboutWords } from './modules/about-words.js';
import { renderProjects } from './modules/projects-grid.js';
import { renderCertificates, initCertificatePopup } from './modules/certificates.js';
import { initDragon } from './modules/dragon.js';

initMobileMenu();

// Content that is generated from the files in data/
renderProjects(document.getElementById('projects-grid'));
const certificateGrid = document.getElementById('certificate-grid');
renderCertificates(certificateGrid);
initCertificatePopup(certificateGrid);

initAboutWords();
initActiveNav();
initReveal();

// The dragon is decoration: if it fails, the rest of the page must keep working.
try {
  const dragon = initDragon();

  if (dragon && new URLSearchParams(window.location.search).has('debug')) {
    import('./dev/dragon-debug.js').then(({ attachDragonDebug }) => {
      attachDragonDebug({
        renderer: dragon.renderer,
        state: dragon.state,
        getModel: dragon.getModel,
        setOverride: (value) => { dragon.manualOverride = value; },
      });
    });
  }
} catch (error) {
  console.error('The dragon could not start:', error);
}
