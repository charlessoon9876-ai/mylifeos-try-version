(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const dock = document.getElementById('audioDock');
  const playPauseBtn = document.getElementById('audioPlayPause');
  const stopBtn = document.getElementById('audioStop');
  const statusEl = document.getElementById('audioStatus');
  const titleEl = document.getElementById('audioTitle');
  const languageSelect = document.getElementById('languageSelect');

  let voices = [];
  let currentText = '';
  let currentTitle = 'My Life Origin · Narration';
  let currentUtterance = null;

  const chosenVoices = {
    zh: {
      names: ['Google 國語（臺灣）', 'Google 國語 (臺灣)', 'Google 國語', 'Google 中文'],
      lang: 'zh-TW',
      rate: 0.94
    },
    en: {
      names: ['Google US English'],
      lang: 'en-US',
      rate: 0.96
    },
    ms: {
      names: ['Google Bahasa Indonesia'],
      lang: 'id-ID',
      rate: 0.95
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
    updateStatus();
  }

  function updateStatus(prefix = '') {
    if (!statusEl) return;
    const voice = findChosenVoice();
    const label = voice ? voice.name : profile().names[0];
    statusEl.textContent = prefix ? `${prefix} · ${label}` : label;
  }

  function chapterText() {
    const reader = document.getElementById('reader');
    if (reader?.classList.contains('open')) {
      const kicker = document.getElementById('readerKicker')?.innerText || '';
      const title = document.getElementById('readerTitle')?.innerText || '';
      const intro = document.getElementById('readerIntro')?.innerText || '';
      const body = document.getElementById('readerBody')?.innerText || '';
      currentTitle = `${kicker} · ${title}`.replace(/^ · | · $/g, '');
      return [title, intro, body].filter(Boolean).join('. ');
    }
    currentTitle = 'Book 1 · My Life Origin';
    const hero = document.querySelector('.hero-copy')?.innerText || '';
    const manifesto = document.querySelector('.manifesto')?.innerText || '';
    return `${hero}. ${manifesto}`;
  }

  function showDock() { dock?.classList.add('active'); }
  function hideDock() { dock?.classList.remove('active'); }

  function stop({ hide = true } = {}) {
    synth.cancel();
    currentUtterance = null;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    updateStatus();
    if (hide) hideDock();
  }

  function speak(text) {
    stop({ hide: false });
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
      showDock();
      if (titleEl) titleEl.textContent = currentTitle;
      updateStatus('Playing');
      if (playPauseBtn) playPauseBtn.textContent = 'Ⅱ';
    };
    utter.onend = () => {
      currentUtterance = null;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      updateStatus('Finished');
      setTimeout(hideDock, 1000);
    };
    utter.onerror = () => {
      currentUtterance = null;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      if (statusEl) statusEl.textContent = 'Narration unavailable on this device';
      setTimeout(hideDock, 1600);
    };

    showDock();
    synth.speak(utter);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('#listenPageBtn, #listenChapterBtn');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    speak(chapterText());
  }, true);

  playPauseBtn?.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      playPauseBtn.textContent = '▶';
      if (statusEl) statusEl.textContent = 'Paused';
    } else if (synth.paused) {
      synth.resume();
      playPauseBtn.textContent = 'Ⅱ';
      updateStatus('Playing');
    } else {
      speak(currentText || chapterText());
    }
  });

  stopBtn?.addEventListener('click', () => stop());
  languageSelect?.addEventListener('change', () => {
    stop();
    setTimeout(refreshVoices, 50);
  });

  synth.onvoiceschanged = refreshVoices;
  refreshVoices();

  const style = document.createElement('style');
  style.textContent = `
    .audio-dock{display:none!important;left:auto!important;right:18px!important;bottom:18px!important;transform:none!important;width:min(390px,calc(100% - 28px))!important;border-radius:18px!important}
    .audio-dock.active{display:block!important}
    .audio-settings{display:none!important}
    .audio-dock-main{padding:11px 12px!important;gap:10px!important}
    .audio-icon{width:34px!important;height:34px!important}
    .audio-meta strong{font-size:13px!important}
    .audio-meta span{font-size:11px!important}
    .audio-btn{width:36px!important;height:36px!important}
    .reader-content{padding-bottom:105px!important}
    footer{padding-bottom:36px!important}
    @media(max-width:640px){
      .audio-dock{right:10px!important;bottom:10px!important;width:calc(100% - 20px)!important;border-radius:16px!important}
      .audio-icon{display:none!important}
      .audio-dock-main{grid-template-columns:1fr auto!important}
      .reader-content{padding-bottom:100px!important}
      footer{padding-bottom:36px!important}
    }
  `;
  document.head.appendChild(style);
})();