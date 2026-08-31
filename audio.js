(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const voiceSelect = document.getElementById('voiceSelect');
  const rateSelect = document.getElementById('audioRate');
  const playPauseBtn = document.getElementById('audioPlayPause');
  const stopBtn = document.getElementById('audioStop');
  const statusEl = document.getElementById('audioStatus');
  const titleEl = document.getElementById('audioTitle');
  const languageSelect = document.getElementById('languageSelect');

  let voices = [];
  let currentText = '';
  let currentTitle = 'My Life Origin · Narration';
  let currentUtterance = null;
  let paused = false;

  const langMap = { zh: 'zh', en: 'en', ms: 'ms' };
  const naturalHints = [
    'xiaoxiao','xiaoyi','yunxi','ting-ting','sin-ji','samantha','ava','serena','karen','moira','aria','jenny','sonia','natasha','google','natural','premium','enhanced'
  ];
  const lower = s => (s || '').toLowerCase();

  function scoreVoice(v, target) {
    let score = 0;
    const name = lower(v.name);
    const lang = lower(v.lang);
    if (lang.startsWith(target)) score += 60;
    if (v.localService === false) score += 8;
    naturalHints.forEach((hint, i) => { if (name.includes(hint)) score += 30 - Math.min(i, 20); });
    if (name.includes('compact')) score -= 12;
    return score;
  }

  function preferredVoice() {
    const target = langMap[languageSelect?.value] || 'zh';
    const compatible = voices.filter(v => lower(v.lang).startsWith(target));
    const pool = compatible.length ? compatible : voices;
    return [...pool].sort((a,b) => scoreVoice(b,target) - scoreVoice(a,target))[0] || null;
  }

  function populateVoices() {
    voices = synth.getVoices();
    if (!voiceSelect || !voices.length) return;
    const target = langMap[languageSelect?.value] || 'zh';
    const previous = voiceSelect.value;
    const sorted = [...voices].sort((a,b) => scoreVoice(b,target) - scoreVoice(a,target));
    voiceSelect.innerHTML = sorted.map(v => `<option value="${v.voiceURI.replace(/"/g,'&quot;')}">${v.name} · ${v.lang}</option>`).join('');
    const preferred = preferredVoice();
    if (previous && voices.some(v => v.voiceURI === previous)) voiceSelect.value = previous;
    else if (preferred) voiceSelect.value = preferred.voiceURI;
    updateVoiceStatus();
  }

  function selectedVoice() {
    return voices.find(v => v.voiceURI === voiceSelect?.value) || preferredVoice();
  }

  function updateVoiceStatus() {
    const v = selectedVoice();
    if (!statusEl) return;
    statusEl.textContent = v ? `${v.name} · ${v.lang}` : 'Best available natural voice';
  }

  function chapterText() {
    const reader = document.getElementById('reader');
    if (reader?.classList.contains('open')) {
      const kicker = document.getElementById('readerKicker')?.innerText || '';
      const title = document.getElementById('readerTitle')?.innerText || '';
      const intro = document.getElementById('readerIntro')?.innerText || '';
      const body = document.getElementById('readerBody')?.innerText || '';
      currentTitle = `${kicker} · ${title}`.replace(/^ · | · $/g,'');
      return [title, intro, body].filter(Boolean).join('. ');
    }
    currentTitle = 'Book 1 · My Life Origin';
    const hero = document.querySelector('.hero-copy')?.innerText || '';
    const manifesto = document.querySelector('.manifesto')?.innerText || '';
    return `${hero}. ${manifesto}`;
  }

  function stop() {
    synth.cancel();
    currentUtterance = null;
    paused = false;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    if (statusEl) updateVoiceStatus();
  }

  function speak(text) {
    stop();
    currentText = (text || '').replace(/\s+/g,' ').trim();
    if (!currentText) return;
    const utter = new SpeechSynthesisUtterance(currentText);
    const voice = selectedVoice();
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = languageSelect?.value === 'en' ? 'en-US' : languageSelect?.value === 'ms' ? 'ms-MY' : 'zh-CN';
    }
    utter.rate = Number(rateSelect?.value || 0.95);
    utter.pitch = 1.02;
    utter.volume = 1;
    utter.onstart = () => {
      currentUtterance = utter;
      if (titleEl) titleEl.textContent = currentTitle;
      if (statusEl) statusEl.textContent = `Playing · ${voice ? voice.name : utter.lang}`;
      if (playPauseBtn) playPauseBtn.textContent = 'Ⅱ';
    };
    utter.onend = () => {
      currentUtterance = null;
      paused = false;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      updateVoiceStatus();
    };
    utter.onerror = () => {
      currentUtterance = null;
      paused = false;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      if (statusEl) statusEl.textContent = 'Narration unavailable on this device';
    };
    synth.speak(utter);
  }

  document.addEventListener('click', e => {
    const button = e.target.closest('#listenPageBtn, #listenChapterBtn');
    if (!button) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    speak(chapterText());
  }, true);

  playPauseBtn?.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
      synth.pause(); paused = true; playPauseBtn.textContent = '▶';
      if (statusEl) statusEl.textContent = 'Paused';
    } else if (synth.paused) {
      synth.resume(); paused = false; playPauseBtn.textContent = 'Ⅱ';
      const v = selectedVoice();
      if (statusEl) statusEl.textContent = `Playing · ${v ? v.name : ''}`;
    } else {
      speak(currentText || chapterText());
    }
  });

  stopBtn?.addEventListener('click', stop);
  voiceSelect?.addEventListener('change', () => { updateVoiceStatus(); if (synth.speaking) speak(currentText); });
  rateSelect?.addEventListener('change', () => { if (synth.speaking) speak(currentText); });
  languageSelect?.addEventListener('change', () => { stop(); populateVoices(); });

  synth.onvoiceschanged = populateVoices;
  populateVoices();
})();