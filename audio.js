(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const listenBtn = document.getElementById('listenChapterBtn');
  const languageSelect = document.getElementById('languageSelect');

  let voices = [];
  let queue = [];
  let queueIndex = 0;
  let activeUtterance = null;
  let stoppedManually = false;

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

  function refreshVoices() {
    voices = synth.getVoices() || [];
  }

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
    return [title, intro, body].filter(Boolean).join('\n\n').trim();
  }

  function splitIntoChunks(text, maxLen = 180) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];

    const sentences = clean.match(/[^。！？!?\.]+[。！？!?\.]?/g) || [clean];
    const chunks = [];
    let current = '';

    sentences.forEach(sentence => {
      const part = sentence.trim();
      if (!part) return;

      if ((current + part).length <= maxLen) {
        current += part;
        return;
      }

      if (current.trim()) chunks.push(current.trim());

      if (part.length <= maxLen) {
        current = part;
      } else {
        for (let i = 0; i < part.length; i += maxLen) {
          chunks.push(part.slice(i, i + maxLen));
        }
        current = '';
      }
    });

    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  function stop() {
    stoppedManually = true;
    synth.cancel();
    queue = [];
    queueIndex = 0;
    activeUtterance = null;
    setButton('listen');
  }

  function speakNext() {
    if (stoppedManually) return;

    if (queueIndex >= queue.length) {
      queue = [];
      queueIndex = 0;
      activeUtterance = null;
      setButton('listen');
      return;
    }

    const p = profile();
    const voice = findChosenVoice();
    const utter = new SpeechSynthesisUtterance(queue[queueIndex]);

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
      activeUtterance = utter;
      setButton('pause');
    };

    utter.onend = () => {
      if (stoppedManually) return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 25);
    };

    utter.onerror = event => {
      if (stoppedManually || event.error === 'interrupted' || event.error === 'canceled') return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 25);
    };

    synth.speak(utter);
  }

  function speakChapter() {
    const text = chapterText();
    if (!text) {
      setButton('listen');
      return;
    }

    stoppedManually = false;
    synth.cancel();
    refreshVoices();
    queue = splitIntoChunks(text, 180);
    queueIndex = 0;
    speakNext();
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

    speakChapter();
  }, true);

  document.addEventListener('click', event => {
    if (event.target.closest('[data-close-reader]')) stop();
  }, true);

  languageSelect?.addEventListener('change', () => {
    stop();
    window.setTimeout(refreshVoices, 50);
    window.setTimeout(() => setButton('listen'), 60);
  });

  synth.onvoiceschanged = refreshVoices;
  refreshVoices();
  setButton('listen');
})();
