// widgets.js — hosts interactive canvas widgets inside the Markdown notes.
//
// Notes are rendered with markdown-it `html:false`, so raw <canvas>/<script>
// would be escaped. Instead a note embeds a fenced block:
//
//     ```widget
//     convolution
//     { "optional": "json config on following lines" }
//     ```
//
// markdown-it renders that as <pre><code class="language-widget">…</code></pre>.
// After render, mountWidgets() finds those blocks, swaps each for a mount div,
// and lazily imports the matching widget module, calling its init(host, cfg).
//
// Each widget module exports `init(host, cfg)` and returns an object with a
// `destroy()` method (the createWidget() api from _kit.js already provides one).

const REGISTRY = {
  convolution:     () => import('./widgets/convolution.js'),
  'fourier-series':() => import('./widgets/fourier-series.js'),
  'pole-zero':     () => import('./widgets/pole-zero.js'),
  'dft-spectrum':  () => import('./widgets/dft-spectrum.js'),
  'filter-response':() => import('./widgets/filter-response.js'),
  'image-kernel':  () => import('./widgets/image-kernel.js'),
};

let active = [];   // mounted widget handles awaiting teardown

// Stop every running widget (RAF loops, observers). Called before each route.
export function destroyWidgets() {
  for (const w of active) { try { w && w.destroy && w.destroy(); } catch { /* ignore */ } }
  active = [];
}

// Parse a fence body: first non-empty line = widget id, remainder = JSON config.
function parseSpec(raw) {
  const lines = raw.split('\n');
  let id = '';
  let rest = [];
  for (let i = 0; i < lines.length; i++) {
    if (id === '' && lines[i].trim() !== '') { id = lines[i].trim(); rest = lines.slice(i + 1); }
  }
  let cfg = {};
  const json = rest.join('\n').trim();
  if (json) { try { cfg = JSON.parse(json); } catch { /* tolerate junk */ } }
  return { id, cfg };
}

// Find every ```widget block in `container`, replace it with a live widget.
export async function mountWidgets(container) {
  destroyWidgets();
  const blocks = container.querySelectorAll('pre > code.language-widget');
  for (const code of blocks) {
    const { id, cfg } = parseSpec(code.textContent || '');
    const host = document.createElement('div');
    host.className = 'widget';
    code.parentElement.replaceWith(host);

    const loader = REGISTRY[id];
    if (!loader) {
      host.innerHTML = `<div class="widget-err">Unknown widget: <code>${id || '(none)'}</code></div>`;
      continue;
    }
    try {
      const mod = await loader();
      const handle = mod.init(host, cfg) || null;
      if (handle) active.push(handle);
    } catch (err) {
      host.innerHTML = `<div class="widget-err">Widget failed to load: <code>${id}</code><br><small>${String(err)}</small></div>`;
    }
  }
}
