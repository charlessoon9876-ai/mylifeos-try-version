(() => {
  const reader = document.getElementById('reader');
  const stage = document.getElementById('bookStage');
  const spread = document.getElementById('bookSpread');
  const left = document.getElementById('paperLeft');
  const right = document.getElementById('paperRight');
  const prevSide = document.getElementById('bookPrevPage');
  const nextSide = document.getElementById('bookNextPage');
  const prevBottom = document.getElementById('prevChapter');
  const nextBottom = document.getElementById('nextChapter');
  const pageLabel = document.getElementById('bookPageLabel');
  const chapterLabel = document.getElementById('bookChapterLabel');
  const progressBar = document.getElementById('bookProgressBar');
  const languageSelect = document.getElementById('languageSelect');

  if (!reader || !spread || typeof chapterContent === 'undefined') return;

  let activeChapter = 0;
  let pageIndex = 0;
  let pages = [];
  let resizeTimer = null;

  const copy = {
    zh: { prev: '上一页', next: '下一页', previousChapter: '上一章', nextChapter: '下一章', end: '尾声' },
    en: { prev: 'Previous page', next: 'Next page', previousChapter: 'Previous chapter', nextChapter: 'Next chapter', end: 'Epilogue' },
    ms: { prev: 'Halaman sebelumnya', next: 'Halaman seterusnya', previousChapter: 'Bab sebelumnya', nextChapter: 'Bab seterusnya', end: 'Epilog' }
  };

  function currentLang() {
    return languageSelect?.value || 'zh';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  }

  function sentenceChunks(text, limit) {
    const clean = String(text || '').trim();
    if (!clean) return [];
    const parts = clean.match(/[^。！？.!?]+[。！？.!?]?/g) || [clean];
    const chunks = [];
    let current = '';
    parts.forEach(part => {
      const candidate = current + part;
      if (candidate.length > limit && current) {
        chunks.push(current.trim());
        current = part;
      } else {
        current = candidate;
      }
    });
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  function buildPages(chapter) {
    const lang = currentLang();
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const pageLimit = lang === 'zh' ? (mobile ? 250 : 420) : (mobile ? 620 : 980);
    const pagesOut = [{
      kind: 'title',
      kicker: chapter[0],
      title: chapter[1],
      intro: chapter[2]
    }];

    const paragraphs = String(chapter[3] || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    let buffer = [];
    let count = 0;

    const flush = () => {
      if (!buffer.length) return;
      pagesOut.push({ kind: 'body', paragraphs: buffer });
      buffer = [];
      count = 0;
    };

    paragraphs.forEach(paragraph => {
      const pieces = paragraph.length > pageLimit ? sentenceChunks(paragraph, Math.round(pageLimit * 0.72)) : [paragraph];
      pieces.forEach(piece => {
        const projected = count + piece.length;
        if (projected > pageLimit && buffer.length) flush();
        buffer.push(piece);
        count += piece.length;
      });
    });
    flush();
    return pagesOut;
  }

  function pageHtml(page, physicalPage) {
    if (!page) {
      return `<div class="paper-blank"><span>MY LIFE ORIGIN</span></div>`;
    }
    if (page.kind === 'title') {
      return `<div class="chapter-opening">
        <div class="chapter-opening-rule"></div>
        <p class="paper-kicker">${escapeHtml(page.kicker)}</p>
        <h2>${escapeHtml(page.title)}</h2>
        <p class="paper-intro">${escapeHtml(page.intro)}</p>
        <div class="chapter-opening-mark">MY LIFE OS · ORIGIN</div>
        <span class="paper-number">${physicalPage}</span>
      </div>`;
    }
    return `<div class="paper-copy">
      ${page.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
      <span class="paper-number">${physicalPage}</span>
    </div>`;
  }

  function render(direction = '') {
    if (reader.classList.contains('continuous-reader')) return;
    const desktop = !window.matchMedia('(max-width: 720px)').matches;
    const total = pages.length;
    if (!total) return;

    if (desktop) {
      if (pageIndex % 2 !== 0) pageIndex -= 1;
      left.innerHTML = pageHtml(pages[pageIndex], pageIndex + 1);
      right.innerHTML = pageHtml(pages[pageIndex + 1], pageIndex + 2);
      right.hidden = false;
      spread.classList.add('two-page');
    } else {
      left.innerHTML = pageHtml(pages[pageIndex], pageIndex + 1);
      right.innerHTML = '';
      right.hidden = true;
      spread.classList.remove('two-page');
    }

    if (direction) {
      spread.classList.remove('turn-next', 'turn-prev');
      void spread.offsetWidth;
      spread.classList.add(direction === 'next' ? 'turn-next' : 'turn-prev');
      setTimeout(() => spread.classList.remove('turn-next', 'turn-prev'), 520);
    }

    const shownEnd = desktop ? Math.min(pageIndex + 2, total) : Math.min(pageIndex + 1, total);
    pageLabel.textContent = `${shownEnd} / ${total}`;
    const chapter = chapterContent[currentLang()][activeChapter];
    chapterLabel.textContent = `${chapter[0]} · ${chapter[1]}`;
    progressBar.style.width = `${Math.max(4, (shownEnd / total) * 100)}%`;

    const labels = copy[currentLang()] || copy.zh;
    const atStart = pageIndex <= 0;
    const atEnd = desktop ? pageIndex + 2 >= total : pageIndex + 1 >= total;

    prevBottom.textContent = atStart && activeChapter > 0 ? `← ${labels.previousChapter}` : `← ${labels.prev}`;
    nextBottom.textContent = atEnd && activeChapter < chapterContent[currentLang()].length - 1 ? `${labels.nextChapter} →` : `${labels.next} →`;
    prevSide.disabled = atStart && activeChapter === 0;
    nextSide.disabled = atEnd && activeChapter === chapterContent[currentLang()].length - 1;
  }

  function syncHiddenSource(chapter) {
    document.getElementById('readerKicker').textContent = chapter[0];
    document.getElementById('readerTitle').textContent = chapter[1];
    document.getElementById('readerIntro').textContent = chapter[2];
    document.getElementById('readerBody').innerHTML = String(chapter[3] || '').split(/\n\s*\n/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  }

  function openBook(i, startAtEnd = false) {
    if (!window.bookReady || reader.classList.contains('continuous-reader')) return;
    const list = chapterContent[currentLang()];
    if (!list || i < 0 || i >= list.length) return;
    activeChapter = i;
    try { currentChapter = i; } catch (_) {}
    const chapter = list[i];
    syncHiddenSource(chapter);
    pages = buildPages(chapter);
    pageIndex = startAtEnd ? Math.max(0, pages.length - (window.matchMedia('(max-width:720px)').matches ? 1 : 2)) : 0;
    if (!window.matchMedia('(max-width:720px)').matches && pageIndex % 2 !== 0) pageIndex -= 1;
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    render();
  }

  function nextPage() {
    const desktop = !window.matchMedia('(max-width:720px)').matches;
    const step = desktop ? 2 : 1;
    if (pageIndex + step < pages.length) {
      pageIndex += step;
      render('next');
      return;
    }
    if (activeChapter < chapterContent[currentLang()].length - 1) openBook(activeChapter + 1, false);
  }

  function previousPage() {
    const desktop = !window.matchMedia('(max-width:720px)').matches;
    const step = desktop ? 2 : 1;
    if (pageIndex - step >= 0) {
      pageIndex -= step;
      render('prev');
      return;
    }
    if (activeChapter > 0) openBook(activeChapter - 1, true);
  }

  try { openReader = openBook; } catch (_) {}

  [nextSide, nextBottom].forEach(btn => btn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    nextPage();
  }, true));

  [prevSide, prevBottom].forEach(btn => btn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    previousPage();
  }, true));

  stage?.addEventListener('click', event => {
    if (event.target.closest('button')) return;
    const rect = stage.getBoundingClientRect();
    if (event.clientX > rect.left + rect.width * 0.62) nextPage();
    else if (event.clientX < rect.left + rect.width * 0.38) previousPage();
  });

  document.addEventListener('keydown', event => {
    if (!reader.classList.contains('open')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); nextPage(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); previousPage(); }
  });

  languageSelect?.addEventListener('change', () => {
    if (reader.classList.contains('open')) setTimeout(() => openBook(activeChapter, false), 80);
  });

  window.addEventListener('resize', () => {
    if (!reader.classList.contains('open') || reader.classList.contains('continuous-reader')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const chapter = chapterContent[currentLang()][activeChapter];
      pages = buildPages(chapter);
      pageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
      render();
    }, 180);
  });

  const style = document.createElement('style');
  style.textContent = `
    .book-reader .reader-backdrop{background:rgba(18,15,11,.72)}
    .book-reader .book-shell{left:0;right:0;top:0;margin:auto;width:100%;height:100%;max-width:none;background:#2b241d;overflow:hidden;box-shadow:none;display:flex;flex-direction:column}
    .book-toolbar{position:relative;flex:0 0 auto;background:#211c17;color:#f3eadc;border-bottom:1px solid rgba(255,255,255,.09);padding:12px 18px;align-items:center}
    .book-toolbar .ghost{background:transparent;color:#f3eadc;border-color:rgba(255,255,255,.2)}
    .book-toolbar-center{display:flex;flex-direction:column;align-items:center;min-width:0;font-family:Georgia,serif;line-height:1.2}
    .book-toolbar-center span:first-child{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40vw}
    .book-toolbar-center span:last-child{font-size:11px;color:#b9aa97;margin-top:3px}
    .book-stage{position:relative;flex:1;display:flex;align-items:center;justify-content:center;min-height:0;padding:24px 72px 16px;perspective:1800px;background:radial-gradient(circle at 50% 30%,#47392d 0,#2b241d 58%,#1f1a16 100%)}
    .book-spread{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);width:min(1120px,100%);height:min(690px,calc(100% - 8px));min-height:520px;filter:drop-shadow(0 24px 38px rgba(0,0,0,.38));transform-style:preserve-3d}
    .paper-page{position:relative;overflow:hidden;background:#fbf4e7;color:#2b251f;padding:58px 62px 48px;font-family:Georgia,"Times New Roman",serif;border:1px solid #d8cbb7;background-image:linear-gradient(rgba(120,91,56,.025),rgba(120,91,56,.025)),radial-gradient(circle at 20% 10%,rgba(255,255,255,.85),transparent 36%)}
    .paper-left{border-radius:8px 0 0 8px;box-shadow:inset -18px 0 30px rgba(80,60,38,.08)}
    .paper-right{border-radius:0 8px 8px 0;box-shadow:inset 18px 0 30px rgba(80,60,38,.08)}
    .book-gutter{position:absolute;z-index:3;left:50%;top:0;bottom:0;width:26px;transform:translateX(-50%);pointer-events:none;background:linear-gradient(90deg,transparent,rgba(60,44,28,.14) 43%,rgba(255,255,255,.3) 50%,rgba(60,44,28,.12) 57%,transparent)}
    .chapter-opening{height:100%;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:4% 2% 10%}
    .chapter-opening-rule{width:52px;height:1px;background:#9f7548;margin-bottom:28px}
    .paper-kicker{font-family:Inter,system-ui,sans-serif;font-size:11px;font-weight:800;letter-spacing:.18em;color:#9a6a38;margin:0 0 20px}
    .chapter-opening h2{font-family:Georgia,serif;font-size:clamp(36px,4vw,58px);line-height:1.1;margin:0 0 24px;color:#211b16}
    .paper-intro{font-size:20px;line-height:1.7;color:#6b5f52;margin:0;max-width:90%}
    .chapter-opening-mark{margin-top:auto;font-family:Inter,system-ui,sans-serif;font-size:10px;letter-spacing:.18em;color:#9c8e7d}
    .paper-copy{height:100%;font-size:18px;line-height:1.82;text-align:justify;letter-spacing:.01em}
    .paper-copy p{margin:0 0 1.05em;text-indent:2em}
    .paper-copy p:first-child{text-indent:0}
    .paper-copy p:first-child::first-letter{font-size:2.3em;line-height:.8;float:left;margin:.08em .12em 0 0;color:#8b6239}
    .paper-number{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);font-family:Inter,system-ui,sans-serif;font-size:11px;color:#9d8f7e}
    .paper-blank{height:100%;display:grid;place-items:center;color:#c1b39f;font-family:Georgia,serif;letter-spacing:.14em;font-size:12px}
    .page-turn{position:absolute;z-index:8;top:50%;transform:translateY(-50%);width:48px;height:70px;border:1px solid rgba(255,255,255,.12);background:rgba(18,15,12,.42);color:#f4eadb;border-radius:999px;font-size:38px;line-height:1;backdrop-filter:blur(8px)}
    .page-turn-left{left:16px}.page-turn-right{right:16px}.page-turn:disabled{opacity:.18;cursor:default}
    .book-bottombar{flex:0 0 auto;display:grid;grid-template-columns:auto minmax(120px,360px) auto;gap:18px;align-items:center;justify-content:center;padding:12px 18px 16px;background:#211c17;border-top:1px solid rgba(255,255,255,.07)}
    .book-bottombar .primary,.book-bottombar .secondary{min-width:120px;padding:9px 14px;border-color:#d4c4ae}.book-bottombar .secondary{color:#efe4d4}.book-bottombar .primary{background:#efe4d4;color:#241e18}
    .book-progress-track{height:3px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden}.book-progress-track span{display:block;height:100%;width:0;background:#c89d6d;transition:width .25s}
    .book-source{position:absolute!important;left:-10000px!important;top:0!important;width:720px!important;opacity:.001!important;pointer-events:none!important}
    .turn-next .paper-right{animation:bookNext .5s ease}.turn-prev .paper-left{animation:bookPrev .5s ease}
    @keyframes bookNext{0%{transform:rotateY(0);filter:brightness(1)}45%{transform:rotateY(-5deg) translateX(-5px);filter:brightness(.82)}100%{transform:rotateY(0);filter:brightness(1)}}
    @keyframes bookPrev{0%{transform:rotateY(0);filter:brightness(1)}45%{transform:rotateY(5deg) translateX(5px);filter:brightness(.82)}100%{transform:rotateY(0);filter:brightness(1)}}
    @media(max-width:900px){.paper-page{padding:48px 42px 44px}.book-stage{padding-left:54px;padding-right:54px}.paper-copy{font-size:17px}}
    @media(max-width:720px){
      .book-toolbar{padding:9px 10px}.book-toolbar-center{display:none}.book-toolbar .reader-actions .ghost:last-child{display:none}
      .book-stage{padding:12px 14px 8px;align-items:stretch}
      .book-spread{display:block;width:100%;height:100%;min-height:0;filter:drop-shadow(0 12px 24px rgba(0,0,0,.28))}
      .paper-page{width:100%;height:100%;min-height:520px;border-radius:7px!important;padding:42px 34px 42px;box-shadow:none!important}
      .paper-right,.book-gutter{display:none!important}.paper-copy{font-size:17px;line-height:1.78}.paper-intro{font-size:18px}.chapter-opening h2{font-size:38px}
      .page-turn{display:none}.book-bottombar{grid-template-columns:auto minmax(70px,1fr) auto;gap:10px;padding:9px 10px 12px}.book-bottombar .primary,.book-bottombar .secondary{min-width:0;padding:8px 10px;font-size:12px}.book-progress-track{min-width:70px}
    }
    @media(prefers-reduced-motion:reduce){.turn-next .paper-right,.turn-prev .paper-left{animation:none}}
  `;
  document.head.appendChild(style);
})();