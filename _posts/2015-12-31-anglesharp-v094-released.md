---
title: "AngleSharp v0.9.4 released"
date: 2015-12-31 08:36:00
categories: news release
author: "Florian Rappl"
section: Blog
layout: post
---
Finally, after weeks of delays and many discussions, AngleSharp v0.9.4 is available. There have been some bug fixes and improvements. Most importantly, these are encoding and insertion pointer fixes.

However, AngleSharp v0.9.4 is in fact more than just a minor release. It could be considered a bridge release, as many internal things have been changed for the better. The upcoming version(s) will continue to walk the path enabled by v0.9.4.

Features, such as the behavior of `OpenAsync` (delayed until embedded resources finished loading) or the virtual file system are already partially available. The CSSOM will also see more updates and will be enhanced with further helpers to modify the OM with objects instead of raw strings.

On the API side a lot new things will come up. Many internal concepts will be made public and the parsing can be expected to become even more flexible.

Last but not least, the performance will be improved. While HTML is already quite decent (but could be improved in some scenarios), CSS has plenty of room for improvement.
