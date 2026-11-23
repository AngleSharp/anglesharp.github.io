// AngleSharp website — client enhancements (no dependencies)
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const base = document.body.dataset.base || '/';

  // ---------------------------------------------------------------- theme
  $$('[data-theme-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {}
    }),
  );

  // ---------------------------------------------------------------- mobile nav
  const navToggle = $('[data-nav-toggle]');
  const nav = $('.main-nav');
  navToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  const sidebarToggle = $('[data-sidebar-toggle]');
  const sidebar = $('#docs-sidebar');
  sidebarToggle?.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const open = sidebar.classList.toggle('open');
    sidebarToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (ev) => {
    if (sidebar?.classList.contains('open') && !sidebar.contains(ev.target)) {
      sidebar.classList.remove('open');
      sidebarToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  $('[data-project-select]')?.addEventListener('change', (ev) => {
    location.href = ev.target.value;
  });

  // ---------------------------------------------------------------- copy buttons
  document.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.copy-btn');
    if (!btn) return;
    const text = btn.dataset.copy ?? btn.closest('.code-block')?.querySelector('pre')?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ''));
      btn.classList.add('copied');
      const label = btn.textContent.trim();
      if (label) btn.textContent = 'Copied';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) btn.textContent = label;
      }, 1400);
    } catch {}
  });

  // ---------------------------------------------------------------- code tabs (home)
  const tablist = $('.window-tabs');
  if (tablist) {
    const tabs = $$('[role="tab"]', tablist);
    let auto = true;
    const panels = tablist.closest('.window').querySelector('.code-panels');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const select = (tab, focus) => {
      const from = panels.offsetHeight;
      panels.style.height = ''; // drop a leftover height from an interrupted animation
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
      });
      if (focus) tab.focus();
      // animate between the heights of the old and the new sample
      const to = panels.offsetHeight;
      if (from !== to && !reduced) {
        panels.style.height = `${from}px`;
        panels.offsetHeight; // force reflow so the transition starts from `from`
        panels.style.height = `${to}px`;
        panels.addEventListener('transitionend', () => (panels.style.height = ''), { once: true });
      }
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        auto = false;
        select(tab);
      });
      tab.addEventListener('keydown', (ev) => {
        const dir = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
        if (dir) {
          auto = false;
          select(tabs[(i + dir + tabs.length) % tabs.length], true);
        }
      });
    });
    // gently cycle through the samples until the user interacts
    const win = tablist.closest('.window');
    win.addEventListener('pointerenter', () => (auto = false), { once: true });
    if (!reduced && matchMedia('(min-width: 961px)').matches) {
      const timer = setInterval(() => {
        if (!auto || document.hidden) return auto || clearInterval(timer);
        const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
        select(tabs[(i + 1) % tabs.length]);
      }, 6000);
    }
  }

  // ---------------------------------------------------------------- toc scrollspy
  const tocLinks = $$('.docs-toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map(tocLinks.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const visible = new Set();
    const update = () => {
      const first = $$('.prose h2[id], .prose h3[id]').find((h) => visible.has(h.id));
      if (!first) return;
      tocLinks.forEach((a) => a.classList.toggle('active', a === map.get(first.id)));
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        update();
      },
      { rootMargin: '-64px 0px -60% 0px' },
    );
    $$('.prose h2[id], .prose h3[id]').forEach((h) => io.observe(h));
  }

  // ---------------------------------------------------------------- search
  const dialog = $('.search-dialog');
  const input = $('input', dialog);
  const list = $('.search-results', dialog);
  let index = null;
  let results = [];
  let active = 0;

  const loadIndex = () =>
    (index ??= fetch(`${base}search-index.json`)
      .then((r) => r.json())
      .then((items) =>
        items.map((it) => ({
          ...it,
          lt: it.t.toLowerCase(),
          lh: (it.h || '').toLowerCase(),
          lx: (it.x || '').toLowerCase(),
        })),
      ));

  const open = () => {
    if (!dialog.open) dialog.showModal();
    input.select();
    loadIndex();
  };

  $$('[data-search-open]').forEach((b) => b.addEventListener('click', open));
  document.addEventListener('keydown', (ev) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if ((ev.key === 'k' && (ev.metaKey || ev.ctrlKey)) || (ev.key === '/' && !typing)) {
      ev.preventDefault();
      open();
    }
  });
  dialog.addEventListener('click', (ev) => {
    if (ev.target === dialog) dialog.close();
  });

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const highlight = (text, terms) => {
    let out = esc(text);
    terms.forEach((t) => {
      if (t.length > 1) out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    });
    return out;
  };

  const search = async (q) => {
    const items = await loadIndex();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items
      .map((it) => {
        let score = 0;
        for (const term of terms) {
          let s = 0;
          if (it.lt === term) s += 100;
          else if (it.lt.startsWith(term)) s += 60;
          else if (it.lt.includes(term)) s += 40;
          if (it.lh.includes(term)) s += 15;
          if (it.lx.includes(term)) s += 5 + Math.min(10, it.lx.split(term).length - 1);
          if (!s) return null;
          score += s;
        }
        return { it, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ it }) => {
        // snippet around the first match in the text
        const pos = it.lx.indexOf(terms[0]);
        const snippet = pos >= 0 ? (pos > 40 ? '…' : '') + it.x.slice(Math.max(0, pos - 40), pos + 120) : it.h || '';
        return { ...it, snippet, terms };
      });
  };

  const render = () => {
    if (!input.value.trim()) {
      list.innerHTML = '';
      return;
    }
    list.innerHTML = results.length
      ? results
          .map(
            (r, i) =>
              `<li role="option"><a href="${base}${r.u}" aria-selected="${i === active}"><span class="r-sub">${esc(r.s)}</span><span class="r-title">${highlight(r.t, r.terms)}</span>${r.snippet ? `<span class="r-snippet">${highlight(r.snippet, r.terms)}</span>` : ''}</a></li>`,
          )
          .join('')
      : `<li class="r-empty">No results for “${esc(input.value)}”</li>`;
  };

  let seq = 0;
  input.addEventListener('input', async () => {
    const mine = ++seq;
    const r = await search(input.value);
    if (mine !== seq) return;
    results = r;
    active = 0;
    render();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (!results.length) return;
      active = (active + (ev.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      render();
      $('[aria-selected="true"]', list)?.scrollIntoView({ block: 'nearest' });
    } else if (ev.key === 'Enter' && results[active]) {
      ev.preventDefault();
      location.href = `${base}${results[active].u}`;
      dialog.close();
    }
  });
})();
