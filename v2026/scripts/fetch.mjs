#!/usr/bin/env node
/**
 * Downloads the docs and assets of all projects listed in `site.config.json`.
 *
 *   node scripts/fetch.mjs                  # fetch everything
 *   node scripts/fetch.mjs --only css,js    # fetch selected projects
 *   node scripts/fetch.mjs --skip-nuget     # do not query NuGet stats
 *
 * Environment:
 *   GITHUB_TOKEN      optional, used for the GitHub API (commit lookup) and private repos
 *   SITE_LOCAL_ROOT   optional, folder containing local checkouts (e.g. ~/Code/AngleSharp);
 *                     a project is read from <SITE_LOCAL_ROOT>/<localPath or repo name> if that folder exists
 *
 * Output: .cache/projects/<id>/{files/**, meta.json} and .cache/nuget.json
 */
import { mkdir, rm, rename, writeFile, readdir, copyFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { join, relative, resolve, dirname, sep } from 'node:path';
import { x as untar } from 'tar';
import { loadConfig, getPatterns, cacheDir } from './lib/config.mjs';
import { matches } from './lib/glob.mjs';

const args = process.argv.slice(2);
const only = getArg('--only')?.split(',').map((s) => s.trim());
const skipNuget = args.includes('--skip-nuget');
const localRoot = process.env.SITE_LOCAL_ROOT;
const token = process.env.GITHUB_TOKEN;

const { projects } = loadConfig();
const selected = only ? projects.filter((p) => only.includes(p.id)) : projects;

if (only && selected.length !== only.length) {
  const unknown = only.filter((id) => !projects.some((p) => p.id === id));
  fail(`Unknown project id(s): ${unknown.join(', ')}`);
}

await mkdir(join(cacheDir, 'projects'), { recursive: true });

const results = await mapLimit(selected, 4, async (project) => {
  try {
    const info = await fetchProject(project);
    console.log(`  ✓ ${project.name.padEnd(22)} ${info.files} files  (${info.source})`);
    return { project, ok: true };
  } catch (err) {
    console.error(`  ✗ ${project.name.padEnd(22)} ${err.message}`);
    return { project, ok: false };
  }
});

if (!skipNuget) {
  await fetchNuget(projects);
}

const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  fail(`${failed.length} project(s) failed to fetch.`);
}

// ---------------------------------------------------------------------------

async function fetchProject(project) {
  const target = join(cacheDir, 'projects', project.id);
  const staging = `${target}.tmp-${process.pid}`;
  const filesDir = join(staging, 'files');
  const { include, exclude } = getPatterns(project);
  const accept = (path) => path && matches(path, include) && !matches(path, exclude);
  const localDir = localRoot && resolve(localRoot, project.localPath || project.repoName);
  let source;

  await rm(staging, { recursive: true, force: true });
  await mkdir(filesDir, { recursive: true });

  if (localDir && existsSync(localDir)) {
    source = `local: ${localDir}`;
    await copyLocal(localDir, filesDir, accept);
  } else {
    source = `${project.repo}@${project.ref}`;
    await downloadTarball(project, filesDir, accept);
  }

  const files = await listFiles(filesDir);

  if (project.docs && !files.includes(joinPath(project.docs.root, project.docs.index))) {
    await rm(staging, { recursive: true, force: true });
    throw new Error(`docs index "${joinPath(project.docs.root, project.docs.index)}" not found in ${source}`);
  }

  const meta = {
    id: project.id,
    repo: project.repo,
    ref: project.ref,
    commit: localDir && existsSync(localDir) ? null : await resolveCommit(project),
    source,
    fetchedAt: new Date().toISOString(),
    files,
  };

  await writeFile(join(staging, 'meta.json'), JSON.stringify(meta, null, 2));
  await rm(target, { recursive: true, force: true });
  await rename(staging, target);
  return { files: files.length, source };
}

async function downloadTarball(project, dest, accept) {
  // codeload is not subject to the GitHub API rate limit and accepts branches, tags, and SHAs
  const url = `https://codeload.github.com/${project.repo}/tar.gz/${encodeURIComponent(project.ref)}`;
  const res = await fetch(url, { headers: token ? { authorization: `token ${token}` } : {} });

  if (!res.ok) {
    throw new Error(`GET ${url} → ${res.status} ${res.statusText}`);
  }

  await pipeline(
    Readable.fromWeb(res.body),
    untar({
      cwd: dest,
      strip: 1,
      // the archive has a single top-level folder `<repo>-<ref>/`
      filter: (path, entry) => entry.type === 'File' && accept(path.split('/').slice(1).join('/')),
    }),
  );
}

async function copyLocal(src, dest, accept) {
  const skip = new Set(['.git', 'node_modules', 'bin', 'obj', '.vs', '.idea']);
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        const rel = relative(src, full).split(sep).join('/');
        if (accept(rel)) {
          await mkdir(dirname(join(dest, rel)), { recursive: true });
          await copyFile(full, join(dest, rel));
        }
      }
    }
  };
  await walk(src);
}

async function resolveCommit(project) {
  try {
    const res = await fetch(`https://api.github.com/repos/${project.repo}/commits/${encodeURIComponent(project.ref)}`, {
      headers: {
        accept: 'application/vnd.github.sha',
        'user-agent': 'anglesharp-website-builder',
        ...(token ? { authorization: `token ${token}` } : {}),
      },
    });
    return res.ok ? (await res.text()).trim() : null;
  } catch {
    return null;
  }
}

async function fetchNuget(projects) {
  const file = join(cacheDir, 'nuget.json');
  const packages = projects.filter((p) => p.nuget);
  const query = async (id, prerelease) => {
    const url = `https://azuresearch-usnc.nuget.org/query?q=packageid:${encodeURIComponent(id)}&prerelease=${prerelease}&semVerLevel=2.0.0&take=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const { data } = await res.json();
    return data[0] || null;
  };

  const stats = {};
  await mapLimit(packages, 5, async (p) => {
    try {
      const [stable, pre] = await Promise.all([query(p.nuget, false), query(p.nuget, true)]);
      const latest = stable || pre;
      if (!latest) return;
      stats[p.id] = {
        package: p.nuget,
        version: stable?.version || null,
        prerelease: pre && pre.version !== stable?.version ? pre.version : null,
        downloads: latest.totalDownloads,
      };
    } catch (err) {
      console.warn(`  ! NuGet stats for ${p.nuget} unavailable (${err.message})`);
    }
  });

  await writeFile(file, JSON.stringify({ fetchedAt: new Date().toISOString(), packages: stats }, null, 2));
  console.log(`  ✓ NuGet stats for ${Object.keys(stats).length}/${packages.length} packages`);
}

// ---------------------------------------------------------------------------

async function listFiles(dir) {
  const out = [];
  const walk = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else out.push(relative(dir, full).split(sep).join('/'));
    }
  };
  if ((await stat(dir)).isDirectory()) await walk(dir);
  return out.sort();
}

function joinPath(...parts) {
  return parts.filter(Boolean).join('/');
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

function getArg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
