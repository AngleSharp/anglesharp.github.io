import { icons, logoMark } from './icons.mjs';
import { escapeHtml as e } from './markdown.mjs';

// ---------------------------------------------------------------------------
// helpers

export const fmtNumber = (n) => {
  if (n == null) return '—';
  if (n >= 1e9) return `${(n / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace(/\.0$/, '')}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, '')}K`;
  return String(n);
};

export const fmtDate = (d) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

const isoDate = (d) => d.toISOString().slice(0, 10);

const statusLabel = { stable: 'Stable', preview: 'Preview', deprecated: 'Deprecated' };
const categoryLabel = { core: 'Core', extension: 'Extensions', tooling: 'Tooling', experimental: 'Experimental' };
export const categoryOrder = ['core', 'extension', 'tooling', 'experimental'];

export function projectLogo(ctx, p, cls = 'project-logo') {
  return p.logoUrl
    ? `<img class="${cls}" src="${ctx.url(p.logoUrl)}" alt="" width="128" height="128" loading="lazy">`
    : `<span class="${cls} project-logo-fallback">${logoMark('')}</span>`;
}

function projectName(p) {
  const [head, ...rest] = p.name.split('.');
  return rest.length ? `${e(head)}<wbr><span class="dim">.${e(rest.join('.'))}</span>` : e(p.name);
}

function versionChip(ctx, p) {
  const n = ctx.nuget[p.id];
  if (!n) return '';
  const v = n.version || n.prerelease;
  return `<span class="chip chip-version" title="Latest version on NuGet">v${e(v)}</span>`;
}

function statusChip(p) {
  return `<span class="chip chip-${p.status}">${statusLabel[p.status] || e(p.status)}</span>`;
}

function installCmd(pkg, cls = '') {
  return `<div class="install ${cls}">
    <span class="install-prompt">$</span>
    <code>dotnet add package <span class="install-pkg">${e(pkg)}</span></code>
    <button class="copy-btn icon-btn" type="button" data-copy="dotnet add package ${e(pkg)}" aria-label="Copy install command">${icons.copy}</button>
  </div>`;
}

// ---------------------------------------------------------------------------
// layout

