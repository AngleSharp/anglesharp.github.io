# Introduction to AngleSharp: narration

Script for narrating the 8:00 video live, or for recording a voice-over. Every block starts with a **timecode** (mm:ss into the video) and a short note on what appears on screen at that moment. Start talking when the cue appears.

## Before you start

- **Video:** render with `npm run render:intro` (it has the background music) or with `npm run render:intro:silent` (no music, for example if you play your own).
- **Music:** ambient track at about -28 LUFS in the video, which is roughly 12 dB under a normal speaking voice. If you play it through room speakers while talking, you can turn it down further: render with `--props='{"musicVolume":0.2}'`.
- **Pace:** the text is written for about **130–140 words per minute**, which is a calm presenting pace. Each block lists its word count and the time you have for it.
- **Running behind?** Sentences in *(parentheses)* are optional. Drop them to catch up. Running ahead? Pause, or let a visual finish on its own. The music fills the gaps.
- The video fades between scenes (0.5 s overlap), so it's fine to finish a sentence while the next scene fades in.

| #  | Scene        | Starts | Length | Words |
| -- | ------------ | ------ | ------ | ----- |
| 0  | Opening      | 0:00   | 0:15   | 34    |
| 1  | What is it   | 0:14.5 | 0:45   | 104   |
| 2  | Use cases    | 0:59   | 0:40   | 80    |
| 3  | Philosophy   | 1:38.5 | 0:55   | 103   |
| 4  | Install      | 2:33   | 0:30   | 53    |
| 5  | Ecosystem    | 3:02.5 | 0:30   | 62    |
| 6  | Extensions   | 3:32   | 1:11   | 151   |
| 7  | End to end   | 4:42.5 | 1:10   | 146   |
| 8  | Pitfalls     | 5:52   | 0:55   | 120   |
| 9  | Ideas        | 6:46.5 | 0:50   | 92    |
| 10 | Outro        | 7:36   | 0:24   | 46    |

---

## 0 · Opening (0:00)

**0:00** · *Floating angle-bracket glyphs, then the AngleSharp logo and name.* (14 s)

> Angle brackets are everywhere: HTML, SVG, XML. In .NET, one library handles them properly — AngleSharp.
> In the next eight minutes: what it is, how to use it, and what you can build with it.

## 1 · What is AngleSharp? (0:14.5)

**0:14.5** · *"What is AngleSharp?" Five bullets appear one by one, about every 3 s.* (23 s)

> AngleSharp is a .NET library that turns markup into a real DOM.
> It parses HTML5, CSS, SVG, MathML and XML, and builds the same tree a browser would.
> It implements the W3C and WHATWG specifications in pure managed code.
> It's MIT licensed, around since 2013, and a .NET Foundation member since 2019.

**0:38** · *Broken HTML on the left. At 0:44 the resulting DOM tree builds up on the right.* (21 s)

