// fourier-series.js — square wave from odd harmonics (Gibbs phenomenon).

import { createWidget, addSlider, addButton, addToggle, THEME, clear, polyline, line, text } from './_kit.js';

const T0 = 2 * Math.PI;
const COEFF = 4 / Math.PI;
const NPTS = 480;

function partialSum(N, t) {
  let s = 0;
  for (let n = 0; n < N; n++) {
    const k = 2 * n + 1;
    s += (COEFF / k) * Math.sin(k * t);
  }
  return s;
}

function harmonic(N, t) {
  const k = 2 * N + 1;
  return (COEFF / k) * Math.sin(k * t);
}

export function init(host, cfg) {
  const api = createWidget(host, {
    title: 'Fourier series — square wave from harmonics',
    caption: 'More harmonics sharpen the edges, but the ~9% Gibbs overshoot at each jump never vanishes — it only narrows.',
    height: 320,
  });

  let N = 5;
  let showHarmonics = false;
  let playing = false;
  let lastStep = 0;

  const slider = addSlider(api.controls, {
    label: 'harmonics', min: 1, max: 30, step: 1, value: 5,
    format: (v) => `N = ${v}`, onInput: (v) => { N = v; draw(); },
  });
  addToggle(api.controls, {
    label: 'show harmonics', value: false,
    onChange: (b) => { showHarmonics = b; draw(); },
  });
  const playBtn = addButton(api.controls, {
    label: '▶ Animate',
    onClick: (b) => { playing = !playing; b.textContent = playing ? '⏸ Pause' : '▶ Animate'; lastStep = 0; },
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H);
    const padL = 36, padR = 16, midY = H / 2, amp = 0.42 * H;
    const plotW = W - padL - padR;
    const tOf = (t) => padL + (t / T0) * plotW;
    const yOf = (v) => midY - v * amp;

    line(ctx, padL, midY, W - padR, midY, THEME.axis, 1);
    text(ctx, '0', padL, midY + 16, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'π', tOf(Math.PI), midY + 16, THEME.dim, '10px sans-serif', 'center');
    text(ctx, '2π', W - padR, midY + 16, THEME.dim, '10px sans-serif', 'right');
    text(ctx, '+1', padL - 6, yOf(1), THEME.dim, '10px sans-serif', 'right');
    text(ctx, '−1', padL - 6, yOf(-1), THEME.dim, '10px sans-serif', 'right');

    // ideal square wave (faint, with gap at jumps)
    polyline(ctx, [[tOf(0), yOf(1)], [tOf(Math.PI - 1e-4), yOf(1)]], THEME.dim, 1);
    polyline(ctx, [[tOf(Math.PI + 1e-4), yOf(-1)], [tOf(T0), yOf(-1)]], THEME.dim, 1);

    const ts = Array.from({ length: NPTS }, (_, i) => (i / (NPTS - 1)) * T0);

    if (showHarmonics) {
      for (let n = 0; n < N; n++) {
        const pts = ts.map((t) => [tOf(t), yOf(harmonic(n, t))]);
        polyline(ctx, pts, 'rgba(188,140,255,0.35)', 1);
      }
    }

    const sumPts = ts.map((t) => [tOf(t), yOf(partialSum(N, t))]);
    polyline(ctx, sumPts, THEME.accent, 2.5);
    text(ctx, `Σ (N=${N} odd)`, W - padR, 22, THEME.accent, '12px sans-serif', 'right');
    text(ctx, 'ideal', padL, 22, THEME.dim, '12px sans-serif');
  }

  api.onDraw(draw);
  api.animate((t) => {
    if (playing && t - lastStep > 0.5) {
      lastStep = t;
      N = N >= 30 ? 1 : N + 1;
      slider.set(N);
      draw();
    }
  });
  api.redraw();
  return api;
}
