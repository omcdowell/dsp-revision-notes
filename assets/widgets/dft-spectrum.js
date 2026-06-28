// dft-spectrum.js — length-N signal and N-point DFT magnitude (leakage demo).

import { createWidget, addSlider, addToggle, THEME, clear, polyline, line, text } from './_kit.js';

const N = 64;
const A1 = 1, A2 = 0.6;

function buildX(f1, f2, tone2) {
  const x = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    x[n] = A1 * Math.cos((2 * Math.PI * f1 * n) / N);
    if (tone2) x[n] += A2 * Math.cos((2 * Math.PI * f2 * n) / N);
  }
  return x;
}

function dftMag(x) {
  const mag = new Float64Array(N / 2 + 1);
  for (let k = 0; k <= N / 2; k++) {
    let re = 0, im = 0;
    for (let n = 0; n < N; n++) {
      const a = (-2 * Math.PI * k * n) / N;
      re += x[n] * Math.cos(a);
      im += x[n] * Math.sin(a);
    }
    mag[k] = Math.hypot(re, im);
  }
  return mag;
}

export function init(host, cfg) {
  void cfg;
  const api = createWidget(host, {
    title: 'DFT — spectrum & leakage',
    caption: 'An INTEGER number of cycles per window lands on one clean bin; a non-integer frequency smears across bins (spectral leakage).',
    height: 340,
  });

  let f1 = 8.25, f2 = 12.5, tone2 = false;

  addSlider(api.controls, {
    label: 'tone 1 freq (cycles)', min: 0, max: 32, step: 0.25, value: f1,
    format: (v) => v.toFixed(2), onInput: (v) => { f1 = v; draw(); },
  });
  addSlider(api.controls, {
    label: 'tone 2 freq (cycles)', min: 0, max: 32, step: 0.25, value: f2,
    format: (v) => v.toFixed(2), onInput: (v) => { f2 = v; draw(); },
  });
  addToggle(api.controls, {
    label: 'tone 2 on', value: tone2, onChange: (b) => { tone2 = b; draw(); },
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H);
    const padL = 28, padR = 12, plotW = W - padL - padR;
    const topY = 138, botY = 308, split = 168;

    const x = buildX(f1, f2, tone2);
    const mag = dftMag(x);
    let xMax = 1e-9;
    for (let n = 0; n < N; n++) xMax = Math.max(xMax, Math.abs(x[n]));
    let mMax = 1e-9;
    for (let k = 0; k <= N / 2; k++) mMax = Math.max(mMax, mag[k]);

    const xOf = (n) => padL + (n / (N - 1)) * plotW;
    const kOf = (k) => padL + (k / (N / 2)) * plotW;
    const ampH = 88;

    text(ctx, 'x[n]', padL, 22, THEME.dim, '13px sans-serif');
    line(ctx, padL, topY, W - padR, topY, THEME.axis, 1);
    const pts = [];
    for (let n = 0; n < N; n++) pts.push([xOf(n), topY - (x[n] / xMax) * ampH]);
    polyline(ctx, pts, THEME.accent, 1.5);
    for (let n = 0; n < N; n += 8) text(ctx, String(n), xOf(n), topY + 14, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'n', W - padR, topY + 14, THEME.dim, '11px sans-serif', 'right');

    line(ctx, padL, split, W - padR, split, THEME.grid, 1);
    text(ctx, '|X[k]|', padL, split + 20, THEME.dim, '13px sans-serif');
    line(ctx, padL, botY, W - padR, botY, THEME.axis, 1);
    const barW = Math.max(1, plotW / (N / 2 + 1) - 1);
    for (let k = 0; k <= N / 2; k++) {
      const cx = kOf(k);
      const h = (mag[k] / mMax) * ampH;
      ctx.fillStyle = THEME.good;
      ctx.fillRect(cx - barW / 2, botY - h, barW, h);
    }
    for (let k = 0; k <= N / 2; k += 8) text(ctx, String(k), kOf(k), botY + 14, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'k', W - padR, botY + 14, THEME.dim, '11px sans-serif', 'right');
    void H;
  }

  api.onDraw(draw);
  draw();
  return api;
}