> Real-world HTML is messy. Here, the list items are never closed, and the bold tag never ends.
> AngleSharp runs the exact HTML5 parsing algorithm. It adds html, head and body, closes each list item, and nests the bold text — just like every browser does.
> *(You get the browser's DOM, not a guess.)*

## 2 · When is it useful? (0:59)

**0:59** · *Six cards, one about every 3 s: Scraping, Sanitizing, Testing, Generating, Headless browsing, Auditing.* (26 s)

> So when should you reach for AngleSharp?
> Scraping: pulling structured data out of pages with CSS selectors.
> Sanitizing and rewriting HTML.
> Testing markup — bUnit, for example, uses AngleSharp to verify Blazor components.
> Generating HTML, SVG or XML from code.
> Headless browsing, with cookies, forms and even scripts.
> And auditing whole sites for SEO, accessibility or broken links.

**1:25** · *Note at the bottom: when to use Playwright instead.* (13 s)

> To be fair: pixel-perfect screenshots of arbitrary websites aren't its job. For that, a real browser driven by Playwright is the better tool.

## 3 · Philosophy (1:38.5)

**1:38.5** · *"Don't reinvent the wheel — mirror the spec." JavaScript code on the left, C# on the right.* (11 s)

> One principle drives AngleSharp: don't reinvent the wheel — mirror the spec.
> On the left, JavaScript in a browser. On the right, C# with AngleSharp.

**1:49.5** · *Lines 1–2 highlighted on both sides.* (5 s)

> First, we get a document.

**1:54.5** · *`querySelectorAll` highlighted.* (5 s)

> querySelectorAll becomes QuerySelectorAll — same selector.

**1:59.5** · *The loop highlighted.* (5 s)

> textContent and href become TextContent and Href.

**2:04.5** · *Create and append highlighted.* (9 s)

> Creating and appending elements? Same names, same behavior.

**2:13.5** · *Three cards: Spec first, Familiar names, Interfaces everywhere. At 2:22.5: "Your knowledge transfers — in both directions."* (19 s)

> This is deliberate. Behavior follows the W3C and WHATWG algorithms. The names are the DOM names, in .NET's PascalCase. And interfaces like IHtmlAnchorElement mirror the spec's IDL.
> So your knowledge transfers both ways. If you know the DOM from MDN, you already know AngleSharp — *(and what you learn here works in the browser, too.)*

## 4 · Getting started (2:33)

**2:33** · *Terminal: `dotnet new console`, then `dotnet add package AngleSharp` at 2:38.* (9 s)

> Getting started takes one command. Create a console app, then: dotnet add package AngleSharp. No native dependencies.

**2:42** · *Program.cs types in line by line, then the key lines are highlighted.* (9 s)

> Take the default configuration, create a browsing context, open a document from some content — and query it.

**2:51** · *`dotnet run` prints "Hello, AngleSharp!"* (11 s)

> Run it, and there's our heading.
> *(It runs on netstandard 2.0, .NET 8 and .NET 10, on any OS.)*

## 5 · The ecosystem (3:02.5)

**3:02.5** · *Diagram builds bottom-up: Core at 3:04, Extensions at 3:07.5, Tooling at 3:13.5.* (16 s)

> AngleSharp is more than one package.
> At the bottom is the core: the HTML5 parser, the DOM, CSS selectors, and the configuration and browsing context.
> Extensions sit on top, and tooling like Diffing and Browser above them.

**3:18.5** · *Code line: `Configuration.Default.WithCss().WithJs().WithDefaultLoader()`.* (13 s)

> The core stays lean; everything else is opt-in. Each extension registers itself on the configuration — WithCss, WithJs — and the browsing context picks it up automatically.

## 6 · A tour of the extensions (3:32)

The list on the left moves on every **7.7 s**. One or two sentences per extension is all you have time for.

**3:32** · *List of nine extensions.* (2 s)

> A quick tour.

**3:34** · *Css* (7.7 s)

> Css: a full CSS parser, the CSSOM and computed styles. The cascade is big, so it's opt-in.

**3:41.5** · *Js* (7.7 s)

> Js runs scripts with the Jint engine. Most scrapers skip it; if you need it, it's one line.

**3:49.5** · *Xml* (7.7 s)

> Xml: XML, XHTML and SVG documents, plus DTD validation. Strict rules, separate parser — same DOM API.

**3:57** · *Io* (7.7 s)

> Io: better requesters, cookies, downloads, storage and caching — what real-world browsing needs.

**4:04.5** · *XPath* (7.7 s)

> XPath: select nodes with XPath. It's not part of the HTML DOM, but many developers know it from XML.

**4:12.5** · *Diffing* (7.7 s)

> Diffing compares DOM trees by meaning, not as strings, so whitespace and attribute order don't matter. It powers bUnit.

**4:20** · *Wasm* (7.7 s)

> Wasm runs WebAssembly modules inside browsing contexts, together with the Js extension.

**4:27.5** · *Renderer · preview* (7.7 s)

> Renderer, in preview, does layout and painting: styled DOM in, pixels out — for example, a PNG via SkiaSharp.

**4:35.5** · *Browser · preview* (7 s)

> And Browser, also in preview, assembles everything into a browser engine — headless, or as an Avalonia control.

## 7 · End to end (4:42.5)

**4:42.5** · *Step list on the left: Configure, Load, Query, Use. Step 1 · Configure lights up at 4:45.5.* (17 s)

> Let's build something real: extracting blog posts from a website.
> Configure. We start from the default configuration and opt in to two things: a loader, so we can make HTTP requests, and CSS, so we get computed styles.

**4:59.5** · *Step 2 · Load* (14 s)

> Load. We create a browsing context and open the URL. Like a browser tab, it fetches the page, follows redirects and decodes it.
> The document is disposable, so it goes in a using statement.

**5:13.5** · *Step 3 · Query* (18 s)

> Query. Plain CSS selectors: every article with the class "post", skipping hidden ones via the computed style.
> For each, we take the heading text and the link. Since we read the Href property, not the raw attribute, it's already absolute.

**5:31.5** · *Step 4 · Use. At 5:35.5 the terminal shows the output.* (20 s)

> Use. From here on it's just .NET objects and LINQ. We print each post…
> …run it — and there's our data.
> *(Configure, load, query, use. That's the pattern for almost everything you'll do with AngleSharp.)*

## 8 · Common pitfalls (5:52)

Each pitfall shows the **symptom** first, then the **cause** (after 1.5 s) and the **fix** (after 3.5 s). They change every **10 s**.

**5:52** · *"Common pitfalls"* (3 s)

> Five problems people often run into.

**5:55** · *1 · `OpenAsync("https://…")` returns an empty document* (10 s)

> One: OpenAsync with a URL returns an empty document. The default configuration doesn't load anything from the network — add WithDefaultLoader.

**6:05** · *2 · Stylesheets ignored, computed styles empty* (10 s)

> Two: stylesheets are ignored, computed styles are empty. Everything CSS beyond selectors lives in AngleSharp.Css — install it and call WithCss.

**6:15** · *3 · Content rendered by JavaScript is missing* (10 s)

> Three: JavaScript-rendered content is missing. Add WithJs and wait for the document to be ready. *(Often simpler: call the page's JSON API directly.)*

**6:25** · *4 · `GetAttribute("href")` returns `/about`* (10 s)

> Four: GetAttribute href returns a relative path. Attributes hold the raw value; DOM properties resolve it, just like in the browser. Use the Href property.

**6:35** · *5 · The serialized HTML differs from the input* (11 s)

> Five: the serialized HTML doesn't match your input. The parser fixes markup and adds html, head and body. Serialize just the body's InnerHtml, or use PrettyMarkupFormatter.

## 9 · Ideas (6:46.5)

**6:46.5** · *"What will you build?" Idea 1: SVG renderer. A bar chart renders bar by bar.* (17.5 s)

> So — what will you build?
> How about a native SVG renderer for .NET? Load a chart, an icon or a badge, and render it to PNG on the server — no browser, no native SVG library.

**7:04** · *Idea 2: canvas in C#. Shapes fill in.* (16 s)

> Or canvas in C#: the familiar 2D canvas API — fill styles, rectangles, paths — straight from C#. Great for thumbnails, reports or generative art.

**7:20** · *Idea 3: a desktop app. The cursor clicks "Save" at 7:25.* (16 s)

> Or go further: cross-platform apps — HTML and CSS for the views, C# for the logic. AngleSharp.Browser renders the UI inside Avalonia, and a click on "Save" is handled directly in C#. No JavaScript required.

## 10 · Outro (7:36)

**7:36** · *Recap pills and logo. From 7:43: "Thanks for watching!", links, call to action. Fades to black at 7:59.* (23 s)

> To recap: a standards-based DOM, an API that mirrors the specs you already know, and opt-in extensions for everything else.
> You'll find the docs at anglesharp.github.io and the code at github.com/AngleSharp.
> Star the repo, join the discussions, contribute, or sponsor the project.
> Thanks for watching!
