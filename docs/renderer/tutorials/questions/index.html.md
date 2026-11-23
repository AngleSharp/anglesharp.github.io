# Questions (AngleSharp.Renderer)

> Source: https://anglesharp.github.io/docs/renderer/tutorials/questions/
> Project: AngleSharp.Renderer (https://github.com/AngleSharp/AngleSharp.Renderer)
> Package: AngleSharp.Renderer 0.12.0 — install with `dotnet add package AngleSharp.Renderer`
> Docs revision: 0a71fb1145856a0e638852edb3b9de0385eb01fa

## Why do web-safe fonts look the same on my machine?

The renderer maps generic families such as `serif`, `sans-serif`, and `monospace` to fonts bundled with it (DejaVu), not to installed fonts, so they look the same on every machine.

Named families (e.g. `Arial`) resolve only when installed on the host or declared via `@font-face`; otherwise the next entry of the `font-family` list is used.

## Why does my text in another script show boxes?

Characters the resolved font has no glyph for fall back to the next `font-family` entry, then the bundled fonts (Latin, Greek, Cyrillic, Hebrew, Arabic, Devanagari), then whatever the host has installed. For other scripts (e.g. Thai or CJK) declare an `@font-face` or install a font that covers them.

## Why does a snapshot fail when I add a new baseline?

Visual snapshots compare the current PNG against the baseline in `verification-assets/`. If the baseline is missing, it is created automatically unless strict mode is enabled.

## How do I debug layout issues?

Start with `BuildDisplayList(...)` and inspect the commands before rasterizing. This usually makes it easier to see whether the issue is in layout, text measurement, or final drawing.

## Can I render only the render tree?

Yes. AngleSharp.Css exposes the render tree via `window.Render(...)`, which is helpful when you want to inspect computed styles before handing the document to AngleSharp.Renderer.
