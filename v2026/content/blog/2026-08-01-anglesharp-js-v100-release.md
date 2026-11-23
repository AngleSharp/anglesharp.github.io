---
title: "AngleSharp.Js 1.0.0"
date: 2026-08-01 13:15:00
categories: news release
author: "Florian Rappl"
userId: FlorianRappl
section: Posts
---
Another long-awaited milestone has finally arrived:

**AngleSharp.Js 1.0.0 is here!** 🚀

With this release, the final major building block of the AngleSharp ecosystem reaches its first stable version. Together with **AngleSharp 1.6.0** and **AngleSharp.Css 1.0.0**, it marks an important moment for the project: AngleSharp has evolved from "just" an HTML parser into a comprehensive platform for understanding, executing, and interacting with modern web applications—all from .NET.

## JavaScript, the Way the Web Uses It

The modern web doesn't stop at HTML.

Whether you're dealing with React, Angular, Vue, jQuery, or plain JavaScript, websites increasingly depend on client-side execution before they reveal their true content. Static parsing alone often isn't enough anymore.

That's exactly where AngleSharp.Js comes in.

By integrating a high-performance JavaScript engine directly into the AngleSharp ecosystem, AngleSharp.Js enables real-world websites to be evaluated inside .NET while seamlessly interacting with the DOM.

The result is a browsing experience that feels remarkably close to what happens inside a real browser—but entirely managed, extensible, and embeddable within your own application.

## Powered by Jint ❤️

None of this would be possible without the incredible work done by the team behind **Jint**.

Over the years, they have built what is arguably one of the best JavaScript interpreters available for .NET, with excellent ECMAScript support—including full ES6 compatibility—and an impressive focus on correctness and performance.

Just as importantly, they've been fantastic collaborators.

A huge amount of work has gone into making the integration between Jint and AngleSharp as efficient as possible. Both projects have evolved together, continuously refining the bridge between the JavaScript runtime and the DOM while squeezing as much performance as possible out of the architecture.

The result is an integration that feels natural instead of bolted on.

A big thank you goes to everyone involved in making Jint and AngleSharp.Js what they are today.

## The Complete AngleSharp Ecosystem

One of the strengths of AngleSharp has always been its modular architecture.

Instead of forcing every application to include every web technology, you can assemble exactly the capabilities you need.

Want to execute JavaScript?

➡️ Install **AngleSharp.Js**.

Need CSS parsing, selector matching, computed styles, or render-tree support?

➡️ Add **AngleSharp.Css**.

Need better networking, support for `fetch`, `XMLHttpRequest`, custom requesters, or advanced I/O integration?

➡️ **AngleSharp.Io** has you covered.

Working with XML documents or validating against DTDs?

➡️ That's what **AngleSharp.Xml** is for.

Need WebAssembly support?

➡️ **AngleSharp.Wasm** is there for exactly that.

Piece by piece, the ecosystem has grown into a toolbox that covers almost every aspect of working with web technologies in managed .NET.

## What Does 1.0 Mean?

Version 1.0 is much more than changing the first digit.

It represents years of bug fixes, architectural improvements, compatibility work, and API stabilization.

This release includes a wide range of improvements across the project.

### Better Performance ⚡

Several architectural improvements make JavaScript execution faster and more scalable.

One notable optimization is the redesign of DOM prototype creation. Instead of rebuilding type information for every document, prototype layouts are now shared across the process, allowing type resolution to happen once while giving the JavaScript engine much warmer caches for member access.

Internal caches have also become thread-safe, reducing overhead in concurrent scenarios.

### Better Standards Compliance

A lot of work has gone into making browser behavior more accurate.

Among many fixes, this release improves:

* document ready-state handling
* `location` assignment and navigation behavior
* DOM object interoperability between C# and JavaScript
* `NodeFilter`
* `Window.parent`
* `hasChildNodes()`
* `XMLHttpRequest` handling
* dataset synchronization between JavaScript and the underlying DOM

There are also fixes for deeply recursive scripts that previously could result in `StackOverflowException`s, making the runtime significantly more robust.

### New Features

Version 1.0 also introduces several new capabilities, including:

* 🌐 **Web Worker** support
* ⚙️ configurable JavaScript engines through `JsScriptingOptions`
* 📢 reporting of uncaught event-loop exceptions through the browsing context

Meanwhile, networking-related functionality such as `Navigator` and `XmlHttpRequester` has been moved into **AngleSharp.Io**, where it naturally belongs and can evolve independently.

Finally, AngleSharp.Js has been updated to build on **AngleSharp 1.x** and the latest **Jint v4**, bringing the latest improvements from both projects into one release.

## What's Next? Rendering. 🖥️

Now that HTML, CSS, JavaScript, networking, XML, and even WebAssembly all have dedicated libraries, the next big milestone is becoming increasingly tangible:

**AngleSharp.Renderer.**

The goal is ambitious but exciting.

Instead of stopping at DOM manipulation and style computation, AngleSharp.Renderer aims to provide actual rendering capabilities for the ecosystem.

That means supporting layout information such as `offsetLeft`, `offsetTop`, element dimensions, and other APIs that traditionally require a browser engine. It also opens the door to fully headless browser scenarios, screenshot generation, visual testing, and automated interaction with rendered pages.

One of the next major goals is to build an example browser showcasing these capabilities and demonstrating just how far a fully managed .NET browser stack can go.

It's an exciting direction—and one that has been years in the making.

## Supporting the Project

Open source projects don't evolve like this by accident.

AngleSharp, AngleSharp.Js, and the surrounding ecosystem represent thousands of hours spent implementing standards, fixing edge cases, optimizing performance, reviewing issues, and helping users.

If these libraries save you time, power your products, or simply make your life a little easier, please consider supporting their continued development.

You can sponsor the project through GitHub Sponsors or Buy Me a Coffee:

* GitHub Sponsors: [github.com/sponsors/FlorianRappl](https://github.com/sponsors/FlorianRappl)
* Buy Me a Coffee: [buymeacoffee.com/florianrappl](https://buymeacoffee.com/florianrappl)

Every contribution helps make future releases—and ambitious projects like AngleSharp.Renderer—possible. ❤️

## Thank You

Reaching **AngleSharp.Js 1.0.0** feels like the completion of a long chapter.

What began years ago as an HTML parser has steadily grown into a modular platform capable of parsing documents, executing JavaScript, evaluating CSS, communicating over the network, processing XML, and soon—even rendering complete web pages.

There is still plenty to build, but today is a moment worth celebrating.

Thank you to everyone who contributed code, filed issues, reviewed pull requests, tested previews, sponsored development, or simply trusted AngleSharp in your own projects.

Here's to the next chapter of the ecosystem. 🚀
