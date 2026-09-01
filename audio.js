(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const listenBtn = document.getElementById('listenChapterBtn');
  const languageSelect = document.getElementById('languageSelect');
  const nextPageBtn = document.getElementById('bookNextPage');
  const reader = document.getElementById('reader');

  let voices = [];
  let queue = [];
  let queueIndex = 0;
  let activeUtterance = null;
  let stoppedManually = false;

  const chosenVoices = {
    zh: { names: ['Google 國語（臺灣）', 'Google 國語 (臺灣)', 'Google 國語', 'Google 中文'], lang: 'zh-TW', rate: 0.95 },
    en: { names: ['Google US English'], lang: 'en-US', rate: 0.95 },
    ms: { names: ['Google Bahasa Indonesia'], lang: 'id-ID', rate: 0.95 }
  };

  const lower = value => (value || '').toLowerCase();
  const profile = () => chosenVoices[languageSelect?.value] || chosenVoices.zh;
  const normalize = value => String(value || '').replace(/\s+/g, '').replace(/[“”‘’"']/g, '').trim();
  const emit = name => window.dispatchEvent(new CustomEvent(name));

  const style = document.createElement('style');
  style.textContent = `
    .readalong-active{
      background:linear-gradient(180deg,transparent 10%,rgba(214,164,82,.34) 10%,rgba(214,164,82,.34) 92%,transparent 92%);
      border-radius:.18em;
      box-shadow:0 0 0 2px rgba(181,126,50,.08);
      transition:background .18s ease,box-shadow .18s ease;
    }
  `;
  document.head.appendChild(style);

  function refreshVoices() { voices = synth.getVoices() || []; }

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

  function sentenceUnits(text) {
    const source = String(text || '').trim();
    if (!source) return [];
    const matches = source.match(/[^。！？!?\.]+[。！？!?\.]?/g) || [source];
    return matches.map(s => s.trim()).filter(Boolean);
  }

  function buildSentenceQueue() {
    if (!reader?.classList.contains('open')) return [];
    const items = [];
    const title = document.getElementById('readerTitle')?.innerText?.trim();
    const intro = document.getElementById('readerIntro')?.innerText?.trim();
    if (title) items.push(title);
    if (intro) items.push(...sentenceUnits(intro));

    document.querySelectorAll('#readerBody p').forEach(p => {
      const text = p.innerText.trim();
      if (!text) return;
      const units = sentenceUnits(text);
      if (units.length) items.push(...units);
      else items.push(text);
    });
    return items;
  }

  function unwrapHighlights() {
    document.querySelectorAll('.readalong-active').forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent || ''));
    });
  }

  function wrapSentenceInElement(el, sentence) {
    const raw = el.textContent || '';
    const wanted = normalize(sentence);
    if (!wanted || !normalize(raw).includes(wanted)) return false;

    const compactRaw = normalize(raw);
    const compactWanted = wanted;
    const compactIndex = compactRaw.indexOf(compactWanted);
    if (compactIndex < 0) return false;

    let start = -1;
    let end = -1;
    let compactPos = 0;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (/\s/.test(ch) || /[“”‘’"']/.test(ch)) continue;
      if (compactPos === compactIndex && start < 0) start = i;
      compactPos += 1;
      if (compactPos === compactIndex + compactWanted.length) { end = i + 1; break; }
    }
    if (start < 0 || end < 0) return false;

    el.textContent = '';
    el.appendChild(document.createTextNode(raw.slice(0, start)));
    const span = document.createElement('span');
    span.className = 'readalong-active';
    span.textContent = raw.slice(start, end);
    el.appendChild(span);
    el.appendChild(document.createTextNode(raw.slice(end)));
    return true;
  }

  function tryHighlightVisible(sentence) {
    unwrapHighlights();
    const candidates = document.querySelectorAll('#paperLeft h2,#paperLeft .paper-intro,#paperLeft .paper-copy p,#paperRight h2,#paperRight .paper-intro,#paperRight .paper-copy p');
    for (const el of candidates) {
      if (wrapSentenceInElement(el, sentence)) return true;
    }
    return false;
  }

  function focusSentence(sentence) {
    if (!reader?.classList.contains('open')) return;
    const chapterBefore = document.getElementById('bookChapterLabel')?.textContent || '';
    if (tryHighlightVisible(sentence)) return;

    for (let i = 0; i < 8; i++) {
      if (!nextPageBtn || nextPageBtn.disabled) break;
      nextPageBtn.click();
      const chapterAfter = document.getElementById('bookChapterLabel')?.textContent || '';
      if (chapterBefore && chapterAfter && chapterAfter !== chapterBefore) break;
      if (tryHighlightVisible(sentence)) return;
    }
  }

  function stop() {
    stoppedManually = true;
    synth.cancel();
    queue = [];
    queueIndex = 0;
    activeUtterance = null;
    unwrapHighlights();
    setButton('listen');
    emit('mylife:narration-end');
  }

  function speakNext() {
    if (stoppedManually) return;
    if (queueIndex >= queue.length) {
      queue = [];
      queueIndex = 0;
      activeUtterance = null;
      unwrapHighlights();
      setButton('listen');
      emit('mylife:narration-end');
      return;
    }

    const text = queue[queueIndex];
    focusSentence(text);

    const p = profile();
    const voice = findChosenVoice();
    const utter = new SpeechSynthesisUtterance(text);
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    else utter.lang = p.lang;
    utter.rate = p.rate;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      activeUtterance = utter;
      focusSentence(text);
      setButton('pause');
      emit('mylife:narration-start');
    };

    utter.onend = () => {
      if (stoppedManually) return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 18);
    };

    utter.onerror = event => {
      if (stoppedManually || event.error === 'interrupted' || event.error === 'canceled') return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 18);
    };

    synth.speak(utter);
  }

  function speakChapter() {
    const items = buildSentenceQueue();
    if (!items.length) { setButton('listen'); return; }
    stoppedManually = false;
    synth.cancel();
    refreshVoices();
    queue = items;
    queueIndex = 0;
    emit('mylife:narration-start');
    speakNext();
  }

  listenBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setButton('resume');
      emit('mylife:narration-pause');
      return;
    }
    if (synth.paused) {
      synth.resume();
      setButton('pause');
      emit('mylife:narration-start');
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
