parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"sySI":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=r(require("react")),t=require("piral-docs-tools/components");function o(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(o=function(e){return e?r:t})(e)}function r(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=o(t);if(r&&r.has(e))return r.get(e);var n={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var l=a?Object.getOwnPropertyDescriptor(e,i):null;l&&(l.get||l.set)?Object.defineProperty(n,i,l):n[i]=e[i]}return n.default=e,r&&r.set(e,n),n}var n=(0,t.getPageLayout)("blog"),a="https://github.com/AngleSharp/anglesharp.github.io/tree/main/docs/blog/2015-10-04-anglesharp-io.md",i="\n<p>In the last days one of the remaining projects was officially launched: <code>AngleSharp.Io</code>. This library will provide many essential IO classes, helper methods, and DOM interfaces. Most importantly it will bring new / improved requesters, such as a much better HTTP/HTTPS requester build on top of the <code>HttpClient</code> class. As a consequence this library will unfortunately not be released as a PCL. In the long run more requesters will be integrated.</p>\n<p><code>AngleSharp.Io</code> is also the library that will finally offer a <code>WebSocket</code> implementation. Also the <code>Storage</code> interface will be made available, which can then be instantied as <code>localStorage</code> or <code>sessionStorage</code>. Under the hood the library should also be able to handle caching or resources.</p>\n<p>Right now the work has just begun. The first work items only focus on the requester side, with a few interesting items, e.g., <code>WebSocket</code>, being on the way. As with the (JavaScript) scripting library the exact roadmap is unclear at this point in time, however, we will try to come up with one in the next couple of months.</p>\n",l={title:"AngleSharp IO",date:"2015-10-04 23:34:00",categories:"news project",author:"Florian Rappl",userId:"FlorianRappl",section:"Posts"},s=function(){return e.createElement(t.ContentPage,null,e.createElement(n,{meta:l},e.createElement(t.PageContent,{meta:l},e.createElement(t.Markdown,{content:i,link:a,editLabel:"Edit on GitHub"}))))};exports.default=s;
},{"react":"kvyv","piral-docs-tools/components":"Mdgd"}]},{},[], null)
//# sourceMappingURL=/blog-2015-10-04-anglesharp-io.342b0b3d.js.map