---
title: "AngleSharp v0.12 and the future"
date: 2019-05-06 22:23:10
categories: news organization release
author: "Florian Rappl"
---
Last week the latest version of AngleSharp v0.12 has been released. Not only the core library was updated to v0.12, but we also started updating some related libraries. So far we released:

- AngleSharp.Xml
- AngleSharp.Io

Both contain several improvements. For instance, AngleSharp.Xml now supports fragments. This means that changing properties such as `InnerHtml` also work in an `IXmlDocument` document. Also the XML parser contains a special fragment parsing mode. Besides the fragment parsing the source reference option also was included in the XML parser.

AngleSharp.Io now comes with an advanced cookie provider - written fully from scratch it should come with much less quirks than the `MemoryCookieProvider`, which used the .NET `CookieContainer`. The new provider fully adheres to the RFC 6265 specification. Without much hacks it already deals with all the cookies that required sanitizations and other tricks to be working with the standard .NET implementation. Even better - its internal representation `WebCookie` can be used also outside of AngleSharp. The new cookie provider (called `AdvancedCookieProvider`) also supports syncing to the file system. Here the de-facto standard Netscape format has been implemented.

AngleSharp.Io also introduces additional helpers to simplify downloading response content (potentially even automatic, e.g., when following a link to a binary) or appending files to a form. The new `AppendFile` helper for an `IHtmlInputElement` can work with a stream or local file path.

Nevertheless, two important libraries are missing from the list above:

- AngleSharp.Css
- AngleSharp.Js

The CSS library will be updated to AngleSharp v0.12 first (earliest estimated release date: 15th of May). This is currently in progress and while the library itself will still not be "finished" yet, this version should represent a significant step forward. In this release much of the CSSOM regarding values will be opened (e.g., `ICssFunctionValue`) and equipped with helpers to traverse the CSSOM easily. The serialization (especially decomposition and recombination of shorthand / longhand declarations) will be refined and improved.

After the CSS library v0.12 is done we will prepare a short and simple release of AngleSharp.Js v0.12. This will be a compatibility release only - no significant changes or improvements are planned here. Our goal here is to make existing code / examples work with AngleSharp v0.12 as in pre v0.10 versions.

The reason for such a "simple" compatibility release is stated in [#51](https://github.com/AngleSharp/AngleSharp.Js/issues/51):

> Biggest road blocker for AngleSharp.Js at the moment is Jint. While awesome at its core it also brought / brings some limitations. That Jint v3 takes so long (if it ever finishes) is also not good. We need / want ES6 support and a leaner model that also has the potential to perform better. We think that this is a general .NET problem (lacking a great JS engine - something which should have been IronJS, but wasn't), which is why there is homework to be picked up before solving AngleSharp.Js.

We want to see how to proceed. Right now we have the following options:

- Look for an alternative to Jint (Jint still seems like the best option)
- Collaborate on improving Jint (could be problematic due to Jint's design)
- Collaborate on Esprima.NET and create a new project for a JS.NET engine
- Fully invest in a new JS.NET engine from scratch

Potentially, as beforehand, the last option may be way too large. Currently, it seems that option 2 or 3 are most viable. A detailed analysis of Jint's design and codebase may give us more indication. Even more important is the repository activity there. So far it seems to be in a stale state as AngleSharp was months ago, which would not be the ideal basis to utilize for this option.

As for AngleSharp itself - we still want to hit v1 this year (finally!). More full releases (e.g., v0.13) are therefore expected.
