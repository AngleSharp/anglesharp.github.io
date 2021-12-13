"use strict";(self.webpackChunk_pidoc_core=self.webpackChunk_pidoc_core||[]).push([[131],{3131:(e,t,o)=>{o.r(t),o.d(t,{"default":()=>r});var a=o(7158),n=o(5292),i={title:"AngleSharp v0.12 and the future",date:"2019-05-06 22:23:10",categories:"news organization release",author:"Florian Rappl",userId:"FlorianRappl",section:"Posts"};const r=function(){return a.createElement(n.ContentPage,null,a.createElement(n.PageLayout,{name:"blog",meta:i},a.createElement(n.PageContent,{meta:i},a.createElement(n.Markdown,{content:"\n<p>Last week the latest version of AngleSharp v0.12 has been released. Not only the core library was updated to v0.12, but we also started updating some related libraries. So far we released:</p>\n<ul>\n<li>AngleSharp.Xml</li>\n<li>AngleSharp.Io</li>\n</ul>\n<p>Both contain several improvements. For instance, AngleSharp.Xml now supports fragments. This means that changing properties such as <code>InnerHtml</code> also work in an <code>IXmlDocument</code> document. Also the XML parser contains a special fragment parsing mode. Besides the fragment parsing the source reference option also was included in the XML parser.</p>\n<p>AngleSharp.Io now comes with an advanced cookie provider - written fully from scratch it should come with much less quirks than the <code>MemoryCookieProvider</code>, which used the .NET <code>CookieContainer</code>. The new provider fully adheres to the RFC 6265 specification. Without much hacks it already deals with all the cookies that required sanitizations and other tricks to be working with the standard .NET implementation. Even better - its internal representation <code>WebCookie</code> can be used also outside of AngleSharp. The new cookie provider (called <code>AdvancedCookieProvider</code>) also supports syncing to the file system. Here the de-facto standard Netscape format has been implemented.</p>\n<p>AngleSharp.Io also introduces additional helpers to simplify downloading response content (potentially even automatic, e.g., when following a link to a binary) or appending files to a form. The new <code>AppendFile</code> helper for an <code>IHtmlInputElement</code> can work with a stream or local file path.</p>\n<p>Nevertheless, two important libraries are missing from the list above:</p>\n<ul>\n<li>AngleSharp.Css</li>\n<li>AngleSharp.Js</li>\n</ul>\n<p>The CSS library will be updated to AngleSharp v0.12 first (earliest estimated release date: 15th of May). This is currently in progress and while the library itself will still not be &quot;finished&quot; yet, this version should represent a significant step forward. In this release much of the CSSOM regarding values will be opened (e.g., <code>ICssFunctionValue</code>) and equipped with helpers to traverse the CSSOM easily. The serialization (especially decomposition and recombination of shorthand / longhand declarations) will be refined and improved.</p>\n<p>After the CSS library v0.12 is done we will prepare a short and simple release of AngleSharp.Js v0.12. This will be a compatibility release only - no significant changes or improvements are planned here. Our goal here is to make existing code / examples work with AngleSharp v0.12 as in pre v0.10 versions.</p>\n<p>The reason for such a &quot;simple&quot; compatibility release is stated in <a href=\"https://github.com/AngleSharp/AngleSharp.Js/issues/51\">#51</a>:</p>\n<blockquote>\n<p>Biggest road blocker for AngleSharp.Js at the moment is Jint. While awesome at its core it also brought / brings some limitations. That Jint v3 takes so long (if it ever finishes) is also not good. We need / want ES6 support and a leaner model that also has the potential to perform better. We think that this is a general .NET problem (lacking a great JS engine - something which should have been IronJS, but wasn't), which is why there is homework to be picked up before solving AngleSharp.Js.</p>\n</blockquote>\n<p>We want to see how to proceed. Right now we have the following options:</p>\n<ul>\n<li>Look for an alternative to Jint (Jint still seems like the best option)</li>\n<li>Collaborate on improving Jint (could be problematic due to Jint's design)</li>\n<li>Collaborate on Esprima.NET and create a new project for a JS.NET engine</li>\n<li>Fully invest in a new JS.NET engine from scratch</li>\n</ul>\n<p>Potentially, as beforehand, the last option may be way too large. Currently, it seems that option 2 or 3 are most viable. A detailed analysis of Jint's design and codebase may give us more indication. Even more important is the repository activity there. So far it seems to be in a stale state as AngleSharp was months ago, which would not be the ideal basis to utilize for this option.</p>\n<p>As for AngleSharp itself - we still want to hit v1 this year (finally!). More full releases (e.g., v0.13) are therefore expected.</p>\n",link:"https://github.com/AngleSharp/anglesharp.github.io/tree/main/docs/blog/2019-05-06-anglesharp-v012-forward.md",editLabel:"Edit on GitHub"}))))}}}]);
//# sourceMappingURL=bd9f2f.js.map