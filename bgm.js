(() => {
  const track = new Audio('mylife-origin-bgm.mp3.mp3');
  track.loop = true;
  track.volume = 0.30;
  track.preload = 'auto';

  let userEnabled = true;
  let started = false;

  const style = document.createElement('style');
  style.textContent = `
    .bgm-toggle{position:fixed;left:20px;bottom:20px;z-index:59;display:flex;align-items:center;gap:8px;padding:10px 14px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:#1f1a16;color:#f7efe4;box-shadow:0 12px 30px rgba(0,0,0,.22);font:700 13px/1 Inter,system-ui,sans-serif;cursor:pointer}
    .bgm-toggle:hover{transform:translateY(-1px)}
    .bgm-toggle[aria-pressed="false"]{opacity:.62}
    @media(max-width:720px){.bgm-toggle{left:12px;bottom:12px;padding:9px 12px;font-size:12px}}
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'bgm-toggle';
  button.setAttribute('aria-label', 'Toggle background music');
  button.setAttribute('aria-pressed', 'true');
  button.textContent = '♫ Music On';
  document.body.appendChild(button);

  function updateButton() {
    button.setAttribute('aria-pressed', userEnabled ? 'true' : 'false');
    button.textContent = userEnabled ? '♫ Music On' : '♫ Music Off';
  }

  async function tryPlay() {
    if (!userEnabled) return;
    try {
      await track.play();
      started = true;
    } catch (_) {
      // Browser autoplay policy: wait for a user gesture.
    }
  }

  function startAfterGesture() {
    if (started || !userEnabled) return;
    tryPlay();
  }

  document.addEventListener('pointerdown', startAfterGesture, { once: true, capture: true });
  document.addEventListener('keydown', startAfterGesture, { once: true, capture: true });

  button.addEventListener('click', async event => {
    event.preventDefault();
    event.stopPropagation();
    userEnabled = !userEnabled;
    updateButton();
    if (!userEnabled) {
      track.pause();
      return;
    }
    await tryPlay();
  });

  // Keep background music playing during narration.
  window.addEventListener('mylife:narration-start', () => {
    if (userEnabled) tryPlay();
  });

  window.addEventListener('mylife:narration-pause', () => {
    if (userEnabled) tryPlay();
  });

  window.addEventListener('mylife:narration-end', () => {
    if (userEnabled) tryPlay();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      track.pause();
    } else if (userEnabled && started) {
      tryPlay();
    }
  });

  updateButton();
})();
