parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ysVz":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("react")),t=require("piral-docs-tools/components");function r(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,n=new WeakMap;return(r=function(e){return e?n:t})(e)}function n(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var n=r(t);if(n&&n.has(e))return n.get(e);var a={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&Object.prototype.hasOwnProperty.call(e,i)){var l=o?Object.getOwnPropertyDescriptor(e,i):null;l&&(l.get||l.set)?Object.defineProperty(a,i,l):a[i]=e[i]}return a.default=e,n&&n.set(e,a),a}var a=(0,t.getPageLayout)("blog"),o="https://github.com/AngleSharp/anglesharp.github.io/tree/main/docs/blog/2016-09-04-anglesharp-v098-released.md",i="\n<p>Yesterday version 0.9.8 of AngleSharp has been released. There are not too many API changes - and barely any breaking change so one should not notice anything.</p>\n<p>The biggest changes are the improvements in the parser, the cookie handling, and the requester. Here we managed to come up with a lot of useful improvements. Furthermore, more of the API has been opened. With the v0.9.9 release we will introduce some breaking changes that are necessary to prepare the v1.0 release. It is yet unclear if there won't be a v0.9.10. Right now, the tendency is to come up with the first stable and production ready release soon.</p>\n<p>In order to be production ready AngleSharp will separate most of the CSS into its own project (with its own versioning and maintenance). This will help in many aspects. However, we fully understand that AngleSharp is that much loved due to the fact of being <em>complete</em>, i.e., integrated so tightly with CSS. Therefore, a tiny CSS core will remain, which is responsible for parsing and building the CSSOM. Furthermore, the selectors will also remain in the core. This should be the best of both worlds.</p>\n<p>So what will transition to its own CSS base? Essentially, all properties. Additionally, some special rules and declarations. Finally, new stuff such as the rendering device or anything related to specific properties or media queries will be placed there. Overall this should simplify the structure in AngleSharp and reduce its size.</p>\n<p>The CSS parser will remain in AngleSharp. However, it will only return a generalized version of the CSSOM, which should be much easier to handle. Also in most cases it should be the best one to work against.</p>\n<p>The exact changes are all listed for v0.9.8 in the changelog.</p>\n",l={title:"AngleSharp v0.9.8 released",date:"2016-09-04 17:40:00",categories:"news release",author:"Florian Rappl",userId:"FlorianRappl",section:"Posts"},s=function(){return e.createElement(t.ContentPage,null,e.createElement(a,{meta:l},e.createElement(t.PageContent,{meta:l},e.createElement(t.Markdown,{content:i,link:o,editLabel:"Edit on GitHub"}))))};exports.default=s;
},{"react":"kvyv","piral-docs-tools/components":"Mdgd"}]},{},[], null)
//# sourceMappingURL=/blog-2016-09-04-anglesharp-v098-released.7c0f26ca.js.map