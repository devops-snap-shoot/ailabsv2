/*! For license information please see 22.75550aa0.chunk.js.LICENSE.txt */
"use strict";(globalThis.webpackChunkimKchat=globalThis.webpackChunkimKchat||[]).push([[22],{5022:(t,e,n)=>{n.r(e),n.d(e,{createSwipeBackGesture:()=>c});var r=n(1811),a=n(9507),i=n(7909);const c=(t,e,n,c,o)=>{const s=t.ownerDocument.defaultView;let h=(0,a.i)(t);const l=t=>h?-t.deltaX:t.deltaX;return(0,i.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:n=>(h=(0,a.i)(t),(t=>{const{startX:e}=t;return h?e>=s.innerWidth-50:e<=50})(n)&&e()),onStart:n,onMove:t=>{const e=l(t)/s.innerWidth;c(e)},onEnd:t=>{const e=l(t),n=s.innerWidth,a=e/n,i=(t=>h?-t.velocityX:t.velocityX)(t),c=i>=0&&(i>.2||e>n/2),u=(c?1-a:a)*n;let d=0;if(u>5){const t=u/Math.abs(i);d=Math.min(t,540)}o(c,a<=0?.01:(0,r.m)(0,a,.9999),d)}})}}}]);
//# sourceMappingURL=22.75550aa0.chunk.js.map