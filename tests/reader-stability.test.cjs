// Dependency-free integration checks; DOM geometry and speech are simulated.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

function harness() {
  class Element extends EventTarget {
    addEventListener(type, listener, options) {
      this.listeners ??= [];
      this.listeners.push({ type, listener, capture: options === true || options?.capture });
    }
    dispatchEvent(event) {
      let stopped = false;
      event.stopImmediatePropagation = () => { stopped = true; };
      for (const entry of (this.listeners || []).filter(x => x.type === event.type)
        .sort((a, b) => Number(!!b.capture) - Number(!!a.capture))) {
        entry.listener(event);
        if (stopped) break;
      }
      return true;
    }
    constructor() {
      super();
      this.style = {}; this.dataset = {}; this.attributes = {};
      this.children = []; this.textContent = ''; this.innerHTML = '';
      this.value = 'zh'; this.scrollTop = 0; this.clientHeight = 600;
      this.scrollHeight = 14000; this.isConnected = true; this.top = 0;
      const classes = new Set();
      this.classList = {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name),
        toggle(name, force) {
          const on = force ?? !classes.has(name);
          on ? classes.add(name) : classes.delete(name); return on;
        }
      };
    }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k]; }
    appendChild(node) { this.children.push(node); this.textContent += node.textContent || ''; return node; }
    insertAdjacentElement() {}
    remove() { this.removed = true; }
    querySelector(selector) { return node(selector); }
    querySelectorAll() { return []; }
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 900, left: 0, width: 800 }; }
    scrollIntoView() {}
    closest() { return null; }
  }
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, new Element());
    return nodes.get(id);
  };
  const window = new EventTarget();
  const timers = new Map(); let timerId = 0;
  window.setTimeout = fn => { timers.set(++timerId, fn); return timerId; };
  window.clearTimeout = id => timers.delete(id);
  window.setInterval = () => 1; window.clearInterval = () => {};
  window.matchMedia = () => ({ matches: false });
  const document = new EventTarget();
  document.getElementById = id => node('#' + id);
  document.querySelector = selector => node(selector);
  document.querySelectorAll = () => [];
  document.createElement = () => new Element();
  document.createTextNode = text => Object.assign(new Element(), { textContent: text });
  document.head = new Element(); document.body = new Element();
  document.documentElement = new Element();
  const saved = new Map();
  const context = vm.createContext({
    window, document, Event, CustomEvent, HTMLElement: Element,
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame: window.setTimeout,
    setTimeout: window.setTimeout, clearTimeout: window.clearTimeout,
    performance: { now: () => 1000 },
    localStorage: { getItem: k => saved.get(k) || null, setItem: (k, v) => saved.set(k, v) },
    navigator: {}, location: { href: 'http://localhost/' },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } }
  });
  function run(file) { vm.runInContext(source(file), context, { filename: file }); }
  function flush() {
    for (let rounds = 0; timers.size && rounds < 20; rounds++) {
      const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn());
    }
  }
  return { node, window, document, context, saved, run, flush, Element };
}

test('ordered loader blocks entry, retries the failed file, and loads each successful file once', () => {
  const h = harness(); const buttons = [new h.Element(), new h.Element()];
  h.node('#chapterGrid').querySelectorAll = () => buttons;
  h.run('reader-loader.js');
  assert.equal(h.window.bookReady, false);
  assert.ok(buttons.every(b => b.disabled));
  const requested = [];
  while (!h.window.bookReady) {
    const script = h.document.body.children.at(-1);
    requested.push(script.src);
    if (script.src === 'translation8.js' && requested.filter(x => x === script.src).length === 1) {
      script.onerror();
      assert.equal(h.window.bookReady, false);
      assert.equal(h.node('#bookLoadRetry').hidden, false);
      h.node('#languageSelect').value = 'ms';
      h.node('#languageSelect').dispatchEvent(new Event('change'));
      assert.equal(h.node('#bookLoadRetry').textContent, 'Cuba lagi');
      h.node('#bookLoadRetry').dispatchEvent(new Event('click'));
    } else script.onload();
    assert.ok(requested.length <= 15);
  }
  assert.deepEqual(requested, [
    'prologue.js', 'chapter1.js', 'chapter234.js', 'chapter567.js', 'chapter8.js',
    'chapter9-end.js', 'translation01.js', 'translation234.js', 'translation567.js',
    'translation8.js', 'translation8.js', 'translation910.js', 'translation11end.js',
    'continuous-reader.js', 'chapter-format.js'
  ]);
  assert.ok(buttons.every(b => !b.disabled));
  assert.equal(h.node('#bookLoadStatus').hidden, true);
});

