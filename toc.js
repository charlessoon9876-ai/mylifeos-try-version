(() => {
  const grid = document.getElementById('chapterGrid');
  const section = document.getElementById('chapters');
  const languageSelect = document.getElementById('languageSelect');
  if (!grid || !section || typeof chapterContent === 'undefined') return;

  const labels = {
    zh: { title: '《Book 1 — My Life Origin》', structure: '12章主结构', hint: '点击章节进入连续向下阅读', sourceNote: '中文为原始版本；English 与 Bahasa Melayu 为依照中文原文的对应翻译。' },
    en: { title: '《Book 1 — My Life Origin》', structure: '12-Chapter Structure', hint: 'Select a chapter to begin continuous scroll reading', sourceNote: 'Chinese is the original source text; English and Bahasa Melayu are corresponding translations based on the Chinese master.' },
    ms: { title: '《Book 1 — My Life Origin》', structure: 'Struktur 12 Bab', hint: 'Pilih bab untuk membaca secara berterusan dengan skrol', sourceNote: 'Teks bahasa Cina ialah versi asal; English dan Bahasa Melayu ialah terjemahan yang mengikuti teks induk bahasa Cina.' }
  };

  function currentLang() {
    return languageSelect?.value || 'zh';
  }

  function renderTraditionalContents() {
    const activeLang = currentLang();
    const list = chapterContent[activeLang] || chapterContent.zh;
    const copy = labels[activeLang] || labels.zh;

    section.classList.add('traditional-contents');
    const head = section.querySelector('.section-head');
    if (head) {
      head.innerHTML = `
        <div class="traditional-book-heading">
          <h2 class="traditional-book-title">${copy.title}</h2>
          <h3 class="traditional-structure-title">${copy.structure}</h3>
          <p class="traditional-contents-hint">${copy.hint}</p>
          <p class="traditional-source-note">${copy.sourceNote}</p>
        </div>
        <div class="reading-progress"><span id="readCount">0</span>/${list.length} <span>${translations[activeLang]?.readLabel || ''}</span></div>`;
    }

    grid.className = 'chapter-grid traditional-chapter-list';
    grid.innerHTML = list.map((chapter, index) => {
      const isRead = typeof readSet !== 'undefined' && readSet.has(index);
      return `
        <button class="traditional-chapter-entry ${isRead ? 'read' : ''}" type="button" data-chapter="${index}">
          <span class="traditional-chapter-heading">${chapter[0]}｜${chapter[1]}</span>
          <span class="traditional-chapter-summary">${chapter[2]}</span>
          ${isRead ? '<span class="traditional-read-mark">✓</span>' : ''}
        </button>`;
    }).join('');

    const count = section.querySelector('#readCount');
    if (count && typeof readSet !== 'undefined') {
      count.textContent = [...readSet].filter(i => i < list.length).length;
    }

    section.querySelectorAll('.traditional-chapter-entry').forEach(btn => {
      btn.addEventListener('click', () => openReader(Number(btn.dataset.chapter)));
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    #chapters.traditional-contents{width:min(1040px,calc(100% - 40px));padding-top:72px;padding-bottom:86px}
    #chapters.traditional-contents .section-head{align-items:flex-start;border-bottom:0;margin-bottom:22px}
    .traditional-book-heading{max-width:820px}
    .traditional-book-title{font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(34px,4.5vw,54px)!important;line-height:1.12!important;letter-spacing:-.025em!important;margin:0 0 22px!important;color:#15191f}
    .traditional-structure-title{font-family:Georgia,'Times New Roman',serif;font-size:clamp(24px,3vw,34px);line-height:1.2;margin:0 0 10px;color:#15191f}
    .traditional-contents-hint{margin:0;color:#8a847c;font-size:13px}
    .traditional-source-note{margin:8px 0 0;max-width:720px;color:#9b8b78;font-size:11px;line-height:1.55}
    .traditional-chapter-list{display:block!important;max-width:930px}
    .traditional-chapter-entry{position:relative;display:block;width:100%;min-height:0!important;padding:15px 0 16px!important;margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;text-align:left;color:#17191d;box-shadow:none!important;transform:none!important;border-bottom:1px solid rgba(28,24,20,.08)!important}
    .traditional-chapter-entry:hover{transform:none!important;box-shadow:none!important;background:rgba(167,111,55,.035)!important}
    .traditional-chapter-entry:focus-visible{outline:2px solid rgba(167,111,55,.45);outline-offset:5px}
    .traditional-chapter-heading{display:block;font-family:Georgia,'Times New Roman',serif;font-size:clamp(20px,2vw,25px);font-weight:700;line-height:1.35;margin-bottom:4px;color:#14171b}
    .traditional-chapter-summary{display:block;font-family:Georgia,'Times New Roman',serif;font-size:clamp(16px,1.65vw,20px);line-height:1.65;color:#3f4348;padding-right:40px}
    .traditional-read-mark{position:absolute;right:4px;top:20px;color:#6a7d61;font-weight:800}
    #chapters.traditional-contents .reading-progress{font-family:Georgia,'Times New Roman',serif;font-size:13px;margin-top:8px}
    @media(max-width:640px){
      #chapters.traditional-contents{width:min(100% - 30px,1040px);padding-top:54px;padding-bottom:64px}
      #chapters.traditional-contents .section-head{gap:12px;margin-bottom:14px}
      .traditional-book-title{font-size:34px!important;margin-bottom:18px!important}
      .traditional-structure-title{font-size:25px}
      .traditional-chapter-entry{padding:14px 0 15px!important}
      .traditional-chapter-heading{font-size:20px}
      .traditional-chapter-summary{font-size:16px;line-height:1.65}
      #chapters.traditional-contents .reading-progress{margin-top:0}
    }
  `;
  document.head.appendChild(style);

  setTimeout(renderTraditionalContents, 0);
  languageSelect?.addEventListener('change', () => setTimeout(renderTraditionalContents, 0));

  renderChapters = renderTraditionalContents;
})();
