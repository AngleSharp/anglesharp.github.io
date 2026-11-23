# Avalonia Control (AngleSharp.Browser)

> Source: https://anglesharp.github.io/docs/browser/general/avalonia/
> Project: AngleSharp.Browser (https://github.com/AngleSharp/AngleSharp.Browser)
> Package: AngleSharp.Browser 0.2.0 — install with `dotnet add package AngleSharp.Browser`
> Docs revision: 9e2ca98df15342044069b89c6ba35431334e1443

The `AngleSharp.Browser.Avalonia` package provides `BrowserView`, a control displaying a web page. It has no native browser dependency: pages are parsed, scripted and painted in .NET. The control paints frames, forwards pointer, wheel and keyboard input, draws an overlay scrollbar, and shows the cursor the page asks for.

The package relies on `Avalonia` only, so the application decides on the theme and platform packages. Rendering pages does not require a specific Avalonia renderer.

## The Simple Way

Set the `Source`:

```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:browser="using:AngleSharp.Browser.Avalonia">
    <browser:BrowserView Source="https://example.org" />
</Window>
```

The control creates an engine while it is in the visual tree, and disposes it when it gets detached. Nothing is persisted. The clipboard of the window is connected, and pages are told the color scheme of the current theme, following it when it changes.

`Source` is what navigates: setting it opens another page. It also follows the page, e.g., after a click on a link. By default it binds two-way, which is all it takes for an address bar. Note the update trigger, as otherwise every keystroke would navigate:

```xml
<DockPanel xmlns="https://github.com/avaloniaui"
           xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
           xmlns:browser="using:AngleSharp.Browser.Avalonia">
    <TextBox DockPanel.Dock="Top" Text="{Binding #View.Source, UpdateSourceTrigger=LostFocus}" />
    <browser:BrowserView x:Name="View" Source="https://example.org" />
</DockPanel>
```

The `Options` property configures the engine created by the control. Set it before the view is attached:

```cs
using AngleSharp.Browser;
using AngleSharp.Browser.Avalonia;

var view = new BrowserView
{
    Source = "https://example.org",
    Options = new BrowserOptions
    {
        ProfileDirectory = "profile",
        IsScriptingEnabled = false,
    },
};
```

The created engine is available from the `Engine` property, once the view is attached.

## Providing the Engine

Host the engine yourself to go beyond a page in a box: to reuse it after the view was detached, to control its lifetime, or to bind against it in a view model.

```cs
using AngleSharp.Browser;
using AngleSharp.Browser.Avalonia;

var engine = new BrowserEngine();
var view = new BrowserView { Engine = engine };

await engine.NavigateAsync("https://example.org");
```

An engine provided like this belongs to you: the control never disposes it, and `Options` does not apply to it. To allow pages to access the clipboard, set `BrowserOptions.ClipboardPlatform` to an `AvaloniaClipboardPlatform` with the clipboard of the top level.

If the assigned engine shows a page already, `Source` is updated with its address. Otherwise, the engine opens the `Source`, if there is any.

## Toolbar and Windows

The control has no chrome. The engine has what it takes for building one:

```cs
using Avalonia.Threading;

engine.StateChanged += (_, _) => Dispatcher.UIThread.Post(() =>
{
    // update the title, back / forward buttons, or a progress indicator
    Console.WriteLine($"{engine.Title} ({engine.Url}), loading: {engine.IsLoading}");
});

engine.HoverChanged += (_, _) => Dispatcher.UIThread.Post(() =>
{
    // show the link's address in a status bar
    Console.WriteLine(engine.HoveredLink);
});
```

Engine events may be raised on any thread, so they are dispatched here. To open real windows for `target="_blank"` links, handle `WindowRequested`; see [Multiple Windows](https://anglesharp.github.io/docs/browser/general/configuration/index.html.md#multiple-windows).

## Input Handling

The control has to be focused to get keyboard input; clicking it does that. Shortcuts with Control or Alt stay unhandled, so `KeyBinding`s of the window work while the page is focused. Control+V pastes into the focused text field, Control+C copies the selected text and Control+A selects all of it (with `BrowserOptions.IsTextSelectionEnabled`), and the extra mouse buttons go back and forward in the history.

## Namespace Hint

Inside of a namespace below `AngleSharp.Browser`, the name `Avalonia` refers to `AngleSharp.Browser.Avalonia`. Should your code live in one, put the `using` directives for Avalonia outside of the namespace, or write `global::Avalonia`.
