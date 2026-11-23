# AngleSharp Website — 2026 edition

A static site generator for [anglesharp.github.io](https://anglesharp.github.io). Unlike the previous pidoc/Piral-based site, the docs are **not** maintained here. They are downloaded from each project's repository, as declared in [`site.config.json`](./site.config.json).

```
site.config.json ──► npm run fetch ──► .cache/ ──► npm run build ──► dist/
 (projects, refs,     (GitHub tarballs,            (markdown, shiki,      (static HTML,
  docs paths, logos)   NuGet stats)                 templates)             GitHub Pages)
```

## Quick start

```sh
npm install
npm start          # fetch + build + serve on http://localhost:8080
```

| Command | Description |
|---|---|
| `npm run fetch` | Downloads docs/assets of all projects into `.cache/` and NuGet stats into `.cache/nuget.json` |
| `npm run fetch -- --only css,js` | Re-fetches only selected projects (by `id`) |
| `npm run fetch -- --skip-nuget` | Skips the NuGet stats query |
| `npm run build` | Generates the site into `dist/` (`-- --base /v2026/` to serve from a sub-path) |
| `npm run serve` | Serves `dist/` like GitHub Pages does (directory index + `404.html`) |
| `npm run dev` | Serves, rebuilds on changes, and live-reloads the browser |

Requires Node.js 20+.

## Adding or changing a project

Everything about a project is configured in `site.config.json`, which is described by [`site.config.schema.json`](./site.config.schema.json) so editors offer completion and validation. A minimal entry:

```json
{
  "id": "xpath",
  "name": "AngleSharp.XPath",
  "repo": "AngleSharp/AngleSharp.XPath",
  "ref": "master",
  "nuget": "AngleSharp.XPath",
  "tagline": "Select nodes via XPath expressions."
}
```

Values missing from a project are taken from `defaults`:

| Field | Default | Meaning |
|---|---|---|
| `ref` | `devel` | Branch, tag, or commit SHA to download |
| `logo` | `logo.png` | Logo path in the repository (`null` disables it) |
| `docs.root` | `docs` | Docs folder in the repository (`""` for the repository root) |
| `docs.index` | `README.md` | Landing page of the project docs |
| `docs.include` | markdown + images | Globs (relative to `docs.root`) of files to download |
| `docs.exclude` | — | Globs to skip |
| `assets` | — | Extra repository files to publish under `/assets/projects/<id>/` |

Projects without a `docs/` folder (e.g. Diffing, XPath) use `"docs": { "root": "", "include": ["README.md"] }` so the README becomes the documentation page.

### How docs are mapped

- `docs/README.md` → `/docs/<id>/`
- `docs/general/01-Basics.md` → `/docs/<id>/general/basics/` (numeric prefixes define the order)
- First-level folders become sidebar sections; their labels come from `sections` in the config.
- Page titles come from the front matter `title`, else from the first `# heading`.
- Relative links to other docs become site links, linked images are published with the site, and links to any other repository file point to GitHub.
- Badges and the centered header banner at the top of a README are removed, since the site renders its own project header.

### Working on docs locally

Point `SITE_LOCAL_ROOT` at a folder that contains your checkouts to read docs from disk instead of GitHub:

```sh
SITE_LOCAL_ROOT=~/Code/AngleSharp npm run fetch -- --only css
npm run dev
```

A project is read from `<SITE_LOCAL_ROOT>/<repo name>`, or from `<SITE_LOCAL_ROOT>/<localPath>` if `localPath` is set in the config (e.g. `AngleSharp.Core`).

`GITHUB_TOKEN` is used if set (for the commit lookup via the GitHub API and for private repositories).

## Local content

| Path | Becomes |
|---|---|
| `content/blog/YYYY-MM-DD-slug.md` | `/blog/YYYY/slug/` + entry in `/blog/feed.xml` |
| `content/pages/*.md` | `/<name>/`, or the front matter `permalink` |
| `content/images/` | `/assets/content/images/` (reference as `../images/x.png`) |
| `public/` | copied verbatim to the site root |

## Structure

```
scripts/
  fetch.mjs            download step
  build.mjs            build step
  serve.mjs            static server with optional watch/live-reload
  lib/config.mjs       config loading and defaults
  lib/content.mjs      docs model, link rewriting, blog/pages loading
  lib/markdown.mjs     markdown-it + shiki (dual light/dark themes)
  lib/templates.mjs    page templates
  lib/icons.mjs        inline SVG icons and the logo mark
  lib/llms.mjs         llms.txt, llms-full.txt, and per-page markdown
src/
  styles.css           the design (dark/light via CSS variables)
  app.js               theme toggle, search (Ctrl/⌘ K), code tabs, copy buttons, TOC scrollspy
```

## LLM support

Following the [llms.txt](https://llmstxt.org) proposal, the build emits:

| URL | Content |
|---|---|
| `/llms.txt` | Index: summary, key usage notes, all projects with NuGet versions, and every doc page |
| `/llms-full.txt` | The documentation of all projects concatenated into one markdown file |
| `<page>/index.html.md` | A clean markdown version of every doc page, blog post, and content page |

The markdown versions use absolute links: links to other docs point to their markdown versions, and images point to the published assets. Each one starts with its source URL, the NuGet package, and the docs commit. HTML pages advertise their markdown version via `<link rel="alternate" type="text/markdown">`, and doc pages have a "View as Markdown" link. The llms.txt text lives in `scripts/lib/llms.mjs`.

The build also emits `search-index.json` (client-side search), `sitemap.xml`, `robots.txt`, `404.html`, `.nojekyll`, and `build.json`, which records the commit each project's docs were built from.
