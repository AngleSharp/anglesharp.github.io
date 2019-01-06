---
title:  "AngleSharp Documentation"
date:   2015-08-29 10:01:00
categories: information documentation
author: "Florian Rappl"
---
An important aspect that is still missing (on the new homepage) is documentation. There should be two directly linked pages: "Get Started" and "Documentation". Right now the documentation can only be found in the Wiki, with a little code being displayed in the *AngleSharp/AngleSharp* repository. My plan is to keep both, but to update / sync them from a larger (more dedicated) source.

I am actively working on a documentation system, which allows deployment in several formats. Here we have HTML, Markdown and LaTeX. However, it is not that the markup system converts contents into other markup systems, which are directly or indirectly bound to output devices, but rather that this system allows very structured and programmatic access. It has LaTeX like features (more lightweight of course) in a RST-like syntax. The syntax has not yet stabilized, which is why I am using XML (parsed with AngleSharp of course) for tests. Finally the idea is to have one `AngleSharp/Documentation` repository containing the documentation code, which is then produced and placed (probably automatically) in the Wiki and on the page. Also a PDF (kind of like a book) will be produced from the documentation.

One of the most important features of this documentation system will be the ability to embed code from external files. These files may be given by URLs. The idea is to place the snippets shown in the documentation in unit tests. The unit tests are run in their respective repository (tests of core functionality in `AngleSharp.Core`, tests of scripting functionality in `AngleSharp.Scripting`). That ensures that the code shown in the documentation is always up to date and compilable. Of course one can specify certain lines, ranges or delimiters to limit the code shown in the documentation.

The only remaining question is: When will this documentation system be available? Well, I can't give an exact date, but it has to be prior to v1.0. I hope to finish the system's software in the end of October and to finish the (full!) documentation itself in the end of November.