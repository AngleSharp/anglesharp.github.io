# Browser Engine (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/engine/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

The `BrowserEngine` represents a browsing context with its history, i.e., what a single browser window (or tab) would be. It is `IDisposable`; dispose it once the window goes away.

## Navigation

| Member | Description |
| --- | --- |
| `NavigateAsync(address)` | Loads an address and adds it to the history. |
| `LoadHtmlAsync(html, address)` | Shows the given markup, optionally pretending it came from the given address. |
| `ReloadAsync()` | Loads the current address again. |
| `GoBackAsync()`, `GoForwardAsync()` | Moves through the history. |
| `GoAsync(delta)` | Jumps several entries back (negative) or forward. |
| `History` | A copy of the entries (address and title) and the index of the current one; `Back` and `Forward` list the entries before and after it, the closest first. |
| `Url`, `Title`, `IsLoading` | The state of the current page. |
| `CanGoBack`, `CanGoForward` | If there is something to go to. |

The address goes through `BrowserEngine.NormalizeAddress`, so what a user enters in an address bar works: `example.org` turns into `https://example.org`, while rooted paths of existing files turn into `file:` addresses. Addresses of the custom schemes of the engine (`BrowserOptions.SchemeHandlers`) stay as they are.

`Url` shows where the engine is going as soon as a navigation starts, like in any browser. A failed navigation does not throw: it raises `Error`, is recorded in the diagnostics, and shows an error page instead.

```cs
engine.StateChanged += (_, _) => Console.WriteLine($"{engine.Title} ({engine.Url}), loading: {engine.IsLoading}");

await engine.NavigateAsync("example.org");
Console.WriteLine(engine.CanGoBack);
```

## Site Information

| Member | Description |
| --- | --- |
| `IconUrls`, `IconUrl` | Where the page's icon may come from, best first: bitmaps of `<link rel="icon">`, then of `<link rel="apple-touch-icon">`, `/favicon.ico` of an HTTP(S) page, and declared SVG icons last. `IconUrl` is the first of them. |
| `LoadIconAsync()` | Loads the first of them that is an image, with the page's cookies and cache; `null` if there is none. Images are recognized by their content, as servers send icons with all kinds of content types. |
| `Certificate` | The `ServerCertificate` the server of the current HTTPS page presented. |
| `GetCertificate(host)` | The certificate a host presented the last time the engine connected to it. |

A changed icon raises `StateChanged`. A `ServerCertificate` is a snapshot of what the platform verified: names, issuer, validity, fingerprints, key, the chain up to the root, and `PolicyErrors` (`IsValid`). The engine captures it in the validation callback of its HTTP handler, keeping the platform's verdict; a host setting its own callback (via `BrowserOptions.ConfigureIo`) can use `ServerCertificate.Create` to the same end. A page served from the HTTP cache without a new connection may have no certificate.

```cs
engine.StateChanged += async (_, _) =>
{
    var icon = await engine.LoadIconAsync();
    Console.WriteLine($"{engine.IconUrl}: {icon?.Length ?? 0} bytes, issued by {engine.Certificate?.IssuerName}");
};
```

## Threading

AngleSharp is not thread-safe, so all DOM work is serialized and runs on AngleSharp's event loop. This has some consequences:

- All `*Async` methods of the engine may be called from any thread. They wait for the engine to be free.
- Code touching the DOM has to run in `InvokeAsync`, which also makes `Document` safe to use. Handlers of DOM events run on the event loop already.
- Engine events may be raised on any thread. A UI has to dispatch to its UI thread when handling them.
- Do not block the event loop (e.g., waiting for another engine operation in `InvokeAsync`): it would wait for itself.

```cs
var links = await engine.InvokeAsync(document => document?.QuerySelectorAll("a").Length ?? 0);
Console.WriteLine(links);
```

## Working With the DOM

`InvokeAsync` gets the current document, which is the regular AngleSharp DOM. CSS and script integration work as in AngleSharp.Css and AngleSharp.Js:

```cs
using AngleSharp.Dom;

await engine.InvokeAsync(document =>
{
    var heading = document?.QuerySelector("h1");

    if (heading is not null)
    {
        heading.TextContent = "Changed from .NET";
        heading.AddEventListener("click", (_, _) => Console.WriteLine("Clicked!"));
    }
});
```

Changing the DOM invalidates the page, i.e., hosts paint a new frame on their own.

The underlying `IBrowsingContext` is available via `Context`, e.g., to retrieve services.

## Events

| Event | Raised when |
| --- | --- |
| `Invalidated` | The visual output changed and a new frame should be painted. |
| `StateChanged` | The address, title, icon, loading state, or history state changed. |
| `HoverChanged` | The hovered link or the cursor changed. |
| `ScrollChanged` | The scroll position changed. |
| `WindowRequested` | The page asks for a new window. See [Configuration](https://anglesharp.github.io/docs/browser/general/configuration/index.html.md#multiple-windows). |
| `Error` | An operation failed, e.g., a navigation or a script. |

## Diagnostics

`Diagnostics` collects what happens while showing the current page, like the developer tools of a browser. It starts over with every page and is thread-safe:

```cs
await engine.NavigateAsync("https://example.org");

foreach (var request in engine.Diagnostics.Requests)
{
    Console.WriteLine($"{request.Method} {request.Url}: {request.StatusCode} after {request.Duration}");
}

foreach (var message in engine.Diagnostics.Messages)
{
    Console.WriteLine($"[{message.Kind}] {message.ErrorType} {message.Text}");
    Console.WriteLine(message.StackTrace);
}

foreach (var frame in engine.Diagnostics.Frames)
{
    Console.WriteLine($"{frame.Kind}: layout {frame.Layout} (styles {frame.Metrics.Style}), raster {frame.Raster}");
}
```

Requests come with their `StartedAt` and `Duration` as well as their `RequestHeaders` and `ResponseHeaders`. Errors tell as much as is known about them: `ErrorType`, `Line`, `Column` and the `StackTrace` of the script (or of the .NET exception, if no script threw). `Source` names the script, if known; AngleSharp.Js does not report that yet. `Frames` has the timings of the latest painted frames (those made by `PrepareFrameAsync` and rasterized), where `Kind` tells if the document was laid out (`Layout`), the last frame was patched (`Update`) or just moved (`Reposition`). The `Metrics` of a frame come from AngleSharp.Renderer and tell where the time of its layout went (`Setup`, `Style`, `Layout`, `HitTesting`, `Subframes`) and how much work that was (e.g., `Elements`, `Boxes`, `TrialLayouts`, `AllocatedBytes`); they are `RenderMetrics.None` for a frame that needed no layout.

The `Changed` event tells when there is something new. `Clear()` removes what has been collected so far.
