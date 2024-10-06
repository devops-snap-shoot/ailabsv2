/*! For license information please see 186.a7e9cafd.chunk.js.LICENSE.txt */
"use strict";(globalThis.webpackChunkimKchat=globalThis.webpackChunkimKchat||[]).push([[186],{1186:(e,t,n)=>{n.r(t),n.d(t,{startInputShims:()=>b});var o=n(3743),i=n(1811),r=n(5573);const a=new WeakMap,s=function(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,i=arguments.length>4&&void 0!==arguments[4]&&arguments[4];a.has(e)!==n&&(n?l(e,t,o,i):d(e,t))},l=function(e,t,n){let o=arguments.length>3&&void 0!==arguments[3]&&arguments[3];const i=t.parentNode,r=t.cloneNode(!1);r.classList.add("cloned-input"),r.tabIndex=-1,o&&(r.disabled=!0),i.appendChild(r),a.set(e,r);const s="rtl"===e.ownerDocument.dir?9999:-9999;e.style.pointerEvents="none",t.style.transform=`translate3d(${s}px,${n}px,0) scale(0)`},d=(e,t)=>{const n=a.get(e);n&&(a.delete(e),n.remove()),e.style.pointerEvents="",t.style.transform=""},c="input, textarea, [no-blur], [contenteditable]",u=(e,t,n,o)=>{const i=e.top,r=e.bottom,a=t.top,s=a+15,l=Math.min(t.bottom,o-n)-50-r,d=s-i,c=Math.round(l<0?-l:d>0?-d:0),u=Math.min(c,i-a),m=Math.abs(u)/.3;return{scrollAmount:u,scrollDuration:Math.min(400,Math.max(150,m)),scrollPadding:n,inputSafeY:4-(i-s)}},m="$ionPaddingTimer",v=(e,t,n)=>{const o=e[m];o&&clearTimeout(o),t>0?e.style.setProperty("--keyboard-offset",`${t}px`):e[m]=setTimeout((()=>{e.style.setProperty("--keyboard-offset","0px"),n&&n()}),120)},h=(e,t,n)=>{e.addEventListener("focusout",(()=>{t&&v(t,0,n)}),{once:!0})};let f=0;const p="data-ionic-skip-scroll-assist",w=e=>{document.activeElement!==e&&(e.setAttribute(p,"true"),e.focus())},g=async function(e,t,n,r,a,l){let d=arguments.length>6&&void 0!==arguments[6]&&arguments[6];if(!n&&!r)return;const c=((e,t,n)=>{var o;const i=null!==(o=e.closest("ion-item,[ion-item]"))&&void 0!==o?o:e;return u(i.getBoundingClientRect(),t.getBoundingClientRect(),n,e.ownerDocument.defaultView.innerHeight)})(e,n||r,a);if(n&&Math.abs(c.scrollAmount)<4)return w(t),void(l&&null!==n&&(v(n,f),h(t,n,(()=>f=0))));if(s(e,t,!0,c.inputSafeY,d),w(t),(0,i.r)((()=>e.click())),l&&n&&(f=c.scrollPadding,v(n,f)),"undefined"!==typeof window){let i;const r=async()=>{void 0!==i&&clearTimeout(i),window.removeEventListener("ionKeyboardDidShow",a),window.removeEventListener("ionKeyboardDidShow",r),n&&await(0,o.c)(n,0,c.scrollAmount,c.scrollDuration),s(e,t,!1,c.inputSafeY),w(t),l&&h(t,n,(()=>f=0))},a=()=>{window.removeEventListener("ionKeyboardDidShow",a),window.addEventListener("ionKeyboardDidShow",r)};if(n){const e=await(0,o.g)(n),s=e.scrollHeight-e.clientHeight;if(c.scrollAmount>s-e.scrollTop)return"password"===t.type?(c.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",a)):window.addEventListener("ionKeyboardDidShow",r),void(i=setTimeout(r,1e3))}r()}},b=async(e,t)=>{const n=document,a="ios"===t,l="android"===t,d=e.getNumber("keyboardHeight",290),u=e.getBoolean("scrollAssist",!0),m=e.getBoolean("hideCaretOnScroll",a),v=e.getBoolean("inputBlurring",a),h=e.getBoolean("scrollPadding",!0),f=Array.from(n.querySelectorAll("ion-input, ion-textarea")),w=new WeakMap,b=new WeakMap,y=await r.K.getResizeMode(),E=async e=>{await new Promise((t=>(0,i.c)(e,t)));const t=e.shadowRoot||e,n=t.querySelector("input")||t.querySelector("textarea"),a=(0,o.a)(e),c=a?null:e.closest("ion-footer");if(!n)return;if(a&&m&&!w.has(e)){const t=((e,t,n)=>{if(!n||!t)return()=>{};const o=n=>{var o;(o=t)===o.getRootNode().activeElement&&s(e,t,n)},r=()=>s(e,t,!1),a=()=>o(!0),l=()=>o(!1);return(0,i.a)(n,"ionScrollStart",a),(0,i.a)(n,"ionScrollEnd",l),t.addEventListener("blur",r),()=>{(0,i.b)(n,"ionScrollStart",a),(0,i.b)(n,"ionScrollEnd",l),t.removeEventListener("blur",r)}})(e,n,a);w.set(e,t)}if(!("date"===n.type||"datetime-local"===n.type)&&(a||c)&&u&&!b.has(e)){const t=function(e,t,n,o,i,a,s){let l=arguments.length>7&&void 0!==arguments[7]&&arguments[7];const d=a&&(void 0===s||s.mode===r.a.None),c=async()=>{t.hasAttribute(p)?t.removeAttribute(p):g(e,t,n,o,i,d,l)};return e.addEventListener("focusin",c,!0),()=>{e.removeEventListener("focusin",c,!0)}}(e,n,a,c,d,h,y,l);b.set(e,t)}};v&&(()=>{let e=!0,t=!1;const n=document,o=()=>{t=!0},r=()=>{e=!0},a=o=>{if(t)return void(t=!1);const i=n.activeElement;if(!i)return;if(i.matches(c))return;const r=o.target;r!==i&&(r.matches(c)||r.closest(c)||(e=!1,setTimeout((()=>{e||i.blur()}),50)))};(0,i.a)(n,"ionScrollStart",o),n.addEventListener("focusin",r,!0),n.addEventListener("touchend",a,!1)})();for(const o of f)E(o);n.addEventListener("ionInputDidLoad",(e=>{E(e.detail)})),n.addEventListener("ionInputDidUnload",(e=>{(e=>{if(m){const t=w.get(e);t&&t(),w.delete(e)}if(u){const t=b.get(e);t&&t(),b.delete(e)}})(e.detail)}))}}}]);
//# sourceMappingURL=186.a7e9cafd.chunk.js.map