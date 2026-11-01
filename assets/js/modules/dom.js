/**
 * Tiny helper for building elements without writing innerHTML strings.
 *
 *   el('a', { class: 'btn', href: '#top', text: 'Go up' })
 *   el('ul', {}, [el('li', { text: 'One' }), el('li', { text: 'Two' })])
 *
 * Special keys: class, text. Everything else becomes an HTML attribute.
 * Attributes set to false / null / undefined are skipped.
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === false || value === null || value === undefined) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, value === true ? '' : value);
  }

  for (const child of children) {
    node.append(child);
  }
  return node;
}

/** Lock or unlock page scrolling (used by pop-ups and the mobile menu). */
export function lockScroll(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}
