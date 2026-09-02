(() => {
  const root = document.getElementById('paperLeft');
  if (!root) return;

  function addStrongMarkup(el) {
    if (el.dataset.mdStrongDone === '1') return;
    const text = el.textContent || '';
    if (!text.includes('**')) {
      el.dataset.mdStrongDone = '1';
      return;
    }

    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    el.textContent = '';
    parts.forEach(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const strong = document.createElement('strong');
        strong.textContent = part.slice(2, -2);
        el.appendChild(strong);
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
    el.dataset.mdStrongDone = '1';
  }

  function formatParagraph(p) {
    if (!(p instanceof HTMLElement) || p.dataset.bookFormatted === '1') return;
    let text = p.textContent || '';
    const trimmed = text.trim();

    if (trimmed === '---') {
      p.classList.add('book-section-rule');
      p.textContent = '';
      p.dataset.bookFormatted = '1';
      return;
    }

    if (trimmed.startsWith('## ')) {
      p.classList.add('book-subheading');
      p.textContent = trimmed.slice(3).trim();
    } else if (trimmed.startsWith('> ')) {
      p.classList.add('book-quote');
      p.textContent = text.replace(/^>\s?/gm, '').trim();
    }

    addStrongMarkup(p);
    p.dataset.bookFormatted = '1';
  }

  function formatAll() {
    root.querySelectorAll('.continuous-copy p').forEach(formatParagraph);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(formatAll));
  observer.observe(root, { childList: true, subtree: true });
  formatAll();

  const style = document.createElement('style');
  style.textContent = `
    .continuous-reader .continuous-copy .book-subheading{
      margin:2.35em 0 .9em!important;
      text-indent:0!important;
      font-family:Georgia,'Times New Roman',serif;
      font-size:1.28em;
      line-height:1.35;
      font-weight:700;
      color:#2b2118;
    }
    .continuous-reader .continuous-copy .book-subheading::first-letter{float:none!important;font-size:inherit!important;margin:0!important;color:inherit!important}
    .continuous-reader .continuous-copy .book-section-rule{
      height:1px;
      margin:2.4em 12% 2.2em!important;
      padding:0!important;
      background:rgba(139,98,57,.22);
      text-indent:0!important;
    }
    .continuous-reader .continuous-copy .book-quote{
      margin:1.5em 0 1.65em!important;
      padding:.9em 1.15em!important;
      border-left:3px solid rgba(139,98,57,.55);
      background:rgba(139,98,57,.055);
      text-indent:0!important;
      font-style:italic;
    }
    .continuous-reader .continuous-copy strong{font-weight:700;color:#1f1812}
    @media(max-width:720px){
      .continuous-reader .continuous-copy .book-subheading{font-size:1.2em;margin-top:2em!important}
      .continuous-reader .continuous-copy .book-quote{padding:.8em 1em!important}
    }
  `;
  document.head.appendChild(style);

  const chapterScript = document.createElement('script');
  chapterScript.src = 'chapter567.js';
  chapterScript.onload = () => {
    document.getElementById('languageSelect')?.dispatchEvent(new Event('change'));
    requestAnimationFrame(formatAll);
  };
  document.body.appendChild(chapterScript);
})();