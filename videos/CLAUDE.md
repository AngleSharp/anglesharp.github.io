# Videos monorepo: guide for agents

`README.md` explains the layout, commands and how to add a new video. This file records the decisions and lessons from building the first video (`intro/`). Read both before you start.

## Workflow that worked

1. **Load the Remotion skill first** (`remotion:remotion-best-practices`, then its create/markup references). The Remotion packages are pinned to `4.0.546`. When you add a new video, use the same version in its `package.json`.
2. **Check facts against the local repos** in `/home/rapplf/Code/AngleSharp/*` before putting code on screen. grep for the exact extension method, its namespace and its signature. Project taglines and descriptions are in `../v2026/site.config.json`. Things we verified:
   - Configuration extensions: `WithCss` and `WithJs` are in namespace `AngleSharp`. `WithRendering` and `WithRenderDevice` come from Renderer. Io provides `WithRequesters`, `WithTemporaryCookies` and `WithPersistentCookies`. `WithXml` and `WithWasm` also exist.
   - `ComputeCurrentStyle()` is in `AngleSharp.Dom` (from the Css package). `GetDisplay()` is in `AngleSharp.Css.Dom`.
   - Core has `QuerySelector<TElement>`, `WaitForReadyAsync()`, `ToHtml(IMarkupFormatter)` and `PrettyMarkupFormatter`.
   - In Renderer, `document.RenderToPng()` returns a `RenderedImage` with `.Data`. For canvas, use `canvas.GetContext("2d") as Canvas2DRenderingContext`, then `SetFillStyle`, `FillRect` and `ToImage("image/png")`.
   - Core targets `netstandard2.0`, `net8.0` and `net10.0`. Don't show a version number on screen: the csproj may say an unreleased version (1.11.0 at the time, while the blog was at 1.10.0).
   - The project started in 2013 and joined the .NET Foundation in May 2019 (`v2026/content/blog/2019-05-02-dotnet-foundation.md`). Not "Foundation since 2013".
   - 1.11 scripting/AoT APIs (`release-1-11/`): `DomRegistration`, `DomRegistry` and `DomRegistrations.Combine` are in `AngleSharp.Scripting`. `[assembly: GenerateDomRegistration("…")]` is in `AngleSharp.Attributes`, and the source generator ships inside the AngleSharp package. Generated classes: `AngleSharp.Css.CssDom`, `AngleSharp.Io.IoDom`, `AngleSharp.Wasm.WasmDom`, `AngleSharp.Xml.XmlDom` and `AngleSharp.Renderer.RendererDom`, each with `Register(DomRegistry)`. `WithJs(DomRegistration)` and `WithEventLoop()` are in namespace `AngleSharp`. The diagnostics are ASDOM001–003.
   - **Caveat:** the 1.11 blog post shows `.WithIo()` without arguments, but the local Io checkout only has `WithIo(IoOptions options)`. The release video therefore uses Css + Xml in its `Combine` example.
   - XPath, Diffing and Browser.Avalonia are **not** checked out locally. Keep claims about them conservative.
3. **Write the scenes, then run `npm run typecheck`**.
4. **Check visually by rendering stills.** Don't render the full MP4 unless the user asks. Put stills in the session scratchpad, not the repo:
   `cd intro && npx remotion still src/index.ts <SceneId> <scratchpad>/x.png --frame=N --log=error`
   Render at least one frame per scene, and one frame in each phase of scenes that have several.
5. **Write `narration.md`**: the user narrates the videos **live** over playback, so the narration is a read-along script. One block per on-screen cue, each with an absolute timecode, a short note on what appears, the seconds available, and optional sentences in *(parentheses)* to drop when running late. Compute cue times from the frame offsets in the code (scene start + local frame / 30). Keep every block at or below ~150 wpm (aim for 120–140) and check it with a small word-count script. Merge a short, dense cue into a neighbor with slack instead of cramming it.

## Timing math

- 30 fps. Every scene transition is a 15-frame fade (`sceneTiming()`). Total length = sum of the scenes − (number of scenes − 1) × 15.
- For an exact target length, add the overlap to one scene's length. The intro uses 11 scenes summing to 14,550 frames, which minus 150 gives 14,400 = 8:00.
- A scene's start time = the sum of the earlier scenes − index × 15. `narration.md` lists these start times. If you change `timeline.ts`, update the script too.

## Layout lessons (1920×1080)

