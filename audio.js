(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const listenBtn = document.getElementById('listenChapterBtn');
  const languageSelect = document.getElementById('languageSelect');
  const reader = document.getElementById('reader');
  const stage = document.getElementById('bookStage');

  let voices = [];
  let queue = [];
  let queueIndex = 0;
  let activeUtterance = null;
  let stoppedManually = false;

  const chosenVoices = {
    zh: { names: ['Google 國語（臺灣）', 'Google 國語 (臺灣)', 'Google 國語', 'Google 中文'], lang: 'zh-TW', rate: 1.0 },
    en: { names: ['Google US English'], lang: 'en-US', rate: 1.0 },
    ms: { names: ['Google Bahasa Indonesia'], lang: 'id-ID', rate: 1.0 }
  };

  const lower = value => (value || '').toLowerCase();
  const profile = () => chosenVoices[languageSelect?.value] || chosenVoices.zh;
  const normalize = value => String(value || '').replace(/\s+/g, '').replace(/[“”‘’"']/g, '').trim();
  const emit = name => window.dispatchEvent(new CustomEvent(name));

  const labels = () => {
    const lang = languageSelect?.value || 'zh';
    if (lang === 'en') return { listen: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop' };
    if (lang === 'ms') return { listen: 'Dengar', pause: 'Jeda', resume: 'Sambung', stop: 'Henti' };
    return { listen: '听书', pause: '暂停', resume: '继续', stop: '停止' };
  };

  const style = document.createElement('style');
  style.textContent = `
    .readalong-active{
      background:linear-gradient(180deg,transparent 10%,rgba(214,164,82,.34) 10%,rgba(214,164,82,.34) 92%,transparent 92%);
      border-radius:.18em;
      box-shadow:0 0 0 2px rgba(181,126,50,.08);
      transition:background .18s ease,box-shadow .18s ease;
    }
    #stopNarrationBtn{display:none}
    #stopNarrationBtn.show{display:inline-flex}
  `;
  document.head.appendChild(style);

  const stopBtn = document.createElement('button');
  stopBtn.id = 'stopNarrationBtn';
  stopBtn.type = 'button';
  stopBtn.className = 'ghost';
  listenBtn?.insertAdjacentElement('afterend', stopBtn);

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

  function setButton(mode = 'listen') {
    if (!listenBtn) return;
    const copy = labels();
    const text = mode === 'pause' ? copy.pause : mode === 'resume' ? copy.resume : copy.listen;
    listenBtn.innerHTML = `${mode === 'pause' ? 'Ⅱ' : '▶'} <span>${text}</span>`;
    listenBtn.setAttribute('aria-pressed', mode === 'pause' ? 'true' : 'false');
    stopBtn.innerHTML = `■ <span>${copy.stop}</span>`;
    stopBtn.classList.toggle('show', mode !== 'listen');
  }

  function sentenceUnits(text) {
    const source = String(text || '').trim();
    if (!source) return [];
    const matches = source.match(/[^。！？!?\.]+[。！？!?\.]?/g) || [source];
    return matches.map(s => s.trim()).filter(Boolean);
  }

  function buildContinuousQueue() {
    if (!reader?.classList.contains('open')) return [];
    const items = [];
    const sections = document.querySelectorAll('#paperLeft .continuous-chapter');

    sections.forEach(section => {
      const chapterIndex = Number(section.dataset.continuousChapter || 0);
      const titleEl = section.querySelector('.continuous-chapter-head h2');
      const introEl = section.querySelector('.continuous-chapter-head .paper-intro');
      if (titleEl?.textContent.trim()) items.push({ text: titleEl.textContent.trim(), el: titleEl, chapterIndex });
      if (introEl?.textContent.trim()) {
        sentenceUnits(introEl.textContent).forEach(text => items.push({ text, el: introEl, chapterIndex }));
      }
      section.querySelectorAll('.continuous-copy p').forEach(p => {
        sentenceUnits(p.textContent).forEach(text => items.push({ text, el: p, chapterIndex }));
      });
    });
    return items;
  }

  function findStartIndex(items) {
    if (!items.length || !stage) return 0;
    const stageRect = stage.getBoundingClientRect();
    const targetY = stageRect.top + Math.min(stage.clientHeight * 0.32, 220);
    let bestIndex = 0;
    let bestDistance = Infinity;

    items.forEach((item, index) => {
      if (!item.el?.isConnected) return;
      const rect = item.el.getBoundingClientRect();
      const y = Math.max(rect.top, Math.min(targetY, rect.bottom));
      const distance = Math.abs(y - targetY);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function unwrapHighlights() {
    document.querySelectorAll('.readalong-active').forEach(span => {
      span.replaceWith(document.createTextNode(span.textContent || ''));
    });
  }

  function wrapSentenceInElement(el, sentence) {
    if (!el) return false;
    const raw = el.textContent || '';
    const wanted = normalize(sentence);
    if (!wanted || !normalize(raw).includes(wanted)) return false;

    const compactRaw = normalize(raw);
    const compactIndex = compactRaw.indexOf(wanted);
    if (compactIndex < 0) return false;

    let start = -1;
    let end = -1;
    let compactPos = 0;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (/\s/.test(ch) || /[“”‘’"']/.test(ch)) continue;
      if (compactPos === compactIndex && start < 0) start = i;
      compactPos += 1;
      if (compactPos === compactIndex + wanted.length) { end = i + 1; break; }
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

  function focusItem(item) {
    unwrapHighlights();
    if (!item?.el?.isConnected) return;
    if (wrapSentenceInElement(item.el, item.text)) {
      const active = item.el.querySelector('.readalong-active');
      (active || item.el).scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  function finish() {
    queue = [];
    queueIndex = 0;
    activeUtterance = null;
    unwrapHighlights();
    setButton('listen');
    emit('mylife:narration-end');
  }

  function speakNext() {
    if (stoppedManually) return;
    if (queueIndex >= queue.length) { finish(); return; }

    const item = queue[queueIndex];
    focusItem(item);

    const p = profile();
    const voice = findChosenVoice();
    const utter = new SpeechSynthesisUtterance(item.text);
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    else utter.lang = p.lang;
    utter.rate = p.rate;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      activeUtterance = utter;
      focusItem(item);
      setButton('pause');
      emit('mylife:narration-start');
    };

    utter.onend = () => {
      if (stoppedManually) return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 20);
    };

    utter.onerror = event => {
      if (stoppedManually || event.error === 'interrupted' || event.error === 'canceled') return;
      queueIndex += 1;
      activeUtterance = null;
      window.setTimeout(speakNext, 20);
    };

    synth.speak(utter);
  }

  function startContinuousNarration() {
    const items = buildContinuousQueue();
    if (!items.length) { setButton('listen'); return; }
    stoppedManually = false;
    synth.cancel();
    refreshVoices();
    queue = items;
    queueIndex = findStartIndex(items);
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

    startContinuousNarration();
  }, true);

  stopBtn.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    stop();
  }, true);

  document.addEventListener('click', event => {
    if (event.target.closest('[data-close-reader]')) stop();
  }, true);

  languageSelect?.addEventListener('change', () => {
    stop();
    window.setTimeout(refreshVoices, 80);
    window.setTimeout(() => setButton('listen'), 100);
  });

  synth.onvoiceschanged = refreshVoices;
  refreshVoices();
  setButton('listen');
})();
