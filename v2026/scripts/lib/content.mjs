import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, posix, basename, extname } from 'node:path';
import matter from 'gray-matter';
import { cacheDir, rootDir } from './config.mjs';
import { slugify } from './markdown.mjs';

const ORDER_PREFIX = /^(\d+)[-_. ]+/;

export function titleCase(s) {
  return s
    .replace(ORDER_PREFIX, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function firstHeading(src) {
  const m = src.match(/^#\s+(.+?)\s*#*\s*$/m);
  return m ? m[1].replace(/[*_`]/g, '').trim() : null;
}

/**
 * Removes decorations that make sense on GitHub but not on the website:
 * centered header images and lines consisting only of badges.
 */
function cleanReadme(src) {
  return src
    .replace(/^\s*<p[^>]*align=["']?center["']?[^>]*>[\s\S]*?<\/p>\s*/i, '')
    // a leading standalone image (usually the repository header banner)
    .replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*\n/, '')
    .split('\n')
    .filter((line) => !/^\s*(\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)\s*)+$/.test(line))
    .join('\n');
}

export function plainText(src) {
  return src
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>|#-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(src, max = 220) {
  const para = src
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('<') && !p.startsWith('!['));
  const text = plainText(para || '');
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
}

/**
 * Loads a project's downloaded files and turns them into pages and assets.
 */
export function loadProject(project, config) {
  const base = join(cacheDir, 'projects', project.id);
  const metaFile = join(base, 'meta.json');

  if (!existsSync(metaFile)) {
    return { ...project, available: false, pages: [], assets: new Map(), logoUrl: null };
  }

  const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
  const filesDir = join(base, 'files');
  const ref = meta.commit || project.ref;
  const assets = new Map(); // repo path -> site path
  const pages = [];

  for (const file of meta.files) {
    if (!/\.md$/i.test(file)) {
      assets.set(file, `assets/projects/${project.id}/${file}`);
    }
  }

  if (project.docs) {
    const { root, index } = project.docs;
    const prefix = root ? `${root}/` : '';
    const indexPath = prefix + index;

    for (const file of meta.files) {
      if (!/\.md$/i.test(file) || !file.startsWith(prefix)) continue;
      const rel = file.slice(prefix.length);
      // in repo-root mode only the index is a page (CHANGELOG etc. must be opted-in explicitly)
      const isIndex = file === indexPath;
      const parts = rel.split('/');
      const name = parts.pop();
      const sectionKey = parts[0] || '';
      const orderMatch = name.match(ORDER_PREFIX);
      const pageSlug = slugify(name.replace(ORDER_PREFIX, '').replace(/\.md$/i, ''));
      const raw = readFileSync(join(filesDir, file), 'utf8');
      const { data, content } = matter(raw);
      const body = isIndex ? cleanReadme(content) : content;
      const urlParts = isIndex ? [] : [...parts.map((p) => slugify(p.replace(ORDER_PREFIX, ''))), pageSlug];

      pages.push({
        project,
        repoPath: file,
        isIndex,
        section: isIndex ? '' : sectionKey,
        sectionTitle: config.sections[sectionKey] ?? titleCase(sectionKey || 'Overview'),
        order: isIndex ? -1 : orderMatch ? Number(orderMatch[1]) : 1000,
        name,
        title: isIndex ? 'Overview' : data.title || firstHeading(body) || titleCase(name),
        heading: data.title || firstHeading(body) || titleCase(name),
        data,
        body,
        url: `docs/${project.id}/${urlParts.length ? urlParts.join('/') + '/' : ''}`,
        editUrl: `https://github.com/${project.repo}/edit/${project.ref}/${file}`,
      });
    }

    const sectionKeys = Object.keys(config.sections);
    const sectionRank = (s) => {
      const i = sectionKeys.indexOf(s);
      return i === -1 ? sectionKeys.length : i;
    };
    pages.sort(
      (a, b) =>
        sectionRank(a.section) - sectionRank(b.section) ||
        a.section.localeCompare(b.section) ||
        a.order - b.order ||
        a.name.localeCompare(b.name),
    );
  }

  const byPath = new Map(pages.map((p) => [p.repoPath, p]));

  return {
    ...project,
    available: true,
    meta,
    ref,
    filesDir,
    pages,
    byPath,
    assets,
    logoUrl: project.logo && assets.has(project.logo) ? assets.get(project.logo) : null,
    githubUrl: `https://github.com/${project.repo}`,
    nugetUrl: project.nuget ? `https://www.nuget.org/packages/${project.nuget}` : null,
  };
}

/**
 * Creates a URL resolver for a document located at `repoPath` in `project`.
 * Relative links to other docs become site links, assets become site asset links,
 * and everything else points to GitHub.
 */
export function createResolver(project, repoPath, toSiteUrl) {
  return (url, kind) => {
    if (!url || url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) {
      return url;
    }
    const [, pathPart, suffix = ''] = url.match(/^([^?#]*)(.*)$/);
    const target = pathPart.startsWith('/')
      ? pathPart.slice(1)
      : posix.normalize(posix.join(posix.dirname(repoPath), decodeURIComponent(pathPart)));
    const hash = suffix.startsWith('#') ? suffix : '';

    if (target.startsWith('..')) {
      return url;
    }
    const page = project.byPath.get(target);
    if (page) {
      return toSiteUrl(page.url) + hash;
    }
    if (project.assets.has(target)) {
      return toSiteUrl(project.assets.get(target));
    }
    return kind === 'image'
      ? `https://raw.githubusercontent.com/${project.repo}/${project.ref}/${target}`
      : `https://github.com/${project.repo}/blob/${project.ref}/${target}${hash}`;
  };
}

/**
 * Loads the local blog posts from content/blog.
 */
export function loadBlog() {
  const dir = join(rootDir, 'content', 'blog');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(dir, file), 'utf8'));
      const m = basename(file, extname(file)).match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
      const date = data.date ? new Date(data.date) : m ? new Date(`${m[1]}-${m[2]}-${m[3]}`) : new Date(0);
      const slug = m ? m[4] : basename(file, '.md');
      const year = date.getUTCFullYear();
      const tags = (Array.isArray(data.categories) ? data.categories : String(data.categories || '').split(/\s+/)).filter(
        (t) => t && t !== 'news',
      );
      return {
        file,
        repoPath: `content/blog/${file}`,
        title: data.title || titleCase(slug),
        date,
        author: data.author || null,
        userId: data.userId || null,
        tags,
        body: content,
        excerpt: data.description || excerpt(content),
        readingMinutes: Math.max(1, Math.round(plainText(content).split(' ').length / 220)),
        url: `blog/${year}/${slug}/`,
      };
    })
    .sort((a, b) => b.date - a.date);
}

/**
 * Loads the local standalone pages from content/pages.
 */
export function loadPages() {
  const dir = join(rootDir, 'content', 'pages');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(readFileSync(join(dir, file), 'utf8'));
      const slug = basename(file, '.md');
      return {
        file,
        repoPath: `content/pages/${file}`,
        title: data.title || firstHeading(content) || titleCase(slug),
        description: data.description || excerpt(content),
        body: content,
        url: (data.permalink || `/${slug}/`).replace(/^\//, ''),
      };
    });
}
