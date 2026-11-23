# Rendering (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/rendering/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

There are two ways to get pixels out of the engine. Pick `PaintAsync` for occasional images, and frames for displaying a page continuously.

## Images

`PaintAsync` paints the current viewport into a PNG. It returns `null` if there is no document to paint yet:

```cs
engine.Resize(1024, 768);

var image = await engine.PaintAsync();

if (image is not null)
{
    Console.WriteLine($"{image.Width}x{image.Height} {image.MimeType}");
    await File.WriteAllBytesAsync("page.png", image.Data);
}
```

## Frames

Encoding a PNG is too slow for showing a live page. Frames split the work into two steps instead, which allows a host to pipeline them:

1. `PrepareFrameAsync` lays out the page on the event loop. It returns `null` if no document is ready.
2. `BrowserFrame.Rasterize` turns the frame into raw premultiplied RGBA pixels. It does not touch the DOM, so it runs on any thread, while the engine already prepares the next frame.

```cs
var frame = await engine.PrepareFrameAsync();

if (frame is not null)
{
    var pixels = frame.Rasterize();
    Console.WriteLine($"{pixels.Width}x{pixels.Height}, {pixels.RowBytes} bytes per row, {pixels.Data.Length} in total");
}
```

Preparing a frame also refreshes what the engine knows for hit testing. The cursor and links are then looked up without touching the DOM, which keeps pointer moves responsive on busy pages.

Animated images (GIFs and WebPs of several frames) play on their own: when one in view shows its next frame, the engine raises `Invalidated`, and the next frame is the last one rasterized again, without a layout. An image plays from the moment it is first painted and as often as it tells, which is forever for most GIFs.

The first frame of a page shows up early: only what is in the viewport is styled and laid out for it. The engine asks for the next frame right away (it raises `Invalidated`), which lays out the whole page. Until then, the page below the viewport is blank, and the scroll position is not limited to the height of the page.

## Overscan and Scrolling

A frame may be larger than the viewport: `OverscanTop` rows are painted above the viewport, and some more below it. The viewport starts at row `OverscanTop`.

Scrolling is smooth and runs ahead of the DOM. Two properties reflect that:

- `ScrollPosition` is where the page should be right now, and changes without waiting for the event loop.
- `ScrollTop` is the scroll offset the DOM knows about.

Until the next frame arrives, a host displays the last frame shifted by the difference, which is what makes scrolling smooth even when layout takes a while:

```cs
var frame = await engine.PrepareFrameAsync();

if (frame is { IsScrollShiftable: true })
{
    var shift = frame.ScrollTop - engine.ScrollPosition;
    var y = shift - frame.OverscanTop;
    Console.WriteLine($"Draw the frame at {y}");
}
```

A frame of a page with fixed or sticky boxes cannot be shifted, which is what `IsScrollShiftable` tells.

`ScrollHeight` is the height of the page once measured, which allows drawing a scrollbar. Use `ScrollAsync` for relative changes (e.g., the mouse wheel) and `ScrollToAsync` for absolute ones (e.g., a scrollbar's thumb, with `animate: false`).

## Viewport and Color Scheme

`Resize` changes the size of the viewport in CSS pixels. Setting `ColorScheme` changes the answer to `prefers-color-scheme`. Both repaint the page.

```cs
engine.Resize(390, 844);
engine.ColorScheme = "dark";
```

The screen size reported to media queries is set via `BrowserOptions.ScreenWidth` and `BrowserOptions.ScreenHeight`.
