// _kit.js — shared toolkit for the interactive "3b1b-style" note widgets.
//
// Every widget is a tiny ES module exporting `init(host, cfg)` and is loaded
// on demand by ../widgets.js when a ```widget fence appears in a note. The kit
// handles the fiddly bits — HiDPI canvas, the requestAnimationFrame lifecycle,
// responsive resize, theming, and styled controls — so a widget is just draw
// logic + a few sliders.
//
// Pure canvas, zero dependencies, zero build step (matches the rest of the site).

// Theme — mirrors the CSS custom properties in assets/style.css.
export const THEME = {
  bg: '#0f1419', panel: '#161b22', code: '#1c2330', border: '#2a313c',
  text: '#d7dde5', dim: '#9aa4b2', heading: '#f0f4f9',
  accent: '#4ea1ff', accent2: '#e3b341', good: '#3fb950', bad: '#ff6b6b',
  purple: '#bc8cff', cyan: '#56d4dd',
  grid: 'rgba(255,255,255,0.06)', axis: 'rgba(215,221,229,0.40)',
};

// createWidget(host, opts) → the widget chrome + a drawing/animation surface.
//
//   opts.title    string  heading shown above the canvas
//   opts.caption  string  small dim line under the controls
//   opts.height   number  CSS pixel height of the canvas (default 300)
//
// Returns an api:
//   api.ctx, api.canvas        2D context + element (already DPR-scaled — draw in CSS px)
//   api.W, api.H               current canvas size in CSS px (getters)
//   api.controls               the controls row element (pass to addSlider/etc.)
//   api.onDraw(fn)             register a static redraw fn (called on resize too)
//   api.redraw()               invoke the registered draw fn now
//   api.animate(fn)            start a RAF loop; fn(t) gets elapsed seconds
//   api.stop()                 stop the RAF loop
//   api.destroy()              full teardown (called by the host on route change)
export function createWidget(host, opts = {}) {
  const { title = '', caption = '', height = 300 } = opts;
  host.classList.add('widget');

  if (title) {
    const h = document.createElement('div');
    h.className = 'widget-title';
    h.textContent = title;
    host.appendChild(h);
  }

  const stage = document.createElement('div');
  stage.className = 'widget-stage';
  const canvas = document.createElement('canvas');
  canvas.className = 'widget-canvas';
  stage.appendChild(canvas);
  host.appendChild(stage);

  const controls = document.createElement('div');
  controls.className = 'widget-controls';
  host.appendChild(controls);

  if (caption) {
    const c = document.createElement('div');
    c.className = 'widget-caption';
    c.textContent = caption;
    host.appendChild(c);
  }

  const ctx = canvas.getContext('2d');
  const H = height;
  let W = 600;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let drawFn = null;
  let rafId = 0;
  let running = false;
  let startTs = 0;

  function resize() {
    const next = Math.max(220, Math.floor(stage.clientWidth || host.clientWidth || 600));
    W = next;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (drawFn) drawFn();
  }

  let ro = null;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => resize());
    ro.observe(stage);
  } else {
    window.addEventListener('resize', resize);
  }

  const api = {
    canvas, ctx, controls,
    get W() { return W; },
    get H() { return H; },
    onDraw(fn) { drawFn = fn; },
    redraw() { if (drawFn) drawFn(); },
    animate(fn) {
      running = true;
      startTs = 0;
      const step = (ts) => {
        if (!running) return;
        if (!startTs) startTs = ts;
        fn((ts - startTs) / 1000);
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    },
    stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    },
    destroy() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
    },
  };

  // Defer the first sizing one frame so the stage has a measured width.
  requestAnimationFrame(resize);
  return api;
}

// --- Controls ---------------------------------------------------------------

// addSlider(controls, {label, min, max, step, value, format, onInput}) → handle
//   format(v) → string shown to the right (default: the number)
//   onInput(v) called on every change with the numeric value
//   handle.get() / handle.set(v) / handle.input
export function addSlider(controls, o) {
  const wrap = document.createElement('label');
  wrap.className = 'widget-ctl';
  const lab = document.createElement('span');
  lab.className = 'widget-ctl-label';
  lab.textContent = o.label;
  const input = document.createElement('input');
  input.type = 'range';
  input.className = 'widget-range';
  input.min = o.min; input.max = o.max;
  input.step = o.step != null ? o.step : 1;
  input.value = o.value;
  const val = document.createElement('span');
  val.className = 'widget-ctl-val';
  const fmt = o.format || ((v) => String(v));
  const sync = () => { val.textContent = fmt(Number(input.value)); };
  input.addEventListener('input', () => { sync(); o.onInput(Number(input.value)); });
  sync();
  wrap.appendChild(lab); wrap.appendChild(input); wrap.appendChild(val);
  controls.appendChild(wrap);
  return { get: () => Number(input.value), set: (v) => { input.value = v; sync(); }, input };
}

// addSelect(controls, {label, options:[{value,label}]|[string], value, onChange}) → handle
export function addSelect(controls, o) {
  const wrap = document.createElement('label');
  wrap.className = 'widget-ctl';
  const lab = document.createElement('span');
  lab.className = 'widget-ctl-label';
  lab.textContent = o.label;
  const sel = document.createElement('select');
  sel.className = 'widget-select';
  for (const opt of o.options) {
    const e = document.createElement('option');
    if (typeof opt === 'string') { e.value = opt; e.textContent = opt; }
    else { e.value = opt.value; e.textContent = opt.label; }
    sel.appendChild(e);
  }
  if (o.value != null) sel.value = o.value;
  sel.addEventListener('change', () => o.onChange(sel.value));
  wrap.appendChild(lab); wrap.appendChild(sel);
  controls.appendChild(wrap);
  return { get: () => sel.value, set: (v) => { sel.value = v; }, select: sel };
}

// addButton(controls, {label, onClick}) → the <button> (its .textContent is yours to mutate)
export function addButton(controls, o) {
  const b = document.createElement('button');
  b.className = 'widget-btn';
  b.type = 'button';
  b.textContent = o.label;
  b.addEventListener('click', () => o.onClick(b));
  controls.appendChild(b);
  return b;
}

// addToggle(controls, {label, value, onChange}) → handle for a checkbox
export function addToggle(controls, o) {
  const wrap = document.createElement('label');
  wrap.className = 'widget-ctl widget-ctl-toggle';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = !!o.value;
  const lab = document.createElement('span');
  lab.className = 'widget-ctl-label';
  lab.textContent = o.label;
  input.addEventListener('change', () => o.onChange(input.checked));
  wrap.appendChild(input); wrap.appendChild(lab);
  controls.appendChild(wrap);
  return { get: () => input.checked, set: (v) => { input.checked = v; }, input };
}

// --- Tiny drawing helpers ----------------------------------------------------

export function clear(ctx, W, H, color) {
  ctx.clearRect(0, 0, W, H);
  if (color) { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }
}

// Stroke a polyline through [[x,y],...] points.
export function polyline(ctx, pts, color, width = 2) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = width;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.stroke();
}

// A discrete-signal stem ("lollipop") at (x) from baseline y0 to y, with a dot.
export function stem(ctx, x, y0, y, color, dot = 3) {
  ctx.beginPath();
  ctx.moveTo(x, y0); ctx.lineTo(x, y);
  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, dot, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width = 1) {
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}

export function text(ctx, str, x, y, color, font = '12px -apple-system, sans-serif', align = 'left') {
  ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align;
  ctx.fillText(str, x, y);
  ctx.textAlign = 'left';
}
