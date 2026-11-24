# Popovers (AngleSharp)

> Source: https://anglesharp.github.io/docs/anglesharp/tutorials/popovers/
> Project: AngleSharp (https://github.com/AngleSharp/AngleSharp)
> Package: AngleSharp 1.11.0 — install with `dotnet add package AngleSharp`
> Docs revision: f9edfbecb8a147550d2c7bfe9a158633f4b94ec2

AngleSharp.Core provides the DOM state and events for HTML popovers. A popover can be opened or
closed through `showPopover()`, `hidePopover()`, and `togglePopover()`. `beforetoggle` fires
synchronously and can cancel opening; `toggle` reports the change through a `ToggleEvent`.

```cs
var document = new HtmlParser().ParseDocument(
    "<button id='open' popovertarget='menu'>Open</button><div id='menu' popover>Menu</div>");
var button = document.QuerySelector<IHtmlButtonElement>("button");
var menu = document.QuerySelector<IHtmlElement>("#menu");

button.GetPopoverTargetElement()?.ShowPopover();
Boolean isOpen = menu.IsPopoverOpen();
```

The `popover` property reflects `auto`, `manual`, and `hint`; an empty attribute is `auto`, and
an invalid value is `manual`. Opening an `auto` popover closes unrelated open `auto` popovers but
preserves its open popover ancestors. Manual popovers are not affected by that stack.

Core tracks DOM state only. Top-layer painting, clipping, the `:popover-open` style rule,
backdrops, invoker activation, light dismissal, and Escape handling require the corresponding
CSS, renderer, or browser integrations.
