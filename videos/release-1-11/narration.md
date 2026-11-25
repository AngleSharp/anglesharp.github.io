# AngleSharp 1.11: narration

Script for narrating the 3:00 release video live, or for recording a voice-over. Every block starts with a **timecode** (mm:ss into the video) and a short note on what appears on screen. Start talking when the cue appears.

## Before you start

- **Video:** `npm run render:release-1-11` (with background music) or `npm run render:release-1-11:silent` (without).
- **Music:** ambient track, about 12 dB under a normal speaking voice. For room speakers you can turn it down further: `--props='{"musicVolume":0.2}'`.
- **Pace:** written for about **130–140 words per minute**. Each block lists the time you have for it.
- Bold times inside a block (**0:39** —) mark a mid-block visual change; start that sentence there.
- **Running ahead?** Pause and let the visual finish. **Behind?** The cues have a little slack, so drop a clause rather than rushing.
- Source for all facts and numbers: `v2026/content/blog/2026-11-24-anglesharp-v111-release.md`.

| # | Scene                | Starts | Length | Words |
| - | -------------------- | ------ | ------ | ----- |
| 0 | Opening              | 0:00   | 0:10   | 19    |
| 1 | The whole ecosystem  | 0:09.5 | 0:22   | 50    |
| 2 | Native AoT           | 0:31   | 0:30   | 69    |
| 3 | Switching on AoT     | 1:00.5 | 0:30   | 66    |
| 4 | Performance          | 1:30   | 0:33   | 60    |
| 5 | Road to 1.0          | 2:02.5 | 0:22   | 36    |
| 6 | And a lot more       | 2:24   | 0:18   | 39    |
| 7 | Get started          | 2:41.5 | 0:18.5 | 37    |

---

## 0 · Opening (0:00)

**0:00** · *Logo and "AngleSharp 1.10" flips to "1.11" at 0:02.5. Three theme pills appear at 0:04.5.* (9.5 s)

> AngleSharp 1.11 is here. Three big themes: native AoT across the board, a faster stack, and rendering that's close to 1.0.

## 1 · The whole ecosystem (0:09.5)

**0:09.5** · *Eight package cards with their versions. "≥ 1.11.0" badges at 0:17, "AoT friendly" at 0:20.5.* (15 s)

> It's a milestone release: eight packages ship together. The core, plus Css, Js, Io, Wasm, Xml, Renderer and Browser.
> For the first time, all of them require AngleSharp 1.11 — and all of them are AoT friendly.

**0:24.5** · *Renderer and Browser cards light up: "1.0 this year", "1.0 shortly after". "Update them together" at 0:27.5.* (6.5 s)

> Renderer and Browser are still pre-1.0 — not for long. Using several packages? Update them together.

## 2 · Native AoT (0:31)

**0:31** · *An assembly being scanned for `[DomName]` attributes. At 0:39: the trimmer problem.* (14 s)

> The biggest theme: native AoT. Until now, scripting engines found the DOM by reflection.
> **0:39** — But the trimmer can't see what reflection touches, so it keeps too much or removes what's needed.

**0:45** · *A `DomRegistration` in code. Highlights at 0:51 (property), 0:54 (inheritance), 0:56.5 (method), each with a card.* (16 s)

> With 1.11, the DOM can be declared in code. A registration declares types, properties, inheritance and methods — all as strongly typed delegates.
> The engine calls them directly, with no reflection. What you register is exactly what the trimmer keeps.

## 3 · Switching on AoT (1:00.5)

**1:00.5** · *`Configuration.Default.WithCss().WithXml().WithJs(DomRegistrations.Combine(...))`. Cards at 1:05, 1:07, 1:09.5.* (12 s)

> Switching it on takes one overload: pass a registration to WithJs, combining those of the libraries you use.
> And plain WithJs still works, just like before.

**1:12.5** · *`[assembly: GenerateDomRegistration("MyApp.AppDom")]`, the generator arrow at 1:16.5, then usage. Warnings table at 1:22.5.* (18 s)

> And nobody writes these by hand. AngleSharp 1.11 ships a source generator: add one assembly attribute, and at build time it turns your DomName attributes into a Register method.
> **1:22.5** — Anything it can't express becomes a build warning — not a runtime surprise.

## 4 · Performance (1:30)

Three pages of before/after bars, one every **11 s**. The tabs at the top show which one is active.

**1:30** · *1 · CSS selectors (AngleSharp 1.10 vs 1.11). Callout at 1:35.* (11 s)

> It's also faster, across the stack. Selector parsing is 32 to 43 percent quicker, and nth-child matching is now four times as fast.

**1:41** · *2 · CSS render tree (AngleSharp.Css 1.4 vs 1.6). Callout at 1:46.* (11 s)

> In AngleSharp.Css, building the render tree is three to four times as fast — with less than half the memory.

**1:52** · *3 · Rendering (AngleSharp.Renderer 0.13). Callout at 1:57.* (10.5 s)

> And in the renderer, the first frame of a page is ready in a quarter of the time. Same pixels.

## 5 · Road to 1.0 (2:02.5)

**2:02.5** · *AngleSharp.Renderer 0.13 feature list.* (8.5 s)

> Which brings us to rendering. Renderer 0.13 adds subgrid, background-clip text, lazy images, the CSS Painting API, and many layout fixes.

**2:11** · *AngleSharp.Browser 0.3: "Renders the Acid2 test correctly", plus feature pills.* (6 s)

> And Browser 0.3 renders the Acid2 test correctly.

**2:17** · *Roadmap: Today → Renderer 1.0 this year → Browser 1.0 shortly after.* (7.5 s)

> Renderer 1.0 is coming this year — and Browser 1.0 shortly after.

## 6 · And a lot more (2:24)

**2:24** · *Six cards, one every 1.5 s: Core, Css, Js, Io, Wasm, Correctness.* (17.5 s)

> There's a lot more: ElementInternals and the state pseudo-class in the core, scope rules and oklch in Css, SharedWorker and Web Crypto in Js, EventSource and URLPattern in Io, the full WebAssembly JavaScript API — and plenty of correctness fixes.

## 7 · Get started (2:41.5)

**2:41.5** · *Terminal with `dotnet add package` lines, `PublishAot` in the csproj at 2:46, the `WithJs` swap at 2:47.5. "Next stop: 1.0" at 2:53.5. Fades to black at 2:59.* (17.5 s)

> To get started, update your packages together. For trimming or native AoT, set PublishAot and switch WithJs to a combined registration. Everything else stays the same.
> **2:53.5** — Next stop: 1.0 for the renderer and the browser. Thanks for watching!
