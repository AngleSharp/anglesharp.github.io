---
title: "AngleSharp v0.11.0 released"
date: 2019-02-12 09:20:00
categories: news release major
author: "Florian Rappl"
section: Blog
layout: post
---
Yesterday the latest version of AngleSharp has been released. This version corrects some smaller issues of the big 0.10 release published a month ago. It also brings some further advancements such as improved fragment parsing, some internal bugfixes, or the removal of AngleSharp.Xml from the core library.

The removal of AngleSharp.Xml has been done for several reasons. For once, not many people have been interested in or actively using this part of AngleSharp. The other reason is that this way AngleSharp.Xml can have its own release cycle and expand beyond the constraint feature set determined by AngleSharp.Core. This logic closely follows the logic for extracting AngleSharp.Css out of the core.

As a first consequence the `AutoSelectedMarkupFormatter` has been removed from AngleSharp.Core. It now lives in AngleSharp.Xml as the `XhtmlMarkupFormatter` is also part of AngleSharp.Xml.

Finally, this release also expands the documentation with more information regarding the migration steps and examples to get started.
