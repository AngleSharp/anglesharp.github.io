---
layout: default
title: Changelog
parent: root
---
**0.15.0**

- Added `ToHtmlAsync()` extension method (#863)
- Added `ParseFragment` overload using `Stream` (#896)
- Added `euc-kr` encoding (#928)
- Fixed CSS attribute value comparison w.r.t. case sensitivity (#864)
- Fixed issue in the Heisenberg algorithm of the HTML5 parser (#893)
- Fixed issue with the strictness of broken char references in attribute values (#902)
- Fixed possible NRE in the markup formatters / attribute serialization (#903)
- Fixed `GetSelector` returning invalid ID selector (#909)
- Fixed `GetSelector` returning duplicate element ids (#910)
- Fixed possible NRE in media and `embed` elements without `src` (#914)
- Updated CI/CD system to GitHub Actions (#942)
- Dropped support for the .NET Standard 1.3 target (#944)

**0.14.0**

- Included context event `error` for error tracking (#698)
- Extended the `IMarkupFormatter` for literal text (#821)
- Extended the `IElementFactory` definition
- Fixed an issue regarding n-th child for the `GetSelector` utility (#835)
- Added explicit support for .NET 4.6.1 (#842)
- Added public constructor to `BrowsingContext` (#844)
- Force `IBrowsingContext` to be `IDisposable` for cleanup purposes
- Fixed missing `Media` property of stylesheets (#846)
- Improved API of `IMarkupFormatter` (#858)
- Enhanced existing `IMarkupFormatter` instances to allow inheritance
- Added default accepts header for standard document requests (#859)

**0.13.0**

- Removed the `TaskEventLoop` (#782)
- Renamed `WithCookies` to `WithDefaultCookies`
- Fixed bubbling of `DOMContentLoaded` event (#789)
- Fixed maximum recursion depth at query selector (#763)
- Added `MinifyMarkupFormatter` (#745)
- Added `Prettify` and `Minify` extension methods
- Moved `hashchange` to be emitted on `IWindow`
- Added option to avoid consuming character references (#494)
- Added more pseudo elements for GCPM
- Fixed character position starting at normalized CRLF (#786)
- Improved setting `Href` in `Url`
- Fixed crash for invalid attribute names during SVG parsing (#795)
- Added more punycode replacement characters on .NET Standard 1.3 (#797)
- Added use of correct hostname IDN on .NET Standard 2.0 and .NET Framework 4.6 (#797)
- Added ability to delay load in `Document` (#815)

**0.12.0**

- Added ability to create a selector for an element (#784)
- Enhanced documentation (#776, #774, #771)
- Fixed DOM name attribute in `AdjacentPosition` (#775)
- Fixed bug regarding `set-cookie` header (#768)
- Added attribute start position in token (#766)
- Added support for XML processing instruction (#761)
- Fixed serialization of xmlns attributes (#760)
- Added `ISourceReference` for source position retrieval (#754)

**0.11.0**

- Moved everything from `AngleSharp.Xml` to its own library
- Added more examples regarding forms
- Moved `ISvgDocument` and `AutoSelectedMarkupFormatter` to AngleSharp.Xml
- Improved fragment parsing
- Fixed inconsistent behavior in fragment parsing
- Improved migration documentation
- Fixed internal bug in `link` resolution
- Removed `SetDefault` function from `Configuration`

**0.10.0**

- `HttpRequester` improvements
- Make configuration re-usable and easier to work with
- Extracted major part of CSS to `AngleSharp.Css`
- Changed license to MIT
- Enhanced form submission (e.g., added JSON type)
- Added more factories (e.g., link relation factory, document factory)
- Allow usage of HTML imports and more web component parts
- Included sub-resource integrity
- Various performance enhancements
- Improved document unloading
- Default cookie management improvements
- Added custom mime-type handling
- Improvements to CSS selector evaluation and usage (e.g., custom extensions, `ISelectorVisitor`)
- Enhanced the URL parsing
- Changed target to .NET Standard 2.0 (and enable build on Linux)
- Updated to adhere to HTML 5.2 where noted

**0.9.0**

- Improved DOM algorithms and performance
- Shadow DOM draft implemented
- The `picture` element is now support (with `srcset`)
- More neat helpers
- Custom `MimeType`
- `DocumentBuilder` removed
- AngleSharp events aggregated in `IEventAggregator`
- Non-validating XML parser reintegrated
- CSSOM improved (also allows round-trip)
- Included default cookie service
- Deployed with strong name
- Improved parser front-ends (`HtmlParser`, `CssParser`, ...)

**0.8.0**

- New CSS value model integrated
- PseudoElement available
- Mutation records connected
- Encoding basically finished
- Memory leak fixed
- All CSS4 selectors (excluding `||`) included
- Finished `Url` implementation
- HTML5 form validation
- Media features and CSS properties extended
- Namespace naming fix
- All HTML5 input types are supported

**0.7.0**

- Native (callback based) async parsing
- Interfaces for resource loading defined
- Browsing context available / creation possible (if demanded)
- Event model included (`addEventListener`, ...)
- CSS property / value architecture finalized
- Sample JavaScript engine based on Jint included

**0.6.0:**

- Implemented parsing of CSS media queries
- Improved URL parsing according to RFC 3986
- 100% finished HTML5 parser
- 98% finished CSS3 parser
- CSS properties and values defined and implemented
- CSS model implemented (i.e. *getComputedStyle* works)
- Tree traversal included (`NodeIterator` and `TreeWalker`)
- Configuration model changed
- API changed (now interface driven)
- New source management for better handling and performance

**0.5.0:**

- Major API changes (DI is now the only singleton)
- 98% finished HTML5 parser
- 95% finished CSS3 parser
- 85% finished HTML DOM
- Included `Submit()` method for forms

**0.4.0:**

- Final alpha version
- 98% finished HTML5 parser
- 90% finished CSS3 parser
- 85% finished HTML DOM
- Removed XML parser (until HTML and CSS are finished)
- Included WebRequester

**0.3.0:**

- Alpha version
- 95% finished HTML5 parser
- 90% finished CSS3 parser
- 85% finished HTML DOM
- Includes non-validating XML parser
- QuerySelectors etc. are fully working
- DOMAttribute applied where possible

**0.2.0:**

- First released version (pre-alpha)
- 95% finished HTML5 parser
- 70% finished CSS3 parser
- 80% finished HTML DOM
- SVG and MathML DOM are not implemented yet
- Performance seems to be quite OK