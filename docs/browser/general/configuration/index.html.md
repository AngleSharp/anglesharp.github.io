# Configuration (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/configuration/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

Everything that touches the outside world is configured via `BrowserOptions`, which is passed to the constructor of the engine.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `ProfileDirectory` | `null` | Where cookies, web storage and the HTTP cache are persisted; `null` keeps everything in memory. |
| `UserAgent` | `null` | The user agent to report; `null` uses the default of AngleSharp.Io. |
| `DefaultHeaders` | empty | Headers added to every request, unless a request sets them already. |
| `ColorScheme` | `null` | The answer to `prefers-color-scheme`, e.g., `light` or `dark`. |
| `IsScriptingEnabled` | `true` | If JavaScript should be evaluated. |
| `ClipboardPlatform` | `null` | The clipboard exposed to pages; `null` means the API is not available. |
| `IsTextSelectionEnabled` | `false` | If the text of pages can be selected with the pointer and Control+A. |
| `ViewportWidth`, `ViewportHeight` | 1280, 800 | The initial viewport in CSS pixels. |
| `ScreenWidth`, `ScreenHeight` | 1920, 1080 | The screen size reported to media queries. |
| `FontSize` | 16 | The default font size in CSS pixels. |
| `ConfigureIo` | `null` | A callback customizing the IO options. |
| `Configure` | `null` | A callback extending the AngleSharp configuration. |
| `SchemeHandlers` | empty | Handlers answering the requests of custom URL schemes. |
| `AudioOutput` | `null` | Where the audio of pages plays; `null` plays it silently (`SilentAudioOutput`). |
| `AudioCodecs` | WAV, MP3, Ogg Vorbis, Ogg Opus | The audio formats that play, in the order they are tried. |
| `IsAutoplayAllowed` | `false` | If pages may play audible media before the user pressed or typed something. |

```cs
var options = new BrowserOptions
{
    ProfileDirectory = "profile",
    UserAgent = "MyApp/1.0",
    ColorScheme = "dark",
    ViewportWidth = 1024,
    ViewportHeight = 768,
};

options.DefaultHeaders["Accept-Language"] = "de";

using var engine = new BrowserEngine(options);
```

## Profiles

Without a `ProfileDirectory` nothing survives the engine, which is what you want for tests and automation. With one, a later engine using the same directory finds its cookies, storage and cache again.

## Customizing IO and AngleSharp

`ConfigureIo` runs after the defaults have been derived from the other options. It gives access to all of `IoOptions` from AngleSharp.Io, e.g., the HTTP handler:

```cs
using System.Net;

var options = new BrowserOptions
{
    ConfigureIo = io => io.HttpHandler.Proxy = new WebProxy("http://localhost:8080"),
};
```

Like a browser, the handler decompresses responses (gzip, deflate and brotli; `AutomaticDecompression`), which some servers send even if not asked to.

Pages can register service workers (`navigator.serviceWorker`, through `ServiceWorkerPlatform`). The workers are installed and activated, but their scripts don't run, so every request goes to the network. Setting `io.ServiceWorkerPlatform` to `null` in `ConfigureIo` removes the API, and another platform can run the workers.

`Configure` receives the AngleSharp configuration before the browsing context is created, so further services can be added:

```cs
using AngleSharp;

var options = new BrowserOptions
{
    Configure = config => config.WithLocaleBasedEncoding(),
};
```

## Custom Schemes

`SchemeHandlers` registers URL schemes of the host, e.g., for its own pages. A handler gets the request and answers a response, or `null` if there is nothing at the address. Pages can link to these addresses, and `NavigateAsync` keeps them as they are (`Schemes` lists them; `BrowserEngine.NormalizeAddress(address, schemes)` does the same for an address bar):

```cs
using System.IO;
using System.Net;
using System.Text;
using AngleSharp.Io;

var options = new BrowserOptions();
options.SchemeHandlers["app"] = (request, cancellationToken) =>
{
    var response = new DefaultResponse
    {
        Address = request.Address,
        StatusCode = HttpStatusCode.OK,
        Content = new MemoryStream(Encoding.UTF8.GetBytes($"<h1>{request.Address.Data}</h1>")),
    };
    response.Headers[HeaderNames.ContentType] = "text/html; charset=utf-8";
    return Task.FromResult<IResponse?>(response);
};

using var engine = new BrowserEngine(options);
await engine.NavigateAsync("app:settings");
```

The handlers are asked before the built-in requesters, so a handler for `http` would take over the network.

## Audio

Pages play audio with `audio` elements and `new Audio(src)`, including `play()` (a promise), `pause()`, `currentTime`, `volume`, `muted`, `loop`, `autoplay` and their events (`playing`, `timeupdate`, `ended`, ...). The formats of `AudioCodecs` are decoded with managed code only: WAV (PCM or floats), MP3 (NLayer), Ogg Vorbis (NVorbis) and Ogg Opus (Concentus). Other formats (e.g. AAC in MP4) answer an empty `canPlayType`, so pages offering several `source` elements get one that plays, and fail with an `error` (`MEDIA_ERR_SRC_NOT_SUPPORTED`) otherwise. The engine reads the whole file before it plays.

Where the audio is heard is up to the host, as it depends on the platform. An `IAudioOutput` opens a stream per media element playing, which pulls the samples (32-bit floats, the channels interleaved) as it plays them; the media's clock advances with what was pulled:

```cs
sealed class DeviceOutput : IAudioOutput
{
    public IAudioStream Open(AudioFormat format, IAudioSource source) =>
        new DeviceStream(format, source); // e.g. an OpenAL source fed from source.Read
}

var options = new BrowserOptions
{
    AudioOutput = new DeviceOutput(),
};
```

Vision plays on the default device via OpenAL Soft (`src/Vision/Audio/OpenAlAudioOutput.cs`, using Silk.NET.OpenAL), which can serve as a starting point. Without an output, the media plays silently in real time, with its events and its end, which is what tests and automation want. Like browsers, audible media only plays once the user pressed or typed something on the page (`play()` rejects with a `NotAllowedError` before); muted media always plays, and `IsAutoplayAllowed` lifts the rule. Media stops once its document is left.

An `audio` element with the `controls` attribute shows the controls of Chrome (300x54 by default): a play/pause button, the time, a timeline and a mute button. A press on them plays, pauses, mutes or seeks (also while the timeline is dragged); the hit testing is AngleSharp.Renderer's `GetMediaControlAt` and `GetMediaTimelinePosition`. While media plays, the time and the timeline go on in the last frame (rasterized again, like the frames of a GIF) without a layout; only playing, pausing, seeking or a change of the volume lays the page out. One without `controls` is not rendered.

## Multiple Windows

One engine stands for one window. When a page asks for another window (a link with `target="_blank"`, or a link clicked with Control), the engine raises `WindowRequested`. If the request is not marked as handled the page navigates in place, so there is nothing to do if a host only has a single window.

`CreateWindow` creates the engine of another window. It has its own browsing context and history, but shares the profile (cookies, storage, caches), even without a profile directory:

```cs
engine.WindowRequested += (_, request) =>
{
    // must be set while handling the event, which is raised on the engine's thread
    request.Handled = true;

    _ = Task.Run(async () =>
    {
        var window = engine.CreateWindow();
        await window.NavigateAsync(request.Url);
    });
};
```

The caller owns the returned engine and has to dispose it. An overload takes other options for the new window, e.g., after settings changed.
