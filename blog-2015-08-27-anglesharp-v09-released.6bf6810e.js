parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"vc7p":[function(require,module,exports) {
module.exports="/dist_dom.b6a04a54.png";
},{}],"yFLG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("react")),t=require("piral-docs-tools/components");function r(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(r=function(e){return e?n:t})(e)}function n(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=r(t);if(n&&n.has(e))return n.get(e);var i={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var l=a?Object.getOwnPropertyDescriptor(e,o):null;l&&(l.get||l.set)?Object.defineProperty(i,o,l):i[o]=e[o]}return i.default=e,n&&n.set(e,i),i}var i=(0,t.getPageLayout)("blog"),a="https://github.com/AngleSharp/anglesharp.github.io/tree/main/docs/blog/2015-08-27-anglesharp-v09-released.md",o="\n<p>Yesterday the latest version of Anglesharp has been released. This release marks the v0.9 milestone. Besides providing skeleton implementations for, e.g., the recent shadow DOM API draft, the <code>picture</code> element, etc., this version fixes some bugs that may appear in conjunction with using scripts.</p>\n<p>Scripts are one of the success stories for AngleSharp. They make this library so useful. Therefore the AngleSharp.Scripting project is moving forward as well. The <em>AngleSharp.Scripting.JavaScript</em> library was yesterday released in with version 0.3. Here we will now try to align with the versioning of AngleSharp.Core.</p>\n<p>AngleSharp.Core will definitely be split up. The library is already too huge and contains too many features to be considered lightweight. Let's have a look at the SLOC (taken two months ago) of the DOM part alone:</p>\n<p><img src=\""+require("../../../../../images/dist_dom.png")+'" alt="AngleSharp Core DOM SLOC Distribution"></p>\n<p>From this picture alone we can already estimate that splitting the library could be benificial. We have roughly 1/3 SLOC spent on general, HTML and CSS functionality. The splitting could therefore result in three or four parts:</p>\n<ul>\n<li><em>AngleSharp.Core.Common</em>, containing the basic infrastructure and definitions [no dependency]</li>\n<li><em>AngleSharp.Core.Html</em>, containing the HTML parser and DOM implementation [depending on Common]</li>\n<li><em>AngleSharp.Core.Css</em>, containing the CSS parser and CSSOM implementation [depending on Common]</li>\n<li><em>AngleSharp.Core.Complete</em>, aggregating the Core and providing further helpers [depending on the former three]</li>\n</ul>\n<p>Experiments with a proper dissection will begin soon. Also the renderer part will then be discussed. Plans have already been made and it seems likely that a renderer will be published within this year (experimental stage). Here a new project, AngleSharp.Renderer will be opened. The renderer itself will contain many libraries, specifically to make the renderer common infrastructure a PCL again with specific platform libraries that contain the actual drawing code.</p>\n',l={title:"AngleSharp v0.9 released",date:"2015-08-27 14:05:00",categories:"news release",author:"Florian Rappl",userId:"FlorianRappl",section:"Posts"},s=function(){return e.createElement(t.ContentPage,null,e.createElement(i,{meta:l},e.createElement(t.PageContent,{meta:l},e.createElement(t.Markdown,{content:o,link:a,editLabel:"Edit on GitHub"}))))};exports.default=s;
},{"react":"kvyv","piral-docs-tools/components":"Mdgd","../../../../../images/dist_dom.png":"vc7p"}]},{},[], null)
//# sourceMappingURL=/blog-2015-08-27-anglesharp-v09-released.6bf6810e.js.map