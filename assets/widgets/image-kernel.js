// image-kernel.js — 3×3 spatial filtering on a synthetic grayscale image.
import { createWidget, addSelect, THEME, clear, text } from './_kit.js';

const S = 128;
const KERNELS = {
  Identity: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  'Box blur': [1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => 1 / 9),
  Gaussian: [1, 2, 1, 2, 4, 2, 1, 2, 1].map((v) => v / 16),
  Sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  'Edge (Laplacian)': [-1, -1, -1, -1, 8, -1, -1, -1, -1],
  'Sobel X': [-1, 0, 1, -2, 0, 2, -1, 0, 1],
  Emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
};

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function buildImg() {
  const img = new Float32Array(S * S);
  const cx = S * 0.65, cy = S * 0.35, r2 = (S * 0.18) ** 2;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let v = ((x + y) / (2 * S - 2)) * 180;
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r2) v = 255;
      if (x >= 10 && x < 40 && y >= 80 && y < 110) v = 40;
      if (x >= 90 && x < 120 && y >= 90 && y < 120) v = 200;
      if (x >= S / 2 - 2 && x < S / 2 + 2) v = x < S / 2 ? 30 : 220;
      img[y * S + x] = clamp(v, 0, 255);
    }
  }
  return img;
}

function convolve(src, k) {
  const out = new Float32Array(S * S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const iy = clamp(y + dy, 0, S - 1);
          const ix = clamp(x + dx, 0, S - 1);
          s += src[iy * S + ix] * k[(dy + 1) * 3 + (dx + 1)];
        }
      }
      out[y * S + x] = clamp(s, 0, 255);
    }
  }
  return out;
}

function toCanvas(arr) {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  const id = ctx.createImageData(S, S);
  const d = id.data;
  for (let i = 0; i < S * S; i++) {
    const g = arr[i] | 0;
    const j = i * 4;
    d[j] = d[j + 1] = d[j + 2] = g;
    d[j + 3] = 255;
  }
  ctx.putImageData(id, 0, 0);
  return c;
}

export function init(host, cfg) {
  void cfg;
  const api = createWidget(host, {
    title: 'Spatial filtering — 3×3 kernels',
    caption: 'blur kernels average neighbours; sharpen/Laplacian/Sobel emphasise differences (edges).',
    height: 300,
  });

  const src = buildImg();
  const srcCanvas = toCanvas(src);
  let filtCanvas = toCanvas(convolve(src, KERNELS.Gaussian));

  const kernelSel = addSelect(api.controls, {
    label: 'kernel',
    options: Object.keys(KERNELS).map((k) => ({ value: k, label: k })),
    value: 'Gaussian',
    onChange: (v) => { filtCanvas = toCanvas(convolve(src, KERNELS[v])); draw(); },
  });

  function draw() {
    const { ctx, W, H } = api;
    clear(ctx, W, H, THEME.bg);
    const pad = 12, gap = 16;
    const halfW = (W - 2 * pad - gap) / 2;
    const drawH = H - 50;
    const scale = Math.min(halfW / S, drawH / S);
    const dw = S * scale, dh = S * scale;
    const y0 = 32 + (drawH - dh) / 2;
    const xL = pad + (halfW - dw) / 2;
    const xR = pad + halfW + gap + (halfW - dw) / 2;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(srcCanvas, xL, y0, dw, dh);
    ctx.drawImage(filtCanvas, xR, y0, dw, dh);
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(xL, y0, dw, dh);
    ctx.strokeRect(xR, y0, dw, dh);
    text(ctx, 'original', xL + dw / 2, 20, THEME.dim, '12px sans-serif', 'center');
    text(ctx, kernelSel.get(), xR + dw / 2, 20, THEME.accent, '12px sans-serif', 'center');
  }

  api.onDraw(draw);
  api.redraw();
  return api;
}
