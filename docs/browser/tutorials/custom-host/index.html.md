# Writing a Custom Host (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/tutorials/custom-host/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

The engine knows nothing about a UI, so it can be displayed in any framework. This tutorial walks through what `BrowserView` does for Avalonia. Its source in `src/AngleSharp.Browser.Avalonia/BrowserView.cs` is the complete reference.

## 1. Connect the Engine

Listen to the events of the engine, and tell it about the size of the view. Keep in mind that events may be raised on any thread.

```cs
using AngleSharp.Browser;

using var engine = new BrowserEngine();

engine.Invalidated += (_, _) => { /* schedule painting */ };
engine.ScrollChanged += (_, _) => { /* redraw the last frame on the UI thread */ };
engine.HoverChanged += (_, _) => { /* update the cursor from engine.Cursor on the UI thread */ };

engine.Resize(800, 600);
```

## 2. Paint in a Loop

`Invalidated` may be raised much more often than a UI displays frames. Requests are coalesced into a dirty flag, and a single loop paints while there are changes. Layout and raster overlap, which keeps a higher frame rate than doing them one after the other:

```cs
using System.Threading;
using System.Threading.Tasks;
using AngleSharp.Browser;

var dirty = 1;
Task? presenting = null;

while (Interlocked.Exchange(ref dirty, 0) == 1)
{
    var frame = await engine.PrepareFrameAsync();

    if (presenting is not null)
    {
        await presenting;
    }

    presenting = frame is null ? null : Task.Run(() =>
    {
        var pixels = frame.Rasterize();
        // copy pixels.Data to a bitmap; rows are pixels.RowBytes long and in premultiplied RGBA
        // then, on the UI thread, make the bitmap and the frame's scroll information current
        return pixels.Width;
    });
}

if (presenting is not null)
{
    await presenting;
}
```

A loop like this should be limited to about 60 frames per second, and restarted when `Invalidated` is raised. Catch `ObjectDisposedException` to end it with the engine.

## 3. Draw the Frame

When drawing, shift the frame to the current scroll position, and leave out the overscan. The values to remember from the frame are `ScrollTop`, `OverscanTop` and `IsScrollShiftable`:

```cs
var frame = await engine.PrepareFrameAsync();

if (frame is not null)
{
    var shift = frame.IsScrollShiftable ? frame.ScrollTop - engine.ScrollPosition : 0;
    var top = shift - frame.OverscanTop;
    // draw the bitmap at (0, top), clipped to the view
    Console.WriteLine(top);
}
```

Clear with white first, as the frame only covers the page once there is a document.

## 4. Forward the Input

Translate the events of the framework. All of these are fire-and-forget from the perspective of the UI, but observe the tasks to log exceptions:

| UI event | Engine call |
| --- | --- |
| Pointer moved | `MovePointer(x, y)` |
| Primary button pressed / released | `PointerDownAsync` (with the click count, for selecting words) / `PointerUpAsync` |
| Back / forward button pressed | `GoBackAsync` / `GoForwardAsync` |
| Back / forward button held (its menu) | `History.Back` / `History.Forward`, then `GoAsync(delta)` for the entry chosen |
| Wheel | `ScrollAsync(-deltaX * distance, -deltaY * distance)` |
| Key pressed / released | `KeyDownAsync` / `KeyUpAsync`, with the DOM's name of the key |
| Text entered | `TextInputAsync` |

`MovePointer` looks up the cursor and hovered link in the last frame right away, and coalesces the DOM events, so a busy page does not make the pointer lag.

## 5. Offer the Rest

What else makes it feel like a browser:

- Set `BrowserOptions.ClipboardPlatform` with an implementation of `IClipboardPlatform` from AngleSharp.Io.
- Set `BrowserOptions.IsTextSelectionEnabled`, and put the text of `CopySelectionAsync` on the clipboard for Control+C.
- Update `ColorScheme` when the theme changes.
- Draw a scrollbar from `ScrollPosition`, `ScrollHeight` and `ViewportHeight`, and change the position using `ScrollToAsync`.
- Handle `WindowRequested`, and open a window with an engine from `CreateWindow`.
