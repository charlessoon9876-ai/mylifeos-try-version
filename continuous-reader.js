(() => {
  const reader = document.getElementById('reader');
  const stage = document.getElementById('bookStage');
  const spread = document.getElementById('bookSpread');
  const left = document.getElementById('paperLeft');
  const right = document.getElementById('paperRight');
  const gutter = document.querySelector('.book-gutter');
  const prev = document.getElementById('bookPrevPage');
  const next = document.getElementById('bookNextPage');
  const pageLabel = document.getElementById('bookPageLabel');
  const chapterLabel = document.getElementById('bookChapterLabel');
  const progressBar = document.getElementById('bookProgressBar');
  const languageSelect = document.getElementById('languageSelect');

  if (!reader || !stage || !spread || !left || typeof chapterContent === 'undefined') return;

  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const lang = () => languageSelect?.value || 'zh';
  const list = () => chapterContent[lang()] || chapterContent.zh;

  let activeIndex = 0;
  let scrollTimer = null;

  const labels = {
    zh: '连续阅读 · 向下滚动',
    en: 'Continuous reading · Scroll down',
    ms: 'Bacaan berterusan · Skrol ke bawah'
  };

  function bodyHtml(text) {
    return String(text || '')
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${escapeHtml(p)}</p>`)
      .join('');
  }

  function sectionHtml(chapter, index) {
    return `<section class="continuous-chapter" data-continuous-chapter="${index}" id="continuous-chapter-${index}">
      <header class="continuous-chapter-head">
        <p class="paper-kicker">${escapeHtml(chapter[0])}</p>
        <h2>${escapeHtml(chapter[1])}</h2>
        <p class="paper-intro">${escapeHtml(chapter[2])}</p>
      </header>
      <div class="paper-copy continuous-copy">${bodyHtml(chapter[3])}</div>
      <div class="continuous-divider"><span>MY LIFE OS · ORIGIN</span></div>
    </section>`;
  }

  function syncHiddenSource(index) {
    const chapter = list()[index];
    if (!chapter) return;
    activeIndex = index;
    currentChapter = index;
    const kicker = document.getElementById('readerKicker');
    const title = document.getElementById('readerTitle');
    const intro = document.getElementById('readerIntro');
    const body = document.getElementById('readerBody');
    if (kicker) kicker.textContent = chapter[0];
    if (title) title.textContent = chapter[1];
    if (intro) intro.textContent = chapter[2];
    if (body) body.innerHTML = bodyHtml(chapter[3]);
    if (chapterLabel) chapterLabel.textContent = `${chapter[0]} · ${chapter[1]}`;
    if (pageLabel) pageLabel.textContent = labels[lang()] || labels.zh;
    document.querySelectorAll('.continuous-chapter').forEach((el, i) => el.classList.toggle('active-reading-chapter', i === index));
  }

  function updateProgress() {
    if (!progressBar) return;
    const max = Math.max(1, stage.scrollHeight - stage.clientHeight);
    progressBar.style.width = `${Math.max(2, Math.min(100, (stage.scrollTop / max) * 100))}%`;
  }

  function syncVisibleChapter() {
    const readingLine = stage.getBoundingClientRect().top + 70;
    let index = 0;
    for (const section of left.querySelectorAll('.continuous-chapter')) {
      if (section.getBoundingClientRect().top > readingLine) break;
      index = Number(section.dataset.continuousChapter);
    }
    if (index !== activeIndex) syncHiddenSource(index);
  }

  function renderContinuous(startIndex = 0) {
    const chapters = list();
    left.innerHTML = chapters.map(sectionHtml).join('');
    left.classList.add('continuous-book');
    if (right) { right.innerHTML = ''; right.hidden = true; }
    if (gutter) gutter.hidden = true;
    if (prev) prev.hidden = true;
    if (next) next.hidden = true;
    spread.classList.remove('two-page');
    spread.classList.add('continuous-spread');
    reader.classList.add('continuous-reader');
    syncHiddenSource(Math.max(0, Math.min(startIndex, chapters.length - 1)));
    stage.scrollTop = 0;
    requestAnimationFrame(() => {
      const target = left.querySelector(`[data-continuous-chapter="${startIndex}"]`);
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      updateProgress();
      window.dispatchEvent(new Event('mylife:reader-rendered'));
    });
  }

  function openContinuous(index = 0) {
    if (!window.bookReady) return;
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderContinuous(Number(index) || 0);
  }

  try { window.openReader = openContinuous; openReader = openContinuous; } catch (_) { window.openReader = openContinuous; }

  stage.addEventListener('click', event => {
    if (!reader.classList.contains('continuous-reader')) return;
    if (event.target.closest('button')) return;
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('keydown', event => {
    if (!reader.classList.contains('open') || !reader.classList.contains('continuous-reader')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopImmediatePropagation();
  }, true);

  stage.addEventListener('scroll', () => {
    syncVisibleChapter();
    clearTimeout(scrollTimer);
    updateProgress();
    scrollTimer = setTimeout(updateProgress, 40);
  }, { passive: true });



  const highlightObserver = new MutationObserver(() => {
    const active = left.querySelector('.active-reading-chapter .readalong-active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  highlightObserver.observe(left, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });

  const style = document.createElement('style');
  style.textContent = `
    .continuous-reader .book-stage{display:block!important;overflow-y:auto!important;overflow-x:hidden!important;padding:0!important;background:#211c17!important;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}
    .continuous-reader .book-spread{display:block!important;width:100%!important;max-width:none!important;height:auto!important;min-height:100%!important;filter:none!important;transform:none!important;margin:0!important}
    .continuous-reader .paper-page.continuous-book{display:block!important;width:min(820px,calc(100% - 40px))!important;height:auto!important;min-height:100%!important;margin:0 auto!important;padding:0 64px 120px!important;overflow:visible!important;border:0!important;border-radius:0!important;background:#fbf4e7!important;box-shadow:0 0 40px rgba(0,0,0,.16)!important;box-sizing:border-box!important}
    .continuous-reader .paper-right,.continuous-reader .book-gutter,.continuous-reader .page-turn{display:none!important}
    .continuous-reader .continuous-chapter{padding:92px 0 72px;scroll-margin-top:30px}
    .continuous-reader .continuous-chapter-head{padding-bottom:34px;border-bottom:1px solid rgba(139,98,57,.18);margin-bottom:36px}
    .continuous-reader .continuous-chapter-head h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(38px,5vw,58px);line-height:1.12;color:#211b16;margin:10px 0 20px}
    .continuous-reader .continuous-chapter-head .paper-intro{max-width:100%;font-size:20px;line-height:1.7}
    .continuous-reader .continuous-copy{height:auto!important;min-height:0!important;font-size:19px!important;line-height:1.9!important;overflow:visible!important}
    .continuous-reader .continuous-copy p{margin:0 0 1.18em!important;text-indent:2em}
    .continuous-reader .continuous-copy p:first-child{text-indent:0}
    .continuous-reader .continuous-copy p:first-child::first-letter{font-size:2.3em;line-height:.8;float:left;margin:.08em .12em 0 0;color:#8b6239}
    .continuous-reader .continuous-divider{display:flex;align-items:center;gap:18px;margin-top:64px;color:#a18e77;font:700 9px/1 Inter,system-ui,sans-serif;letter-spacing:.22em}
    .continuous-reader .continuous-divider:before,.continuous-reader .continuous-divider:after{content:'';height:1px;flex:1;background:rgba(139,98,57,.18)}
    .continuous-reader .active-reading-chapter{position:relative}
    .continuous-reader .book-bottombar{display:none!important}
    @media(max-width:720px){
      .continuous-reader .book-stage{padding:0!important}
      .continuous-reader .paper-page.continuous-book{width:100%!important;padding:0 28px 130px!important;box-shadow:none!important}
      .continuous-reader .continuous-chapter{padding:58px 0 54px;scroll-margin-top:18px}
      .continuous-reader .continuous-chapter-head{padding-bottom:24px;margin-bottom:26px}
      .continuous-reader .continuous-chapter-head h2{font-size:34px;line-height:1.18;margin:8px 0 16px}
      .continuous-reader .continuous-chapter-head .paper-intro{font-size:17px;line-height:1.65}
      .continuous-reader .continuous-copy{font-size:17px!important;line-height:1.78!important;text-align:left!important}
      .continuous-reader .continuous-copy p{margin-bottom:1.05em!important}
      .continuous-reader .continuous-divider{margin-top:48px}
    }
  `;
  document.head.appendChild(style);
})();
