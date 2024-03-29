---
title: "AngleSharp v0.9.8 released"
date: 2016-09-04 17:40:00
categories: news release
author: "Florian Rappl"
userId: FlorianRappl
section: Posts
---
Yesterday version 0.9.8 of AngleSharp has been released. There are not too many API changes - and barely any breaking change so one should not notice anything.

The biggest changes are the improvements in the parser, the cookie handling, and the requester. Here we managed to come up with a lot of useful improvements. Furthermore, more of the API has been opened. With the v0.9.9 release we will introduce some breaking changes that are necessary to prepare the v1.0 release. It is yet unclear if there won't be a v0.9.10. Right now, the tendency is to come up with the first stable and production ready release soon.

In order to be production ready AngleSharp will separate most of the CSS into its own project (with its own versioning and maintenance). This will help in many aspects. However, we fully understand that AngleSharp is that much loved due to the fact of being *complete*, i.e., integrated so tightly with CSS. Therefore, a tiny CSS core will remain, which is responsible for parsing and building the CSSOM. Furthermore, the selectors will also remain in the core. This should be the best of both worlds.

So what will transition to its own CSS base? Essentially, all properties. Additionally, some special rules and declarations. Finally, new stuff such as the rendering device or anything related to specific properties or media queries will be placed there. Overall this should simplify the structure in AngleSharp and reduce its size.

The CSS parser will remain in AngleSharp. However, it will only return a generalized version of the CSSOM, which should be much easier to handle. Also in most cases it should be the best one to work against.

The exact changes are all listed for v0.9.8 in the changelog.
