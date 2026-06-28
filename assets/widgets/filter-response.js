// filter-response.js — windowed-sinc FIR lowpass: impulse + magnitude response.

import { createWidget, addSlider, addSelect, THEME, clear, polyline, stem, line, text } from './_kit.js';

function windowW(type, n, N) {
  const p = (2 * Math.PI * n) / (N - 1);
  if (type === 'hamming') return 0.54 - 0.46 * Math.cos(p);
  if (type === 'hanning') return 0.5 - 0.5 * Math.cos(p);
  if (type === 'blackman') return 0.42 - 0.5 * Math.cos(p) + 0.08 * Math.cos(2 * p);
  return 1;
}

function firCoeffs(N, wc, win) {
  const a = (N - 1) / 2;
  const h = new Array(N);
  for (let n = 0; n < N; n++) {
    const d = n - a;
    const hd = Math.abs(d) < 1e-9 ? wc / Math.PI : Math.sin(wc * d) / (Math.PI * d);
    h[n] = hd * windowW(win, n, N);
  }
  return h;
}

function magDb(h, w, floor = -80) {
  let re = 0, im = 0;
  for (let n = 0; n < h.length; n++) {
    re += h[n] * Math.cos(w * n);
    im -= h[n] * Math.sin(w * n);
  }
  const m = Math.hypot(re, im);
  return m > 0 ? Math.max(floor, 20 * Math.log10(m)) : floor;
}

export function init(host, cfg) {
  const api = createWidget(host, {
    title: 'FIR lowpass — windowed sinc',
    caption: 'Rectangular window → sharp transition but big Gibbs ripple; Hamming/Blackman → smoother stopband, wider transition. More taps → narrower transition.',
    height: 360,
  });

  const wcSlider = addSlider(api.controls, {
    label: 'cutoff ωc (×π)', min: 0.05, max: 0.95, step: 0.01, value: 0.25,
    format: (v) => v.toFixed(2) + 'π',
    onInput: () => api.redraw(),
  });
  const nSlider = addSlider(api.controls, {
    label: 'taps N', min: 7, max: 81, step: 2, value: 31,
    format: (v) => String(Math.round(v)),
    onInput: () => api.redraw(),
  });
  const winSelect = addSelect(api.controls, {
    label: 'window',
    options: [
      { value: 'rect', label: 'Rectangular' },
      { value: 'hamming', label: 'Hamming' },
      { value: 'hanning', label: 'Hanning' },
      { value: 'blackman', label: 'Blackman' },
    ],
    value: 'hamming',
    onChange: () => api.redraw(),
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H);
    const padL = 40, padR = 14, plotW = W - padL - padR;
    const topBase = 148, botBase = H - 32;
    const wc = wcSlider.get() * Math.PI;
    const N = Math.round(nSlider.get());
    const h = firCoeffs(N, wc, winSelect.get());
    const hMax = Math.max(...h.map(Math.abs), 1e-9);

    text(ctx, 'h[n]', padL, 20, THEME.dim, '13px sans-serif');
    line(ctx, padL, topBase, W - padR, topBase, THEME.axis, 1);
    const dx = plotW / N;
    for (let n = 0; n < N; n++) {
      const x = padL + (n + 0.5) * dx;
      stem(ctx, x, topBase, topBase - (h[n] / hMax) * 110, THEME.accent, 2.5);
    }
    text(ctx, '0', padL + 0.5 * dx, topBase + 14, THEME.dim, '10px sans-serif', 'center');
    text(ctx, String(N - 1), padL + (N - 0.5) * dx, topBase + 14, THEME.dim, '10px sans-serif', 'center');

    text(ctx, '|H(e^{jω})| dB', padL, 178, THEME.dim, '13px sans-serif');
    const dbTop = 5, dbBot = -60, plotH = botBase - 198;
    const wX = (w) => padL + (w / Math.PI) * plotW;
    const dY = (db) => botBase - ((db - dbBot) / (dbTop - dbBot)) * plotH;

    line(ctx, padL, dY(0), W - padR, dY(0), THEME.grid, 1);
    text(ctx, '0 dB', padL - 4, dY(0) + 4, THEME.dim, '10px sans-serif', 'right');
    for (const g of [-20, -40]) {
      line(ctx, padL, dY(g), W - padR, dY(g), THEME.grid, 1);
      text(ctx, g + ' dB', padL - 4, dY(g) + 4, THEME.dim, '10px sans-serif', 'right');
    }
    line(ctx, padL, botBase, W - padR, botBase, THEME.axis, 1);
    line(ctx, wX(wc), 192, wX(wc), botBase, 'rgba(78,161,255,0.35)', 1);

    const pts = [];
    const steps = Math.min(256, Math.floor(plotW));
    for (let i = 0; i <= steps; i++) {
      const w = (i / steps) * Math.PI;
      pts.push([wX(w), dY(magDb(h, w))]);
    }
    polyline(ctx, pts, THEME.good, 2);

    text(ctx, '0', padL, botBase + 14, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'π/2', wX(Math.PI / 2), botBase + 14, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'π', W - padR, botBase + 14, THEME.dim, '10px sans-serif', 'center');
  }

  api.onDraw(draw);
  api.redraw();
  return api;
}
