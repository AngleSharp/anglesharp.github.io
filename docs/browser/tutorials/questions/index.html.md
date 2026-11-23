# Questions (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/tutorials/questions/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

## A page looks wrong or stays empty. What can I do?

Look at the diagnostics first, as many issues come from a script that failed, or a resource not being loaded:

```cs
foreach (var message in engine.Diagnostics.Messages)
{
    Console.WriteLine($"[{message.Kind}] {message.Text}");
}
```

Layout and painting are done by AngleSharp.Renderer, styles by AngleSharp.Css, and scripts by AngleSharp.Js. Sites relying on the page being rendered by a client-side framework are the most likely to stay empty, as a single unsupported API may stop their script. Please open an issue in the respective repository with a small reproduction.

## How do I wait until a page is ready?

The task returned by `NavigateAsync` completes once the document has been loaded. Scripts may keep on changing the page afterwards. There is no general answer for when such a page is finished, so wait for what you are looking for:

```cs
await engine.NavigateAsync("https://example.org");

while (await engine.InvokeAsync(document => document?.QuerySelector("p")) is null)
{
    await Task.Delay(100);
}
```

## Why does my code throw or behave strangely when using the document?

AngleSharp is not thread-safe, so the DOM must only be used on the event loop. Use `InvokeAsync`. Do not keep elements around to use them outside of it. See [Threading](https://anglesharp.github.io/docs/browser/general/engine/index.html.md#threading).

## Why does waiting for the engine hang in my code?

The event loop is waiting for itself if an operation of the engine is awaited with blocking inside of `InvokeAsync` or a DOM event handler. Start the operation outside, instead.

Prefer `await` over `Wait()` and `Result` in general. This includes tests: assertions that block while running async code (e.g., `Assert.ThrowsAsync` of NUnit) may hang, so use an awaited `try` / `catch` instead.

## Why do `ScrollPosition` and `ScrollTop` differ?

Scrolling is smooth and runs ahead of the DOM. See [Overscan and Scrolling](https://anglesharp.github.io/docs/browser/general/rendering/index.html.md#overscan-and-scrolling).

## How do I persist logins?

Use a `ProfileDirectory`. Without one, cookies and storage are gone with the engine:

```cs
using var persistent = new BrowserEngine(new BrowserOptions { ProfileDirectory = "profile" });
```

## Why does a `data:` address show an empty page?

Characters like `<` need to be percent-encoded in the address. Use `Uri.EscapeDataString`, or `LoadHtmlAsync` to show markup:

```cs
await engine.NavigateAsync("data:text/html," + Uri.EscapeDataString("<title>Hello</title>"));
```

## Does the engine run on servers without a display?

Yes. Painting only requires SkiaSharp, whose native assets are included. On Linux they depend on fontconfig, so make sure it and some fonts are installed. Only `AngleSharp.Browser.Avalonia` needs a UI.

## How do I make large pages paint faster?

Use the server GC in the application. Laying out a large page keeps a lot alive until it is done (the styles and boxes of all elements), which the default workstation GC copies on a single thread for every collection meanwhile; the server GC does it on all cores, and its heaps adapt to the size of the application. For GitHub's start page, the pauses for garbage collection went from about 150 ms to 40 ms per frame, for about 200 MB more memory:

```xml
<PropertyGroup>
  <ServerGarbageCollection>true</ServerGarbageCollection>
</PropertyGroup>
```

The first frames of a page are mostly spent compiling and optimizing code. A host shortens them by publishing precompiled code, and by not having the runtime wait for a quiet moment before it optimizes what is called often:

```xml
<PropertyGroup>
  <PublishReadyToRun Condition="'$(RuntimeIdentifier)' != ''">true</PublishReadyToRun>
</PropertyGroup>

<ItemGroup>
  <RuntimeHostConfigurationOption Include="System.Runtime.TieredCompilation.CallCountingDelayMs" Value="0" />
</ItemGroup>
```

The styles and the style maps of large pages are computed on all cores. A host that has none to spare turns this off with the AppContext switches `AngleSharp.Css.DisableParallelism` and `AngleSharp.Renderer.DisableParallelism`.