test('chapter selection and scrolling share the state used by Mark as read; resize preserves continuous content', () => {
  const h = harness(); h.run('app.js'); h.run('book.js'); h.run('continuous-reader.js');
  h.window.openReader(8);
  assert.equal(h.node('#reader').classList.contains('open'), false);
  h.window.bookReady = true;
  h.window.openReader(8); h.flush();
  h.node('#markReadBtn').dispatchEvent(new Event('click'));
  assert.deepEqual(JSON.parse(h.saved.get('origin.read')), [8]);
  const sections = Array.from({ length: 14 }, (_, i) => {
    const el = new h.Element(); el.dataset.continuousChapter = String(i);
    el.top = (i - 10) * 1000; return el;
  });
  h.node('#paperLeft').querySelectorAll = () => sections;
  h.node('#bookStage').dispatchEvent(new Event('scroll'));
  h.node('#markReadBtn').dispatchEvent(new Event('click'));
  assert.deepEqual(JSON.parse(h.saved.get('origin.read')), [8, 10]);
  const before = h.node('#paperLeft').innerHTML;
  h.window.dispatchEvent(new Event('resize')); h.flush();
  assert.equal(h.node('#paperLeft').innerHTML, before);
  assert.equal((before.match(/class="continuous-chapter"/g) || []).length, 14);
});

test('Escape cancels narration and callbacks from an old session cannot continue after reopening', () => {
  const h = harness(); const utterances = []; let cancellations = 0;
  const synth = {
    speaking: false, paused: false, getVoices: () => [],
    cancel() { cancellations++; this.speaking = false; },
    speak(utterance) { utterances.push(utterance); this.speaking = true; utterance.onstart(); },
    pause() { this.paused = true; }, resume() { this.paused = false; }
  };
  h.window.speechSynthesis = synth;
  h.run('app.js'); h.run('continuous-reader.js'); h.run('audio.js');
  const title = new h.Element(); title.textContent = 'Chapter title.';
  const section = new h.Element(); section.dataset.continuousChapter = '0';
  section.querySelector = selector => selector.includes('h2') ? title : null;
  h.document.querySelectorAll = selector => selector.includes('.continuous-chapter') ? [section] : [];
  h.window.bookReady = true;
  h.window.openReader(0); h.flush();
  h.node('#listenChapterBtn').dispatchEvent(new Event('click'));
  assert.equal(utterances.length, 1);
  const before = cancellations;
  h.document.dispatchEvent(Object.assign(new Event('keydown'), { key: 'Escape' }));
  assert.ok(cancellations > before);
  assert.equal(synth.speaking, false);
  assert.equal(h.node('#reader').classList.contains('open'), false);
  h.window.openReader(0); h.flush();
  h.node('#listenChapterBtn').dispatchEvent(new Event('click'));
  utterances[0].onend(); h.flush();
  assert.equal(utterances.length, 2);
  assert.equal(synth.speaking, true);
});

test('Continue restarts the saved sentence despite stale browser flags and native resume doing nothing', () => {
  const h = harness(); const utterances = [];
  const synth = {
    speaking: true, paused: false, getVoices: () => [],
    cancel() {}, resume() {},
    pause() { throw new Error('Native pause must not be used'); },
    speak(utterance) { utterances.push(utterance); utterance.onstart(); }
  };
  h.window.speechSynthesis = synth;
  h.run('app.js'); h.run('continuous-reader.js'); h.run('audio.js');
  const title = new h.Element(); title.textContent = 'Saved sentence.';
  const section = new h.Element(); section.dataset.continuousChapter = '0';
  section.querySelector = selector => selector.includes('h2') ? title : null;
  h.document.querySelectorAll = selector => selector.includes('.continuous-chapter') ? [section] : [];
  h.window.bookReady = true;
  h.window.openReader(0); h.flush();
  const button = h.node('#listenChapterBtn');
  button.dispatchEvent(new Event('click'));
  assert.equal(utterances.length, 1);
  button.dispatchEvent(new Event('click'));
  assert.match(button.innerHTML, /继续/);
  // An old utterance may deliver its completion after cancellation.
  utterances[0].onend(); h.flush();
  assert.equal(utterances.length, 1);
  button.dispatchEvent(new Event('click'));
  assert.equal(utterances.length, 2);
  assert.equal(utterances[1].text, 'Saved sentence.');
  assert.match(button.innerHTML, /暂停/);
  // Also pause in the short gap between sentences.
  utterances[1].onend();
  button.dispatchEvent(new Event('click'));
  h.flush();
  assert.equal(utterances.length, 2);
  h.window.dispatchEvent(new Event('mylife:reader-close'));
  h.flush();
  assert.equal(utterances.length, 2);
});
