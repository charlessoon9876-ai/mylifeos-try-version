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

  const languageProfiles = {
    zh: {
      prefix: 'zh', fallback: 'zh-CN', rate: 0.92,
      preferred: ['xiaoxiao','xiaoyi','hsiaochen','ting-ting','sin-ji','meijia','huihui','yaoyao','mandarin'],
      natural: ['natural','premium','enhanced','online']
    },
    en: {
      prefix: 'en', fallback: 'en-US', rate: 0.95,
      preferred: ['ava','jenny','aria','sonia','samantha','serena','karen','moira','natasha','zira'],
      natural: ['natural','premium','enhanced','online']
    },
    ms: {
      prefix: 'ms', fallback: 'ms-MY', rate: 0.94,
      preferred: ['yasmin','malay','bahasa melayu'],
      natural: ['natural','premium','enhanced','online']
    }
  };

  const lower = value => (value || '').toLowerCase();
  const profile = () => languageProfiles[languageSelect?.value] || languageProfiles.zh;

  function scoreVoice(voice) {
    const p = profile();
    const name = lower(voice.name);
    const lang = lower(voice.lang);
    let score = 0;

    if (lang.startsWith(p.prefix)) score += 100;
    if (lang === lower(p.fallback)) score += 18;

    p.preferred.forEach((hint, index) => {
      if (name.includes(hint)) score += 55 - Math.min(index * 3, 24);
    });
    p.natural.forEach((hint, index) => {
      if (name.includes(hint)) score += 35 - index * 4;
    });

    if (name.includes('microsoft')) score += 14;
    if (name.includes('apple')) score += 12;
    if (name.includes('google')) score += 4;
    if (name.includes('compact')) score -= 25;
    if (name.includes('male')) score -= 10;

    return score;
  }

  function preferredVoice() {
    const p = profile();
    const compatible = voices.filter(v => lower(v.lang).startsWith(p.prefix));
    const pool = compatible.length ? compatible : voices;
    return [...pool].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  }

  function refreshVoices() {
    voices = synth.getVoices();
    updateVoiceStatus();
  }

  function updateVoiceStatus(prefix = '') {
    if (!statusEl) return;
    const voice = preferredVoice();
    const label = voice ? `${voice.name} · ${voice.lang}` : 'Best available voice';
    statusEl.textContent = prefix ? `${prefix} · ${label}` : `Auto voice · ${label}`;
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

  function showDock() {
    dock?.classList.add('active');
  }

  function hideDock() {
    dock?.classList.remove('active');
  }

  function stop({ hide = true } = {}) {
    synth.cancel();
    currentUtterance = null;
    if (playPauseBtn) playPauseBtn.textContent = '▶';
    updateVoiceStatus();
    if (hide) hideDock();
  }

  function speak(text) {
    stop({ hide: false });
    currentText = (text || '').replace(/\s+/g, ' ').trim();
    if (!currentText) return;

    const p = profile();
    const voice = preferredVoice();
    const utter = new SpeechSynthesisUtterance(currentText);

    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    } else {
      utter.lang = p.fallback;
    }

    utter.rate = p.rate;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      currentUtterance = utter;
      showDock();
      if (titleEl) titleEl.textContent = currentTitle;
      updateVoiceStatus('Playing');
      if (playPauseBtn) playPauseBtn.textContent = 'Ⅱ';
    };

    utter.onend = () => {
      currentUtterance = null;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      updateVoiceStatus('Finished');
      setTimeout(hideDock, 1200);
    };

    utter.onerror = () => {
      currentUtterance = null;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
      if (statusEl) statusEl.textContent = 'Narration unavailable on this device';
      setTimeout(hideDock, 1800);
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
      updateVoiceStatus('Playing');
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