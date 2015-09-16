---
title:  "AngleSharp v0.9.1 released"
date:   2015-09-16 11:08:00
categories: news release
author: "Florian Rappl"
---
A week ago the the first patch for AngleSharp v0.9.1 has been released. Besides fixing some issues the event loop model has been reworked. This will not be the last update to this mechanism. The next update v0.9.2 will focus on closing some existing issues, such as the proposed `CssNode`.

One of the most important additions to AngleSharp v0.9.1 is the ability to filter (http, data, ...) requests. The standard requester service has been extended to provide the ability for this integration. It is therefore possible to stop unwanted requests directly without having to provide a custom `IRequester` implementation.

Finally a remark for the upcoming releases: The service model will definitely change until v1. Right now there are too many interfaces and layers required to extend AngleSharp. Also the whole approach won't scale well once loosely coupled abilities, such as drawing or performance capturing, arrive. I believe that methods may be happier if they can just send a message, which may or may not find a listener. These messages will be very loosely coupled.

At the moment I don't know if such a potential change will also affect the event aggregator, but only using DOM events may actually be a good thing. In the end the `BrowsingContext` itself may end up as an `EventTarget`, which would bring consistency across the entire library.