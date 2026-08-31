(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const listenBtn = document.getElementById('listenChapterBtn');
  const languageSelect = document.getElementById('languageSelect');

  let voices = [];
  let currentText = '';
  let currentUtterance = null;

  const chosenVoices = {
    zh: {
      names: ['Google 國語（臺灣）', 'Google 國語 (臺灣)', 'Google 國語', 'Google 中文'],
      lang: 'zh-TW',
      rate: 1.08
    },
    en: {
      names: ['Google US English'],
      lang: 'en-US',
      rate: 1.10
    },
    ms: {
      names: ['Google Bahasa Indonesia'],
      lang: 'id-ID',
      rate: 1.08
    }
  };

  const lower = value => (value || '').toLowerCase();
  const profile = () => chosenVoices[languageSelect?.value] || chosenVoices.zh;

  function findChosenVoice() {
    const p = profile();
    for (const wanted of p.names) {
      const exact = voices.find(v => lower(v.name) === lower(wanted));
      if (exact) return exact;
    }
    for (const wanted of p.names) {
      const partial = voices.find(v => lower(v.name).includes(lower(wanted)));
      if (partial) return partial;
    }
    const sameLang = voices.find(v => lower(v.lang) === lower(p.lang));
    if (sameLang) return sameLang;
    const prefix = p.lang.split('-')[0].toLowerCase();
    return voices.find(v => lower(v.lang).startsWith(prefix)) || voices[0] || null;
  }

  function refreshVoices() {
    voices = synth.getVoices();
  }

  function labels() {
    const lang = languageSelect?.value || 'zh';
    if (lang === 'en') return { listen: 'Listen', pause: 'Pause', resume: 'Resume' };
    if (lang === 'ms') return { listen: 'Dengar bab', pause: 'Jeda', resume: 'Sambung' };
    return { listen: '听本章', pause: '暂停', resume: '继续' };
  }

  function setButton(mode = 'listen') {
    if (!listenBtn) return;
    const copy = labels();
    const text = mode === 'pause' ? copy.pause : mode === 'resume' ? copy.resume : copy.listen;
    listenBtn.innerHTML = `${mode === 'pause' ? 'Ⅱ' : '▶'} <span>${text}</span>`;
    listenBtn.setAttribute('aria-pressed', mode === 'pause' ? 'true' : 'false');
  }

  function chapterText() {
    const reader = document.getElementById('reader');
    if (!reader?.classList.contains('open')) return '';
    const title = document.getElementById('readerTitle')?.innerText || '';
    const intro = document.getElementById('readerIntro')?.innerText || '';
    const body = document.getElementById('readerBody')?.innerText || '';
    return [title, intro, body].filter(Boolean).join('. ');
  }

  function stop() {
    synth.cancel();
    currentUtterance = null;
    currentText = '';
    setButton('listen');
  }

  function speak(text) {
    synth.cancel();
    currentText = (text || '').replace(/\s+/g, ' ').trim();
    if (!currentText) return;

    const p = profile();
    const voice = findChosenVoice();
    const utter = new SpeechSynthesisUtterance(currentText);

    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = p.lang;
    }

    utter.rate = p.rate;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      currentUtterance = utter;
      setButton('pause');
    };

    utter.onend = () => {
      currentUtterance = null;
      currentText = '';
      setButton('listen');
    };

    utter.onerror = () => {
      currentUtterance = null;
      currentText = '';
      setButton('listen');
    };

    synth.speak(utter);
  }

  listenBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (synth.speaking && !synth.paused) {
      synth.pause();
      setButton('resume');
      return;
    }

    if (synth.paused) {
      synth.resume();
      setButton('pause');
      return;
    }

    speak(chapterText());
  }, true);

  document.addEventListener('click', event => {
    if (event.target.closest('[data-close-reader], #prevChapter, #nextChapter')) stop();
  }, true);

  languageSelect?.addEventListener('change', () => {
    stop();
    setTimeout(refreshVoices, 50);
    setTimeout(() => setButton('listen'), 60);
  });

  synth.onvoiceschanged = refreshVoices;
  refreshVoices();
  setButton('listen');
})();