export function layout(ctx, { title, description, body, active = '', bodyClass = '', path = '', markdown = false }) {
  const { site } = ctx;
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const desc = description || site.description;
  const canonical = `${site.url}${ctx.url(path)}`;
  const nav = [
    ['docs/', 'Docs', 'docs'],
    ['ecosystem/', 'Ecosystem', 'ecosystem'],
    ['blog/', 'Blog', 'blog'],
    ['resources/', 'Resources', 'resources'],
  ];

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(fullTitle)}</title>
<meta name="description" content="${e(desc)}">
<link rel="canonical" href="${e(canonical)}">
<meta name="theme-color" content="#070b14">
<meta property="og:type" content="website">
<meta property="og:title" content="${e(fullTitle)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(canonical)}">
${ctx.ogImage ? `<meta property="og:image" content="${e(site.url + ctx.ogImage)}">` : ''}
<meta name="twitter:card" content="summary">
<link rel="icon" href="${ctx.url('favicon.svg')}" type="image/svg+xml">
${markdown ? `<link rel="alternate" type="text/markdown" href="${ctx.url(path + 'index.html.md')}">\n` : ''}<link rel="help" type="text/plain" href="${ctx.url('llms.txt')}" title="llms.txt">
<link rel="alternate" type="application/rss+xml" title="AngleSharp Blog" href="${ctx.url('blog/feed.xml')}">
<link rel="preload" href="${ctx.url('assets/fonts/inter.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.asset('assets/styles.css')}">
<script>(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t}catch(e){}})()</script>
<script src="${ctx.asset('assets/app.js')}" defer></script>
</head>
<body class="${bodyClass}" data-base="${ctx.site.basePath}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${ctx.url('')}" aria-label="AngleSharp home">
      ${logoMark()}
      <span class="brand-name">Angle<b>Sharp</b></span>
    </a>
    <nav class="main-nav" aria-label="Main">
      ${nav.map(([href, label, key]) => `<a href="${ctx.url(href)}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
    </nav>
    <div class="header-actions">
      <button class="search-trigger" type="button" data-search-open aria-label="Search">
        ${icons.search}<span>Search docs…</span><kbd>Ctrl K</kbd>
      </button>
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Toggle color theme">
        <span class="theme-dark">${icons.moon}</span><span class="theme-light">${icons.sun}</span>
      </button>
      <a class="icon-btn" href="${e(site.github)}" aria-label="AngleSharp on GitHub" target="_blank" rel="noopener">${icons.github}</a>
      <button class="icon-btn nav-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${footer(ctx)}
<dialog class="search-dialog" aria-label="Search">
  <div class="search-box">
    <div class="search-input-row">
      ${icons.search}
      <input type="search" placeholder="Search the docs, projects, and blog…" autocomplete="off" spellcheck="false" aria-label="Search query">
      <kbd>Esc</kbd>
    </div>
    <ul class="search-results" role="listbox"></ul>
    <div class="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span></div>
  </div>
</dialog>
</body>
</html>`;
}

function footer(ctx) {
  const { site, projects } = ctx;
  const year = new Date().getFullYear();
  const listed = projects.filter((p) => !p.hidden);
  const half = Math.ceil(listed.length / 2);
  const col = (items) =>
    items.map((p) => `<li><a href="${ctx.url(`docs/${p.id}/`)}">${e(p.name)}</a></li>`).join('');
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="${ctx.url('')}">${logoMark()}<span class="brand-name">Angle<b>Sharp</b></span></a>
      <p>The ultimate angle brackets parser library for .NET — HTML5, CSS, SVG, MathML, and XML, built to spec.</p>
      <a class="foundation" href="${e(site.foundation)}" target="_blank" rel="noopener">
        <span><small>A member project of the</small></span>
        <img src="${ctx.url('dotnetfoundation.svg')}" alt=".NET Foundation" width="110" height="40">
      </a>
    </div>
    <div>
      <h3>Projects</h3>
      <ul>${col(listed.slice(0, half))}</ul>
    </div>
    <div>
      <h3>&nbsp;</h3>
      <ul>${col(listed.slice(half))}</ul>
    </div>
    <div>
      <h3>Community</h3>
      <ul>
        <li><a href="${e(site.github)}" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="${ctx.url('blog/')}">Blog</a></li>
        <li><a href="${ctx.url('blog/feed.xml')}">RSS feed</a></li>
        <li><a href="${ctx.url('resources/')}">Articles &amp; samples</a></li>
        <li><a href="${ctx.url('llms.txt')}">llms.txt</a></li>
        <li><a href="${e(site.sponsor)}" target="_blank" rel="noopener">Sponsor</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>© ${site.since}–${year} AngleSharp contributors. Licensed under MIT.</span>
    <span>Built from <a href="${e(site.repository)}" target="_blank" rel="noopener">${e(site.repository.replace('https://github.com/', ''))}</a> · Published with GitHub Pages</span>
  </div>
</footer>`;
}

// ---------------------------------------------------------------------------
// home

const SAMPLES = [
  {
    id: 'parse',
    label: 'Parse',
    pkg: 'AngleSharp',
    code: `using AngleSharp;

var context = BrowsingContext.New(Configuration.Default);
var document = await context.OpenAsync(req => req
    .Content("<ul><li>One<li>Two</ul><p>Unclosed <b>tags"));

// Same error recovery as every modern browser
Console.WriteLine(document.Body!.InnerHtml);`,
    output: `<ul><li>One</li><li>Two</li></ul><p>Unclosed <b>tags</b></p>`,
  },
  {
    id: 'query',
    label: 'Query',
    pkg: 'AngleSharp',
    code: `using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;

var context = BrowsingContext.New(Configuration.Default);
var document = await context.OpenAsync(req => req.Content("""
    <nav>
      <a href="/docs">Docs</a>
      <a href="https://github.com/AngleSharp">GitHub</a>
      <a href="https://www.nuget.org/packages/AngleSharp">NuGet</a>
    </nav>
    """));

foreach (var a in document.QuerySelectorAll<IHtmlAnchorElement>("nav a[href^='https']"))
    Console.WriteLine($"{a.TextContent} → {a.Href}");`,
    output: `GitHub → https://github.com/AngleSharp
NuGet → https://www.nuget.org/packages/AngleSharp`,
  },
  {
    id: 'css',
    label: 'Style',
    pkg: 'AngleSharp.Css',
    code: `using AngleSharp;
using AngleSharp.Css.Dom;
using AngleSharp.Dom;

var config = Configuration.Default.WithCss();
var context = BrowsingContext.New(config);
var document = await context.OpenAsync(req => req.Content("""
    <style>.alert { color: tomato }</style>
    <p class="alert">Heads up!</p>
    """));

var p = document.QuerySelector(".alert")!;
var style = document.DefaultView!.GetComputedStyle(p);
Console.WriteLine(style.GetColor());`,
    output: `rgba(255, 99, 71, 1)`,
  },
  {
    id: 'js',
    label: 'Script',
    pkg: 'AngleSharp.Js',
    code: `using AngleSharp;
using AngleSharp.Js;

var config = Configuration.Default.WithJs();
var context = BrowsingContext.New(config);
var document = await context.OpenAsync(req => req.Content("""
    <output id="out"></output>
    <script>
      const squares = [1, 2, 3].map(n => n * n);
      document.getElementById('out').textContent = squares.join(', ');
    </script>
    """));

Console.WriteLine(document.QuerySelector("#out")!.TextContent);`,
    output: `1, 4, 9`,
  },
  {
    id: 'xpath',
    label: 'XPath',
    pkg: 'AngleSharp.XPath',
    code: `using AngleSharp.Html.Parser;
using AngleSharp.XPath;

var parser = new HtmlParser();
var document = parser.ParseDocument("""
    <table><tr><td>A</td><td>1</td></tr>
           <tr><td>B</td><td>2</td></tr></table>
    """);

var cells = document.Body!.SelectNodes("//tr/td[2]");
Console.WriteLine(string.Join(", ", cells.Select(c => c.TextContent)));`,
    output: `1, 2`,
  },
];

