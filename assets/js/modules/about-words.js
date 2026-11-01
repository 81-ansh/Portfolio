/** Wraps every word of the About paragraphs in a <span> so each word can light up on hover. */
export function initAboutWords() {
  document.querySelectorAll('.aboutParagraph').forEach((paragraph) => {
    const words = paragraph.textContent.trim().split(/\s+/);
    paragraph.textContent = '';

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'about-word';
      span.textContent = word;
      paragraph.append(span);
      if (index < words.length - 1) paragraph.append(' ');
    });
  });
}
