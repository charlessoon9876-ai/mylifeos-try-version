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

  let allPages = [];
  let pageIndex = 0;
  let resizeTimer = null;

  const currentLang = () => languageSelect?.value || 'zh';
  const isMobile = () => window.matchMedia('(max-width:720px)').matches;

  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[ch]));

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
      } else current = candidate;
    });
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  function buildChapterPages(chapter, chapterIndex) {
    const lang = currentLang();
    const pageLimit = lang === 'zh' ? (isMobile() ? 250 : 420) : (isMobile() ? 620 : 980);
    const pages = [{
      kind: 'title', chapterIndex,
      kicker: chapter[0], title: chapter[1], intro: chapter[2]
    }];
    const paragraphs = String(chapter[3] || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    let buffer = [];
    let count = 0;
    const flush = () => {
      if (!buffer.length) return;
      pages.push({ kind:'body', chapterIndex, paragraphs:buffer });
      buffer = []; count = 0;
    };
    paragraphs.forEach(paragraph => {
      const pieces = paragraph.length > pageLimit ? sentenceChunks(paragraph, Math.round(pageLimit * .72)) : [paragraph];
      pieces.forEach(piece => {
        if (count + piece.length > pageLimit && buffer.length) flush();
        buffer.push(piece); count += piece.length;
      });
    });
    flush();
    return pages;
  }

  function rebuildWholeBook() {
    const list = chapterContent[currentLang()] || [];
    allPages = [];
    list.forEach((chapter, chapterIndex) => {
      allPages.push(...buildChapterPages(chapter, chapterIndex));
    });
  }

  function pageHtml(page, physicalPage) {
    if (!page) return '<div class="paper-blank"><span>MY LIFE ORIGIN</span></div>';
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

  function chapterForPage(index) {
    return allPages[Math.max(0, Math.min(index, allPages.length - 1))]?.chapterIndex ?? 0;
  }

  function firstPageOfChapter(chapterIndex) {
    const found = allPages.findIndex(p => p.chapterIndex === chapterIndex);
    return found < 0 ? 0 : found;
  }

  function syncChapter(chapterIndex) {
    const chapter = chapterContent[currentLang()]?.[chapterIndex];
    if (!chapter) return;
    try { currentChapter = chapterIndex; } catch (_) {}
    document.getElementById('readerKicker').textContent = chapter[0];
    document.getElementById('readerTitle').textContent = chapter[1];
    document.getElementById('readerIntro').textContent = chapter[2];
    document.getElementById('readerBody').innerHTML = String(chapter[3] || '')
      .split(/\n\s*\n/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  }

  function render(direction = '') {
    if (!allPages.length) return;
    const desktop = !isMobile();
    if (desktop && pageIndex % 2 !== 0) pageIndex -= 1;
    pageIndex = Math.max(0, Math.min(pageIndex, allPages.length - 1));

    left.innerHTML = pageHtml(allPages[pageIndex], pageIndex + 1);
    if (desktop) {
      right.innerHTML = pageHtml(allPages[pageIndex + 1], pageIndex + 2);
      right.hidden = false;
      spread.classList.add('two-page');
    } else {
      right.innerHTML = '';
      right.hidden = true;
      spread.classList.remove('two-page');
    }

    if (direction) {
      spread.classList.remove('turn-next','turn-prev');
      void spread.offsetWidth;
      spread.classList.add(direction === 'next' ? 'turn-next' : 'turn-prev');
      setTimeout(() => spread.classList.remove('turn-next','turn-prev'), 520);
    }

    const shownEnd = desktop ? Math.min(pageIndex + 2, allPages.length) : pageIndex + 1;
    pageLabel.textContent = `${shownEnd} / ${allPages.length}`;
    const visibleChapter = chapterForPage(pageIndex);
    const chapter = chapterContent[currentLang()][visibleChapter];
    chapterLabel.textContent = `${chapter[0]} · ${chapter[1]}`;
    progressBar.style.width = `${Math.max(2, shownEnd / allPages.length * 100)}%`;
    prevBottom.textContent = currentLang()==='zh' ? '← 上一页' : currentLang()==='ms' ? '← Halaman sebelumnya' : '← Previous page';
    nextBottom.textContent = currentLang()==='zh' ? '下一页 →' : currentLang()==='ms' ? 'Halaman seterusnya →' : 'Next page →';
    prevSide.disabled = pageIndex <= 0;
    nextSide.disabled = shownEnd >= allPages.length;
    prevBottom.disabled = pageIndex <= 0;
    nextBottom.disabled = shownEnd >= allPages.length;
    syncChapter(visibleChapter);
  }

  function openWholeBook(chapterIndex = 0) {
    rebuildWholeBook();
    pageIndex = firstPageOfChapter(chapterIndex);
    if (!isMobile() && pageIndex % 2 !== 0) pageIndex -= 1;
    reader.classList.add('open');
    reader.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    render();
  }

  function nextPage() {
    const step = isMobile() ? 1 : 2;
    if (pageIndex + step >= allPages.length) return;
    pageIndex += step;
    render('next');
  }

  function previousPage() {
    const step = isMobile() ? 1 : 2;
    if (pageIndex - step < 0) return;
    pageIndex -= step;
    render('prev');
  }

  try { openReader = openWholeBook; } catch (_) {}

  document.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('#bookNextPage, #nextChapter')) {
      event.preventDefault(); event.stopImmediatePropagation(); nextPage();
      return;
    }
    if (target.closest('#bookPrevPage, #prevChapter')) {
      event.preventDefault(); event.stopImmediatePropagation(); previousPage();
      return;
    }
    if (reader.classList.contains('open') && target.closest('#bookStage') && !target.closest('button')) {
      event.preventDefault(); event.stopImmediatePropagation();
      const rect = stage.getBoundingClientRect();
      if (event.clientX > rect.left + rect.width * .62) nextPage();
      else if (event.clientX < rect.left + rect.width * .38) previousPage();
    }
  }, true);

  window.addEventListener('keydown', event => {
    if (!reader.classList.contains('open')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); event.stopImmediatePropagation(); nextPage(); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); event.stopImmediatePropagation(); previousPage(); }
  }, true);

  languageSelect?.addEventListener('change', () => {
    if (!reader.classList.contains('open')) return;
    const chapterIndex = chapterForPage(pageIndex);
    setTimeout(() => openWholeBook(chapterIndex), 90);
  });

  window.addEventListener('resize', () => {
    if (!reader.classList.contains('open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const chapterIndex = chapterForPage(pageIndex);
      rebuildWholeBook();
      pageIndex = firstPageOfChapter(chapterIndex);
      render();
    }, 200);
  });
})();
