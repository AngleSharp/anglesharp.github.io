---
title: "AngleSharp v0.10.0 released"
date: 2019-01-06 10:49:00
categories: news release major
author: "Florian Rappl"
userId: FlorianRappl
section: Posts
---
After more than 2 years AngleSharp v0.10 has finally become a reality. Jointly with AngleSharp.Io and AngleSharp.Css we now enter the v0.10 release cycle - an important milestone before hitting v1. The next step is an intermediate v0.11 (potentially of all of these libraries) to include feedback, suggestions, fixes, and other features before becoming stable.

AngleSharp started to be an HTML5 parser with a fully implemented (W3C compatible) DOM in mind. Now AngleSharp includes hooks to allow anything from custom requesters, cookie management, URL patterns, web extensions, styling engines, script engines, media handlers, and document handlers. If you want to handle some web resource in .NET (e.g., an HTML document, a CSS stylesheet, ...) AngleSharp should be in your mind.

I want to take the chance to say **thank you** to all contributors, users, and fans of AngleSharp. It is truly an outstanding community effort and hopefully the beginning of a on ongoing effort to build the best possible eco-system for web technology analysis / usage in .NET. Thanks for all the patience and continuous feedback!

We already started with a renewed documentation currently available via [the GitHub repository](https://github.com/AngleSharp/AngleSharp/blob/master/doc/index.md). This will soon be also available on the website and distributed to all repositories.

Especially interesting is the [available migration guide](https://github.com/AngleSharp/AngleSharp/blob/master/doc/Migration.md). It is currently not 100% complete, but we try to extend it soon. While some namespaces and namings may have changed (slightly) the biggest change is the removal of the old .NET 4 and Silverlight targets. Yes, this will certainly hurt some people, but keeping these targets alive has become more and more difficult and time-consuming. It was one of the major points that prevented AngleSharp v0.10 to be released earlier. Now the time is right to fully adhere to .NET Standard.

Besides some interesting features in the CSS value model we now want to focus on the all-new *AngleSharp.Js*. For this we need to jointly improve (and extend) Jint as Jint v3 seems to be not only the future of Jint, but also a great improvement (e.g., inlcuding ES6) over good old Jint v2. Any help is appreciated (either directly on AngleSharp, a related project such as AngleSharp.Js, or Jint). Let's build this together!
