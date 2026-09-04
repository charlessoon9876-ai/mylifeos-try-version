(() => {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const listenBtn = document.getElementById('listenChapterBtn');
  const languageSelect = document.getElementById('languageSelect');
  const reader = document.getElementById('reader');
  const stage = document.getElementById('bookStage');

  let voices = [];
  let narrationSession = 0;
  let queue = [];
  let queueIndex = 0;
  let activeUtterance = null;
  let stoppedManually = false;
  let timelineDurations = [];
  let timelineStarts = [];
  let timelineTotal = 0;
  let currentItemStartedAt = 0;
  let pauseStartedAt = 0;
  let timelineTimer = 0;

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
    if (lang === 'en') return { listen: 'Listen', pause: 'Pause', resume: 'Resume', stop: 'Stop', timeline: 'Audiobook timeline', estimate: 'estimated at 1.0×' };
    if (lang === 'ms') return { listen: 'Dengar', pause: 'Jeda', resume: 'Sambung', stop: 'Henti', timeline: 'Garis masa audiobook', estimate: 'anggaran pada 1.0×' };
    return { listen: '听书', pause: '暂停', resume: '继续', stop: '停止', timeline: '听书时间轴', estimate: '按当前 1.0× 估算' };
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
    .audiobook-timeline{display:none;padding:14px 20px 12px;border-top:1px solid rgba(114,86,52,.16);border-bottom:1px solid rgba(114,86,52,.12);background:rgba(248,241,229,.72)}
    .reader.open .audiobook-timeline{display:block}
    .audiobook-timeline-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:9px;font:600 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.05em;color:#786955}
    .audiobook-timeline-title{display:flex;align-items:center;gap:8px;text-transform:uppercase}
    .audiobook-speed{padding:3px 7px;border:1px solid rgba(126,92,48,.25);border-radius:999px;color:#8a6335;background:rgba(255,255,255,.42);font-weight:800;letter-spacing:.04em}
    .audiobook-time{font-variant-numeric:tabular-nums;white-space:nowrap;color:#4f4438;letter-spacing:.02em}
    .audiobook-time .approx{color:#9a856c;font-weight:500}
    .audiobook-track-wrap{position:relative;height:22px;display:flex;align-items:center}
    .audiobook-track{position:relative;width:100%;height:4px;border-radius:999px;background:rgba(94,72,46,.16);overflow:visible}
    .audiobook-progress{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:999px;background:linear-gradient(90deg,#8c633d,#c08c51);transition:width .18s linear}
    .audiobook-head{position:absolute;top:50%;left:0;width:10px;height:10px;border-radius:50%;background:#8c633d;box-shadow:0 0 0 3px rgba(140,99,61,.12);transform:translate(-50%,-50%);transition:left .18s linear}
    .audiobook-markers{position:absolute;inset:0;pointer-events:none}
    .audiobook-marker{position:absolute;top:50%;width:1px;height:10px;background:rgba(92,66,37,.28);transform:translateY(-50%)}
    .audiobook-timeline-note{margin-top:6px;font:500 10px/1.3 Inter,system-ui,sans-serif;color:#9a8c7a}
    @media(max-width:700px){.audiobook-timeline{padding:11px 14px 9px}.audiobook-timeline-top{font-size:10px;gap:8px}.audiobook-timeline-note{font-size:9px}.audiobook-speed{padding:2px 6px}}
  `;
  document.head.appendChild(style);

  const stopBtn = document.createElement('button');
  stopBtn.id = 'stopNarrationBtn';
  stopBtn.type = 'button';
  stopBtn.className = 'ghost';
  listenBtn?.insertAdjacentElement('afterend', stopBtn);

  const timeline = document.createElement('div');
  timeline.className = 'audiobook-timeline';
  timeline.setAttribute('aria-label', 'Audiobook timeline');
  timeline.innerHTML = `
    <div class="audiobook-timeline-top">
      <div class="audiobook-timeline-title"><span id="audiobookTimelineTitle">听书时间轴</span><span class="audiobook-speed">1.0×</span></div>
      <div class="audiobook-time"><span id="audiobookElapsed">00:00</span> <span class="approx">/ ~<span id="audiobookTotal">--:--</span></span></div>
    </div>
    <div class="audiobook-track-wrap">
      <div class="audiobook-track">
        <span class="audiobook-progress" id="audiobookProgress"></span>
        <span class="audiobook-head" id="audiobookHead"></span>
        <div class="audiobook-markers" id="audiobookMarkers"></div>
      </div>
    </div>
    <div class="audiobook-timeline-note" id="audiobookTimelineNote">按当前 1.0× 估算</div>
  `;
  stage?.insertAdjacentElement('beforebegin', timeline);

  const elapsedEl = timeline.querySelector('#audiobookElapsed');
  const totalEl = timeline.querySelector('#audiobookTotal');
  const progressEl = timeline.querySelector('#audiobookProgress');
  const headEl = timeline.querySelector('#audiobookHead');
  const markersEl = timeline.querySelector('#audiobookMarkers');
  const timelineTitleEl = timeline.querySelector('#audiobookTimelineTitle');
  const timelineNoteEl = timeline.querySelector('#audiobookTimelineNote');

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
    if (timelineTitleEl) timelineTitleEl.textContent = copy.timeline;
    if (timelineNoteEl) timelineNoteEl.textContent = copy.estimate;
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

  function estimateSeconds(text) {
    const lang = languageSelect?.value || 'zh';
    const source = String(text || '').trim();
    if (!source) return 0;
    const punctuation = (source.match(/[，,。！？!?；;：:]/g) || []).length;
    if (lang === 'zh') {
      const chars = source.replace(/\s+/g, '').length;
      return Math.max(0.8, chars / 4.0 + punctuation * 0.11);
    }
    const words = source.split(/\s+/).filter(Boolean).length;
    return Math.max(0.8, words / 2.7 + punctuation * 0.12);
  }

  function formatTime(seconds) {
    const value = Math.max(0, Math.round(Number(seconds) || 0));
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = value % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function prepareTimeline(items) {
    timelineDurations = [];
    timelineStarts = [];
    timelineTotal = 0;
    const chapterStarts = new Map();

    items.forEach((item, index) => {
      timelineStarts[index] = timelineTotal;
      if (!chapterStarts.has(item.chapterIndex)) chapterStarts.set(item.chapterIndex, timelineTotal);
      const seconds = estimateSeconds(item.text);
      timelineDurations[index] = seconds;
      timelineTotal += seconds;
    });

    if (totalEl) totalEl.textContent = formatTime(timelineTotal);
    if (markersEl) {
      markersEl.innerHTML = '';
      if (timelineTotal > 0) {
        chapterStarts.forEach((seconds, chapterIndex) => {
          if (seconds <= 0) return;
          const marker = document.createElement('span');
          marker.className = 'audiobook-marker';
          marker.style.left = `${Math.min(100, (seconds / timelineTotal) * 100)}%`;
          marker.title = `Chapter ${chapterIndex}`;
          markersEl.appendChild(marker);
        });
      }
    }
    updateTimelinePosition(queueIndex < items.length ? timelineStarts[queueIndex] : 0);
  }

  function updateTimelinePosition(seconds) {
    const elapsed = Math.max(0, Math.min(timelineTotal || 0, Number(seconds) || 0));
    const percent = timelineTotal > 0 ? (elapsed / timelineTotal) * 100 : 0;
    if (elapsedEl) elapsedEl.textContent = formatTime(elapsed);
    if (progressEl) progressEl.style.width = `${percent}%`;
    if (headEl) headEl.style.left = `${percent}%`;
  }

  function stopTimelineTimer() {
    if (timelineTimer) window.clearInterval(timelineTimer);
    timelineTimer = 0;
  }

  function startTimelineTimer() {
    stopTimelineTimer();
    timelineTimer = window.setInterval(() => {
      if (!queue.length || queueIndex >= queue.length) return;
      const base = timelineStarts[queueIndex] || 0;
      const duration = timelineDurations[queueIndex] || 0;
      let inside = 0;
      if (currentItemStartedAt && !synth.paused) inside = (performance.now() - currentItemStartedAt) / 1000;
      else if (currentItemStartedAt && synth.paused && pauseStartedAt) inside = (pauseStartedAt - currentItemStartedAt) / 1000;
      updateTimelinePosition(base + Math.min(duration, Math.max(0, inside)));
    }, 250);
  }

  function refreshTimelinePreview() {
    window.setTimeout(() => {
      if (synth.speaking || synth.paused) return;
      const items = buildContinuousQueue();
      if (!items.length) return;
      queue = items;
      queueIndex = 0;
      prepareTimeline(items);
      updateTimelinePosition(0);
      queue = [];
    }, 90);
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
    narrationSession += 1;
    stoppedManually = true;
    synth.cancel();
    queue = [];
    queueIndex = 0;
    activeUtterance = null;
    currentItemStartedAt = 0;
    pauseStartedAt = 0;
    stopTimelineTimer();
    unwrapHighlights();
    setButton('listen');
    updateTimelinePosition(0);
    emit('mylife:narration-end');
  }

  function finish() {
    updateTimelinePosition(timelineTotal);
    queue = [];
    queueIndex = 0;
    activeUtterance = null;
    currentItemStartedAt = 0;
    pauseStartedAt = 0;
    stopTimelineTimer();
    unwrapHighlights();
    setButton('listen');
    emit('mylife:narration-end');
  }

  function speakNext() {
    if (stoppedManually) return;
    if (queueIndex >= queue.length) { finish(); return; }

    const session = narrationSession;
    const item = queue[queueIndex];
    focusItem(item);
    updateTimelinePosition(timelineStarts[queueIndex] || 0);

    const p = profile();
    const voice = findChosenVoice();
    const utter = new SpeechSynthesisUtterance(item.text);
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    else utter.lang = p.lang;
    utter.rate = p.rate;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      if (session !== narrationSession || stoppedManually) return;
      activeUtterance = utter;
      currentItemStartedAt = performance.now();
      pauseStartedAt = 0;
      focusItem(item);
      setButton('pause');
      startTimelineTimer();
      emit('mylife:narration-start');
    };

    utter.onend = () => {
      if (session !== narrationSession || stoppedManually) return;
      updateTimelinePosition((timelineStarts[queueIndex] || 0) + (timelineDurations[queueIndex] || 0));
      queueIndex += 1;
      activeUtterance = null;
      currentItemStartedAt = 0;
      pauseStartedAt = 0;
      window.setTimeout(() => { if (session === narrationSession) speakNext(); }, 20);
    };

    utter.onerror = event => {
      if (session !== narrationSession || stoppedManually || event.error === 'interrupted' || event.error === 'canceled') return;
      queueIndex += 1;
      activeUtterance = null;
      currentItemStartedAt = 0;
      pauseStartedAt = 0;
      window.setTimeout(() => { if (session === narrationSession) speakNext(); }, 20);
    };

    synth.speak(utter);
  }

  function startContinuousNarration() {
    const items = buildContinuousQueue();
    if (!items.length) { setButton('listen'); return; }
    narrationSession += 1;
    stoppedManually = false;
    synth.cancel();
    refreshVoices();
    queue = items;
    prepareTimeline(items);
    queueIndex = findStartIndex(items);
    updateTimelinePosition(timelineStarts[queueIndex] || 0);
    emit('mylife:narration-start');
    speakNext();
  }

  listenBtn?.addEventListener('click', event => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (synth.speaking && !synth.paused) {
      pauseStartedAt = performance.now();
      synth.pause();
      setButton('resume');
      emit('mylife:narration-pause');
      return;
    }

    if (synth.paused) {
      const now = performance.now();
      if (currentItemStartedAt && pauseStartedAt) currentItemStartedAt += now - pauseStartedAt;
      pauseStartedAt = 0;
      synth.resume();
      setButton('pause');
      startTimelineTimer();
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
    window.setTimeout(() => {
      setButton('listen');
      refreshTimelinePreview();
    }, 120);
  });

  window.addEventListener('mylife:reader-close', stop);
  window.addEventListener('mylife:reader-rendered', refreshTimelinePreview);

  synth.onvoiceschanged = refreshVoices;
  refreshVoices();
  setButton('listen');
})();
