#!/usr/bin/env node
/**
 * Builds the static website into ./dist from
 *  - site.config.json            (site + project definitions)
 *  - .cache/                     (project docs & assets downloaded via `npm run fetch`)
 *  - content/                    (local blog posts and pages)
 *  - src/                        (styles and client script)
 *  - public/                     (copied verbatim)
 *
 *   node scripts/build.mjs [--base /v2026/]
 */
import { mkdir, rm, writeFile, cp, readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, posix } from 'node:path';
import { loadConfig, rootDir, cacheDir, distDir } from './lib/config.mjs';
import { createMarkdown, escapeHtml } from './lib/markdown.mjs';
import { loadProject, createResolver, loadBlog, loadPages, plainText } from './lib/content.mjs';
import * as t from './lib/templates.mjs';
import { createLlms, markdownPath } from './lib/llms.mjs';

const started = Date.now();
const args = process.argv.slice(2);
const config = loadConfig();
const baseArg = args[args.indexOf('--base') + 1];
if (args.includes('--base') && baseArg) {
  config.site.basePath = ('/' + baseArg.replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');
}

const { site } = config;
const nugetFile = join(cacheDir, 'nuget.json');
const nuget = existsSync(nugetFile) ? JSON.parse(readFileSync(nugetFile, 'utf8')).packages : {};
const projects = config.projects.map((p) => loadProject(p, config));
const missing = projects.filter((p) => !p.available);

if (missing.length === projects.length) {
  console.error('No project content found. Run `npm run fetch` first.');
  process.exit(1);
}
for (const p of missing) {
  console.warn(`  ! ${p.name}: no cached content (run \`npm run fetch -- --only ${p.id}\`)`);
}

const md = await createMarkdown();
const fingerprints = new Map();
const ctx = {
  site,
  projects,
  nuget,
  md,
  url: (path = '') => site.basePath + String(path).replace(/^\/+/, ''),
  asset: (path) => `${ctx.url(path)}${fingerprints.has(path) ? `?v=${fingerprints.get(path)}` : ''}`,
  isInternal: (href) => href.startsWith(site.url),
};
const core = projects.find((p) => p.category === 'core' && p.logoUrl);
ctx.ogImage = site.image ? ctx.url(site.image) : core ? ctx.url(core.logoUrl) : null;

const llms = createLlms(ctx);
const llmDocs = new Map(); // page -> markdown
const localPages = loadPages();
const searchIndex = [];
const sitemap = [];
const pending = [];
let pageCount = 0;

// ---------------------------------------------------------------------------
// static files

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

if (existsSync(join(rootDir, 'public'))) {
  await cp(join(rootDir, 'public'), distDir, { recursive: true });
}

for (const file of ['styles.css', 'app.js']) {
  const content = await readFile(join(rootDir, 'src', file));
  fingerprints.set(`assets/${file}`, createHash('sha1').update(content).digest('hex').slice(0, 10));
  await emit(`assets/${file}`, content);
}

const fonts = {
  'inter.woff2': '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  'jetbrains-mono.woff2': '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
};
for (const [name, src] of Object.entries(fonts)) {
  await cp(join(rootDir, 'node_modules', src), join(distDir, 'assets', 'fonts', name));
}

if (existsSync(join(rootDir, 'content', 'images'))) {
  await cp(join(rootDir, 'content', 'images'), join(distDir, 'assets', 'content', 'images'), { recursive: true });
}

for (const p of projects.filter((p) => p.available)) {
  for (const [repoPath, sitePath] of p.assets) {
    await cp(join(p.filesDir, repoPath), join(distDir, sitePath));
  }
}

// ---------------------------------------------------------------------------
// project docs

for (const project of projects) {
  project.pages.forEach((page, i) => {
    const env = {
      resolveUrl: createResolver(project, page.repoPath, ctx.url),
      isInternal: ctx.isInternal,
    };
    const { html, headings } = md.render(page.body, env);
    const body = t.docPage(ctx, {
      project,
      page,
      html,
      headings,
      prev: project.pages[i - 1],
      next: project.pages[i + 1],
    });
    const title = page.isIndex ? `${project.name} Documentation` : `${page.title} · ${project.name}`;
    write(page.url, t.layout(ctx, { title, description: page.isIndex ? project.description : undefined, body, active: 'docs', bodyClass: 'page-docs', path: page.url, markdown: true }));
    const markdown = llms.docPage(project, page);
    llmDocs.set(page, markdown);
    pending.push(emit(markdownPath(page.url), markdown));

    searchIndex.push({
      t: page.isIndex ? project.name : page.title,
      s: page.isIndex ? 'Project' : `${project.name} · ${page.sectionTitle}`,
      u: page.url,
      h: headings.map((h) => h.text).join(' · '),
      x: plainText(page.body).slice(0, 4000),
    });
  });
}

// ---------------------------------------------------------------------------
// blog

const posts = loadBlog();
const localResolver = (repoPath) => (url) => {
  if (!url || url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('/')) return url;
  const target = posix.normalize(posix.join(posix.dirname(repoPath), url));
  return target.startsWith('content/images/') ? ctx.url(`assets/${target}`) : url;
};

posts.forEach((post, i) => {
  const { html } = md.render(post.body, { resolveUrl: localResolver(post.repoPath), isInternal: ctx.isInternal });
  const body = t.blogPostPage(ctx, { post, html, prev: posts[i + 1], next: posts[i - 1] });
  write(post.url, t.layout(ctx, { title: post.title, description: post.excerpt, body, active: 'blog', bodyClass: 'page-post', path: post.url, markdown: true }));
  const meta = [`Published: ${post.date.toISOString().slice(0, 10)}${post.author ? ` by ${post.author}` : ''}`];
  pending.push(emit(markdownPath(post.url), llms.localPage(post, localResolver(post.repoPath), meta)));
  searchIndex.push({ t: post.title, s: `Blog · ${t.fmtDate(post.date)}`, u: post.url, h: '', x: plainText(post.body).slice(0, 2000) });
});

write('blog/', t.layout(ctx, { title: 'Blog', description: 'News and releases from the AngleSharp project.', body: t.blogIndexPage(ctx, { posts }), active: 'blog', path: 'blog/' }));

await emit('blog/feed.xml', rssFeed(posts.slice(0, 20)));

// ---------------------------------------------------------------------------
// local pages

for (const page of localPages) {
  const { html, headings } = md.render(page.body, { resolveUrl: localResolver(page.repoPath), isInternal: ctx.isInternal });
  const key = page.url.replace(/\/$/, '');
  write(page.url, t.layout(ctx, { title: page.title, description: page.description, body: t.contentPage(ctx, { page, html }), active: key, path: page.url, markdown: true }));
  pending.push(emit(markdownPath(page.url), llms.localPage(page, localResolver(page.repoPath))));
  searchIndex.push({ t: page.title, s: 'Page', u: page.url, h: headings.map((h) => h.text).join(' · '), x: plainText(page.body).slice(0, 2000) });
}

// ---------------------------------------------------------------------------
// hubs

write('', t.layout(ctx, { body: t.homePage(ctx, { posts }), bodyClass: 'page-home', path: '' }));
write('docs/', t.layout(ctx, { title: 'Documentation', body: t.docsHubPage(ctx), active: 'docs', path: 'docs/' }));
write('ecosystem/', t.layout(ctx, { title: 'Ecosystem', description: 'All projects of the AngleSharp ecosystem.', body: t.ecosystemPage(ctx), active: 'ecosystem', path: 'ecosystem/' }));

for (const p of projects.filter((p) => !p.hidden)) {
  searchIndex.push({ t: p.name, s: 'Ecosystem', u: `ecosystem/#${p.id}`, h: p.tagline, x: p.description });
}

await emit('404.html', t.layout(ctx, { title: 'Page not found', body: t.notFoundPage(ctx), bodyClass: 'page-404', path: '404.html' }));

// ---------------------------------------------------------------------------
// machine-readable files

await emit('search-index.json', JSON.stringify(searchIndex));
await emit('llms.txt', llms.index({ projects, posts, pages: localPages }));
await emit('llms-full.txt', llms.full({ projects, docs: llmDocs }));
await emit('.nojekyll', '');
await emit('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}${ctx.url('sitemap.xml')}\n`);
await emit(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
    .map((u) => `  <url><loc>${escapeHtml(site.url + ctx.url(u))}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
await emit(
  'build.json',
  JSON.stringify(
    {
      builtAt: new Date().toISOString(),
      projects: projects.map((p) => ({ id: p.id, repo: p.repo, ref: p.ref, commit: p.meta?.commit || null, pages: p.pages.length })),
    },
    null,
    2,
  ),
);

await Promise.all(pending);
console.log(`  ✓ Built ${pageCount} pages (${projects.reduce((s, p) => s + p.pages.length, 0)} doc pages, ${posts.length} posts) in ${Date.now() - started} ms → dist/`);

// ---------------------------------------------------------------------------

function rssFeed(items) {
  const link = (u) => escapeHtml(site.url + ctx.url(u));
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>AngleSharp Blog</title>
  <link>${link('blog/')}</link>
  <atom:link href="${link('blog/feed.xml')}" rel="self" type="application/rss+xml"/>
  <description>News and releases from the AngleSharp project.</description>
  <language>en</language>
${items
  .map(
    (p) => `  <item>
    <title>${escapeHtml(p.title)}</title>
    <link>${link(p.url)}</link>
    <guid>${link(p.url)}</guid>
    <pubDate>${p.date.toUTCString()}</pubDate>
    <description>${escapeHtml(p.excerpt)}</description>
  </item>`,
  )
  .join('\n')}
</channel>
</rss>
`;
}

function write(urlPath, html) {
  pageCount++;
  sitemap.push(urlPath);
  pending.push(emit(posix.join(urlPath, 'index.html'), html));
}

async function emit(relPath, content) {
  const file = join(distDir, relPath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}
