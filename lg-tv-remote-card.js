/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:!0,type:String,converter:u$1,reflect:!1,useDefault:!1,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return !1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=!1,h){if(void 0!==t){const r=this.constructor;if(!1===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);}!1===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),!0!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=!0;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];!0!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return !0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return E}}i._$litElement$=!0,i["finalized"]=!0,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:!0,type:String,converter:u$1,reflect:!1,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,!0,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,!0,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:!0,attribute:!1})}

// LG WebOS specifieke app-lijst met behoud van de originele register-structuur
const DEFAULT_APPS = {
    netflix: {
        name: "Netflix",
        source: "Netflix",
        icon: "mdi:netflix",
        appId: "netflix",
    },
    nlziet: {
        name: "NLZIET",
        source: "NLZIET",
        icon: "mdi:television-play",
        appId: "nlziet",
    },
    spotify: {
        name: "Spotify",
        source: "Spotify",
        icon: "mdi:spotify",
        appId: "spotify",
    },
    youtube: {
        name: "YouTube",
        source: "YouTube",
        icon: "mdi:youtube",
        appId: "youtube.leanback.v4",
    },
    videoland: {
        name: "Videoland",
        source: "Videoland",
        icon: "mdi:play-box",
        appId: "cdp-30",
    },
    disneyplus: {
        name: "Disney+",
        source: "Disney+",
        icon: "mdi:television-classic",
        appId: "cdp-28",
    },
    primevideo: {
        name: "Prime Video",
        source: "Amazon Prime Video",
        icon: "mdi:video",
        appId: "amazon",
    },
    viaplay: {
        name: "Viaplay",
        source: "Viaplay",
        icon: "mdi:sports-car",
        appId: "viaplay",
    },
    max: { name: "Max", source: "Max", icon: "mdi:movie-roll", appId: "hbo.max" },
    plex: { name: "Plex", source: "Plex", icon: "mdi:plex", appId: "plex" },
    kodi: {
        name: "Kodi",
        source: "Kodi",
        icon: "mdi:kodi",
        appId: "org.xbmc.kodi",
    },
};
let LGTVRemoteCard = class LGTVRemoteCard extends i {
    setConfig(config) {
        if (!config.remote_entity || !config.media_entity) {
            throw new Error("Zowel remote_entity als media_entity zijn verplicht.");
        }
        this._config = {
            show_title: true,
            show_navigation: true,
            show_buttons: true,
            show_apps: true,
            show_volume: true,
            show_label_navigation: true,
            show_label_volume: true,
            show_button_labels: true,
            label_navigation: "navigatie",
            label_volume: "volume",
            ...config,
        };
    }
    // Wordt aangeroepen door de navigatie en systeemenknoppen (UP, DOWN, ENTER, enz.)
    _handleAction(buttonCode) {
        this.hass.callService("webostv", "button", {
            entity_id: this._config.remote_entity,
            button: buttonCode,
        });
    }
    // Volumeregeling met ondersteuning voor de aparte volume_entity (zoals Sonos) uit de originele functionaliteit
    _handleVolume(service) {
        const targetEntity = this._config.volume_entity || this._config.media_entity;
        this.hass.callService("media_player", service, {
            entity_id: targetEntity,
        });
    }
    // App Launcher die de kortere defaults of handmatige overschrijvingen start via select_source
    _launchApp(appIdentifier) {
        const defaultApp = DEFAULT_APPS[appIdentifier.toLowerCase()];
        const finalSource = defaultApp ? defaultApp.appId : appIdentifier;
        this.hass.callService("media_player", "select_source", {
            entity_id: this._config.media_entity,
            source: finalSource,
        });
    }
    render() {
        if (!this.hass || !this._config)
            return b ``;
        const mediaState = this.hass.states[this._config.media_entity];
        const isTvOn = mediaState &&
            mediaState.state !== "off" &&
            mediaState.state !== "unavailable";
        const currentSource = mediaState?.attributes?.source || "";
        return b `
      <ha-card>
        ${this._config.show_title && this._config.title
            ? b `<div class="card-header">${this._config.title}</div>`
            : ""}

        <div class="card-content">
          <!-- OORSPRONKELIJKE D-PAD INDELING MET GROTE TAP TARGETS -->
          ${this._config.show_navigation
            ? b `
                ${this._config.show_label_navigation
                ? b `<div class="section-label">
                      ${this._config.label_navigation}
                    </div>`
                : ""}
                <div class="dpad-container">
                  <div class="dpad">
                    <ha-icon-button
                      class="dpad-button up"
                      icon="mdi:chevron-up"
                      @click="${() => this._handleAction("UP")}"
                    ></ha-icon-button>
                    <div class="dpad-row">
                      <ha-icon-button
                        class="dpad-button left"
                        icon="mdi:chevron-left"
                        @click="${() => this._handleAction("LEFT")}"
                      ></ha-icon-button>
                      <ha-icon-button
                        class="dpad-button ok"
                        icon="mdi:checkbox-blank-circle"
                        @click="${() => this._handleAction("ENTER")}"
                      ></ha-icon-button>
                      <ha-icon-button
                        class="dpad-button right"
                        icon="mdi:chevron-right"
                        @click="${() => this._handleAction("RIGHT")}"
                      ></ha-icon-button>
                    </div>
                    <ha-icon-button
                      class="dpad-button down"
                      icon="mdi:chevron-down"
                      @click="${() => this._handleAction("DOWN")}"
                    ></ha-icon-button>
                  </div>
                </div>
              `
            : ""}

          <!-- OORSPRONKELIJKE TERUG- EN HOME-KNOPPEN MET REFRESH VAN STATE COLORS -->
          ${this._config.show_buttons
            ? b `
                <div class="button-container">
                  <div class="button-wrapper">
                    <ha-icon-button
                      class="remote-button"
                      icon="mdi:arrow-left"
                      @click="${() => this._handleAction("BACK")}"
                    ></ha-icon-button>
                    ${this._config.show_button_labels
                ? b `<span class="button-label">terug</span>`
                : ""}
                  </div>
                  <div class="button-wrapper">
                    <ha-icon-button
                      class="remote-button ${isTvOn &&
                currentSource.toLowerCase() === "home"
                ? "active"
                : ""}"
                      icon="mdi:home"
                      @click="${() => this._handleAction("HOME")}"
                    ></ha-icon-button>
                    ${this._config.show_button_labels
                ? b `<span class="button-label">home</span>`
                : ""}
                  </div>
                </div>
              `
            : ""}

          <!-- OORSPRONKELIJKE APP-LAUNCHER BAR INCLUSIEF HIGHLIGHT-STATE -->
          ${this._config.show_apps &&
            this._config.apps &&
            this._config.apps.length > 0
            ? b `
                <div class="apps-container">
                  ${this._config.apps.map((app) => {
                let name = "";
                let icon = "mdi:television-play";
                let appKey = "";
                if (typeof app === "string") {
                    appKey = app.toLowerCase();
                    const defaultApp = DEFAULT_APPS[appKey];
                    name = defaultApp ? defaultApp.name : app;
                    icon = defaultApp
                        ? defaultApp.icon
                        : "mdi:television-play";
                }
                else {
                    appKey = app.id
                        ? app.id.toLowerCase()
                        : app.name
                            ? app.name.toLowerCase()
                            : "";
                    const defaultApp = DEFAULT_APPS[appKey];
                    name = app.name || (defaultApp ? defaultApp.name : "");
                    icon =
                        app.icon ||
                            (defaultApp ? defaultApp.icon : "mdi:television-play");
                }
                const defaultAppInfo = DEFAULT_APPS[appKey];
                const matchSource = defaultAppInfo
                    ? defaultAppInfo.source.toLowerCase()
                    : name.toLowerCase();
                const isActive = isTvOn && currentSource.toLowerCase() === matchSource;
                return b `
                      <ha-icon-button
                        class="app-button ${isActive ? "active" : ""}"
                        icon="${icon}"
                        title="${name}"
                        @click="${() => this._launchApp(appKey || name)}"
                      >
                      </ha-icon-button>
                    `;
            })}
                </div>
              `
            : ""}

          <!-- OORSPRONKELIJKE VOLUMEREGELAAR INTEGRATIE -->
          ${this._config.show_volume
            ? b `
                ${this._config.show_label_volume
                ? b `<div class="section-label">
                      ${this._config.label_volume}
                    </div>`
                : ""}
                <div class="volume-container">
                  <ha-icon-button
                    icon="mdi:volume-minus"
                    @click="${() => this._handleVolume("volume_down")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:volume-mute"
                    @click="${() => this._handleVolume("volume_mute")}"
                  ></ha-icon-button>
                  <ha-icon-button
                    icon="mdi:volume-plus"
                    @click="${() => this._handleVolume("volume_up")}"
                  ></ha-icon-button>
                </div>
              `
            : ""}
        </div>
      </ha-card>
    `;
    }
};
// DE EXACTE ORIGINELE CSS LAYOUT-STYLING UIT JE REPOSITORY
LGTVRemoteCard.styles = i$3 `
    ha-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
    }
    .card-header {
      font-family: var(--paper-font-headline_-_font-family);
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.012em;
      line-height: 32px;
      opacity: var(--dark-primary-opacity);
      padding: 24px 16px 16px;
      text-align: center;
    }
    .section-label {
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      opacity: 0.5;
      text-align: center;
      margin-top: 16px;
      letter-spacing: 0.1em;
    }

    .dpad-container {
      display: flex;
      justify-content: center;
      margin: 24px 0;
    }
    .dpad {
      background: var(--secondary-background-color);
      border-radius: 50%;
      width: 180px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 8px;
      box-sizing: border-box;
      position: relative;
    }
    .dpad-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      padding: 0 8px;
      box-sizing: border-box;
    }
    .dpad-button {
      --mdc-icon-size: 32px;
      color: var(--primary-text-color);
    }
    .dpad-button.ok {
      background: var(--card-background-color);
      border-radius: 50%;
      width: 56px;
      height: 56px;
      --mdc-icon-size: 28px;
      box-shadow: var(--shadow-elevation-2dp);
    }

    .button-container {
      display: flex;
      justify-content: space-around;
      margin: 16px 0;
    }
    .button-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 64px;
    }
    .remote-button {
      background: var(--secondary-background-color);
      border-radius: 50%;
      width: 48px;
      height: 48px;
      --mdc-icon-size: 24px;
      color: var(--primary-text-color);
    }
    .button-label {
      font-size: 12px;
      opacity: 0.6;
      margin-top: 8px;
      text-transform: capitalize;
    }

    .apps-container {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin: 20px 0;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 16px;
    }
    .app-button {
      --mdc-icon-size: 26px;
      color: var(--primary-text-color);
      opacity: 0.7;
    }

    .volume-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px auto 8px;
      background: var(--secondary-background-color);
      border-radius: 24px;
      padding: 4px 8px;
      width: 85%;
      box-sizing: border-box;
    }
    .volume-container ha-icon-button {
      --mdc-icon-size: 22px;
      color: var(--primary-text-color);
    }

    .active {
      color: var(--accent-color) !important;
      opacity: 1 !important;
    }
  `;
__decorate([
    n({ attribute: false })
], LGTVRemoteCard.prototype, "hass", void 0);
__decorate([
    r()
], LGTVRemoteCard.prototype, "_config", void 0);
LGTVRemoteCard = __decorate([
    t("lg-tv-remote-card")
], LGTVRemoteCard);

export { LGTVRemoteCard };
