// Generates the performance charts of the AngleSharp 1.11.0 blog post (light and dark variant each).
// Run: node scripts/charts/perf-111.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'images');

const THEMES = {
  light: { surface: '#ffffff', text: '#0d1729', dim: '#536079', faint: '#8691a6', grid: 'rgba(15,35,70,0.08)', axis: 'rgba(15,35,70,0.2)', before: '#8a95a8', after: '#0a6fd1' },
  dark: { surface: '#0c1220', text: '#e7eef8', dim: '#93a1b8', faint: '#5f6d84', grid: 'rgba(148,178,230,0.08)', axis: 'rgba(148,178,230,0.22)', before: '#6b7891', after: '#36c5f4' },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// a bar anchored at x0 with a 4px rounded data end on the right
function bar(x0, y, w, h, fill) {
  const r = Math.min(4, w / 2, h / 2);
  if (w <= 0) return '';
  return `<path d="M${x0},${y} H${x0 + w - r} Q${x0 + w},${y} ${x0 + w},${y + r} V${y + h - r} Q${x0 + w},${y + h} ${x0 + w - r},${y + h} H${x0} Z" fill="${fill}"/>`;
}

/**
 * rows: [{ label, sub?, before, after }]
 * format(v): label of a value; ticks: values of the grid lines; max: end of the scale
 */
function chart({ title, subtitle, legend, rows, max, ticks, format, note }, theme) {
  const t = THEMES[theme];
  const W = 760;
  const left = 236;
  const right = 120;
  const plotW = W - left - right;
  const top = 96;
  const barH = 12;
  const gap = 2;
  const rowH = 52;
  const plotH = rows.length * rowH;
  const H = top + plotH + 40 + (note ? 18 : 0);
  const x = (v) => left + (v / max) * plotW;
  const font = `font-family="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"`;

  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d" ${font}>`);
  out.push(`<title id="t">${esc(title)}</title>`);
  out.push(`<desc id="d">${esc(subtitle)}. ${rows.map((r) => `${r.label}${r.sub ? ` (${r.sub})` : ''}: ${legend[0]} ${format(r.before)}, ${legend[1]} ${format(r.after)}`).join('; ')}.</desc>`);
  out.push(`<rect width="${W}" height="${H}" rx="12" fill="${t.surface}"/>`);
  out.push(`<text x="24" y="36" font-size="18" font-weight="600" fill="${t.text}">${esc(title)}</text>`);
  out.push(`<text x="24" y="58" font-size="13" fill="${t.dim}">${esc(subtitle)}</text>`);

  // legend
  let lx = left;
  legend.forEach((name, i) => {
    out.push(`<rect x="${lx}" y="72" width="12" height="12" rx="3" fill="${i === 0 ? t.before : t.after}"/>`);
    out.push(`<text x="${lx + 18}" y="82.5" font-size="12" fill="${t.dim}">${esc(name)}</text>`);
    lx += 18 + name.length * 7 + 24;
  });

  // grid + ticks
  for (const v of ticks) {
    out.push(`<line x1="${x(v)}" x2="${x(v)}" y1="${top - 4}" y2="${top + plotH}" stroke="${t.grid}" stroke-width="1"/>`);
    out.push(`<text x="${x(v)}" y="${top + plotH + 18}" font-size="11" fill="${t.faint}" text-anchor="middle">${esc(format(v))}</text>`);
  }
  out.push(`<line x1="${left}" x2="${left}" y1="${top - 4}" y2="${top + plotH}" stroke="${t.axis}" stroke-width="1"/>`);

  rows.forEach((r, i) => {
    const y = top + i * rowH + (rowH - (2 * barH + gap)) / 2;
    const mid = y + barH + gap / 2;
    out.push(`<text x="${left - 14}" y="${r.sub ? mid - 3 : mid + 4.5}" font-size="13" font-weight="500" fill="${t.text}" text-anchor="end">${esc(r.label)}</text>`);
    if (r.sub) out.push(`<text x="${left - 14}" y="${mid + 12}" font-size="11" fill="${t.dim}" text-anchor="end">${esc(r.sub)}</text>`);
    out.push(bar(left, y, x(r.before) - left, barH, t.before));
    out.push(bar(left, y + barH + gap, x(r.after) - left, barH, t.after));
    out.push(`<text x="${x(r.before) + 6}" y="${y + 10}" font-size="11" fill="${t.dim}">${esc(format(r.before))}</text>`);
    const change = Math.round((1 - r.after / r.before) * 100);
    const label = change >= 1 ? `${format(r.after)}  −${change}%` : change <= -1 ? `${format(r.after)}  +${-change}%` : `${format(r.after)}  ±0%`;
    out.push(`<text x="${x(r.after) + 6}" y="${y + barH + gap + 10}" font-size="11" font-weight="600" fill="${t.text}">${esc(label)}</text>`);
  });

  if (note) out.push(`<text x="24" y="${H - 16}" font-size="11" fill="${t.faint}">${esc(note)}</text>`);
  out.push('</svg>');
  return out.join('\n') + '\n';
}

const ms = (v) => (v === 0 ? '0' : Number.isInteger(v) || v >= 100 ? `${Math.round(v)} ms` : v >= 10 ? `${v.toFixed(1)} ms` : `${v.toFixed(2)} ms`);
const us = (v) => (v === 0 ? '0' : v >= 1000 ? `${(v / 1000).toFixed(2)} ms` : `${Math.round(v)} µs`);

// Data: see the blog post for where each number comes from.
import data from './perf-111.json' with { type: 'json' };

const charts = {
  'perf-111-selectors': {
    title: 'CSS selectors: AngleSharp 1.10.0 → 1.11.0',
    subtitle: 'Mean time per operation, lower is better',
    legend: ['AngleSharp 1.10.0', 'AngleSharp 1.11.0'],
    rows: data.selectors,
    format: us,
    ...data.selectorsScale,
    note: data.note,
  },
  'perf-111-render-tree': {
    title: 'CSS render tree: AngleSharp.Css 1.4.0 → 1.6.0',
    subtitle: 'Mean time per operation, 3,000 elements styled by a real-world sheet, lower is better',
    legend: ['AngleSharp.Css 1.4.0', 'AngleSharp.Css 1.6.0'],
    rows: data.renderTree,
    format: ms,
    ...data.renderTreeScale,
    note: data.note,
  },
  'perf-111-rendering': {
    title: 'Rendering the first frame: AngleSharp.Renderer',
    subtitle: 'Time to prepare a 1280×800 frame with the optimizations since 0.11.0, lower is better',
    legend: ['Before', 'After'],
    rows: data.rendering,
    format: ms,
    max: 400,
    ticks: [0, 100, 200, 300, 400],
    note: 'Median of the last 15 of 30 iterations, Linux, .NET 10, from the AngleSharp.Renderer benchmark baseline.',
  },
};

for (const [name, spec] of Object.entries(charts)) {
  for (const theme of Object.keys(THEMES)) {
    writeFileSync(join(outDir, `${name}-${theme}.svg`), chart(spec, theme));
  }
}
console.log('Charts written to', outDir);