const FEATURES = [
  ['shield', 'Standards-driven', 'Built from the WHATWG and W3C specifications. Malformed HTML is handled exactly like in evergreen browsers.'],
  ['bolt', 'Fast by design', 'Streaming tokenizer, minimal allocations, and modern TFMs. Parse large documents in milliseconds.'],
  ['tree', 'The real DOM', 'The API you know from the browser: querySelector, events, mutation, serialization — fully interactive.'],
  ['query', 'Selectors & LINQ', 'Powerful CSS selectors, XPath via AngleSharp.XPath, and LINQ on top of every node collection.'],
  ['layers', 'Modular ecosystem', 'A small, dependency-free core. Add CSS, JavaScript, XML, IO, or rendering only when you need it.'],
  ['plug', 'Extensible everywhere', 'Bring your own requester, cookie container, script engine, or service. Everything is configurable.'],
  ['sparkles', 'Modern HTML', '<code>template</code>, <code>picture</code>, popovers, shadow DOM, custom elements — AngleSharp keeps up.'],
  ['cursor', 'Forms & navigation', 'Fill, validate, and submit forms. Navigate between pages with a full browsing context.'],
];

const PIPELINE = [
  ['Fetch', 'io', 'Requesters, cookies, caching'],
  ['Parse', 'anglesharp', 'HTML5 tokenizer & tree builder'],
  ['DOM', 'anglesharp', 'Nodes, events, selectors'],
  ['Style', 'css', 'CSSOM & computed styles'],
  ['Script', 'js', 'JavaScript on the DOM'],
  ['Render', 'renderer', 'Layout & paint'],
  ['Browse', 'browser', 'The complete engine'],
];

