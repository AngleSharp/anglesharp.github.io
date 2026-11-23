# Getting Started (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/basics/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

## Packages

The functionality is distributed in two NuGet packages:

| Package | Purpose |
| --- | --- |
| `AngleSharp.Browser` | The UI-agnostic `BrowserEngine`: navigation, painting, input, profiles, and diagnostics. |
| `AngleSharp.Browser.Avalonia` | The `BrowserView` control displaying an engine in an Avalonia application. |

Both target .NET 10. They bring AngleSharp, AngleSharp.Css, AngleSharp.Js, AngleSharp.Io, AngleSharp.Xml, AngleSharp.Wasm and AngleSharp.Renderer along, so no other AngleSharp package has to be installed.

## Getting AngleSharp.Browser over NuGet

For headless use, or to integrate another UI framework, install the engine:

```sh
dotnet add package AngleSharp.Browser
```

For an Avalonia application, install the control, which references the engine:

```sh
dotnet add package AngleSharp.Browser.Avalonia
```

## Showing a Page in Avalonia

Set the address, and the control does the rest:

```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:browser="using:AngleSharp.Browser.Avalonia">
    <browser:BrowserView Source="https://example.org" />
</Window>
```

The [Avalonia Control](https://anglesharp.github.io/docs/browser/general/avalonia/index.html.md) page has all the details.

## Using the Engine Without a UI

The engine needs nothing but a viewport size:

```cs
using System.IO;
using AngleSharp.Browser;

using var engine = new BrowserEngine(new BrowserOptions
{
    ViewportWidth = 1280,
    ViewportHeight = 800,
});

await engine.NavigateAsync("https://example.org");

var image = await engine.PaintAsync();
await File.WriteAllBytesAsync("page.png", image!.Data);
```

## First Practical Workflows

### 1. Read something from the page

AngleSharp is not thread-safe. Code touching the DOM therefore runs on the engine's event loop by using `InvokeAsync`:

```cs
await engine.NavigateAsync("https://example.org");

var text = await engine.InvokeAsync(document => document?.QuerySelector("p")?.TextContent);
Console.WriteLine(text);
```

### 2. Run some JavaScript

`EvaluateScriptAsync` works like the console of a browser's developer tools and returns the completion value converted to .NET:

```cs
var result = await engine.EvaluateScriptAsync("1 + 2");
Console.WriteLine(result);
```

### 3. Interact like a user

Input is given in CSS pixels relative to the viewport. Everything a real click does happens, including following links and focusing text fields:

```cs
await engine.ClickAsync(40, 390);
await engine.TextInputAsync("Hello");
await engine.KeyDownAsync("Enter");
```

### 4. Load your own markup

Pages do not have to come from the network:

```cs
await engine.LoadHtmlAsync("<!doctype html><title>Report</title><h1>Hello!</h1>");
```

## Rendering Quality

Layout and painting are done by AngleSharp.Renderer, which is still a young layout engine, while scripts run in AngleSharp.Js. Many sites work well, but do not expect the coverage of an established browser engine. See the [FAQ](https://anglesharp.github.io/docs/browser/tutorials/questions/index.html.md) for what to do when a page does not look right.
