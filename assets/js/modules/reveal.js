/** Fades each `.reveal` section in the first time it scrolls into view. */
export function initReveal() {
  const nodes = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target); // only needs to happen once
    }
  }, { threshold: 0.15 });

  nodes.forEach((node) => observer.observe(node));
}
