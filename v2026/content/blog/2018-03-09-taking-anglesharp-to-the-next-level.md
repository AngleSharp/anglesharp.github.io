---
title: "Taking AngleSharp to the Next Level"
date: 2018-03-09 10:15:00
categories: news organization
author: "Florian Rappl"
userId: FlorianRappl
section: Posts
---
In the recent two months some advancements have been made to ensure that AngleSharp will see active development also in the future. Today I am happy to announce that plans for joining the .NET Foundation are becoming more solid.

The current progress of this endeavour can be trakced [in the GitHub issue of the AngleSharp.Core repository](https://github.com/AngleSharp/AngleSharp/issues/648). Many steps are missing, but its a start.

Also to give an update on our current timetable. Currently, the roadmap looks as follows:

- A second hotfix for AngleSharp v0.9.9 will be released within the next (0.9.9.2); dealing with the ConditionalWeakTable (thanks for the PR!)
- The big new v0.10 release should be out end of March / beginning of April (keep our fingers crossed) - together with it the first release of AngleSharp.Css is expected
- AngleSharp.Scripting will see much dedication towards the middle of the year; expect to run Angular.js, React, Angular, any jQuery version etc. with it - we will try to make this all possible
- Potentially towards EO Q3 2018 AngleSharp v0.11 will happen
- Hopefully towards the end of the year we finally have v1

Just some remarks on v0.11: Yes, the plan was to release v1 directly after v0.10, however, that plan is not realistic. First of all, there may be some issues that go beyond a hotfix (API changes). v0.10 has (unfortunately way too many) API changes, which need to be carefully assessed first. However, that alone does not justify a v0.11.

The most important aspect for v0.11 will be the drop of all legacy systems. Right now AngleSharp is delivered with multiple libraries inside the same NuGet package (one lib targetting .NET 4, another one for SL, PCL, ...). This will change - we will only target .NET Standard (either 1.0 or 1.3). The decision for the specific .NET Standard version is not yet done, but there are many arguments in favor of 1.3.

Ultimately, our goal is to make development of AngleSharp simpler and to provide a more robust and streamlined version to our users. Going for .NET Standard (1.3) is not only done for cosmetics, but involves an internal rewrite with `Span<T>` and `Memory<T>`. All in all we expect some serious performance improvements in parsing scenarios.
