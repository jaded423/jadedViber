// Command palette — press "/" (or Ctrl+K), tap the "/" chip in the nav, or open #search.
// Jumps between pages. A query that matches nothing on the site but reads "turing" opens the tribute.
(function () {
  'use strict';

  const PAGES = [
    { name: 'Home',                     hint: 'the front door',                       href: '/' },
    { name: 'Work',                     hint: 'systems built for real businesses',    href: '/work/' },
    { name: 'Photos to product pages',  hint: 'work · the unattended pipeline',       href: '/work/photo-to-web.html' },
    { name: 'Blog from a Google Doc',   hint: 'work · Point 4, Doc to Webflow',       href: '/work/blog-from-a-doc.html' },
    { name: 'Compliance portal',        hint: 'work · TCT, the batch trail',          href: '/work/compliance-portal.html' },
    { name: 'Projects',                 hint: 'tools and open source',                href: '/#projects' },
    { name: 'PhotoEditor',              hint: 'projects · bulk product photos',       href: '/projects/photo-editor.html' },
    { name: 'Philosophy',               hint: 'why everything here came out of a chat', href: '/#philosophy' },
    { name: 'Stack',                    hint: 'editor · terminal · AI',               href: '/#stack' },
    { name: 'Homelab',                  hint: 'the Proxmox cluster',                  href: '/homelab.html' },
    { name: 'Now',                      hint: 'what I am building this month',        href: '/now.html' },
    { name: 'Now archive',              hint: 'every /now since the start',           href: '/now-archive.html' },
    { name: 'GitHub',                   hint: 'github.com/jaded423',                  href: 'https://github.com/jaded423', ext: true },
  ];

  const CSS = `
    .nav-right { display: flex; align-items: center; gap: 0.75rem; }
    .nav-palette {
      background: #12121a; border: 1px solid #2a2a3a; color: #6272a4; cursor: pointer;
      font-family: inherit; font-size: 0.8rem; line-height: 1; padding: 0.35rem 0.6rem; border-radius: 5px;
      transition: all 0.2s ease;
    }
    .nav-palette:hover { color: #50fa7b; border-color: #50fa7b; }
    .pal-backdrop {
      position: fixed; inset: 0; background: rgba(10,10,10,0.82); backdrop-filter: blur(6px);
      z-index: 1000; display: flex; align-items: flex-start; justify-content: center; padding: 12vh 1rem 2rem;
      opacity: 0; transition: opacity 0.15s ease;
    }
    .pal-backdrop.show { opacity: 1; }
    .pal {
      width: 100%; max-width: 560px; background: #0e0e12; border: 1px solid #2a2a3a; border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6); overflow: hidden;
      transform: translateY(-8px); transition: transform 0.15s ease;
    }
    .pal-backdrop.show .pal { transform: none; }
    .pal-input-row { display: flex; align-items: center; gap: 0.6rem; padding: 0.9rem 1rem; border-bottom: 1px solid #1a1a24; }
    .pal-input-row .slash { color: #50fa7b; font-weight: 700; }
    .pal-input {
      flex: 1; background: transparent; border: none; outline: none; color: #f8f8f2;
      font-family: inherit; font-size: 1.05rem;
    }
    .pal-input::placeholder { color: #6272a4; }
    .pal-list { list-style: none; margin: 0; padding: 0.4rem 0; max-height: 50vh; overflow-y: auto; }
    .pal-item { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 0.55rem 1rem; cursor: pointer; color: #d8d8d2; }
    .pal-item .hint { color: #6272a4; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pal-item.active { background: #16161f; color: #8be9fd; }
    .pal-item.active .hint { color: #bd93f9; }
    .pal-empty { padding: 1rem; color: #6272a4; font-size: 0.9rem; }
    .pal-foot { display: flex; gap: 1rem; padding: 0.5rem 1rem; border-top: 1px solid #1a1a24; color: #6272a4; font-size: 0.72rem; }
    .pal-foot kbd { background: #1a1a24; border: 1px solid #2a2a3a; border-radius: 3px; padding: 0 0.3rem; color: #a3abc9; font-family: inherit; }
    @media (max-width: 768px) { .pal-backdrop { padding-top: 8vh; } .pal-foot { display: none; } }
  `;

  let backdrop = null, input = null, list = null, items = [], active = 0;

  function injectStyle() {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function injectNavButton() {
    const nav = document.querySelector('.topnav');
    const links = nav && nav.querySelector('.nav-links');
    const burger = nav && nav.querySelector('.nav-hamburger');
    if (!nav || !links) return;
    const right = document.createElement('div');
    right.className = 'nav-right';
    const btn = document.createElement('button');
    btn.className = 'nav-palette';
    btn.type = 'button';
    btn.title = 'Jump to a page (press /)';
    btn.setAttribute('aria-label', 'Search the site');
    btn.textContent = '/';
    btn.addEventListener('click', open);
    links.parentNode.insertBefore(right, links);
    right.appendChild(links);
    right.appendChild(btn);
    if (burger) right.appendChild(burger);
  }

  function filter(q) {
    q = q.trim().toLowerCase();
    if (!q) return PAGES;
    return PAGES.filter(p => (p.name + ' ' + p.hint).toLowerCase().includes(q));
  }

  function render() {
    const q = input.value;
    items = filter(q);
    active = Math.min(active, Math.max(items.length - 1, 0));
    list.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.className = 'pal-empty';
      li.textContent = 'Nothing by that name.';
      list.appendChild(li);
      return;
    }
    items.forEach((p, i) => {
      const li = document.createElement('li');
      li.className = 'pal-item' + (i === active ? ' active' : '');
      li.innerHTML = '<span></span><span class="hint"></span>';
      li.firstChild.textContent = p.name;
      li.lastChild.textContent = p.hint;
      li.addEventListener('mouseenter', () => { active = i; render(); });
      li.addEventListener('click', () => go(p));
      list.appendChild(li);
    });
  }

  function go(p) {
    close();
    if (p.ext) { window.open(p.href, '_blank', 'noopener'); return; }
    const here = location.pathname.replace(/index\.html$/, '');
    const [path, hash] = p.href.split('#');
    if ((path === here || (path === '/' && here === '/')) && hash) {
      location.hash = hash;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    location.href = p.href;
  }

  function submit() {
    const q = input.value.trim().toLowerCase();
    if (items.length) { go(items[active]); return; }
    if (q === 'turing' && window.JadedTuring) { close(); window.JadedTuring.open(); }
  }

  function open() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.className = 'pal-backdrop';
    backdrop.innerHTML = `
      <div class="pal" role="dialog" aria-label="Jump to a page">
        <div class="pal-input-row"><span class="slash">/</span><input class="pal-input" type="text" placeholder="Jump to…" autocomplete="off" spellcheck="false"></div>
        <ul class="pal-list"></ul>
        <div class="pal-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>↵</kbd> go</span><span><kbd>esc</kbd> close</span></div>
      </div>`;
    document.body.appendChild(backdrop);
    input = backdrop.querySelector('.pal-input');
    list = backdrop.querySelector('.pal-list');
    active = 0;
    render();
    input.addEventListener('input', () => { active = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(items.length, 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + Math.max(items.length, 1)) % Math.max(items.length, 1); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); submit(); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      e.stopPropagation();
    });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    requestAnimationFrame(() => { backdrop.classList.add('show'); input.focus(); });
  }

  function close() {
    if (!backdrop) return;
    const b = backdrop;
    backdrop = null;
    b.classList.remove('show');
    setTimeout(() => b.remove(), 160);
    if (location.hash === '#search') history.replaceState(null, '', location.pathname);
  }

  function onKey(e) {
    const t = e.target;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); backdrop ? close() : open(); return; }
    if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); }
  }

  function checkHash() {
    if (location.hash === '#search') open();
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectStyle();
    injectNavButton();
    // Capture phase, and keypress too: Firefox's quick-find listens on keypress, so keydown alone can lose the race.
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('keypress', (e) => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !typing) e.preventDefault();
    }, true);
    window.addEventListener('hashchange', checkHash);
    checkHash();
  });

  window.JadedPalette = { open, close };
})();
