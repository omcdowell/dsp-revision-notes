// Tonight's Cram Plan — an in-SPA timed study runner.
// Mounted by app.js when the route is #plan. Reads the schedule from plan-data.js.
import markdownit from 'https://esm.sh/markdown-it@14';
import texmath from 'https://esm.sh/markdown-it-texmath@1';
import katex from 'https://esm.sh/katex@0.16';
import { PLAN } from './plan-data.js';

// Notes that carry an interactive widget — the plan deep-links to `#<note>::demo`
// to jump straight to the animation (see scrollToAnchor in app.js).
const WIDGET_NOTES = new Set([
  'signals-systems-convolution.md', 'fourier.md', 'z-transforms.md',
  'dft-fft.md', 'filter-design.md', 'digital-image-processing.md',
]);

const md = markdownit({ html: false, linkify: true, typographer: false })
  .use(texmath, { engine: katex, delimiters: 'dollars', katexOptions: { throwOnError: false, strict: false } });

// --- Persistent timer state (survives route changes + reloads) --------------
const SKEY = 'dsp-plan-state-v1';
const studyCount = PLAN.filter(b => b.type !== 'break').length;

function load() {
  try { return JSON.parse(sessionStorage.getItem(SKEY)) || {}; } catch { return {}; }
}
let S = Object.assign({ started: false, idx: 0, remaining: PLAN[0].min * 60, paused: false, muted: false, checked: {} }, load());

function save() { try { sessionStorage.setItem(SKEY, JSON.stringify(S)); } catch {} }

let ticker = null;          // setInterval handle (module-singleton)
let root = null;            // mounted container