export function homePage(ctx, { posts }) {
  const core = ctx.projects.find((p) => p.category === 'core') || ctx.projects[0];
  const coreStats = ctx.nuget[core.id];
  const totalDownloads = Object.values(ctx.nuget).reduce((s, n) => s + (n.downloads || 0), 0);
  const listed = ctx.projects.filter((p) => !p.hidden);
  const year = new Date().getFullYear();

  const tabs = SAMPLES.map(
    (s, i) =>
      `<button type="button" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${s.label}</button>`,
  ).join('');
  const panels = SAMPLES.map(
    (s, i) => `<div class="code-panel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}"${i ? ' hidden' : ''}>
      <div class="code-scroll">${ctx.md.highlight(s.code, 'cs').replace(/<div class="code-head">[\s\S]*?<\/div>/, '')}</div>
      <div class="code-output">
        <div class="code-output-head"><span class="code-output-label">Output</span><span class="code-pkg">${icons.nuget}<span>${e(s.pkg)}</span></span></div>
        <pre>${e(s.output)}</pre>
      </div>
    </div>`,
  ).join('');

  return `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><div class="grid-lines"></div><div class="glow glow-a"></div><div class="glow glow-b"></div></div>
  <div class="container hero-inner">
    <div class="hero-copy">
      ${coreStats?.version ? `<a class="hero-badge" href="${e(core.nugetUrl)}" target="_blank" rel="noopener"><span class="pulse"></span>Latest release: AngleSharp ${e(coreStats.version)}<span class="hero-badge-arrow">${icons.arrowRight}</span></a>` : ''}
      <h1>Parse the web.<br><span class="gradient-text">The .NET way.</span></h1>
      <p class="lead">AngleSharp is the standards-driven engine for HTML5, CSS, SVG, MathML, and XML in .NET. Parse, query, style, script, and render documents — exactly like a browser would.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${ctx.url(`docs/${core.id}/`)}">Get started ${icons.arrowRight}</a>
        <a class="btn btn-ghost" href="${ctx.url('ecosystem/')}">Explore the ecosystem</a>
      </div>
      ${installCmd(core.nuget, 'hero-install')}
    </div>
    <div class="hero-code">
      <div class="window">
        <div class="window-bar">
          <span class="dots"><i></i><i></i><i></i></span>
          <div class="window-tabs" role="tablist" aria-label="Code samples">${tabs}</div>
        </div>
        <div class="code-panels">${panels}</div>
      </div>
    </div>
  </div>
</section>

<section class="stats">
  <div class="container stats-grid">
    <div class="stat"><strong>${fmtNumber(totalDownloads)}+</strong><span>NuGet downloads</span></div>
    <div class="stat"><strong>${listed.length}</strong><span>ecosystem packages</span></div>
    <div class="stat"><strong>0</strong><span>core dependencies</span></div>
    <div class="stat"><strong>${year - ctx.site.since}+</strong><span>years in production</span></div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Why AngleSharp</span>
      <h2>A browser engine core, as a library.</h2>
      <p>Everything you need to work with web content from C#, F#, or PowerShell — on any platform that runs .NET.</p>
    </div>
    <div class="feature-grid">
      ${FEATURES.map(([icon, title, text]) => `<div class="feature-card"><div class="feature-icon">${icons[icon]}</div><h3>${title}</h3><p>${text}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow">Architecture</span>
      <h2>From bytes to pixels.</h2>
      <p>Every stage of the browser pipeline is a package. Pick the ones you need — they all plug into the same <code>BrowsingContext</code>.</p>
    </div>
    <ol class="pipeline">
      ${PIPELINE.map(([stage, id, text], i) => {
        const p = ctx.projects.find((x) => x.id === id);
        return `<li style="--i:${i}"><a href="${p ? ctx.url(`docs/${p.id}/`) : '#'}"><span class="pipeline-step">${String(i + 1).padStart(2, '0')}</span><strong>${stage}</strong><span class="pipeline-pkg">${e(p ? p.name : id).replace('.', '<wbr>.')}</span><small>${text}</small></a></li>`;
      }).join('')}
    </ol>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head section-head-row">
      <div>
        <span class="eyebrow">Ecosystem</span>
        <h2>One core. Many capabilities.</h2>
      </div>
      <a class="btn btn-ghost" href="${ctx.url('ecosystem/')}">All projects ${icons.arrowRight}</a>
    </div>
    <div class="project-grid">
      ${listed.map((p) => projectCard(ctx, p)).join('')}
    </div>
  </div>
</section>

${
  posts.length
    ? `<section class="section section-alt">
  <div class="container">
    <div class="section-head section-head-row">
      <div><span class="eyebrow">Blog</span><h2>Latest news.</h2></div>
      <a class="btn btn-ghost" href="${ctx.url('blog/')}">All posts ${icons.arrowRight}</a>
    </div>
    <div class="post-grid">${posts.slice(0, 3).map((p) => postCard(ctx, p)).join('')}</div>
  </div>
</section>`
    : ''
}

<section class="section">
  <div class="container">
    <div class="cta">
      <div>
        <h2>Built in the open. Powered by people.</h2>
        <p>AngleSharp is MIT licensed and maintained by volunteers. Contributions, issues, and sponsorships keep it moving.</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-primary" href="${e(ctx.site.github)}" target="_blank" rel="noopener">${icons.github} Contribute</a>
        <a class="btn btn-ghost" href="${e(ctx.site.sponsor)}" target="_blank" rel="noopener">${icons.heart} Sponsor</a>
      </div>
    </div>
  </div>
</section>`;
}

export function projectCard(ctx, p) {
  const n = ctx.nuget[p.id];
  return `<a class="project-card" href="${ctx.url(`docs/${p.id}/`)}">
    <div class="project-card-head">
      ${projectLogo(ctx, p)}
      <div class="project-card-chips">${statusChip(p)}${versionChip(ctx, p)}</div>
    </div>
    <h3>${projectName(p)}</h3>
    <p>${e(p.tagline || p.description)}</p>
    <div class="project-card-foot">
      ${n ? `<span title="Total NuGet downloads">${icons.nuget}${fmtNumber(n.downloads)}</span>` : '<span></span>'}
      <span class="project-card-link">Docs ${icons.arrowRight}</span>
    </div>
  </a>`;
}

function postCard(ctx, post) {
  return `<a class="post-card" href="${ctx.url(post.url)}">
    <time datetime="${isoDate(post.date)}">${fmtDate(post.date)}</time>
    <h3>${e(post.title)}</h3>
    <p>${e(post.excerpt)}</p>
    <span class="post-card-more">Read more ${icons.arrowRight}</span>
  </a>`;
}

// ---------------------------------------------------------------------------
// ecosystem & docs hub

export function ecosystemPage(ctx) {
  const listed = ctx.projects.filter((p) => !p.hidden);
  const groups = categoryOrder
    .map((cat) => [cat, listed.filter((p) => p.category === cat)])
    .filter(([, items]) => items.length);

  return `
${pageHero('Ecosystem', 'The AngleSharp ecosystem', 'A dependency-free core with focused companion libraries. Each package plugs into the same configuration and browsing context.')}
<section class="section section-tight">
  <div class="container">
    ${groups
      .map(
        ([cat, items]) => `<div class="eco-group">
      <h2 class="eco-title">${categoryLabel[cat]}</h2>
      <div class="eco-list">
        ${items
          .map((p) => {
            const n = ctx.nuget[p.id];
            return `<article class="eco-item" id="${p.id}">
          ${projectLogo(ctx, p, 'project-logo project-logo-lg')}
          <div class="eco-body">
            <div class="eco-name"><h3>${projectName(p)}</h3>${statusChip(p)}${versionChip(ctx, p)}</div>
            <p>${e(p.description)}</p>
            ${p.nuget ? installCmd(p.nuget, 'install-sm') : ''}
          </div>
          <div class="eco-meta">
            ${n ? `<div class="eco-stat"><strong>${fmtNumber(n.downloads)}</strong><span>downloads</span></div>` : ''}
            ${n?.prerelease ? `<div class="eco-stat"><strong>${e(n.prerelease.replace(/^(\d+\.\d+\.\d+-[a-z]+).*/, '$1'))}</strong><span>preview</span></div>` : ''}
            <div class="eco-links">
              <a class="btn btn-sm btn-primary" href="${ctx.url(`docs/${p.id}/`)}">${icons.book} Docs</a>
              <a class="btn btn-sm btn-ghost" href="${e(p.githubUrl)}" target="_blank" rel="noopener">${icons.github} GitHub</a>
              ${p.nugetUrl ? `<a class="btn btn-sm btn-ghost" href="${e(p.nugetUrl)}" target="_blank" rel="noopener">${icons.nuget} NuGet</a>` : ''}
            </div>
          </div>
        </article>`;
          })
          .join('')}
      </div>
    </div>`,
      )
      .join('')}
  </div>
</section>`;
}

export function docsHubPage(ctx) {
  const listed = ctx.projects.filter((p) => !p.hidden && p.pages.length);
  const core = listed.find((p) => p.category === 'core');
  const quick = core
    ? core.pages.filter((p) => !p.isIndex).slice(0, 6)
    : [];

  return `
${pageHero('Documentation', 'Learn AngleSharp', 'Guides, tutorials, and API notes for every project — pulled straight from each repository, so they are always in sync with the code.')}
<section class="section section-tight">
  <div class="container">
    ${
      core
        ? `<div class="docs-start">
      <div class="docs-start-copy">
        <span class="eyebrow">Start here</span>
        <h2>New to AngleSharp?</h2>
        <p>Install the core package and open your first document in three lines of code.</p>
        ${installCmd(core.nuget)}
        <a class="btn btn-primary" href="${ctx.url(`docs/${core.id}/`)}">Read the core docs ${icons.arrowRight}</a>
      </div>
      <ul class="docs-quick">
        ${quick.map((p) => `<li><a href="${ctx.url(p.url)}"><span>${e(p.sectionTitle)}</span>${e(p.title)}${icons.arrowRight}</a></li>`).join('')}
      </ul>
    </div>`
        : ''
    }
    <h2 class="eco-title">All projects</h2>
    <div class="project-grid">
      ${listed.map((p) => projectCard(ctx, p)).join('')}
    </div>
  </div>
</section>`;
}

function pageHero(eyebrow, title, text) {
  return `<section class="page-hero">
  <div class="hero-bg" aria-hidden="true"><div class="grid-lines"></div><div class="glow glow-a"></div></div>
  <div class="container">
    <span class="eyebrow">${e(eyebrow)}</span>
    <h1>${e(title)}</h1>
    <p class="lead">${e(text)}</p>
  </div>
</section>`;
}

// ---------------------------------------------------------------------------
// docs page

export function docPage(ctx, { project, page, html, headings, prev, next }) {
  const n = ctx.nuget[project.id];
  const sections = [];
  for (const p of project.pages) {
    let s = sections.find((x) => x.key === p.section);
    if (!s) sections.push((s = { key: p.section, title: p.isIndex ? '' : p.sectionTitle, pages: [] }));
    s.pages.push(p);
  }

  const sidebar = `<aside class="docs-sidebar" id="docs-sidebar">
    <div class="project-switch">
      <label for="project-select" class="sr-only">Project</label>
      ${projectLogo(ctx, project, 'project-logo project-logo-xs')}
      <select id="project-select" data-project-select>
        ${ctx.projects
          .filter((p) => p.pages.length)
          .map((p) => `<option value="${ctx.url(`docs/${p.id}/`)}"${p.id === project.id ? ' selected' : ''}>${e(p.name)}</option>`)
          .join('')}
      </select>
      ${icons.chevronDown}
    </div>
    <nav class="docs-nav" aria-label="${e(project.name)} documentation">
      ${sections
        .map(
          (s) => `<div class="docs-nav-group">
        ${s.title ? `<h4>${e(s.title)}</h4>` : ''}
        <ul>${s.pages
          .map((p) => `<li><a href="${ctx.url(p.url)}"${p === page ? ' aria-current="page"' : ''}>${e(p.title)}</a></li>`)
          .join('')}</ul>
      </div>`,
        )
        .join('')}
    </nav>
    <div class="docs-sidebar-foot">
      <a href="${e(project.githubUrl)}" target="_blank" rel="noopener">${icons.github} Repository</a>
      ${project.nugetUrl ? `<a href="${e(project.nugetUrl)}" target="_blank" rel="noopener">${icons.nuget} NuGet package</a>` : ''}
    </div>
  </aside>`;

  const toc = headings.filter((h) => h.level <= 3);

  const projectHeader = page.isIndex
    ? `<div class="doc-project-head">
      ${projectLogo(ctx, project, 'project-logo project-logo-lg')}
      <div>
        <div class="eco-name">${statusChip(project)}${versionChip(ctx, project)}${n ? `<span class="chip">${icons.nuget}${fmtNumber(n.downloads)} downloads</span>` : ''}</div>
        <p class="lead">${e(project.description)}</p>
        ${project.nuget ? installCmd(project.nuget, 'install-sm') : ''}
      </div>
    </div>`
    : '';

  return `<div class="docs-layout container">
  <button class="docs-menu-btn" type="button" data-sidebar-toggle aria-controls="docs-sidebar" aria-expanded="false">${icons.menu} ${e(project.name)} menu</button>
  ${sidebar}
  <article class="docs-main">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${ctx.url('docs/')}">Docs</a><span>/</span>
      <a href="${ctx.url(`docs/${project.id}/`)}">${e(project.name)}</a>
      ${page.isIndex ? '' : `<span>/</span><span>${e(page.sectionTitle)}</span>`}
    </nav>
    ${projectHeader}
    <div class="prose">${html}</div>
    <div class="doc-foot">
      <span class="doc-actions">
        <a class="edit-link" href="${e(page.editUrl)}" target="_blank" rel="noopener">${icons.edit} Edit this page on GitHub</a>
        <a class="edit-link" href="${ctx.url(page.url + 'index.html.md')}" title="Plain markdown, e.g. for LLMs">${icons.markdown} View as Markdown</a>
      </span>
      ${project.meta?.commit ? `<span class="doc-rev">Synced from <a href="https://github.com/${project.repo}/tree/${project.meta.commit}" target="_blank" rel="noopener"><code>${project.meta.commit.slice(0, 7)}</code></a></span>` : ''}
    </div>
    <nav class="pager" aria-label="Pagination">
      ${prev ? `<a class="pager-prev" href="${ctx.url(prev.url)}"><small>${icons.arrowLeft} Previous</small><span>${e(prev.title)}</span></a>` : '<span></span>'}
      ${next ? `<a class="pager-next" href="${ctx.url(next.url)}"><small>Next ${icons.arrowRight}</small><span>${e(next.title)}</span></a>` : '<span></span>'}
    </nav>
  </article>
  <aside class="docs-toc" aria-label="On this page">
    ${
      toc.length
        ? `<h4>On this page</h4><ul>${toc
            .map((h) => `<li class="toc-l${h.level}"><a href="#${e(h.id)}" title="${e(h.text)}">${e(h.text)}</a></li>`)
            .join('')}</ul>`
        : ''
    }
  </aside>
</div>`;
}

// ---------------------------------------------------------------------------
// blog

export function blogIndexPage(ctx, { posts }) {
  const byYear = new Map();
  for (const p of posts) {
    const y = p.date.getUTCFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(p);
  }
  const [featured, ...rest] = posts;
  return `
${pageHero('Blog', 'News & releases', 'Release notes, announcements, and stories from the AngleSharp project.')}
<section class="section section-tight">
  <div class="container blog-container">
    ${
      featured
        ? `<a class="post-featured" href="${ctx.url(featured.url)}">
      <span class="eyebrow">Latest</span>
      <h2>${e(featured.title)}</h2>
      <p>${e(featured.excerpt)}</p>
      <div class="post-meta"><time datetime="${isoDate(featured.date)}">${fmtDate(featured.date)}</time><span>${featured.readingMinutes} min read</span></div>
    </a>`
        : ''
    }
    ${[...byYear.entries()]
      .map(
        ([year, items]) => `<div class="post-year">
      <h2>${year}</h2>
      <ul class="post-list">
        ${items
          .filter((p) => p !== featured)
          .map(
            (p) => `<li><a href="${ctx.url(p.url)}">
          <time datetime="${isoDate(p.date)}">${p.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' })}</time>
          <span class="post-list-title">${e(p.title)}</span>
          <span class="post-list-tags">${p.tags.map((t) => `<span class="tag">${e(t)}</span>`).join('')}</span>
        </a></li>`,
          )
          .join('')}
      </ul>
    </div>`,
      )
      .filter((html) => html.includes('<li>'))
      .join('')}
    <p class="blog-rss"><a href="${ctx.url('blog/feed.xml')}">${icons.rss} Subscribe via RSS</a></p>
  </div>
</section>`;
}

export function blogPostPage(ctx, { post, html, prev, next }) {
  return `<article class="post container">
  <header class="post-header">
    <a class="back-link" href="${ctx.url('blog/')}">${icons.arrowLeft} All posts</a>
    <div class="post-tags">${post.tags.map((t) => `<span class="tag">${e(t)}</span>`).join('')}</div>
    <h1>${e(post.title)}</h1>
    <div class="post-meta">
      ${post.userId ? `<img class="avatar" src="https://github.com/${e(post.userId)}.png?size=64" alt="" width="32" height="32" loading="lazy">` : ''}
      ${post.author ? `<span>${e(post.author)}</span>` : ''}
      <time datetime="${isoDate(post.date)}">${fmtDate(post.date)}</time>
      <span>${icons.clock} ${post.readingMinutes} min read</span>
    </div>
  </header>
  <div class="prose prose-post">${html}</div>
  <nav class="pager" aria-label="More posts">
    ${next ? `<a class="pager-prev" href="${ctx.url(next.url)}"><small>${icons.arrowLeft} Newer</small><span>${e(next.title)}</span></a>` : '<span></span>'}
    ${prev ? `<a class="pager-next" href="${ctx.url(prev.url)}"><small>Older ${icons.arrowRight}</small><span>${e(prev.title)}</span></a>` : '<span></span>'}
  </nav>
</article>`;
}

// ---------------------------------------------------------------------------
// generic

export function contentPage(ctx, { page, html }) {
  return `<article class="post container">
  <div class="prose prose-post">${html}</div>
</article>`;
}

export function notFoundPage(ctx) {
  return `<section class="not-found">
  <div class="hero-bg" aria-hidden="true"><div class="grid-lines"></div><div class="glow glow-a"></div></div>
  <div class="container">
    <div class="nf-code"><span class="dim">&lt;</span>404<span class="dim"> /&gt;</span></div>
    <h1>This node is not in the tree.</h1>
    <p class="lead"><code>document.querySelector(location.pathname)</code> returned <code>null</code>. The page may have moved with the new website.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${ctx.url('')}">Back home</a>
      <a class="btn btn-ghost" href="${ctx.url('docs/')}">Browse the docs</a>
      <button class="btn btn-ghost" type="button" data-search-open>${icons.search} Search</button>
    </div>
  </div>
</section>`;
}
