---
title: "Introduction"
section: "General"
---
# Introduction

AngleSharp is a .NET library that gives you the ability to parse angle bracket based hyper-texts like HTML, SVG, and MathML. XML without validation is also supported by the library. An important aspect of AngleSharp is that CSS can also be parsed. The included parser is built upon the official W3C specification. This produces a perfectly portable HTML5 DOM representation of the given source code and ensures compatibility with results in evergreen browsers. Also standard DOM features such as `querySelector` or `querySelectorAll` work for tree traversal.

## Advantages

The advantage over similar libraries like *HtmlAgilityPack* is that the exposed DOM is using the official W3C specified API, i.e., that even things like `querySelectorAll` are available in AngleSharp. Also the parser uses the HTML 5.1 specification, which defines error handling and element correction. The AngleSharp library focuses on standards compliance, interactivity, and extensibility. It is therefore giving web developers working with C# all possibilities as they know from using the DOM in any modern browser.

The performance of AngleSharp is quite close to the performance of browsers. Even very large pages can be processed within milliseconds. AngleSharp tries to minimize memory allocations and reuses elements internally to avoid unnecessary object creation.

## Architecture

AngleSharp comes without any dependencies. It is created in a modular way, supporting other libraries to extend its own functionality. Examples are `AngleSharp.Css` or `AngleSharp.Io`. Some of these libraries may come with dependencies and may be constraint to certain platforms only.

## Supported Platforms

AngleSharp has been created as a .NET Standard 2.0 compatible library. This includes, but is not limited to:

- .NET Core (2.0 and later)
- .NET Framework (4.6 and later)
- Xamarin.Android (7.0 and 8.0)
- Xamarin.iOS (10.0 and 10.14)
- Xamarin.Mac (3.0 and 3.8)
- Mono (4.6 and 5.4)
- UWP (10.0 and 10.0.16299)
- Unity (2018.1)

## .NET Foundation

This project is supported by the [.NET Foundation](https://dotnetfoundation.org).
