import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import { createHighlighter } from 'shiki';

const LANGS = ['csharp', 'html', 'xml', 'css', 'javascript', 'typescript', 'json', 'powershell', 'shellscript', 'yaml', 'diff'];

const ALIASES = {
  cs: 'csharp',
  'c#': 'csharp',
  csharp: 'csharp',
  ps1: 'powershell',
  ps: 'powershell',
  pwsh: 'powershell',
  powershell: 'powershell',
  sh: 'shellscript',
  bash: 'shellscript',
  shell: 'shellscript',
  console: 'shellscript',
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  html: 'html',
  htm: 'html',
  xml: 'xml',
  xhtml: 'xml',
  svg: 'xml',
  css: 'css',
  json: 'json',
  yml: 'yaml',
  yaml: 'yaml',
  diff: 'diff',
};

const LABELS = {
  csharp: 'C#',
  powershell: 'PowerShell',
  shellscript: 'Shell',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  html: 'HTML',
  xml: 'XML',
  css: 'CSS',
  json: 'JSON',
  yaml: 'YAML',
  diff: 'Diff',
};

export const THEMES = { light: 'github-light', dark: 'github-dark-default' };

export function slugify(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Creates the markdown renderer.
 *
 * `render(source, env)` accepts an env with:
 *  - resolveUrl(url, kind): rewrites hrefs / srcs ('link' | 'image')
 * and returns { html, headings: [{ level, id, text }] }.
 */
export async function createMarkdown() {
  const highlighter = await createHighlighter({ themes: Object.values(THEMES), langs: LANGS });

  const highlight = (code, info = '') => {
    const raw = info.trim().split(/\s+/)[0].toLowerCase();
    const lang = ALIASES[raw] || (LANGS.includes(raw) ? raw : null);
    const label = lang ? LABELS[lang] : raw ? raw.toUpperCase() : 'Text';
    const body = lang
      ? highlighter.codeToHtml(code, { lang, themes: THEMES, defaultColor: false })
      : `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
    return (
      `<div class="code-block">` +
      `<div class="code-head"><span class="code-lang">${escapeHtml(label)}</span>` +
      `<button class="copy-btn" type="button" aria-label="Copy code">Copy</button></div>` +
      body +
      `</div>`
    );
  };

  const md = new MarkdownIt({ html: true, linkify: true, typographer: false });

  md.use(anchor, {
    level: [2, 3],
    slugify,
    permalink: anchor.permalink.linkInsideHeader({ symbol: '#', placement: 'after', ariaHidden: true, class: 'anchor' }),
    callback(token, { slug, title }) {
      md.__env?.headings?.push({ level: Number(token.tag.slice(1)), id: slug, text: title });
    },
  });

  // h1 also gets an id (without permalink) so in-page links work
  const defaultHeadingOpen = md.renderer.rules.heading_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
    const t = tokens[idx];
    if (t.tag === 'h1' && !t.attrGet('id')) {
      t.attrSet('id', slugify(tokens[idx + 1].content));
    }
    return defaultHeadingOpen(tokens, idx, opts, env, self);
  };

  md.renderer.rules.fence = (tokens, idx) => highlight(tokens[idx].content, tokens[idx].info);
  md.renderer.rules.code_block = (tokens, idx) => highlight(tokens[idx].content, '');

  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';

  const defaultLinkOpen = md.renderer.rules.link_open || ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
    const t = tokens[idx];
    const href = t.attrGet('href');
    if (href && env.resolveUrl) t.attrSet('href', env.resolveUrl(href, 'link'));
    const final = t.attrGet('href') || '';
    if (/^https?:\/\//.test(final) && !(env.isInternal && env.isInternal(final))) {
      t.attrSet('target', '_blank');
      t.attrSet('rel', 'noopener');
    }
    return defaultLinkOpen(tokens, idx, opts, env, self);
  };

  const defaultImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, idx, opts, env, self) => {
    const t = tokens[idx];
    const src = t.attrGet('src');
    if (src && env.resolveUrl) t.attrSet('src', env.resolveUrl(src, 'image'));
    t.attrSet('loading', 'lazy');
    return defaultImage(tokens, idx, opts, env, self);
  };

  const rewriteHtml = (html, env) =>
    env.resolveUrl
      ? html.replace(/\b(src|href)=(["'])([^"']*)\2/g, (_, attr, q, url) => `${attr}=${q}${env.resolveUrl(url, attr === 'src' ? 'image' : 'link')}${q}`)
      : html;
  md.renderer.rules.html_block = (tokens, idx, opts, env) => rewriteHtml(tokens[idx].content, env);
  md.renderer.rules.html_inline = (tokens, idx, opts, env) => rewriteHtml(tokens[idx].content, env);

  return {
    highlight,
    render(source, env = {}) {
      const headings = [];
      md.__env = { headings };
      const html = md.render(source, env);
      md.__env = null;
      return { html, headings };
    },
    renderInline(source) {
      return md.renderInline(source);
    },
  };
}
