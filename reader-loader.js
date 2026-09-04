(() => {
  window.bookReady = false;
  const status = document.getElementById('bookLoadStatus');
  const message = document.getElementById('bookLoadMessage');
  const retry = document.getElementById('bookLoadRetry');
  const select = document.getElementById('languageSelect');
  const grid = document.getElementById('chapterGrid');
  const cover = document.querySelector('.image-book-cover');
  const copy = {
    zh: ['正在准备书籍…', '书籍暂时无法加载，请重试。', '重试'],
    en: ['Preparing the book…', 'The book could not load. Please try again.', 'Retry'],
    ms: ['Sedang menyediakan buku…', 'Buku tidak dapat dimuatkan. Sila cuba lagi.', 'Cuba lagi']
  };
  // One ordered path owns all content and reader initialization.
  const scripts = [
    'prologue.js', 'chapter1.js', 'chapter234.js', 'chapter567.js',
    'chapter8.js', 'chapter9-end.js', 'translation01.js',
    'translation234.js', 'translation567.js', 'translation8.js',
    'translation910.js', 'translation11end.js',
    'continuous-reader.js', 'chapter-format.js'
  ];
  let index = 0;
  let loading = false;
  let failed = false;

  function update() {
    const labels = copy[select.value] || copy.zh;
    message.textContent = labels[failed ? 1 : 0];
    retry.textContent = labels[2];
    retry.hidden = !failed;
    status.hidden = window.bookReady;
    grid.setAttribute('aria-busy', String(!window.bookReady));
    grid.querySelectorAll('[data-chapter]').forEach(button => {
      button.disabled = !window.bookReady;
    });
    cover?.setAttribute('aria-disabled', String(!window.bookReady));
  }

  function loadNext() {
    if (loading || window.bookReady) return;
    failed = false;
    update();
    if (index === scripts.length) {
      window.bookReady = true;
      select.dispatchEvent(new Event('change'));
      update();
      return;
    }
    loading = true;
    const script = document.createElement('script');
    script.src = scripts[index];
    script.onload = () => {
      loading = false;
      index += 1;
      loadNext();
    };
    script.onerror = () => {
      script.remove();
      loading = false;
      failed = true;
      update();
    };
    document.body.appendChild(script);
  }

  new MutationObserver(update).observe(grid, { childList: true });
  select.addEventListener('change', update);
  retry.addEventListener('click', loadNext);
  loadNext();
})();
