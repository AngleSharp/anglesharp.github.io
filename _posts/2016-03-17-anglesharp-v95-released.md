---
title:  "AngleSharp v0.9.5 released"
date:   2016-03-17 14:44:00
categories: news release
author: "Florian Rappl"
---
It has been quite a while until the last release, but better late than never: AngleSharp v0.9.5 is now available. There have been some bug fixes and improvements. Most importantly (and thanks to [Jeremy Meng](https://github.com/jeremymeng) from Microsoft after discussions with the core Nancy developers) we now support the CoreCLR (*dotnet*) target via NuGet.

The focus of v0.9.5 was to fix critical bugs, improve parts of the API, and rewrite the internal CSSOM representation. The internal CSSOM changes are not complete yet, but sufficient for v0.9.5 to be released. The critical bugs involved mostly encoding related issues.

Previously, a virtual file system for AngleSharp has been announced. This feature was essentially abandoned as it would be more appropriate in AngleSharp.Io. AngleSharp provides everything to keep track of requests / responses. The internal system has been adjusted and rewritten to cover all cases.

AngleSharp v0.9.5 comes with a set of new helpers. Some of these helpers are CSSOM related, others are there to distinguish between the different types of stylesheets. There are also helpers that are similar to special jQuery filters (some of which did not have any LINQ-counterpart already).

The development focus in the next couple of weeks will be of course on v0.9.6, however, the extension libraries will be adjusted to v0.9.5 first. Especially AngleSharp.Scripting.JavaScript did not get the (dev) attention it requires and deserves. This will be addressed first.

Thanks to everyone for their contribution!