# Provided Services (AngleSharp.Css)

> Source: https://anglesharp.github.io/docs/css/general/provided-services/
> Project: AngleSharp.Css (https://github.com/AngleSharp/AngleSharp.Css)
> Package: AngleSharp.Css 1.5.0 — install with `dotnet add package AngleSharp.Css`
> Docs revision: b35861044ecc148031849ea5a1cfd6316be1b90a

Calling `WithCss()` registers a set of CSS-related services in the AngleSharp configuration.

## What `WithCss()` Registers

From the default configuration extension:

- `ICssDefaultStyleSheetProvider` -> default stylesheet provider,
- `IFeatureValidatorFactory` -> media feature validators,
- `IDocumentFunctionFactory` -> document function support,
- `IPseudoElementFactory` -> pseudo-element construction,
- `IDeclarationFactory` -> declaration metadata + value conversion,
- `ICssParser` -> parser instance using optional `CssParserOptions`,
- `IStylingService` -> `CssStylingService` for CSS MIME handling,
- CSS observer service (`Factory.Observer`) for style mutation integration.
- `IPseudoClassSelectorFactory` -> wrapped so any recognized pseudo-class can be forced per element via `SetPseudoClass(...)` (see [Core Interfaces](https://anglesharp.github.io/docs/css/general/core-interfaces/index.html.md)).

## Quick Service Retrieval

```cs
using AngleSharp;
using AngleSharp.Css;
using AngleSharp.Css.Parser;

var context = BrowsingContext.New(Configuration.Default.WithCss());

var parser = context.GetService<ICssParser>();
var defaultSheets = context.GetServices<ICssDefaultStyleSheetProvider>();
var declarationFactory = context.GetService<IDeclarationFactory>();
```

## Styling Service Role

`CssStylingService` is the `IStylingService` implementation that:

- recognizes CSS MIME types,
- creates `ICssStyleSheet` objects for responses,
- delegates parsing to `ICssParser`.

This is the bridge that enables stylesheet loading from DOM resources.

## Render-Related Service

`WithRenderDevice(...)` registers `IRenderDevice`, which is consumed by:

- `GetComputedStyle(...)`,
- render-tree generation (`window.Render(...)`),
- media query feature validation.

## Optional Painting Services

`WithCss()` registers nothing for the [Painting API](https://anglesharp.github.io/docs/css/general/painting-api/index.html.md); the following services can be added to the configuration with `With(...)`:

- `IPaintWorkletModuleLoader` runs the modules given to `CSS.paintWorklet.addModule()`, e.g., with a scripting engine. Without it, `AddModule` fails with a `NotSupportedError`.
- `IPaintRenderingContextFactory` creates the rendering contexts paint definitions draw with, e.g., into a bitmap. Without it, the operations are recorded by a `RecordingPaintRenderingContext2D`.

## Practical Checks

```cs
var context = BrowsingContext.New(
    Configuration.Default
        .WithCss()
        .WithRenderDevice());

var hasParser = context.GetService<ICssParser>() is not null;
var hasDevice = context.GetService<IRenderDevice>() is not null;

Console.WriteLine($"Parser: {hasParser}, RenderDevice: {hasDevice}");
```
