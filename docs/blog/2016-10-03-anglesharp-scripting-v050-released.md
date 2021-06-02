---
title: "AngleSharp Scripting v0.5.0 released"
date: 2016-10-03 11:45:00
categories: news release scripting
author: "Florian Rappl"
---
Just now the latest version of the JavaScript scripting extension *AngleSharp.Scripting.JavaScript* was released. In the new release with the version 0.5.0 a couple of bug fixes and improvements have been placed. All in all this is certainly leading the way forward.

The biggest internal change is the placement of the correct prototype chain. This was on the list for quite some time. The change allows calling, e.g., `Object.getPrototypeOf(document)` with the result being the `HTMLDocument.prototype` element. Also objects such as `HTMLDocument` are now available on the `window` context. These objects are the constructor functions of their matching DOM interfaces. In most cases the constructors are just dummies, which cannot be used directly.

A quite nice addition is the first API extension from the library. The `ExecuteScript` extension method works on document instances. It allows direct evaluation of a JavaScript snippet. The result is a .NET object, e.g., `document.ExecuteScript("2+3")` would result in a boxed `System.Double` instance (`5`). Similarly, a call to `document.ExecuteScript("document.querySelector('div')")` would return the instance of the first `div` element in the document.

Finally, a couple of improvements to the type casting abilities have been integrated. Functions are now also accepted in form of strings (e.g., for `setTimeout` or `setInterval`). Furthermore, for primitive types (strings, booleans, ...) the corresponding JavaScript conversion is applied. This is all done as it should be.

For the way forward we will improve the extensibility and standard complience of *AngleSharp.Scripting.JavaScript*. With the v0.6 release a set of nasty tests needs to be passed, which all work in standard browsers. The ultimate goal is to reach the v1 milestone shortly after the *AngleSharp.Core* library reaches it.