function fmt(s) { s = Math.max(0, s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, '0')}`; }
function studyIndexOf(i) { return PLAN.slice(0, i + 1).filter(b => b.type !== 'break').length; }

// Seconds left in the whole plan from this moment: current block's remaining + all later blocks.
function remainingSeconds() {
  if (!S.started) return PLAN.reduce((a, b) => a + b.min, 0) * 60;
  if (S.idx >= PLAN.length) return 0;
  return S.remaining + PLAN.slice(S.idx + 1).reduce((a, b) => a + b.min * 60, 0);
}
function fmtDur(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function clockAt(sec) {
  return new Date(Date.now() + Math.max(0, sec) * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
// The live "time left · done ~HH:MM" tail of the schedule summary.
function etaHtml() {
  const rem = remainingSeconds();
  return rem > 0 ? ` · <b>${fmtDur(rem)} left</b> · done ~${clockAt(rem)}` : ' · done ✓';
}

// --- Beep (WebAudio, no asset) ----------------------------------------------
let actx = null;
function beep(times) {
  if (S.muted) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    for (let k = 0; k < times; k++) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.connect(g); g.connect(actx.destination);
      o.type = 'sine'; o.frequency.value = k % 2 ? 660 : 880;
      const t = actx.currentTime + k * 0.18;
      g.gain.setValueAtTime(0.001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      o.start(t); o.stop(t + 0.17);
    }
  } catch {}
}

// --- Tick -------------------------------------------------------------------
function startTicker() {
  if (ticker) return;
  ticker = setInterval(() => {
    if (!S.started) return;
    if (S.paused) { paintEta(); return; }   // countdown frozen, but the projected finish slips later
    S.remaining--;
    const b = PLAN[S.idx];
    if (S.remaining === 120 && b.type !== 'break') beep(2);
    if (S.remaining <= 0) { beep(4); goto(S.idx + 1); return; }
    save();
    paintClock();
  }, 1000);
}
function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

function goto(i) {
  if (i >= PLAN.length) { S.idx = PLAN.length; S.started = true; save(); render(); return; }
  S.idx = i; S.remaining = PLAN[i].min * 60; save(); render();
}

// --- Rendering --------------------------------------------------------------
function tagChip(tag) {
  const t = (tag || '').toUpperCase();
  return `<span class="plan-chip plan-chip-${t.toLowerCase()}">${t}</span>`;
}

function render() {
  if (!root) return;
  if (!S.started) { renderStart(); return; }
  if (S.idx >= PLAN.length) { renderDone(); return; }
  const b = PLAN[S.idx];
  const next = PLAN[S.idx + 1];
  const isBreak = b.type === 'break';

  root.className = `plan ${isBreak ? 'is-break' : ''}`;
  root.innerHTML = `
    <div class="plan-stage">
      <div class="plan-meta">
        ${isBreak ? '<span class="plan-chip plan-chip-break">BREAK</span>' : `<span class="plan-kicker">BLOCK ${studyIndexOf(S.idx)} / ${studyCount}</span> ${tagChip(b.tag)}`}
        ${b.note ? `<a class="plan-notelink" href="#${encodeURIComponent(b.note)}" target="_blank" rel="noopener">Open note ↗</a>` : ''}
        ${b.note && WIDGET_NOTES.has(b.note) ? `<a class="plan-notelink plan-demolink" href="#${encodeURIComponent(b.note)}::demo" target="_blank" rel="noopener">🎬 Interactive demo ↗</a>` : ''}
      </div>
      <h1 class="plan-topic">${escapeHtml(b.topic)}</h1>
      <div class="plan-clock" id="plan-clock">${fmt(S.remaining)}</div>
      <div class="plan-bar"><div class="plan-fill" id="plan-fill"></div></div>
      <div class="plan-ctl">
        <button id="plan-pause" class="plan-btn">${S.paused ? '▶ Resume' : '⏸ Pause'}</button>
        <button id="plan-add" class="plan-btn">+5 min</button>
        <button id="plan-skip" class="plan-btn">⏭ Skip</button>
        <button id="plan-restart" class="plan-btn">↺ Restart</button>
        <button id="plan-mute" class="plan-btn">${S.muted ? '🔇 Muted' : '🔊 Sound'}</button>
      </div>
      ${b.intro ? `<div class="plan-intro">${md.renderInline(b.intro)}</div>` : ''}
      ${renderBody(b)}
      <div class="plan-next">Next: <b>${next ? escapeHtml(next.topic) : '🎉 Sleep'}</b></div>
    </div>
    ${renderSchedule()}
  `;
  wire(b);
  paintClock();
}

function renderBody(b) {
  if (b.type === 'break') {
    return `<div class="plan-tasks"><ul class="plan-breaklist">${(b.tasks || []).map(t => `<li>${md.renderInline(typeof t === 'string' ? t : t.do || '')}</li>`).join('')}</ul></div>`;
  }
  const tasks = (b.tasks || []).map((t, i) => {
    const id = `${b.id}::${i}`;
    const done = !!S.checked[id];
    return `
      <li class="plan-task ${done ? 'done' : ''}">
        <label class="plan-task-head">
          <input type="checkbox" data-check="${id}" ${done ? 'checked' : ''}/>
          <span class="plan-task-do">${md.renderInline(t.do || '')}</span>
        </label>
        ${t.detail ? `<div class="plan-task-detail">${md.render(t.detail)}</div>` : ''}
        ${t.check ? `<details class="plan-task-check"><summary>Show answer</summary>${md.render(t.check)}</details>` : ''}
      </li>`;
  }).join('');
  const formulas = (b.formulas && b.formulas.length)
    ? `<div class="plan-formulas"><div class="plan-formulas-h">Key formulas</div><ul>${b.formulas.map(f => `<li>${md.renderInline(f)}</li>`).join('')}</ul></div>`
    : '';
  const done = b.done_when ? `<div class="plan-donewhen"><b>Done when:</b> ${md.renderInline(b.done_when)}</div>` : '';
  return `<div class="plan-tasks"><ol class="plan-tasklist">${tasks}</ol>${formulas}${done}</div>`;
}

function renderSchedule() {
  let acc = 0;
  const rows = PLAN.map((b, n) => {
    const stamp = `+${Math.floor(acc / 60)}:${String(acc % 60).padStart(2, '0')}`;
    acc += b.min * 60;
    const cls = `${b.type === 'break' ? 'brk' : 'study'} ${n < S.idx ? 'past' : ''} ${n === S.idx ? 'cur' : ''}`;
    return `<a class="plan-row ${cls}" data-jump="${n}"><span class="plan-row-t">${stamp}</span><span class="plan-row-n">${escapeHtml(b.topic)}</span><span class="plan-row-d">${b.min}m</span></a>`;
  }).join('');
  const totalStudy = PLAN.filter(b => b.type !== 'break').reduce((a, b) => a + b.min, 0);
  const total = PLAN.reduce((a, b) => a + b.min, 0);
  return `<details class="plan-schedule"><summary>Full plan · ${studyCount} blocks · ${totalStudy}m study · ~${(total / 60).toFixed(1)}h<span id="plan-eta">${etaHtml()}</span></summary><div class="plan-rows">${rows}</div></details>`;
}

function renderStart() {
  root.className = 'plan';
  root.innerHTML = `
    <div class="plan-start">
      <div class="plan-kicker">CS6004 · Digital Signal Processing</div>
      <h1 class="plan-topic">Overnight Cram Plan</h1>
      <p class="plan-lede">Interleaved mock drills + extra topics. Short sharp auto-advancing stints, each with the tasks already laid out — don't think, just start. Beeps &amp; flashes red in the last 2&nbsp;min.</p>
      <p class="plan-sub">Tick tasks as you go (saved automatically). <b>Pause</b> for real breaks · <b>Skip</b> if done early · <b>+5</b> to extend. Keyboard: <kbd>space</kbd> pause · <kbd>n</kbd> skip · <kbd>m</kbd> mute.</p>
      <button id="plan-begin" class="plan-btn plan-btn-primary">▶ Start the night</button>
      ${renderSchedule()}
    </div>`;
  root.querySelector('#plan-begin').addEventListener('click', () => { S.started = true; S.idx = 0; S.remaining = PLAN[0].min * 60; S.paused = false; save(); render(); });
  wireSchedule();
}

function renderDone() {
  root.className = 'plan';
  root.innerHTML = `
    <div class="plan-start">
      <h1 class="plan-topic">🎉 Done — go to sleep.</h1>
      <p class="plan-lede">You covered every mock question type and every extra topic. Tired-but-rested beats wired-and-fried. Sleep is the last revision step.</p>
      <button id="plan-again" class="plan-btn">↺ Restart the night</button>
    </div>`;
  root.querySelector('#plan-again').addEventListener('click', () => { S = { started: true, idx: 0, remaining: PLAN[0].min * 60, paused: false, muted: S.muted, checked: {} }; save(); render(); });
  document.title = 'Done ✓ — DSP Cram';
}

function paintEta() {
  const eta = root && root.querySelector('#plan-eta');
  if (eta) eta.innerHTML = etaHtml();
}

function paintClock() {
  paintEta();
  const c = root && root.querySelector('#plan-clock');
  if (!c) return;
  const b = PLAN[S.idx];
  c.textContent = fmt(S.remaining);
  const fill = root.querySelector('#plan-fill');
  if (fill) fill.style.width = (100 * (1 - S.remaining / (b.min * 60))) + '%';
  const danger = b.type !== 'break' && S.remaining <= 120 && S.remaining > 0;
  root.classList.toggle('danger', danger);
  document.title = `${fmt(S.remaining)} · ${b.topic}`;
}

// --- Wiring -----------------------------------------------------------------
function wire(b) {
  const on = (id, fn) => { const el = root.querySelector(id); if (el) el.addEventListener('click', fn); };
  on('#plan-pause', () => { S.paused = !S.paused; save(); render(); });
  on('#plan-add', () => { S.remaining += 5 * 60; save(); paintClock(); });
  on('#plan-skip', () => goto(S.idx + 1));
  on('#plan-restart', () => { if (confirm('Restart the whole night from block 1?')) { S = { started: true, idx: 0, remaining: PLAN[0].min * 60, paused: false, muted: S.muted, checked: {} }; save(); render(); } });
  on('#plan-mute', () => { S.muted = !S.muted; save(); if (!S.muted) beep(1); render(); });
  for (const cb of root.querySelectorAll('input[data-check]')) {
    cb.addEventListener('change', () => {
      S.checked[cb.dataset.check] = cb.checked; save();
      cb.closest('.plan-task').classList.toggle('done', cb.checked);
    });
  }
  wireSchedule();
}

function wireSchedule() {
  for (const r of root.querySelectorAll('[data-jump]')) {
    r.addEventListener('click', () => { if (!S.started) S.started = true; goto(Number(r.dataset.jump)); });
  }
}

// Keyboard shortcuts (attached once)
let keysBound = false;
function bindKeys() {
  if (keysBound) return; keysBound = true;
  document.addEventListener('keydown', (e) => {
    if (!root || !root.isConnected || !S.started || S.idx >= PLAN.length) return;
    if (/^(INPUT|TEXTAREA|SUMMARY)$/.test(document.activeElement?.tagName || '')) return;
    if (e.code === 'Space') { e.preventDefault(); S.paused = !S.paused; save(); render(); }
    else if (e.key === 'n') goto(S.idx + 1);
    else if (e.key === 'm') { S.muted = !S.muted; save(); render(); }
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// --- Public mount -----------------------------------------------------------
export function mountPlan(container) {
  root = container;
  bindKeys();
  render();
  startTicker();
}
