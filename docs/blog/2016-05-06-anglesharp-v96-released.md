---
title: "AngleSharp v0.9.6 released"
date: 2016-05-06 13:27:00
categories: news release
author: "Florian Rappl"
---
More than two months after the release of AngleSharp v0.9.5 the new version v0.9.6 has been published. Besides some bug fixes the version focused on starting some changes regarding the final API touches and modifications.

The version may contain breaking changes to anyone using AngleSharp. Two of things that will potentially break builds are concerned with API renaming (e.g., `Submit` becomes `SubmitAsync`) and the removal of the `IEventAggregator`. While the former can be solved easily, the second one may actually require a little bit more time. Dropping the `IEventAggregator` was necessary to provide a uniform API that can also be exposed in JavaScript.

Additionally, the usage of `new Configuration()` is highly *discouraged*. If you create plain new configurations **no factories** will be available to parser, requesters, ... - a lot of components. This will result in ill-behavior. I advise everyone to use `Configuration.Default` as the basis for any configuration adjustments.

Finally, the scripting library (`AngleSharp.Scripting.JavaScript`) has been updated - supporting the latest version of the core AngleSharp library and bringing some fixes and improvements. Together with some changes in the core library the experience should be much more complete right now, but there is still some way to go.

The samples, demo projects, and the `AngleSharp.Io` extension library have been updated accordingly. They all work seamlessly together and will be unified with the release of v1.0.0, planned later this year.

Thanks to everyone for their contribution!