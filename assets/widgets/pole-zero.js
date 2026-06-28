// pole-zero.js — z-plane pole placement vs DTFT magnitude (stability).

import { createWidget, addSlider, THEME, clear, polyline, line, text } from './_kit.js';

function magAt(r, theta, w) {
  const cw = Math.cos(w), sw = Math.sin(w), ct = Math.cos(theta);
  const re = 1 - 2 * r * ct * cw + r * r * Math.cos(2 * w);
  const im = 2 * r * ct * sw - r * r * Math.sin(2 * w);
  const den = Math.hypot(re, im);
  return den > 1e-12 ? 1 / den : 0;
}

function drawCross(ctx, x, y, color, size = 7) {
  line(ctx, x - size, y - size, x + size, y + size, color, 2);
  line(ctx, x - size, y + size, x + size, y - size, color, 2);
}

export function init(host, cfg) {
  const api = createWidget(host, {
    title: 'Poles & frequency response',
    caption: 'Poles approaching the unit circle -> sharper resonant peak at ω = θ; poles ON/outside the circle -> unstable.',
    height: 340,
  });

  let r = 0.85;
  let theta = Math.PI / 4;

  addSlider(api.controls, {
    label: 'pole radius r', min: 0.10, max: 1.20, step: 0.01, value: r,
    format: (v) => v.toFixed(2),
    onInput: (v) => { r = v; api.redraw(); },
  });
  addSlider(api.controls, {
    label: 'pole angle θ', min: 0, max: 180, step: 1,
    value: Math.round(theta * 180 / Math.PI),
    format: (v) => `${v}°`,
    onInput: (v) => { theta = v * Math.PI / 180; api.redraw(); },
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H);

    const leftW = H;
    const cx = leftW / 2, cy = H / 2;
    const scale = (Math.min(leftW, H) / 2 - 32) / 1.3;

    // --- z-plane ---
    text(ctx, 'z-plane', 12, 20, THEME.dim, '12px sans-serif');
    line(ctx, 10, cy, leftW - 10, cy, THEME.axis, 1);
    line(ctx, cx, 28, cx, H - 36, THEME.axis, 1);
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, Math.PI * 2);
    ctx.strokeStyle = THEME.axis;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const poleCol = r >= 1 ? THEME.bad : THEME.accent;
    const zRe = r * Math.cos(theta), zIm = r * Math.sin(theta);
    drawCross(ctx, cx + zRe * scale, cy - zIm * scale, poleCol);
    drawCross(ctx, cx + zRe * scale, cy + zIm * scale, poleCol);

    if (r < 1) {
      text(ctx, 'stable (poles inside unit circle)', cx, H - 14, THEME.good, '10px sans-serif', 'center');
    } else {
      text(ctx, 'UNSTABLE', cx, H - 14, THEME.bad, '12px sans-serif', 'center');
    }

    line(ctx, leftW + 2, 12, leftW + 2, H - 12, THEME.border, 1);

    // --- |H(e^{jω})| for ω ∈ [0, π] ---
    const padL = leftW + 36, padR = 14, padT = 36, padB = 44;
    const plotW = Math.max(40, W - padL - padR);
    const plotH = H - padT - padB;
    const bot = padT + plotH;

    text(ctx, '|H(e^{jω})|', padL, 22, THEME.dim, '12px sans-serif');

    const N = 256;
    const mags = [];
    for (let i = 0; i <= N; i++) mags.push(magAt(r, theta, (i / N) * Math.PI));
    const yMax = Math.max(...mags, 1e-6);

    const pts = mags.map((m, i) => [
      padL + (i / N) * plotW,
      padT + plotH - (m / yMax) * plotH * 0.92,
    ]);
    polyline(ctx, pts, THEME.accent, 2);

    const peakW = Math.min(theta, Math.PI);
    const peakMag = magAt(r, theta, peakW);
    const pkX = padL + (peakW / Math.PI) * plotW;
    const pkY = padT + plotH - (peakMag / yMax) * plotH * 0.92;
    ctx.beginPath();
    ctx.arc(pkX, pkY, 4, 0, Math.PI * 2);
    ctx.fillStyle = THEME.accent2;
    ctx.fill();
    text(ctx, 'ω = θ', pkX, pkY - 10, THEME.accent2, '10px sans-serif', 'center');

    line(ctx, padL, bot, padL + plotW, bot, THEME.axis, 1);
    text(ctx, '0', padL, bot + 16, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'π', padL + plotW, bot + 16, THEME.dim, '10px sans-serif', 'center');
    text(ctx, 'ω', padL + plotW / 2, bot + 18, THEME.dim, '10px sans-serif', 'center');
  }

  api.onDraw(draw);
  api.redraw();
  return api;
}
