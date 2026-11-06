---
title: "AngleSharp 1.10.0"
date: 2026-11-06 13:15:00
categories: news release
author: "Florian Rappl"
userId: FlorianRappl
section: Posts
---
Happy to share that we have some big release party today:

**AngleSharp 1.10.0 is here!** 🚀

AngleSharp is a web utility library for .NET written exclusivly in C#. It is the de-facto standard for parsing HTML5 on the .NET platform. Through its architecture it is actually more than just an HTML parser - it is the core of a headless browser. With associated libraries such as AngleSharp.Css or AngleSharp.Js more web capabilities such as style computation or script evaluation are possible.

The v1.10 release marks an important milestone in the AngleSharp project. Many DOM APIs have been implemented that previously did not appear at all. While these APIs did not make much of a difference for standard HTML parsing they are crucial in the JavaScript evaluation of many websites.

## A New Milestone for the Entire Ecosystem

Today marks an important milestone for AngleSharp! We are happy to announce the release of **AngleSharp 1.10.0**, accompanied by new releases across the entire ecosystem: AngleSharp.Css 1.4.0, AngleSharp.Js 1.2.0, AngleSharp.Io 1.3.0, and AngleSharp.Renderer 0.11.0.

This is more than just another round of package updates. AngleSharp 1.10.0 represents a significant step forward for the core library and establishes a new common foundation for the ecosystem. All the latest releases of the companion libraries are built on top of AngleSharp 1.10.0 and require it as their underlying dependency.

Let's take a closer look at what's new and why this release is particularly exciting.

## AngleSharp 1.10.0 – The Foundation

