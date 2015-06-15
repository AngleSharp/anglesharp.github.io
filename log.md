---
layout: default
title: Log
---

Change log
----------

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