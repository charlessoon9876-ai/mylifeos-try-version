(() => {
  const listenBtn = document.getElementById('listenChapterBtn');
  if (!listenBtn) return;

  const style = document.createElement('style');
  style.textContent = `
    .audiobook-timeline{display:none!important}
    .compact-audio-time{display:inline-flex;align-items:center;gap:6px;margin-left:2px;padding:7px 10px;border:1px solid rgba(255,255,255,.16);border-radius:999px;font:600 11px/1 Inter,system-ui,sans-serif;color:#d8c9b7;background:rgba(255,255,255,.035);font-variant-numeric:tabular-nums;white-space:nowrap;letter-spacing:.01em}
    .compact-audio-time .compact-speed{font-size:9px;color:#b99162;letter-spacing:.04em}
    .compact-audio-time .compact-total{color:#9f907f;font-weight:500}
    @media(max-width:700px){
      .compact-audio-time{padding:6px 8px;font-size:10px;gap:4px}
      .compact-audio-time .compact-speed{display:none}
    }
  `;
  document.head.appendChild(style);

  const compact = document.createElement('span');
  compact.className = 'compact-audio-time';
  compact.setAttribute('aria-label', 'Audiobook time at 1.0 speed');
  compact.innerHTML = `<span class="compact-speed">1.0×</span><span id="compactAudioElapsed">00:00</span><span class="compact-total">/ ~<span id="compactAudioTotal">--:--</span></span>`;
  listenBtn.insertAdjacentElement('afterend', compact);

  const compactElapsed = compact.querySelector('#compactAudioElapsed');
  const compactTotal = compact.querySelector('#compactAudioTotal');

  function sync() {
    const elapsed = document.getElementById('audiobookElapsed');
    const total = document.getElementById('audiobookTotal');
    if (elapsed && compactElapsed) compactElapsed.textContent = elapsed.textContent || '00:00';
    if (total && compactTotal) compactTotal.textContent = total.textContent || '--:--';
  }

  function attachObservers() {
    const elapsed = document.getElementById('audiobookElapsed');
    const total = document.getElementById('audiobookTotal');
    if (!elapsed || !total) {
      window.setTimeout(attachObservers, 120);
      return;
    }
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(elapsed, { childList: true, characterData: true, subtree: true });
    observer.observe(total, { childList: true, characterData: true, subtree: true });
  }

  attachObservers();
})();
