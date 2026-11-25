# Tutorial 6: From HTML to pixels: AngleSharp.Renderer — narration

Script for narrating the video live, or for recording a voice-over. Each block starts with a **timecode** (mm:ss into the video) and a note on what is on screen. Bold times inside a block (**1:20** —) mark the moment the highlight moves to the next lines of code: start that sentence there.

- **Video:** `npm run render:tutorial-6` in `videos/` (with music), or `npm run render:6:silent` in `videos/tutorials/` (without).
- **Pace:** a calm 90–130 words per minute, leaving time to read the code. Running ahead? Pause and let the highlight move on.
- **Code and output** on screen come from `samples/06-rendering` and were captured from real runs (`npm run sync:tutorials`).


| # | Scene | Starts | Length | Words |
| - | ----- | ------ | ------ | ----- |
| 0 | Opening | 0:00 | 8 s | 11 |
| 1 | The goal | 0:07.5 | 25 s | 31 |
| 2 | What the renderer is | 0:32 | 40 s | 64 |
| 3 | First render | 1:11.5 | 55 s | 65 |
| 4 | The template | 2:06 | 55 s | 52 |
| 5 | Controlling the output | 3:00.5 | 50 s | 36 |
| 6 | SVG to PNG | 3:50 | 40 s | 31 |
| 7 | Canvas 2D | 4:29.5 | 45 s | 39 |
| 8 | Where it's going | 5:14 | 30 s | 38 |
| 9 | Outro | 5:43.5 | 16.5 s | 16 |

Total: 383 words over 6:00.

---

## 0 · Opening (0:00)

**0:00** · *Title card.* (8 s)

> Part six, the last one: from HTML to pixels, with AngleSharp.Renderer.

## 1 · The goal (0:07.5)

**0:07.5** · *Three rendered social cards fan out.* (25 s)

> We'll build a social card generator: an HTML and CSS template in, PNG images out. These three cards were rendered by the sample, with no browser and no headless Chrome involved.

## 2 · What the renderer is (0:32)

**0:32** · *Pipeline, then strengths and limits.* (40 s)

> AngleSharp.Renderer takes the document and the styles from AngleSharp.Css, lays everything out, and paints it with SkiaSharp.
> **0:46.5** — It's good at pages you control: templates with flexbox, grid, gradients and web fonts, plus SVG and the canvas.
> **0:50.5** — It's still in preview. It's not meant for screenshots of arbitrary websites, the API can change before 1.0, and when you need exactly what Chrome shows, use Playwright.

## 3 · First render (1:11.5)

**1:11.5** · *Device, configuration, RenderToPng, the template image.* (55 s)

> Install the renderer. It's a prerelease for now.
> **1:15** — First, the render device. Its viewport is the size of the image: here 1200 by 630. The default is zero by zero, so always set it.
> **1:28** — The configuration adds CSS, the device, and rendering.
> **1:43** — Then open the template and call RenderToPng. You get a RenderedImage with the bytes, the width and the height. There's our first card.

## 4 · The template (2:06)

**2:06** · *Filling the template through the DOM, cards appear.* (55 s)

> Now, one card per blog post.
> **2:09.5** — Three posts, as tuples.
> **2:21** — For each one we open the template and fill it through the DOM: title, date and tag. Setting TextContent escapes the text for you, so a title with an angle bracket can't break the markup.
> **2:39.5** — Render, save, and here are the cards.

## 5 · Controlling the output (3:00.5)

**3:00.5** · *RenderOptions, banner and badge images.* (50 s)

> RenderToImage takes options.
> **3:04** — A device scale factor of two gives a retina image, twice the size.
> **3:15.5** — Clip renders just a region: here the top 200 pixels.
> **3:27** — And you can render a single element, like the badge.

## 6 · SVG to PNG (3:50)

**3:50** · *A small device and an SVG chart.* (40 s)

> SVG works too.
> **3:53.5** — A smaller device for a 480 by 240 chart,
> **4:06.5** — and the SVG inside the page renders like any other content. Great for charts and badges on a server.

## 7 · Canvas 2D (4:29.5)

**4:29.5** · *Canvas drawing, pixel readback, the PNG.* (45 s)

> And there's the 2D canvas.
> **4:33** — Load a page with a canvas element and get its 2D context.
> **4:44.5** — Fill styles and rectangles work like in JavaScript.
> **4:59.5** — GetImageData reads pixels back, which is handy in tests, and ToImage exports a PNG.

## 8 · Where it's going (5:14)

**5:14** · *Three guidelines, roadmap at 5:24.* (30 s)

> To sum up: render what you control. Pin the exact version you tested with, and if you need any website exactly the way Chrome renders it, Playwright is the right tool.
> **5:24** — AngleSharp.Renderer 1.0 is planned for this year.

## 9 · Outro (5:43.5)

**5:43.5** · *Recap, end of the series.* (16.5 s)

> WithRenderDevice, WithRendering, RenderToPng and RenderToImage, and GetContext for the canvas. That's the series. Thanks for watching!
