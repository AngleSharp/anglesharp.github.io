---
title:  "AngleSharp v0.9.3 released"
date:   2015-10-12 11:44:00
categories: news release
author: "Florian Rappl"
---
AngleSharp v0.9.3 is another round of minor updates. Besides a few bug fixes the `CompareDocumentPosition` method has been improved. It now passes all tests and works reliably.

The most interesting new feature is the ability to define custom handling of entities. This can be done via the `IEntityService`. The `GetSymbol` is usually called with an entity like `gt` for XML or `gt;` for HTML. The difference between XML and HTML lies in the way that HTML handles entity errors. HTML has the possibility to use non-semicolon-terminated entities.

The simplest way would be to use, e.g., `XmlEntityService.Resolver`, in a custom implementation. That way the common entities would be resolved by the already available service.

The next release will most probably be a feature release again. Hopefully features such as the CSSOM improvements, factory extensions, or a virtual file system, will be integrated.
