---
title: "AngleSharp IO"
date: 2015-10-04 23:34:00
categories: news project
author: "Florian Rappl"
section: Blog
layout: post
---
In the last days one of the remaining projects was officially launched: `AngleSharp.Io`. This library will provide many essential IO classes, helper methods, and DOM interfaces. Most importantly it will bring new / improved requesters, such as a much better HTTP/HTTPS requester build on top of the `HttpClient` class. As a consequence this library will unfortunately not be released as a PCL. In the long run more requesters will be integrated.

`AngleSharp.Io` is also the library that will finally offer a `WebSocket` implementation. Also the `Storage` interface will be made available, which can then be instantied as `localStorage` or `sessionStorage`. Under the hood the library should also be able to handle caching or resources.

Right now the work has just begun. The first work items only focus on the requester side, with a few interesting items, e.g., `WebSocket`, being on the way. As with the (JavaScript) scripting library the exact roadmap is unclear at this point in time, however, we will try to come up with one in the next couple of months.