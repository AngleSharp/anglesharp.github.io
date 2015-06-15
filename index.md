---
layout: default
title: Home
---

What is AngleSharp?
-------------

AngleSharp is a .NET library that gives you the ability to parse angle bracket based hyper-texts like HTML, SVG, and MathML. In the future XML might be included, however, since .NET offers a variety of capable XML parsers there is a discussion about redundancy. An important aspect of AngleSharp is that CSS can also be parsed. The parser is built upon the official W3C specification. This produces a perfectly portable HTML5 DOM representation of the given source code. Also current features such as `querySelector` or `querySelectorAll` work for tree traversal.

The advantage over similar libraries like the HtmlAgilityPack is that e.g. CSS (including selectors) is already built-in. Also the parser uses the HTML 5.1 specification, which defines error handling and element correction. While the HtmlAgilityPack focuses on giving .NET users a nice and easy way to handle HTML documents, this library focuses on giving web developers working with C# all possibilities as they would have in a browser using JavaScript. Hence the DOM is built in a more reliable, standard-conform and faster way than with the other solutions.

The performance of AngleSharp is quite close to the performance of browsers. Even very large pages can be processed within milliseconds. AngleSharp tries to minimize memory allocations and reuses elements internally to avoid unnecessary object creation.

Documentation
-------------

Documentation is available in form of the public Wiki here at GitHub. 

* [Wiki Home](https://github.com/FlorianRappl/AngleSharp/wiki)
* [Documentation](https://github.com/FlorianRappl/AngleSharp/wiki/Documentation)
* [API](https://github.com/FlorianRappl/AngleSharp/wiki/Api)
* [Examples](https://github.com/FlorianRappl/AngleSharp/wiki/Examples)
* [Performance](https://github.com/FlorianRappl/AngleSharp/wiki/Performance)

The project's timeline, upcoming implementations, (currently) missing features and milestones is published and maintained in the Wiki as well. Issues should be reported on the GitHub's project page.

More information is also available by following some of the hyper references mentioned in the Wiki. In-depth articles will be published on the CodeProject, with links being placed in the Wiki at GitHub.

Current status
--------------

[![Build status](https://img.shields.io/appveyor/ci/FlorianRappl/AngleSharp.svg?style=flat-square)](https://ci.appveyor.com/project/FlorianRappl/AngleSharp)
[![Nuget count](https://img.shields.io/nuget/v/AngleSharp.svg?style=flat-square)](https://www.nuget.org/packages/AngleSharp/)
[![Nuget downloads](https://img.shields.io/nuget/dt/AngleSharp.svg?style=flat-square)](https://www.nuget.org/packages/AngleSharp/)
[![Issues open](https://img.shields.io/github/issues/FlorianRappl/AngleSharp.svg?style=flat-square)](https://github.com/FlorianRappl/AngleSharp/issues)

The project aims to bring a solid implementation of the W3C DOM for HTML, SVG, MathML and CSS to the CLR, written in C#. The idea is that you can basically do everything with the DOM in C# that you can do in JavaScript.

Most parts of the DOM are included, even though some may still miss their (right) implementation. The goal for v1.0 is to have almost everything implemented according to the official W3C specification (with useful extensions by the WHATWG).

The API is close to the DOM4 specification, however, the naming has been adjusted to apply with .NET conventions. Nevertheless, to make AngleSharp really useful for, e.g., a JavaScript engine, attributes have been placed on the corresponding interfaces (and methods, properties, ...) to indicate the status of the field in the official specification. This allows automatic generation of DOM objects with the official API.

This is a long-term project which will eventually result in a state of the art parser for the most important angle bracket based hyper-texts (and related description languages like CSS).

Use-cases
---------

- Parsing HTML (incl. fragments)
- Parsing CSS (incl. selectors, declarations, ...)
- Constructing HTML (e.g., view-engine)
- Minifying CSS, HTML
- Querying document elements
- Crawling information
- Gathering statistics
- Connection to page analytics
- HTML / DOM Unit Tests
- Automated JavaScript interaction
- Testing other script engines
- ...

Participating in the project
----------------------------

If you know some feature that AngleSharp is currently missing, and you are willing to implement the feature, then your contribution is more than welcome! Also if you have a really cool idea - do not be shy, we'd like to hear it.

If you have an idea how to improve the API (or what is missing) then posts / messages are also welcome. For instance there have been ongoing discussions about some styles that have been used by AngleSharp (e.g. `HTMLDocument` instead of `HtmlDocument`) in the past. In the end AngleSharp stopped using `HTMLDocument` (at least visible outside of the library). Now AngleSharp uses names like `IDocument`, `IHtmlElement` and so on. This change would not have been possible without fruitful discussions.

The project is always searching for additional contributors. Even if you do not have any code to contribute, but rather an idea for improvement, a bug report or a mistake in the documentation. These are the contributions that keep this project active. 