[AngleSharp 1.10.0](https://github.com/AngleSharp/AngleSharp/releases/tag/v1.10.0) is the centerpiece of this release cycle.

As the foundation on which the other libraries build, improvements to AngleSharp have an impact that reaches far beyond the core package itself. Better DOM behavior, more complete browser API implementations, improved security, and additional standards support benefit the entire ecosystem.

There are several noteworthy additions and improvements.

### Better DOM and browser API compatibility

This release brings a considerable number of improvements to DOM behavior and browser API compatibility.

Among the highlights are:

- **Custom Elements:** Support for the `customElements` registry, including `define`, `get`, `getName`, `whenDefined`, and `upgrade`, as well as the `:defined` pseudo-class.
- **Event handling:** Support for the `capture`, `once`, `passive`, and `signal` options in `addEventListener` and `removeEventListener`.
- **DOM improvements:** Added `isConnected`, `toggleAttribute`, `replaceChildren`, `getRootNode`, and several other useful DOM APIs.
- **Form improvements:** Added `requestSubmit`, `reportValidity`, and `SubmitEvent`, including form validation, cancellation, and submitter reporting.
- **Popover API:** Added support for the `popover` attribute.
- **Pointer and keyboard events:** Expanded event support with `PointerEvent`, additional keyboard properties, and improved mouse event information.

There are also numerous correctness fixes, including improvements to live DOM collections, `TreeWalker`, frame initialization, event propagation, and document writing.

These changes make AngleSharp behave more consistently with the browser platform and provide a stronger foundation for applications that depend on accurate DOM semantics.

### Security improvements

Security remains an important consideration when implementing browser behavior outside an actual browser.

AngleSharp 1.10.0 adds support for the `sandbox` attribute on iframes, applying the corresponding security restrictions to their browsing contexts.

It also introduces support for `X-Frame-Options` and the `frame-ancestors` directive of Content Security Policy. These mechanisms help prevent documents from being displayed in frames when their embedding policies prohibit it.

These additions strengthen the security model around embedded documents and bring AngleSharp closer to the behavior expected from modern browsers.

### More control over document creation

Two new document creation options deserve special attention:

- `CreateDocumentOptions.IsScriptingDisabled`
- `CreateDocumentOptions.IsNavigationDisabled`

They provide more precise control over document creation, including scenarios such as DOM parsing where scripting and navigation should not be enabled.

Together with the other improvements, these additions make AngleSharp more flexible for different embedding and processing scenarios.

**In short:** AngleSharp 1.10.0 is a substantial improvement to the core platform, combining standards compatibility, better DOM behavior, security enhancements, and additional browser APIs.

## AngleSharp.Css 1.4.0 – Better Styling and Rendering

[AngleSharp.Css 1.4.0](https://github.com/AngleSharp/AngleSharp.Css/releases/tag/v1.4.0) brings improvements to CSS processing and its integration with the DOM.

Importantly, this release now requires at least AngleSharp 1.10.0.

Some of the highlights include:

- Improved rendering by creating pseudo-elements and specified styles only when needed.
- Reduced memory consumption of render trees.
- Improved `GetInnerText` by using the render tree, correctly skipping hidden content and accessing shadow hosts through their slots.
- Improved presentational hints without relying on reflection.
- Added support for `CSSStyleSheet` and `adoptedStyleSheets`.
- Added support for `::selection` pseudo-elements.
- Improved `getComputedStyle` and its handling of initial values.
- Added support for the popover API through `:popover-open` and `::backdrop`.
- Expanded CSS style property access from JavaScript, including properties such as `gap`, `aspectRatio`, `gridTemplateColumns`, and `inset`.

There are also improvements to `CSS.supports`, media query handling, and CSS supports conditions.

Of particular interest are the rendering and memory improvements. Avoiding unnecessary style and pseudo-element creation, together with more efficient render trees, helps make CSS processing more economical.

## AngleSharp.Js 1.2.0 – More Reliable JavaScript Integration

[AngleSharp.Js 1.2.0](https://github.com/AngleSharp/AngleSharp.Js/releases/tag/v1.2.0) focuses on improving the integration between JavaScript and the DOM.

This release addresses several subtle but important compatibility issues.

Highlights include:

- Fixed the origin of frames without their own address so that they correctly inherit the origin of their creator.
- Fixed `append`, `prepend`, and related methods to correctly turn strings into text nodes.
- Improved prototype-chain behavior for classes derived from DOM types.
- Improved support for event listeners and callbacks, including objects implementing `handleEvent`.
- Fixed promise jobs not being executed after host callbacks, which could otherwise cause `await` operations to hang.
- Improved callback handling for APIs such as `navigator.locks.request`.
- Fixed event listener removal and error propagation.
- Improved the handling of DOM exceptions, dates, structured cloning, and iterable DOM collections.
- Fixed bound functions and callable proxies not being accepted as callbacks.

One particularly important improvement concerns module loading: JavaScript modules are now loaded through the configured requesters rather than directly from the local filesystem.

This is an important step towards consistent and controlled resource loading, especially when applications provide their own resource access policies.

Overall, AngleSharp.Js 1.2.0 makes JavaScript execution more predictable and improves compatibility with the browser APIs that applications expect.

## AngleSharp.Io 1.3.0 – Expanded Web Platform APIs

[AngleSharp.Io 1.3.0](https://github.com/AngleSharp/AngleSharp.Io/releases/tag/v1.3.0) brings a substantial expansion of the available web platform APIs.

The release includes several improvements to existing networking functionality, as well as a number of new APIs.

### Improved networking

`XMLHttpRequest` now reads response bodies in chunks. Progress events are fired approximately every 50 milliseconds, providing updated `loaded` and `total` values when the content length is available. The `responseText` also grows while the request is in the `LOADING` state.

The final event sequence of `XMLHttpRequest` has also been corrected to follow the expected order.

Other improvements include better WebSocket error reporting and a nesting limit for JSON parsing to handle deeply nested documents more safely.

### More browser APIs

Some particularly interesting additions include:

- `Request`, `Headers`, and `Response` constructors and additional associated functionality.
- IndexedDB support for JavaScript, including transactions, indexes, cursors, keys, and structured values.
- `Blob`, `File`, and `FileReader`.
- Readable, writable, and transform streams.
- `TextEncoderStream` and `TextDecoderStream`.
- `CompressionStream` and `DecompressionStream`.
- Streaming response bodies.
- `AbortController` and `AbortSignal`, including cancellation support for `fetch`.
- `ProgressEvent` and upload progress events.
- File System Access API support through `showOpenFilePicker` and `showSaveFilePicker`.
- Additional service worker capabilities, including background sync and push management.
- Notification support with an injectable delivery platform.

There are also improvements to RTC ICE server URL handling and cookie validation.

One important security fix concerns cookie paths containing control characters. Such paths are now rejected, preventing unwanted line injection into cookie files.

This release makes the I/O package considerably more capable and brings its API surface closer to what modern web applications expect.

## AngleSharp.Renderer 0.11.0 – Taking Rendering Further

[AngleSharp.Renderer 0.11.0](https://github.com/AngleSharp/AngleSharp.Renderer/releases/tag/v0.11.0) continues to improve the rendering capabilities built on top of AngleSharp.

The release brings several important layout, geometry, and interaction improvements.

Highlights include:

- Improved resolution of used pixel values for margins and positioned insets in `getComputedStyle`.
- Fixed handling of mixed percentage and absolute lengths, including expressions such as `calc(50% + 10px)` and `min(240px, 55%)`.
- Improved grid track calculations involving expressions with more than two terms.
- Fixed scroll dimension calculations involving positioned and clipped content.
- Added `elementFromPoint` and `elementsFromPoint`.
- Expanded mouse event geometry with `pageX`, `pageY`, `offsetX`, and `offsetY`.
- Added more used values to `getComputedStyle`, including dimensions, padding, border widths, and inherited text properties.
- Added text selection support, including the DOM's `getSelection()` API and the corresponding selection events.
- Added `ResizeObserver` and `IntersectionObserver`.
- Added `Range.getClientRects()` and `Range.getBoundingClientRect()`.
- Added `element.animate()` and related Web Animations APIs using the renderer's virtual clock.
- Integrated `document.fonts` and script-created `FontFace` objects into font matching and layout.

These additions are particularly interesting because they expand the interaction between the DOM, CSS, JavaScript, and actual layout.

With observers, text selection, geometry APIs, and animation support, the renderer continues to move beyond simply calculating layouts towards providing a richer browser-like environment.

## A Stronger Ecosystem, Together

One of the most important aspects of this release cycle is the alignment of all the companion libraries.

The latest versions are:

| Package | Version |
|---|---:|
| AngleSharp | **1.10.0** |
| AngleSharp.Css | **1.4.0** |
| AngleSharp.Js | **1.2.0** |
| AngleSharp.Io | **1.3.0** |
| AngleSharp.Renderer | **0.11.0** |

All these libraries build on top of AngleSharp, and their latest releases target AngleSharp 1.10.0 as their common foundation.

This is an important point for anyone maintaining an existing application: upgrading only one component may not be sufficient to benefit from the latest ecosystem improvements. We recommend updating the related packages together to ensure that they work with the same core version and take advantage of the improvements introduced throughout the stack.

The result is a more consistent platform, where DOM behavior, CSS processing, JavaScript execution, resource loading, and rendering can evolve together.

## Thank You to the Community!

No open-source project grows in isolation, and this release cycle is a great example of that.

We would particularly like to acknowledge the contributions from **michaelthyregod**, who contributed improvements across AngleSharp.Css and AngleSharp.Io.

These contributions include performance optimizations, reduced memory usage, improvements to CSS processing, and security-related fixes.

We also appreciate everyone who reports issues, tests new releases, provides feedback, and helps improve the project.

Community contributions are especially valuable in a project like AngleSharp, where correctness and compatibility depend on getting many small details right. A seemingly minor fix in event handling, DOM behavior, resource loading, or CSS processing can have a meaningful impact on applications built on top of the library.

The improvements in these releases reflect exactly that: a continuous effort to make the implementation more correct, more secure, and more efficient.

Thank you to everyone involved!

## Getting Started

All five releases are available now.

You can find the packages and their detailed release notes here:

- [AngleSharp 1.10.0](https://github.com/AngleSharp/AngleSharp/releases/tag/v1.10.0)
- [AngleSharp.Css 1.4.0](https://github.com/AngleSharp/AngleSharp.Css/releases/tag/v1.4.0)
- [AngleSharp.Js 1.2.0](https://github.com/AngleSharp/AngleSharp.Js/releases/tag/v1.2.0)
- [AngleSharp.Io 1.3.0](https://github.com/AngleSharp/AngleSharp.Io/releases/tag/v1.3.0)
- [AngleSharp.Renderer 0.11.0](https://github.com/AngleSharp/AngleSharp.Renderer/releases/tag/v0.11.0)

If you are using AngleSharp in an existing project, now is a great time to update.

**Thank you for being part of the AngleSharp community. Here's to another milestone and many more improvements ahead!**

## Supporting the Project

Open source projects don't evolve like this by accident.

AngleSharp, AngleSharp.Css, AngleSharp.Io, AngleSharp.Js, AngleSharp.Renderer and the surrounding ecosystem represent thousands of hours spent implementing standards, fixing edge cases, optimizing performance, reviewing issues, and helping users.

If these libraries save you time, power your products, or simply make your life a little easier, please consider supporting their continued development.

You can sponsor the project through GitHub Sponsors or Buy Me a Coffee:

* GitHub Sponsors: [github.com/sponsors/FlorianRappl](https://github.com/sponsors/FlorianRappl)
* Buy Me a Coffee: [buymeacoffee.com/florianrappl](https://buymeacoffee.com/florianrappl)

Every contribution helps make future releases—and ambitious projects like AngleSharp.Browser—possible. ❤️
