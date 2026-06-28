// convolution.js — discrete convolution as flip-and-slide. (Reference widget.)
//
// Shows y[n] = Σ_k x[k]·h[n−k]: x[k] fixed, h[n−k] flipped and slid to position
// n, the overlap shaded, and y[n] building up in the lower panel as you step n.
//
// This is the reference implementation for the widget contract — every other
// widget follows the same shape: import the kit, createWidget, draw, add controls.

import { createWidget, addSlider, addButton, THEME, clear, stem, line, text } from './_kit.js';

const x = [1, 2, 3, 2, 1];   // input  x[0..4]  (triangle)
const h = [1, 1, 1];         // impulse response h[0..2] (3-tap moving sum)
const L = x.length + h.length - 1;            // output length = 7
const y = Array.from({ length: L }, (_, n) => {
  let s = 0;
  for (let k = 0; k < x.length; k++) { const j = n - k; if (j >= 0 && j < h.length) s += x[k] * h[j]; }
  return s;
});
const yMax = Math.max(...y);

export function init(host) {
  const api = createWidget(host, {
    title: 'Convolution — flip, shift, multiply, sum',
    caption: 'x[n] = {1,2,3,2,1} ∗ h[n] = {1,1,1}. Step n to slide the flipped h[n−k] across x[k]; the shaded overlap is what gets summed into y[n].',
    height: 360,
  });

  let n = 0;
  let playing = false;
  let lastStep = 0;

  const kMin = -h.length, kMax = x.length + 1;   // visible k-axis
  const slider = addSlider(api.controls, {
    label: 'shift n', min: 0, max: L - 1, step: 1, value: 0,
    format: (v) => `n = ${v}`, onInput: (v) => { n = v; draw(); },
  });
  const playBtn = addButton(api.controls, {
    label: '▶ Play', onClick: (b) => { playing = !playing; b.textContent = playing ? '⏸ Pause' : '▶ Play'; },
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H);
    const padL = 20, padR = 16;
    const plotW = W - padL - padR;
    const xOf = (k) => padL + ((k - kMin) / (kMax - kMin)) * plotW;
    const topY = 96, botY = 300;     // baselines of the two panels
    const unit = 26;                 // px per unit amplitude (top)
    const unitY = 22;                // px per unit amplitude (bottom, larger range)

    // ---- top panel: x[k] and the flipped/shifted h[n-k] ----
    text(ctx, 'x[k]  and  h[n−k]', padL, 24, THEME.dim, '13px sans-serif');
    line(ctx, padL, topY, W - padR, topY, THEME.axis, 1);

    // shade the overlap columns (k where both x[k] and h[n-k] are nonzero)
    for (let k = 0; k < x.length; k++) {
      const j = n - k;
      if (j >= 0 && j < h.length) {
        const cx = xOf(k);
        ctx.fillStyle = 'rgba(86,212,221,0.12)';
        ctx.fillRect(cx - 11, 36, 22, botY - 36 - 6);
      }
    }

    // x[k] stems (blue)
    for (let k = 0; k < x.length; k++) stem(ctx, xOf(k), topY, topY - x[k] * unit, THEME.accent, 3.5);
    // h[n-k] stems (amber) — flipped + shifted
    for (let k = kMin; k <= kMax; k++) {
      const j = n - k;
      if (j >= 0 && j < h.length) stem(ctx, xOf(k), topY, topY - h[j] * unit, THEME.accent2, 3.5);
    }
    // k tick labels
    for (let k = kMin; k <= kMax; k++) text(ctx, String(k), xOf(k), topY + 16, THEME.dim, '10px sans-serif', 'center');

    // the running multiply-add for this n
    const terms = [];
    let acc = 0;
    for (let k = 0; k < x.length; k++) { const j = n - k; if (j >= 0 && j < h.length) { terms.push(`${x[k]}·${h[j]}`); acc += x[k] * h[j]; } }
    text(ctx, `y[${n}] = ${terms.join(' + ') || '0'} = ${acc}`, padL, 162, THEME.heading, '14px sans-serif');

    // legend
    text(ctx, '■ x[k]', W - padR - 120, 24, THEME.accent, '12px sans-serif');
    text(ctx, '■ h[n−k]', W - padR - 60, 24, THEME.accent2, '12px sans-serif');

    // ---- bottom panel: y[n] building up ----
    text(ctx, 'y[n] = x ∗ h', padL, 196, THEME.dim, '13px sans-serif');
    line(ctx, padL, botY, W - padR, botY, THEME.axis, 1);
    const yStep = plotW / (L + 1);
    for (let m = 0; m < L; m++) {
      const cx = padL + (m + 1) * yStep;
      const filled = m <= n;
      const col = m === n ? THEME.cyan : (filled ? THEME.good : THEME.border);
      stem(ctx, cx, botY, botY - (filled ? y[m] : 0) * unitY, col, m === n ? 4.5 : 3);
      if (filled) text(ctx, String(y[m]), cx, botY - y[m] * unitY - 8, col, '11px sans-serif', 'center');
      text(ctx, String(m), cx, botY + 16, THEME.dim, '10px sans-serif', 'center');
    }
    void yMax;
  }

  api.onDraw(draw);
  api.animate((t) => {
    if (playing && t - lastStep > 0.85) {
      lastStep = t;
      n = (n + 1) % L;
      slider.set(n);
      draw();
    }
  });
  draw();
  return api;   // api.destroy() stops the RAF loop + observer
}
