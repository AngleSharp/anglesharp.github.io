/**
 * LLM-friendly output following https://llmstxt.org:
 *  - /llms.txt                 index (H1, summary blockquote, H2 sections with link lists)
 *  - <page>/index.html.md      clean markdown version of every content page
 *  - /llms-full.txt            all documentation in a single markdown file
 */
import { createResolver } from './content.mjs';

export const markdownPath = (url) => `${url}index.html.md`;

/**
 * Rewrites link and image targets in markdown (outside of code) using `resolve`.
 */
export function rewriteMarkdownLinks(src, resolve) {
  // split into fenced code blocks (odd indices) and text (even indices)
  return src
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m)
    .map((part, i) => {
      if (i % 2) return part;
      return part
        .split(/(`[^`\n]*`)/)
        .map((seg, j) =>
          j % 2
            ? seg
            : seg
                .replace(/(!?)\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(\s+"[^"]*")?\s*\)/g, (_, bang, text, url, title = '') =>
                  `${bang}[${text}](${resolve(url, bang ? 'image' : 'link')}${title})`,
                )
                .replace(/\b(src|href)=(["'])([^"']*)\2/g, (_, attr, q, url) => `${attr}=${q}${resolve(url, attr === 'src' ? 'image' : 'link')}${q}`),
        )
        .join('');
    })
    .join('');
}

/**
 * Demotes every markdown heading by one level (outside of fenced code).
 */
export function shiftHeadings(src) {
  return src
    .split(/(^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)[ \t]*$)/m)
    .map((part, i) => (i % 2 ? part : part.replace(/^(#{1,5}) /gm, '#$1 ')))
    .join('');
}

export function createLlms(ctx) {
  const { site } = ctx;
  const abs = (path) => site.url + ctx.url(path);
  // doc pages link to their markdown twin, everything else to the absolute site URL
  const toMarkdownUrl = (path) => (path.endsWith('/') ? abs(markdownPath(path)) : abs(path));

  const header = (title, htmlUrl, extra = []) =>
    [`# ${title}`, '', `> Source: ${abs(htmlUrl)}`, ...extra.map((l) => `> ${l}`), ''].join('\n');

  // the page body usually starts with its own H1; avoid duplicating it
  const stripH1 = (body) => body.replace(/^\s*#\s+[^\n]+\n/, '');

  return {
    docPage(project, page) {
      const body = rewriteMarkdownLinks(page.body, createResolver(project, page.repoPath, toMarkdownUrl));
      const n = ctx.nuget[project.id];
      const extra = [`Project: ${project.name} (${project.githubUrl})`];
      if (project.nuget) extra.push(`Package: ${project.nuget}${n?.version ? ` ${n.version}` : ''} — install with \`dotnet add package ${project.nuget}\``);
      if (project.meta?.commit) extra.push(`Docs revision: ${project.meta.commit}`);
      const title = page.isIndex ? `${project.name} Documentation` : `${page.heading} (${project.name})`;
      return `${header(title, page.url, extra)}\n${stripH1(body).trim()}\n`;
    },

    localPage(item, resolve, extra = []) {
      const body = rewriteMarkdownLinks(item.body, (url, kind) => {
        const r = resolve(url, kind);
        return r.startsWith('/') ? site.url + r : r;
      });
      return `${header(item.title, item.url, extra)}\n${stripH1(body).trim()}\n`;
    },

    index({ projects, posts, pages }) {
      const listed = projects.filter((p) => !p.hidden && p.pages.length);
      const core = listed.find((p) => p.category === 'core') || listed[0];
      const coreN = core && ctx.nuget[core.id];
      const link = (title, url, note) => `- [${title}](${url})${note ? `: ${note}` : ''}`;
      const lines = [
        `# ${site.name}`,
        '',
        `> ${site.description}`,
        '',
        'Important notes:',
        '',
        '- AngleSharp is a .NET library (C#). The core package `AngleSharp` has no dependencies and targets .NET Standard 2.0 as well as modern .NET.',
        '- Everything starts from a `BrowsingContext` created with a `Configuration` (e.g. `BrowsingContext.New(Configuration.Default)`); documents are loaded via `context.OpenAsync(...)` or parsed directly with `HtmlParser`.',
        '- The DOM follows the W3C/WHATWG specifications, so the API mirrors the browser DOM in PascalCase (`QuerySelector`, `TextContent`, `GetAttribute`, ...).',
        '- Capabilities beyond the core are opt-in companion packages that extend the configuration, e.g. `.WithCss()` (AngleSharp.Css), `.WithJs()` (AngleSharp.Js), `.WithXml()` (AngleSharp.Xml), `.WithDefaultLoader()` for loading resources.',
        coreN?.version ? `- Latest stable version of the core package: ${coreN.version}.` : null,
        '- Every page linked below is plain markdown. Append `index.html.md` to any page URL of this site to get its markdown version. All documentation in one file: ' + abs('llms-full.txt'),
        '',
        '## Projects',
        '',
        ...listed.map((p) => {
          const n = ctx.nuget[p.id];
          const meta = [p.tagline || p.description, p.nuget ? `NuGet: ${p.nuget}${n?.version ? ` ${n.version}` : ''}` : null, `status: ${p.status}`]
            .filter(Boolean)
            .join(' — ');
          return link(p.name, abs(markdownPath(p.pages[0].url)), meta);
        }),
        '',
      ];

      for (const p of listed) {
        lines.push(`## ${p.name} documentation`, '');
        for (const page of p.pages) {
          lines.push(link(page.isIndex ? 'Overview' : page.title, abs(markdownPath(page.url)), page.isIndex ? p.description : page.sectionTitle));
        }
        lines.push('');
      }

      lines.push('## Optional', '');
      for (const page of pages) lines.push(link(page.title, abs(markdownPath(page.url)), page.description));
      for (const post of posts.slice(0, 10)) {
        lines.push(link(`Blog: ${post.title}`, abs(markdownPath(post.url)), post.date.toISOString().slice(0, 10)));
      }
      lines.push(link('All blog posts', abs('blog/'), `${posts.length} posts, also available as RSS at ${abs('blog/feed.xml')}`));
      lines.push(link('Source code', site.github, 'GitHub organization with all repositories'));
      lines.push('');

      return lines.filter((l) => l !== null).join('\n');
    },

    full({ projects, docs }) {
      const listed = projects.filter((p) => p.pages.length);
      const parts = [
        `# ${site.name} — complete documentation`,
        '',
        `> ${site.description}`,
        '',
        `This file concatenates the documentation of all ${listed.length} AngleSharp projects. Index: ${abs('llms.txt')}`,
        '',
      ];
      for (const p of listed) {
        for (const page of p.pages) {
          parts.push('---', '', shiftHeadings(docs.get(page)), '');
        }
      }
      return parts.join('\n');
    },
  };
}
