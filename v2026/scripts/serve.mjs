#!/usr/bin/env node
/**
 * Tiny static server for ./dist (mimics GitHub Pages: directory index + 404.html).
 *
 *   node scripts/serve.mjs [--port 8080] [--watch]
 *
 * With --watch the site is rebuilt whenever config, content, src, or the cache changes,
 * and open pages reload automatically.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, extname, normalize } from 'node:path';
import { rootDir, distDir } from './lib/config.mjs';

const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 8080;
const watching = args.includes('--watch');
const clients = new Set();

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const reloadSnippet = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let file = normalize(join(distDir, decodeURIComponent(url.pathname)));
  if (!file.startsWith(distDir)) {
    res.writeHead(403).end();
    return;
  }

  try {
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { location: url.pathname + '/' + url.search }).end();
        return;
      }
      file = join(file, 'index.html');
    }
    await send(res, 200, file);
  } catch {
    await send(res, 404, join(distDir, '404.html')).catch(() => res.writeHead(404).end('Not found'));
  }
});

async function send(res, status, file) {
  let body = await readFile(file);
  const type = types[extname(file)] || 'application/octet-stream';
  if (watching && type.startsWith('text/html')) {
    body = body.toString().replace('</body>', `${reloadSnippet}</body>`);
  }
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

server.listen(port, () => {
  console.log(`  ➜ Serving dist/ at http://localhost:${port}/${watching ? ' (watching for changes)' : ''}`);
});

if (watching) {
  let timer;
  let building = false;
  let again = false;

  const build = () => {
    if (building) {
      again = true;
      return;
    }
    building = true;
    const child = spawn(process.execPath, [join(rootDir, 'scripts', 'build.mjs')], { stdio: 'inherit' });
    child.on('exit', (code) => {
      building = false;
      if (code === 0) clients.forEach((c) => c.write('data: reload\n\n'));
      if (again) {
        again = false;
        build();
      }
    });
  };

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  };

  build();
  for (const target of ['site.config.json', 'content', 'src', 'scripts', '.cache', 'public']) {
    try {
      watch(join(rootDir, target), { recursive: true }, schedule);
    } catch {
      // recursive watch is unsupported on some platforms/filesystems; fall back silently
    }
  }
}
