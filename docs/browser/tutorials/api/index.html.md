# API Documentation (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/tutorials/api/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

## Quick API Map

The following APIs cover most day-to-day tasks:

- `new BrowserEngine(options)`
: Creates a browsing context with a history; dispose it when done.
- `NavigateAsync`, `LoadHtmlAsync`, `ReloadAsync`, `GoBackAsync`, `GoForwardAsync`, `GoAsync`
: Changes what is shown.
- `InvokeAsync`, `EvaluateScriptAsync`
: Runs .NET code against the DOM, or JavaScript in the page.
- `PaintAsync`
: Paints the viewport into a PNG.
- `PrepareFrameAsync`, `BrowserFrame.Rasterize`
: Paints raw frames for displaying a live page.
- `ClickAsync`, `TextInputAsync`, `KeyDownAsync`, `ScrollAsync`
: Interacts with the page like a user.
- `Diagnostics`
: Lists the requests, errors, console output and frame timings of the page.
- `BrowserView`
: Displays an engine in Avalonia.

## BrowserEngine

### State

| Member | Description |
| --- | --- |
| `Url`, `Title` | The address (including one being loaded) and the title. |
| `IsLoading` | If a navigation is ongoing. |
| `IconUrl`, `IconUrls`, `Certificate` | The page's icon and the `ServerCertificate` of its connection. See [Site Information](https://anglesharp.github.io/docs/browser/general/engine/index.html.md#site-information). |
| `CanGoBack`, `CanGoForward` | The state of the history. |
| `Document`, `Context` | The current `IDocument` (use it within `InvokeAsync`) and the `IBrowsingContext`. |
| `ViewportWidth`, `ViewportHeight` | The size of the viewport in CSS pixels. |
| `ScrollPosition`, `ScrollTop`, `ScrollHeight` | The target of the smooth scrolling, the DOM's offset, and the page's height. |
| `HoveredLink`, `Cursor` | What is below the pointer. |
| `ColorScheme` | The answer to `prefers-color-scheme`; may be changed. |
| `HasPaintedDocument` | If the current document has been painted at least once. |
| `Diagnostics` | The `BrowserDiagnostics` of the current page. |

### Methods

| Member | Description |
| --- | --- |
| `NormalizeAddress(address)` | Turns the input of an address bar into an absolute address (static). |
| `NavigateAsync(address)` | Loads an address. |
| `LoadHtmlAsync(html, address)` | Shows the given source code. |
| `ReloadAsync()`, `GoBackAsync()`, `GoForwardAsync()`, `GoAsync(delta)` | Moves in the history. |
| `History` | A copy of the history's entries (address and title) and the index of the current one. |
| `Resize(width, height)` | Changes the viewport. |
| `PaintAsync()` | Returns a `RenderedImage` with a PNG, or `null`. |
| `PrepareFrameAsync()` | Returns a `BrowserFrame`, or `null`. |
| `EvaluateScriptAsync(script)` | Runs a script, and returns its completion value. |
| `InvokeAsync(action)` | Runs code on the event loop, and returns its value. |
| `MovePointer`, `MovePointerAsync`, `PointerDownAsync`, `PointerUpAsync`, `ClickAsync` | Pointer input. |
| `KeyDownAsync`, `KeyUpAsync`, `TextInputAsync` | Keyboard input. |
| `CopySelectionAsync()` | Gets the selected text for the clipboard. |
| `ScrollAsync(deltaX, deltaY)`, `ScrollToAsync(top, animate)` | Scrolling. |
| `CreateWindow()`, `CreateWindow(options)` | Creates an engine sharing the profile. |
| `LoadIconAsync()`, `GetCertificate(host)` | Loads the page's icon, or gets the certificate of a host. |

All asynchronous methods take an optional `CancellationToken`.

### Events

`Invalidated`, `StateChanged`, `HoverChanged`, `ScrollChanged`, `WindowRequested`, and `Error`. See [Browser Engine](https://anglesharp.github.io/docs/browser/general/engine/index.html.md#events).

## BrowserFrame

| Member | Description |
| --- | --- |
| `Width`, `Height` | The size in CSS pixels, including the overscan. |
| `OverscanTop` | The rows above the viewport. |
| `ScrollTop` | The scroll offset it was painted at. |
| `IsScrollShiftable` | If it may be shifted to show another offset. |
| `Rasterize()` | Returns the `RenderedPixels` (premultiplied RGBA); safe from any thread. |

## BrowserDiagnostics

| Member | Description |
| --- | --- |
| `Requests` | A list of `NetworkEntry`: `Method`, `Url`, `StartedAt`, `Duration`, `StatusCode`, `ContentType`, `ContentLength`, `RequestHeaders`, `ResponseHeaders`, `IsPending`. |
| `Messages` | A list of `DiagnosticMessage`: `Kind` (`Console` or `Error`), `Time`, `Text`, and for errors `ErrorType`, `Source`, `Line`, `Column`, `StackTrace`. |
| `Frames` | A list of `FrameTiming` for the latest painted frames: `Time`, `Kind` (`Layout`, `Update` or `Reposition`), `Layout`, `Raster`, and the `Metrics` of the renderer (the time of each phase and how much work it did). |
| `Changed` | Raised when something was added or cleared, on any thread. |
| `Clear()` | Removes what has been collected. |

## BrowserView

| Member | Description |
| --- | --- |
| `Source` | The address of the page; a styled property binding two-way by default. |
| `Engine` | The displayed engine; a styled property. |
| `Options` | The options for the engine created by the view. |

`AvaloniaClipboardPlatform` connects an Avalonia clipboard to `BrowserOptions.ClipboardPlatform`.

The options are described in [Configuration](https://anglesharp.github.io/docs/browser/general/configuration/index.html.md).
