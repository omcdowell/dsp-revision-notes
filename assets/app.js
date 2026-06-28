import markdownit from 'https://esm.sh/markdown-it@14';
import texmath from 'https://esm.sh/markdown-it-texmath@1';
import katex from 'https://esm.sh/katex@0.16';
import { mountPlan } from './plan.js';
import { mountWidgets, destroyWidgets } from './widgets.js';

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

  // Pinned: the in-app cram timer (special #plan route, not a markdown note).
  const planGroup = document.createElement('div');
  planGroup.className = 'nav-group';
  const planHeading = document.createElement('h2');
  planHeading.className = 'nav-group-title';
  planHeading.textContent = 'Cram';
  planGroup.appendChild(planHeading);
  const planUl = document.createElement('ul');
  planUl.className = 'nav-list';
  const planLi = document.createElement('li');
  const planA = document.createElement('a');
  planA.className = 'nav-link nav-link-plan';
  planA.href = '#plan';
  planA.textContent = '🕒 Tonight’s Cram Plan';
  planA.dataset.file = 'plan';
  planA.dataset.title = 'tonight cram plan timer';
  planA.addEventListener('click', () => closeMobileNav());
  planLi.appendChild(planA);
  planUl.appendChild(planLi);
  planGroup.appendChild(planUl);
  navEl.appendChild(planGroup);

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
// Hash is `#<file>` or `#<file>::<anchor>` (the latter deep-links to e.g. a
// widget — the cram plan uses `#<file>::demo` to jump straight to the demo).
function parseHash() {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const i = raw.indexOf('::');
  if (i === -1) return { file: raw, anchor: '' };
  return { file: raw.slice(0, i), anchor: raw.slice(i + 2) };
}
function currentFile() {
  return parseHash().file || (notes[0] && notes[0].file) || '';
}

async function route() {
  destroyWidgets();
  const file = currentFile();
  if (!file) {
    contentEl.innerHTML = '<div class="error">No notes available.</div>';
    return;
  }
  setActive(file);
  if (file === 'plan') {
    contentEl.innerHTML = '';
    mountPlan(contentEl);
    return;
  }
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
    await mountWidgets(contentEl);
    scrollToAnchor();
  } catch (err) {
    contentEl.innerHTML = `<div class="error">Could not load note: <code>${escapeHtml(file)}</code><br /><small>${escapeHtml(String(err))}</small></div>`;
  }
}

// Honour a `::anchor` deep-link. `demo` is special — it scrolls to the first
// interactive widget on the page regardless of its id.
function scrollToAnchor() {
  const { anchor } = parseHash();
  if (!anchor) return;
  const el = anchor === 'demo'
    ? contentEl.querySelector('.widget')
    : document.getElementById(anchor);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