- Content area inside `SceneFrame` is about 1680×860 (padding: 140 top, 120 sides, 80 bottom). A heading without a subtitle takes about 130px. With a subtitle, about 200px.
- **Check code width before choosing a font size.** JetBrains Mono is about 0.6 × fontSize per character. Add about 56px of padding without line numbers, or about 2.4 × fontSize more with them. For two code blocks side by side (~820px each), use fontSize 22–23 and lines of ~54 characters or fewer.
- Ligatures are turned off in `CodeBlock` and `Terminal` (`fontVariantLigatures: 'none'`). Without that, `!=` rendered as `≠` and `=>` as `⇒`. Keep them off.
- Text in narrow cards wraps badly. Put inline `Code` pairs on their own lines, or shrink them.
- `Card` icon boxes have `minWidth` (not a fixed width), so longer labels like "a11y" fit.
- Three regular `Card`s stacked next to a code block overflow 1080px. Use `<Card compact>`, which puts the icon beside the title.
- Emoji don't render in the headless browser. Use text or simple Unicode symbols (✓ ✗ → λ ✂ ⚙ render fine).
- Keep timeline/roadmap end labels away from the frame edge (inset ≥ 200px); centered labels under the end dots get clipped otherwise.
- Benchmark charts: use `BarCompare`, and copy numbers from the source exactly. If the source's percentages came from unrounded data, pass `change` explicitly so the screen matches the blog.
- Don't invent terminal output for commands you can't run (e.g. publish results). Show the command only.
- A scene with several "pages" works best as stacked `AbsoluteFill` layers with `windowed(frame, from, to)` opacity, plus a list or step indicator on the left (see `Extensions.tsx`, `EndToEnd.tsx`, `Pitfalls.tsx`, `Ideas.tsx`). Return `null` when opacity is 0.
- Nested `AbsoluteFill`s inside `SceneFrame` ignore its padding. Repeat `padding: '140px 120px 80px'` yourself (see `WhatIs.tsx`).

## Design choices to keep consistent

- Use a dark brand theme for every video, with colors from `shared/src/theme.ts` (kept in sync with `v2026/src/styles.css`).
- Chapter label top-left (`index` + title), logo watermark top-right.
- Use real, plausible C# and keep snippets short. Use `example.com` for fake URLs.
- Be honest about limits: mark Renderer and Browser as **preview**, and mention when a different tool (e.g. Playwright) fits better.
- The interactivity guidance in the Remotion skill (inline `interpolate`, `Interactive.*`) is followed only loosely. The shared components take delay props, because reuse across videos matters more here than editing in the Studio.

## Not done yet / ideas

- Music: `tools/generate-music.mjs` synthesizes an ambient track (D major pad, soft sub bass, sparse bells with delay, reverb) in plain Node, then encodes with ffmpeg using two-pass *linear* loudnorm to -18 LUFS. The video plays it at `musicVolume` 0.3, which is about -28.5 LUFS, roughly 12 dB under speech. Lessons: use equal-power (sin/cos) chord crossfades, because linear ones dip audibly at every change. Single-pass loudnorm pumps the intro. Check results with `ebur128` and `showwavespic`/`showspectrumpic` images, since you can't listen. Generating takes about 75 s for 8 minutes.
- No recorded voice-over (the user narrates live). To add one later, put it in `public/` and add a second `<Audio>`.
- Release videos (`release-1-11/` is the template): 3:00, eight scenes. Opening with the version number, ecosystem/versions, then 2–3 headline themes from the blog post, "a lot more" cards, and get started. The narration cites the blog post as the single source for numbers.
- **Tutorial series (built):** `tutorials/` holds all six videos (`TUTORIALS-PLAN.md` has the plan and what changed while building). How it works:
  - Code and output on screen come **only** from `../samples` via `tools/sync-samples.mjs`. It runs every sample, captures stdout, and writes `tutorials/src/samples.generated.ts` (numbered `// ── N. Title` sections of Program.cs, inputs, outputs). PNGs go to `public/samples/`. Use `code()`, `out()`, `input()`, `output()`, `block()` and `image()` from `src/lib/samples.ts`. Never paste code or output by hand.
  - Keep sample lines ≤ 78 characters (the sync warns). Code is shown at 18–24px, so longer lines don't fit.
  - `src/lib/CodeStep.tsx` is the standard scene (code with timed highlights, compact notes, terminal with output at given frames). `src/lib/tutorial.tsx` builds each video and its per-scene compositions (`T<part>-<id>`) from a scene list.
  - Narration: `tutorials/narration/build.py` generates `part-N.md` with word counts and a pace check. Cue times = scene start + highlight `from` / 30.
  - Check layout on tiled stills (4 per 1920×1080 sheet via ffmpeg `xstack`). Overflow usually comes from code over ~23 lines or more than three notes plus output.
  - Part 5 needs `../AngleSharp.Infrastructure.TestSite` running (`npm run dev`, port 8080) when syncing.
- Facts learned while writing the samples (verified by running them): the default render device has a **0 × 0 viewport**, so every `max-width` media query matches until you set one. `WithXml()` only maps `text/xml`, `application/xml` and `image/svg+xml`, so `application/atom+xml` falls back to HTML. Io's `WithRequesters()` sends an **empty User-Agent**. Persistent cookies only store cookies with an expiry. `WithMockRequester`/`WithVirtualRequester` are **test-project helpers**, not public API (derive from `BaseRequester` instead). There's no public API to attach files to `<input type=file>` (`FileList` is internal). DOM `replaceWith` is `Replace(...)`. AngleSharp.Renderer 0.13.0 isn't on nuget.org yet (the samples use `0.13.0-beta.240`).
- Possible next videos: a deep dive per extension, AngleSharp.Css computed styles, Renderer (SVG/canvas to PNG), testing with Diffing/bUnit, and building an app with AngleSharp.Browser.Avalonia.
