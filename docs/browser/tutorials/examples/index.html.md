# Examples (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/tutorials/examples/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

This page shows some recipes for working with AngleSharp.Browser.

## Take a Screenshot

```cs
using System.IO;
using AngleSharp.Browser;

using var engine = new BrowserEngine(new BrowserOptions { ViewportWidth = 1280, ViewportHeight = 800 });

await engine.NavigateAsync("https://example.org");

var image = await engine.PaintAsync();
await File.WriteAllBytesAsync("example.png", image!.Data);
```

## Compare a Page in Light and Dark

```cs
using System.IO;
using AngleSharp.Browser;

using var engine = new BrowserEngine();
await engine.LoadHtmlAsync("""
    <!doctype html>
    <style>
      body { background: white; color: black; }
      @media (prefers-color-scheme: dark) { body { background: black; color: white; } }
    </style>
    <h1>Hello</h1>
    """);

foreach (var scheme in new[] { "light", "dark" })
{
    engine.ColorScheme = scheme;
    var image = await engine.PaintAsync();
    await File.WriteAllBytesAsync($"{scheme}.png", image!.Data);
}
```

## Type Into a Form Field

Clicking the field focuses it, and the text arrives as input events:

```cs
using AngleSharp.Browser;

using var engine = new BrowserEngine();
await engine.LoadHtmlAsync("""
    <!doctype html>
    <input id="name">
    <p id="out"></p>
    <script>
      document.getElementById('name').addEventListener('input', function (ev) {
        document.getElementById('out').textContent = 'Hello ' + ev.target.value;
      });
    </script>
    """);

await engine.PaintAsync();
await engine.ClickAsync(50, 18);
await engine.TextInputAsync("Vision");

var text = await engine.InvokeAsync(document => document?.GetElementById("out")?.TextContent);
Console.WriteLine(text);
```

## Follow a Link

Awaiting the click covers the navigation it started:

```cs
using AngleSharp.Browser;

using var engine = new BrowserEngine();
await engine.LoadHtmlAsync("""<!doctype html><body style="margin:0"><a href="data:text/html,%3Ctitle%3ENext%3C/title%3E">Go on</a>""");

await engine.PaintAsync();
await engine.ClickAsync(10, 8);

Console.WriteLine(engine.Title);
await engine.GoBackAsync();
Console.WriteLine(engine.CanGoForward);
```

## Find Slow or Failed Requests

```cs
using System.Linq;
using AngleSharp.Browser;

using var engine = new BrowserEngine();
await engine.NavigateAsync("https://example.org");

var problems = engine.Diagnostics.Requests.Where(m => m.Duration > TimeSpan.FromSeconds(1) || (int?)m.StatusCode >= 400);

foreach (var request in problems)
{
    Console.WriteLine($"{request.StatusCode} {request.Url} ({request.Duration})");
}
```

## Read the Console of a Page

```cs
using System.Linq;
using AngleSharp.Browser;

using var engine = new BrowserEngine();
await engine.LoadHtmlAsync("<!doctype html><script>console.log('Hello from the page');</script>");

foreach (var message in engine.Diagnostics.Messages.Where(m => m.Kind == DiagnosticKind.Console))
{
    Console.WriteLine(message.Text);
}
```

## Disable Scripts

```cs
using AngleSharp.Browser;

using var engine = new BrowserEngine(new BrowserOptions { IsScriptingEnabled = false });
await engine.NavigateAsync("https://example.org");

var title = await engine.InvokeAsync(document => document?.Title);
Console.WriteLine(title);
```

## HTML as Your Own UI

Vision writes its settings and about windows like this: no JavaScript, with the logic in C#.

```cs
using AngleSharp.Browser;
using AngleSharp.Dom;

using var engine = new BrowserEngine(new BrowserOptions { IsScriptingEnabled = false });
await engine.LoadHtmlAsync("""<!doctype html><body style="margin:0"><button id="save" style="width:100px;height:40px">Save</button>""");

await engine.InvokeAsync(document =>
{
    document?.GetElementById("save")?.AddEventListener("click", (_, _) => Console.WriteLine("Saved!"));
});

await engine.PaintAsync();
await engine.ClickAsync(20, 20);
```
