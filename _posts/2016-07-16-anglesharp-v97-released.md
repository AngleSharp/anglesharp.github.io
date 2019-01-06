---
title:  "AngleSharp v0.9.7 released"
date:   2016-07-16 22:20:00
categories: news release
author: "Florian Rappl"
---
Too much time has past since the last update. The current release v0.9.7 marks the beginning of a dramatic change in the AngleSharp philosophy. For all related projects the target will change with the upcoming version. AngleSharp will be fully targeting .NET core. This change is an investment in the future of .NET core. Furthermore, it should simplify the development process in the long run - as the target platform is clearly defined.

Another upcoming change is related to the DOM interfacing. Right now AngleSharp tries to portray the IDL from the W3C in form of .NET interfaces. To make some things (e.g., different naming conventions) possible attributes have been inserted. However, the major problem with these interfaces is the coupling they are introducing. It's not the most plugin friendly mechanism, as the overlap has always to be defined specifically.

Therefore a new approach will be added, which will be applied to partial interfaces (usually marked as `DomNoInterfaceObject` by AngleSharp): We will use static classes with extension methods for such interfaces. These classes can then be defined in external dependencies. In C# they are easily resolved via the compiler (once we have referenced the extension library and included the namespace we can use the methods). In, e.g., JavaScript (*AngleSharp.Scripting.JavaScript*) they can be resolved easily via an extension cache that is prepared with the configuration that collects all known extensions. In the long run this approach should provide a more agile basis.

Now its easy to guess what is about to come: AngleSharp.Core will be split into two libraries. This is a good compromise between the previously suggested three libraries and the current state of a single library. In the end we will obtain AngleSharp.Core and AngleSharp.Css. The query selector capability will still be part of AngleSharp.Core, however, everything else related to the CSSOM will be outsourced.

With the upcoming changes in mind the changelog of v0.9.7 is not really sensational:

- Fixed some bugs (#343, #325, #341, #347, #355, #358)
- Improved cookie handling (#280, #274, #365)
- Added a document factory (#331)
- `EventNames`, `AttributeNames` and others are available (#330)
- Allow setting the active document (#281)
- Improved Xamarin.iOS build (#85)
- Changed service API slightly (#157)
- Enhanced CoreCLR support (#270, #362)

Especially, #157 took a longer time. Here many evaluations have been done and the previously mentioned planned changes took shape. In the future the goal is to open AngleSharp even more and allow hooking into the whole pipeline. Making something like CSS work without being integrated into the core will certainly help to find the right level of customization.

Thanks to every contributor for the input and hard work - much appreciated as always!