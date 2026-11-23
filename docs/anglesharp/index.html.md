# AngleSharp Documentation

> Source: https://anglesharp.github.io/docs/anglesharp/
> Project: AngleSharp (https://github.com/AngleSharp/AngleSharp)
> Package: AngleSharp 1.10.5 — install with `dotnet add package AngleSharp`
> Docs revision: c7ac782c5ef0c35aca936f44696bdea7e2b70851

This documentation focuses on AngleSharp.Core, the standards-driven parser, DOM, selector engine, and browsing-context infrastructure that the other AngleSharp projects build on.

We have more detailed information regarding the following subjects:

- [Getting Started](https://anglesharp.github.io/docs/anglesharp/general/basics/index.html.md)
- [Current Features](https://anglesharp.github.io/docs/anglesharp/general/features/index.html.md)
- [Roadmap and Ecosystem](https://anglesharp.github.io/docs/anglesharp/general/upcoming/index.html.md)
- [Performance Comparisons](https://anglesharp.github.io/docs/anglesharp/general/performance/index.html.md)
- [API Documentation](https://anglesharp.github.io/docs/anglesharp/tutorials/api/index.html.md)
- [Parser Options](https://anglesharp.github.io/docs/anglesharp/tutorials/options/index.html.md)
- [More Examples](https://anglesharp.github.io/docs/anglesharp/tutorials/examples/index.html.md)
- [Form Submission by Example](https://anglesharp.github.io/docs/anglesharp/tutorials/forms/index.html.md)
- [Migration Information](https://anglesharp.github.io/docs/anglesharp/tutorials/migration/index.html.md)
- [Frequently Asked Questions](https://anglesharp.github.io/docs/anglesharp/tutorials/questions/index.html.md)
- [Popover DOM State](https://anglesharp.github.io/docs/anglesharp/tutorials/popovers/index.html.md)

## Why AngleSharp?

If you need some arguments for using AngleSharp (over similar libraries) then here we go:

- AngleSharp is totally standard-driven
- AngleSharp handles HTML, SVG, and MathML content in HTML documents and exposes CSS selector support in core
- AngleSharp stands the html5lib parser tests and aligns with browser behavior for malformed HTML
- AngleSharp handles malformed HTML exactly as every modern browser
- AngleSharp contains brand new elements like support for the `<template>` tag
- AngleSharp performs at least as good as other libraries, mostly better
- AngleSharp provides very useful extension methods for DOM manipulation
- AngleSharp gives you a decoupled API that is easy to use
- AngleSharp keeps the core surface small and exposes richer features through companion packages
- AngleSharp can be used in cross-platform solutions
- AngleSharp can validate and submit forms
- AngleSharp is very easy to extend and customize

There are tons of other arguments. With the provided configuration abilities, and the given extensibility, AngleSharp can be used in various scenarios.

## AngleSharp Ecosystem

AngleSharp.Core intentionally keeps the parser and DOM implementation focused. The wider ecosystem adds CSSOM, JavaScript integration, XML support, rendering, and other higher-level capabilities.

| Project | Purpose | Repository |
|---|---|---|
| AngleSharp.Css | Full CSS parser, CSSOM, and styling services | https://github.com/AngleSharp/AngleSharp.Css |
| AngleSharp.Js | JavaScript integration for browsing contexts | https://github.com/AngleSharp/AngleSharp.Js |
| AngleSharp.Wasm | WebAssembly-oriented integration work for AngleSharp | https://github.com/AngleSharp/AngleSharp.Wasm |
| AngleSharp.Xml | XML, XHTML, and related XML-oriented parsing support | https://github.com/AngleSharp/AngleSharp.Xml |
| AngleSharp.Renderer | Rendering-focused companion project | https://github.com/AngleSharp/AngleSharp.Renderer |
| AngleSharp.Diffing | DOM and markup diffing utilities | https://github.com/AngleSharp/AngleSharp.Diffing |
| AngleSharp.XPath | XPath support on top of the AngleSharp DOM | https://github.com/AngleSharp/AngleSharp.XPath |
