(this["webpackJsonppuml-nft-frontend"]=this["webpackJsonppuml-nft-frontend"]||[]).push([[78],{846:function(n,t,e){"use strict";e.r(t);var r=e(5),o=(e(282),e(283));e(112),e(235),e(234);function a(n,t,e,r,o,a,i){try{var u=n[a](i),c=u.value}catch(s){return void e(s)}u.done?t(c):Promise.resolve(c).then(r,o)}function i(n){return function(){var t=this,e=arguments;return new Promise((function(r,o){var i=n.apply(t,e);function u(n){a(i,r,o,u,c,"next",n)}function c(n){a(i,r,o,u,c,"throw",n)}u(void 0)}))}}t.default=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=n.heading,e=n.description,a=n.icon,u=n.html,c=n.button;return function(){var n=i(Object(r.a)().mark((function n(i){var s,d,l,f;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(s=i.wallet,d=i.address,l=i.stateSyncStatus,f=i.stateStore,null!==d){n.next=5;break}if(!l.address){n.next=5;break}return n.next=5,new Promise((function(n){l.address&&l.address.then(n),setTimeout((function(){null===d&&n(void 0)}),500)}));case 5:if(f.address.get()||!s||!s.name){n.next=7;break}return n.abrupt("return",{heading:t||"Login and Authorize Your Wallet",description:e||"This dapp requires access to your wallet, please login and authorize access to your ".concat(s.name," accounts to continue."),eventCode:"loginFail",action:s.connect,icon:a||o.h,html:u,button:c});case 7:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}()}}}]);
//# sourceMappingURL=78.54af3858.chunk.js.map