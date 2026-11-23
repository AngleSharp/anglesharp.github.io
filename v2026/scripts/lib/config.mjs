import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, posix } from 'node:path';

export const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const cacheDir = resolve(rootDir, '.cache');
export const distDir = resolve(rootDir, 'dist');

const joinRepoPath = (...parts) => posix.join(...parts.filter(Boolean)).replace(/^\.\/?/, '');

/**
 * Loads `site.config.json` and applies the `defaults` to every project.
 */
export function loadConfig(file = resolve(rootDir, 'site.config.json')) {
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  const defaults = raw.defaults || {};
  const site = {
    basePath: '/',
    since: new Date().getFullYear(),
    ...raw.site,
  };
  site.basePath = ('/' + (site.basePath || '/').replace(/^\/+|\/+$/g, '') + '/').replace(/\/+/g, '/');

  const ids = new Set();
  const projects = (raw.projects || []).map((p) => {
    if (ids.has(p.id)) {
      throw new Error(`Duplicate project id "${p.id}" in site.config.json`);
    }
    ids.add(p.id);
    const [owner, repoName] = p.repo.includes('/') ? p.repo.split('/') : [defaults.owner, p.repo];
    const docs = p.docs === null ? null : { ...defaults.docs, ...p.docs };
    if (docs) {
      docs.root = (docs.root || '').replace(/^\/+|\/+$/g, '');
      docs.include = docs.include || ['**/*.md'];
      docs.exclude = docs.exclude || [];
      docs.index = docs.index || 'README.md';
    }
    return {
      label: p.name,
      category: 'extension',
      status: 'stable',
      tagline: '',
      description: '',
      assets: [],
      hidden: false,
      ...p,
      owner,
      repoName,
      repo: `${owner}/${repoName}`,
      ref: p.ref || defaults.ref || 'main',
      logo: p.logo === undefined ? defaults.logo || null : p.logo,
      docs,
    };
  });

  return { site, sections: raw.sections || {}, projects };
}

/**
 * Returns the repository-relative glob patterns that need to be downloaded for a project.
 */
export function getPatterns(project) {
  const include = [];
  const exclude = [];
  if (project.logo) include.push(project.logo);
  include.push(...project.assets);
  if (project.docs) {
    const { root } = project.docs;
    include.push(...project.docs.include.map((p) => joinRepoPath(root, p)));
    include.push(joinRepoPath(root, project.docs.index));
    exclude.push(...project.docs.exclude.map((p) => joinRepoPath(root, p)));
  }
  return { include, exclude };
}
