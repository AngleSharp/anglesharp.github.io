---
title:  "AngleSharp v0.9.2 released"
date:   2015-09-24 23:44:00
categories: news release
author: "Florian Rappl"
---
This week's minor update was only a small patch that fixed a bug in the tokenizer and improved the XML parser's performance. It also features the brandnew `application/json` encoding type for form submission. The form submission process internals have been redesigned to be much easier to extend and use. The `FormDataSet` and `FormDataSetEntry` classes are now public. This forms the basis for sending forms without requiring a webpage or valid `<form>` element at all.

The renewed CSSOM is not part of v0.9.2. Also the previously mentioned update to the service model and the event aggregator change could not make it. They will (at least partially, hopefully) find their way into v0.9.3 or some update afterwards.

Until this point more and more updates are being done via feature branches. From now on this will be the only model. Every new feature or update has to be merged to `devel` from a specific feature branch, which is associated with an issue. The idea is to make the development as transparent and open as possible. Also future contributions, discussions, and general user engagement should be boosted.