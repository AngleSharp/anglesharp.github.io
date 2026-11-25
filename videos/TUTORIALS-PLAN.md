# Plan: AngleSharp tutorial series (6 videos)

> **Status: built.** Videos in `tutorials/` (compositions `Tutorial1` … `Tutorial6`), samples in `../samples/`, narration in `tutorials/narration/part-N.md`. Lengths match the plan exactly. Changes made while building:
> - One `tutorials/` workspace for all six videos instead of one folder each.
> - Part 5: **no upload segment**. There is no public API to attach a file to `<input type=file>` (`FileList` is internal; Core's tests reach it through internals). Redirects and status codes took its place. `WithMockRequester` / `WithVirtualRequester` turned out to be test-project helpers, so the offline segment shows a small `BaseRequester` subclass instead.
> - `DomTree` and `SplitCompare` weren't needed. The goal scenes show the real inputs and outputs instead.
> - Part 6 uses `AngleSharp.Renderer 0.13.0-beta.240` (0.13.0 isn't on nuget.org yet).

These are short, hands-on tutorials. Each video builds **one concrete, useful thing** from start to finish, so viewers learn the APIs by using them for a real purpose. The series starts with the core library, then covers AngleSharp.Css, AngleSharp.Xml, AngleSharp.Io and AngleSharp.Renderer.

| #  | Title                                       | Package(s)          | Length | Builds                                     |
| -- | ------------------------------------------- | ------------------- | ------ | ------------------------------------------ |
| 1  | Finding things: selectors, types, traversal | AngleSharp          | 5:00   | A product-page extractor → JSON            |
| 2  | Changing and generating HTML                | AngleSharp          | 4:30   | A newsletter cleaner: sanitize, rewrite, serialize |
| 3  | Working with styles                         | AngleSharp.Css      | 5:30   | A CSS inliner for HTML emails              |
| 4  | XML, SVG and XHTML                          | AngleSharp.Xml      | 4:00   | A feed reader with config validation       |
| 5  | Real-world browsing                         | AngleSharp.Io       | 5:30   | Cookies, forms and uploads against the test site, then offline tests |
| 6  | From HTML to pixels                         | AngleSharp.Renderer | 6:00   | A social-card (OG image) generator         |

Total: **30:30**. The lengths follow how much each topic needs. XML is narrow, so it gets 4:00. The renderer covers the most ground and has to explain its preview status, so it gets 6:00.

---

## Series format

- **.NET 10 everywhere (decided).** Samples target `net10.0`. Project files on screen show `<TargetFramework>net10.0</TargetFramework>`, and code uses current C# (file-scoped namespaces, top-level statements, `record`s, collection expressions where they help). Only mention the netstandard2.0/net8.0 targets when compatibility comes up.
- **Same look as the intro.** It reuses `shared/`, the dark brand theme and the chapter labels.
- **Opening (~8 s):** "AngleSharp Tutorials · Part N of 6", the title, and the package pill(s).
- **Outro (~12 s):** a recap of the three APIs to remember, "Next: …", and links.
- **Structure inside each video:**
  1. Goal: show the finished result first.
  2. Setup: packages and configuration.
  3. Three or four building blocks, one API cluster each.
  4. Put it together and run it.
  5. Pitfalls, woven into the steps where they happen. There's no separate pitfalls chapter, to keep the videos short.
- **Narration:** read live, as for the other videos. `narration.md` uses timed cue blocks at about 130 wpm, so 5:00 is roughly 650 words.
- **Music:** `tools/generate-music.mjs` with a different `--seed` for each video.

### Companion samples (decided)

Each tutorial gets a runnable .NET 10 console project in **`samples/NN-name/`** at the repository root (next to `v2026/` and `videos/`), referencing the released NuGet packages. Every snippet on screen is copied from these projects, and every terminal output in the video is the **real, captured output**. That fixes two risks from the earlier videos: APIs drifting away from the packages, and output we had to leave out because we couldn't run it. The .NET 10 SDK is installed locally. The samples can also be linked from the video description.

### Shared components to add

| Component       | Needed by | Notes |
| --------------- | --------- | ----- |
| `TutorialOpening` / `TutorialOutro` | all | Part number, title, package pills; recap and "next". |
| `DomTree`       | 1, 2, 4   | Move the tree from `intro/src/scenes/WhatIs.tsx` into `shared/` and add highlight and diff states (added, removed, changed nodes). |
| `BrowserWindow` | 1, 3, 5, 6 | A mock browser with an address bar, for showing pages and results. |
| `NetworkLog`    | 5         | A request/response list (method, URL, status, cookies). |
| `SplitCompare`  | 3, 6      | Before/after with a moving divider (CSS inlining, rendered output). |

---

## 1 · Finding things: selectors, types and traversal (5:00)

**For:** people who have just installed AngleSharp. **Builds:** an extractor that turns a product listing page into JSON.

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:20 | Goal | The listing page next to the JSON it produces. |
| 0:20–1:10 | Parse or load? | `new HtmlParser().ParseDocument(html)` (synchronous, no configuration) vs. `BrowsingContext.New(config).OpenAsync(...)`. When to use which. |
| 1:10–2:20 | Selectors | `QuerySelector` / `QuerySelectorAll`, attribute selectors, `:nth-child`, `Matches()`, `Closest()`. The selector syntax is the browser's. |
| 2:20–3:10 | Typed elements | `QuerySelector<IHtmlAnchorElement>`, `OfType<T>()`. `Href`, `Src` and `Value` are resolved, unlike `GetAttribute`. |
| 3:10–4:00 | Traversal and text | `Children`, `ParentElement`, `NextElementSibling`; `TextContent` vs. `InnerHtml`; trimming whitespace. |
| 4:00–4:40 | Into objects | A LINQ projection into a `record`, then `System.Text.Json`. Run it. |
| 4:40–5:00 | Recap | Next: changing the DOM. |

**Pitfalls in the flow:** `QuerySelector` returns `null`, so use `?.`. `TextContent` includes the text of `<script>` elements. Relative URLs need a document URL (`r.Content(html).Address(url)`).
**Out of scope:** XPath, which deserves its own video if there's demand.

## 2 · Changing and generating HTML (4:30)

**Builds:** a newsletter cleaner. It removes scripts and inline handlers, rewrites links (UTM tags, `target="_blank"`), and outputs clean HTML.

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:20 | Goal | Messy HTML in, clean HTML out, shown with a `DomTree` diff. |
| 0:20–1:10 | Create and insert | `CreateElement`, `Append` / `Prepend` / `Before` / `After`, `ClassList`, `SetAttribute`, `Dataset`. |
| 1:10–2:00 | Remove and replace | `Remove()`, `ReplaceWith`, unwrapping elements. An allowlist walk over elements and attributes. |
| 2:00–2:50 | Fragments | `HtmlParser.ParseFragment(html, contextElement)`; setting `InnerHtml`; why the context element matters (e.g. `<tr>` inside a `<table>`). |
| 2:50–3:50 | Serializing | `ToHtml()`, `OuterHtml`, `Body.InnerHtml`; `Prettify()` / `Minify()`; `PrettyMarkupFormatter`, `MinifyMarkupFormatter`, `XhtmlMarkupFormatter`; why `<html><head><body>` appear. |
| 3:50–4:30 | Run it and recap | |

**Be honest:** an allowlist walk is fine for a demo, but for untrusted input point viewers to a dedicated sanitizer. HtmlSanitizer is built on AngleSharp. Verify this before saying it on screen.

## 3 · Working with styles: AngleSharp.Css (5:30)

**Builds:** a CSS inliner for HTML emails. It computes each element's styles and writes them into `style` attributes, because many email clients ignore `<style>` blocks.

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:25 | Goal | An email in a "client" with and without inlining (`SplitCompare`). |
| 0:25–1:05 | Setup | `dotnet add package AngleSharp.Css`, `WithCss()`. What the core already does (selectors) and what Css adds. |
| 1:05–2:05 | Style sheets as objects | `new CssParser().ParseStyleSheet(css)`, walking `Rules`, `ICssStyleRule.SelectorText` / `.Style`, `GetStyleRuleWith(selector)`, editing, `ToCss()` / `Prettify()`. |
| 2:05–3:05 | Inline styles | `element.GetStyle()`, `SetProperty`, `GetPropertyValue`. |
| 3:05–4:15 | Computed styles | `ComputeCurrentStyle()` (namespace `AngleSharp.Dom`): the cascade, specificity and inheritance shown on a small example; `GetDisplay()` and its sibling helpers. |
| 4:15–4:55 | Media queries | `WithRenderDevice(new DefaultRenderDevice { DeviceWidth = 375, … })`: the same document computed for mobile and for desktop. |
| 4:55–5:30 | Putting it together | The inliner loop, then run it and recap. |

**Pitfall:** inlining every computed property makes huge output. Only write properties that differ from the parent or the default.

## 4 · XML, SVG and XHTML: AngleSharp.Xml (4:00)

**Builds:** a small feed reader for RSS/Atom, plus validation of an XML config file.

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:20 | Goal | The feed read into a list; an invalid config rejected with line numbers. |
| 0:20–1:00 | Why a second parser | Forgiving HTML vs. strict XML: case, self-closing tags, well-formedness. `WithXml()` makes `OpenAsync` use the XML parser for XML content types. |
| 1:00–1:50 | Parsing | `new XmlParser().ParseDocument(xml)`, namespaces, reading the feed with the same DOM API. |
| 1:50–2:30 | Errors | Well-formedness errors; `XmlParserOptions.IsSuppressingErrors` and `IsKeepingSourceReferences` (positions for error messages). |
| 2:30–3:15 | Validation | `document.ValidateXsd(schema)` and its result; mention DTD support briefly. |
| 3:15–3:45 | SVG and XHTML | Loading an SVG as an XML document; `XhtmlMarkupFormatter` for XHTML output. |
| 3:45–4:00 | Recap | |

## 5 · Real-world browsing: AngleSharp.Io (5:30)

**Builds:** a browsing session against the local **AngleSharp.Infrastructure.TestSite** (`../AngleSharp.Infrastructure.TestSite`, `npm run dev` → `http://localhost:8080`), using the endpoints the AngleSharp integration tests already use. The site isn't changed. Using our own test site avoids scraping third-party sites on camera and keeps the output reproducible.

Endpoints used (all present in `src/routes.ts` / `src/testcases.ts`):

| Endpoint | Behavior | Used for |
| -------- | -------- | -------- |
| `GET /test-cases/user-agent` | Echoes the `User-Agent` header as JSON | Requesters, custom headers |
| `GET /test-cases/set-cookies?session=…` | Sets the cookies from the query, then 302 to `/test-cases/get-cookies` | Cookies and redirects in one step |
| `GET /test-cases/get-cookies` | Echoes the received cookies as JSON | Proving the cookie jar works |
| `GET` / `POST /PostUrlencodeNormal` | Form with `Name`, `Number`, `IsActive`; the POST answers `okay` (200) only for `Test` / `1` / checked, otherwise `error` (400) | Filling and submitting a form |
| `GET` / `POST /PostMultipartFile` | File-upload form; checks for `Filename.txt` (`text/plain`, 32 sequential bytes) | Multipart upload |
| `GET /test-cases/redirect?url=…` | 302 to `url` | Following redirects |
| `GET /test-cases/robots` | A robots.txt with `Disallow: /deny` | Being a good citizen |

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:25 | Goal | A `NetworkLog` of the whole flow, ending in "okay". |
| 0:25–1:15 | Requesters | Default loader vs. `WithRequesters()` (HttpClient-based, optional `HttpClientHandler` for proxies, certificates and decompression); a custom user agent, shown by `/test-cases/user-agent`. |
| 1:15–2:15 | Cookies | `WithTemporaryCookies()`: `set-cookies` → redirect → `get-cookies` shows the session cookie coming back. `WithPersistentCookies(path)` keeps it across runs (run the sample twice). |
| 2:15–3:15 | Forms | Open `/PostUrlencodeNormal`, fill `Name`, `Number`, check `IsActive`, `form.SubmitAsync()`, read "okay". Then a wrong value gives "error" (400), which shows how to check the response status. |
| 3:15–4:05 | Uploads | `/PostMultipartFile`: setting a file on an `<input type="file">` and submitting multipart data. **Check the AngleSharp.Core `FormSubmitTests` for the exact API used to attach a file**, and copy it. |
| 4:05–4:55 | Testing without a network | `WithMockRequester` / `WithVirtualRequester`: the same flow as a deterministic test, no server running. |
| 4:55–5:30 | Be a good citizen, and recap | `/test-cases/robots`, rate limits, terms of service. |

**Downloads** (`WithStandardDownload`) get one sentence only. The test site has no download endpoint, and we don't demo what we can't run.
**Check first:** the exact signatures of `WithMockRequester` and `WithVirtualRequester`, and how `FormSubmitTests` attaches files. Not in code: `WithIo()` with no arguments, because only `WithIo(IoOptions)` exists locally.

## 6 · From HTML to pixels: AngleSharp.Renderer (6:00, preview)

**Builds:** a social-card generator. It fills an HTML/CSS template with data and renders a 1200×630 PNG, with no browser and no headless Chrome.

| Time      | Segment | Content |
| --------- | ------- | ------- |
| 0:00–0:30 | Goal | Three generated cards appear. |
| 0:30–1:10 | What the renderer is | Layout and paint on top of the Css render tree, drawn with SkiaSharp. What works (flex, grid, subgrid, …), and that it is **preview** and not meant for arbitrary websites. |
| 1:10–2:10 | First render | `WithCss().WithRendering()`, `document.RenderToPng()`, saving `.Data`. |
| 2:10–3:00 | Controlling output | Viewport via the render device (`DeviceWidth` / `DeviceHeight`); `RenderToImage(new RenderOptions { FullPage = …, Clip = … })`; `element.RenderToImage()` for a single component. |
| 3:00–4:00 | The template | Data into the HTML, fonts and images (images need a loader), then render a batch. |
| 4:00–4:50 | SVG to PNG | Badges and charts from SVG markup. |
| 4:50–5:30 | Canvas 2D | `GetContext("2d")`, drawing, `ToImage("image/png")`; `getImageData` / `putImageData` (new in 0.13). |
| 5:30–6:00 | Limits, roadmap and recap | Renderer 1.0 is coming this year. |

**Timing:** produce this one **last**, ideally right after Renderer 1.0 ships, so it isn't labeled "preview" for its whole life and preview APIs don't change under it. If it has to come earlier, re-check every API against the package version used.

---

## Production order

1. **Part 1, querying.** The broadest audience, and it sets the series template (the shared opening/outro and `DomTree` are built here).
2. **Part 3, Css.** The most often asked about after querying.
3. **Part 5, Io.** Runs against the existing test site; the sample needs it running at `localhost:8080`.
4. **Part 2, generating HTML.** Reuses Part 1's components.
5. **Part 4, Xml.**
6. **Part 6, Renderer.** Timed for Renderer 1.0.

Rough effort per video: samples project and API checks, then scenes, then stills and fixes, then narration with pacing checks and music. Parts 1 and 6 take longer: Part 1 because of the series components, Part 6 because of rendered output and checking it against the package version.

## Decisions

- **.NET 10** on screen and in the samples.
- **Samples** live in `samples/` in this repository.
- **Part 5** uses the existing test-site flows; the site isn't changed.
- **Follow-ups** (XPath, Js, Diffing/bUnit) come later, after these six.
