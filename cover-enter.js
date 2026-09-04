(() => {
  const cover = document.querySelector('.image-book-cover');
  if (!cover) return;

  const languageSelect = document.getElementById('languageSelect');
  const labels = {
    zh: { action: '进入书中故事', aria: '打开 Book 1 — My Life Origin，从序章开始阅读' },
    en: { action: 'ENTER THE BOOK', aria: 'Open Book 1 — My Life Origin and begin from the prologue' },
    ms: { action: 'MASUK KE DALAM BUKU', aria: 'Buka Book 1 — My Life Origin dan mula dari prolog' }
  };

  cover.classList.add('clickable-book-cover');
  cover.setAttribute('role', 'button');
  cover.setAttribute('tabindex', '0');

  const cue = document.createElement('div');
  cue.className = 'book-cover-enter-cue';
  cue.innerHTML = '<span class="book-cover-enter-line"></span><strong></strong><small>BOOK 1 · MY LIFE ORIGIN</small>';
  cover.appendChild(cue);

  const style = document.createElement('style');
  style.textContent = `
    .clickable-book-cover{position:relative;cursor:pointer;outline:none;transition:transform .32s ease,box-shadow .32s ease}
    .clickable-book-cover:focus-visible{box-shadow:0 0 0 3px rgba(184,137,87,.55),0 24px 54px rgba(0,0,0,.28)}
    .clickable-book-cover:hover{transform:translateY(-5px);box-shadow:0 28px 62px rgba(0,0,0,.3)}
    .clickable-book-cover img{transition:filter .32s ease,transform .45s ease}
    .clickable-book-cover:hover img,.clickable-book-cover:focus-visible img{filter:brightness(.76);transform:scale(1.012)}
    .book-cover-enter-cue{position:absolute;inset:auto 0 0 0;padding:50px 26px 24px;background:linear-gradient(to top,rgba(7,6,5,.94),rgba(7,6,5,.58) 58%,transparent);color:#f7efe5;opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .28s ease;pointer-events:none;text-align:left}
    .clickable-book-cover:hover .book-cover-enter-cue,.clickable-book-cover:focus-visible .book-cover-enter-cue{opacity:1;transform:translateY(0)}
    .book-cover-enter-line{display:block;width:34px;height:1px;background:#c99763;margin-bottom:12px}
    .book-cover-enter-cue strong{display:block;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:1.3;letter-spacing:.01em}
    .book-cover-enter-cue small{display:block;margin-top:6px;font-size:9px;letter-spacing:.16em;color:#c8b39d}
    @media(max-width:700px){
      .book-cover-enter-cue{opacity:1;transform:none;padding:44px 18px 18px;background:linear-gradient(to top,rgba(7,6,5,.9),rgba(7,6,5,.42) 62%,transparent)}
      .book-cover-enter-cue strong{font-size:16px}
    }
  `;
  document.head.appendChild(style);

  function applyLanguage(){
    const lang = languageSelect?.value || 'zh';
    const copy = labels[lang] || labels.zh;
    cover.setAttribute('aria-label', copy.aria);
    const strong = cue.querySelector('strong');
    if (strong) strong.textContent = copy.action;
  }

  function enterBook(){
    if (!window.bookReady) {
      document.getElementById('bookLoadStatus')?.scrollIntoView({ block: 'center' });
      return;
    }
    if (typeof window.openReader === 'function') {
      window.openReader(0);
      return;
    }

    const firstChapter = document.querySelector('[data-chapter="0"]');
    if (firstChapter instanceof HTMLElement) {
      firstChapter.click();
      return;
    }

    document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cover.addEventListener('click', enterBook);
  cover.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      enterBook();
    }
  });
  languageSelect?.addEventListener('change', applyLanguage);
  applyLanguage();
})();
