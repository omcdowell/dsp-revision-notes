import markdownit from 'https://esm.sh/markdown-it@14';
import texmath from 'https://esm.sh/markdown-it-texmath@1';
import katex from 'https://esm.sh/katex@0.16';

const md = markdownit({ html: false, linkify: true, typographer: false })
  .use(texmath, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: { throwOnError: false, strict: false }
  });

const sidebarTitle = document.getElementById('site-title');
const navEl = document.getElementById('nav');
const contentEl = document.getElementById('content');
const searchEl = document.getElementById('search');
const sidebarEl = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

let notes = [];

// --- Load manifest, build sidebar ------------------------------------------
async function init() {
  try {
    const res = await fetch('notes/manifest.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const manifest = await res.json();

    if (manifest.title) {
      sidebarTitle.textContent = manifest.title;
      document.title = manifest.title;
    }
    notes = Array.isArray(manifest.notes) ? manifest.notes : [];
    buildNav(notes);
    route();
  } catch (err) {
    contentEl.innerHTML = `<div class="error">Could not load notes index. <small>${escapeHtml(String(err))}</small></div>`;
  }
}

function buildNav(list) {
  navEl.innerHTML = '';
  // Preserve category order as first seen in the manifest.
  const categories = [];
  const groups = new Map();
  for (const note of list) {
    const cat = note.category || 'Notes';
    if (!groups.has(cat)) {
      groups.set(cat, []);
      categories.push(cat);
    }
    groups.get(cat).push(note);
  }

  for (const cat of categories) {
    const section = document.createElement('div');
    section.className = 'nav-group';

    const heading = document.createElement('h2');
    heading.className = 'nav-group-title';
    heading.textContent = cat;
    section.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'nav-list';
    for (const note of groups.get(cat)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = `#${encodeURIComponent(note.file)}`;
      a.textContent = note.title;
      a.dataset.file = note.file;
      a.dataset.title = (note.title || '').toLowerCase();
      a.addEventListener('click', () => closeMobileNav());
      li.appendChild(a);
      ul.appendChild(li);
    }
    section.appendChild(ul);
    navEl.appendChild(section);
  }
}

// --- Routing ----------------------------------------------------------------
function currentFile() {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return hash || (notes[0] && notes[0].file) || '';
}

async function route() {
  const file = currentFile();
  if (!file) {
    contentEl.innerHTML = '<div class="error">No notes available.</div>';
    return;
  }
  setActive(file);
  await loadNote(file);
}

async function loadNote(file) {
  contentEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const res = await fetch(`notes/${file}`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    contentEl.innerHTML = `<article class="note">${md.render(text)}</article>`;
    contentEl.scrollTop = 0;
    window.scrollTo(0, 0);
  } catch (err) {
    contentEl.innerHTML = `<div class="error">Could not load note: <code>${escapeHtml(file)}</code><br /><small>${escapeHtml(String(err))}</small></div>`;
  }
}

function setActive(file) {
  for (const a of navEl.querySelectorAll('.nav-link')) {
    a.classList.toggle('active', a.dataset.file === file);
  }
}

// --- Search / filter --------------------------------------------------------
searchEl.addEventListener('input', () => {
  const q = searchEl.value.trim().toLowerCase();
  for (const group of navEl.querySelectorAll('.nav-group')) {
    let anyVisible = false;
    for (const li of group.querySelectorAll('.nav-list li')) {
      const a = li.querySelector('.nav-link');
      const match = !q || (a.dataset.title || '').includes(q);
      li.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    }
    group.style.display = anyVisible ? '' : 'none';
  }
});

// --- Mobile nav -------------------------------------------------------------
menuToggle.addEventListener('click', () => {
  const open = sidebarEl.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

function closeMobileNav() {
  sidebarEl.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

// --- Utils ------------------------------------------------------------------
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

window.addEventListener('hashchange', route);
init();
