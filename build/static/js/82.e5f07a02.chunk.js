(this["webpackJsonppuml-nft-frontend"]=this["webpackJsonppuml-nft-frontend"]||[]).push([[82],{811:function(n,e,t){"use strict";t.r(e);var r=t(4);function a(n,e,t,r,a,c,u){try{var s=n[c](u),i=s.value}catch(o){return void t(o)}s.done?e(i):Promise.resolve(i).then(r,a)}function c(n){return function(){var e=this,t=arguments;return new Promise((function(r,c){var u=n.apply(e,t);function s(n){a(u,r,c,s,i,"next",n)}function i(n){a(u,r,c,s,i,"throw",n)}s(void 0)}))}}function u(n){return s.apply(this,arguments)}function s(){return s=c(Object(r.a)().mark((function n(e){var a,u,s,i,o,p,l,f,A,w,h,d,b,g,v,x,m,k,O,y,j,L,X,C,B,P,D,N,J,q,M,T,S,V,K,z;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return z=function(){return(z=c(Object(r.a)().mark((function n(e){var t;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(0!==v.length){n.next=3;break}return n.next=3,X();case 3:return n.prev=3,n.next=6,b.signPersonalMessage(v[0],e.data);case 6:return t=n.sent,n.abrupt("return",t);case 10:throw n.prev=10,n.t0=n.catch(3),n.t0;case 13:case"end":return n.stop()}}),n,null,[[3,10]])})))).apply(this,arguments)},K=function(n){return z.apply(this,arguments)},V=function(){return(V=c(Object(r.a)().mark((function n(e){var t,a;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(0!==v.length){n.next=3;break}return n.next=3,X();case 3:return t=new s.Transaction(e,{chain:h(l)}),n.prev=4,n.next=7,b.signTransaction(v[0],t);case 7:return a=n.sent,n.abrupt("return","0x".concat(a.serialize().toString("hex")));case 11:throw n.prev=11,n.t0=n.catch(4),n.t0;case 14:case"end":return n.stop()}}),n,null,[[4,11]])})))).apply(this,arguments)},S=function(n){return V.apply(this,arguments)},T=function(n){return new Promise((function(e,t){k.sendAsync({jsonrpc:"2.0",method:"eth_getBalance",params:[n,"latest"],id:42},(function(n,r){n&&t(n);var a=r&&r.result;e(null!=a?new w(a).toString(10):null)}))}))},M=function(n){return Promise.all(n.map((function(n){return new Promise(function(){var e=c(Object(r.a)().mark((function e(t){var a;return Object(r.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T(n);case 2:a=e.sent,t({address:n,balance:a});case 4:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}())})))},q=function(){return(q=c(Object(r.a)().mark((function n(e){return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(x){n.next=2;break}return n.abrupt("return",[]);case 2:if(!(v.length>0)||e){n.next=4;break}return n.abrupt("return",v);case 4:return n.prev=4,n.next=7,b.addAccounts();case 7:v=n.sent,n.next=13;break;case 10:throw n.prev=10,n.t0=n.catch(4),n.t0;case 13:return n.abrupt("return",v);case 14:case"end":return n.stop()}}),n,null,[[4,10]])})))).apply(this,arguments)},J=function(n){return q.apply(this,arguments)},N=function(){return(N=c(Object(r.a)().mark((function n(){var e;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return"Lattice only supports one exported account per wallet. Checking for new wallet.",console.warn("Lattice only supports one exported account per wallet. Checking for new wallet."),n.next=4,J(!0);case 4:return e=n.sent,n.abrupt("return",e&&M(e));case 6:case"end":return n.stop()}}),n)})))).apply(this,arguments)},D=function(){return N.apply(this,arguments)},P=function(){return x?C()[0]:void 0},B=function(){},C=function(){return v},X=function(){return x=!0,J()},L=function(){return m},j=function(){return(j=c(Object(r.a)().mark((function n(e){return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e===p){n.next=2;break}throw new Error("Lattice only supports standard path: m/44'/0'/0'/0/x");case 2:return m=!1,g=e,n.abrupt("return",!0);case 5:case"end":return n.stop()}}),n)})))).apply(this,arguments)},y=function(n){return j.apply(this,arguments)},O=function(){g="",x=!1,k.stop()},n.next=20,Promise.all([t.e(4),t.e(13),t.e(24),t.e(75)]).then(t.t.bind(null,1843,7));case 20:return a=n.sent,u=a.default,n.next=24,Promise.all([t.e(13),t.e(31),t.e(93)]).then(t.t.bind(null,1898,7));case 24:return s=n.sent,n.next=27,Promise.all([t.e(0),t.e(1),t.e(2),t.e(3)]).then(t.bind(null,880));case 27:return i=n.sent,o=i.default,p="m/44'/60'/0'/0",l=e.networkId,f=e.appName,A=e.rpcUrl,w=e.BigNumber,h=e.networkName,d={name:f,network:h(l)},b=new u(d),g="",v=Array.from([]),x=!1,m=!1,(k=o({getAccounts:function(n){J().then((function(e){return n(null,e)})).catch((function(e){return n(e,null)}))},signTransaction:function(n,e){S(n).then((function(n){return e(null,n)})).catch((function(n){return e(n,null)}))},processMessage:function(n,e){K(n).then((function(n){return e(null,n)})).catch((function(n){return e(n,null)}))},processPersonalMessage:function(n,e){K(n).then((function(n){return e(null,n)})).catch((function(n){return e(n,null)}))},signMessage:function(n,e){K(n).then((function(n){return e(null,n)})).catch((function(n){return e(n,null)}))},signPersonalMessage:function(n,e){K(n).then((function(n){return e(null,n)})).catch((function(n){return e(n,null)}))},rpcUrl:A})).setPath=y,k.dPath=g,k.enable=X,k.setPrimaryAccount=B,k.getPrimaryAddress=P,k.getAccounts=J,k.getMoreAccounts=D,k.getBalance=T,k.getBalances=M,k.send=k.sendAsync,k.disconnect=O,k.isCustomPath=L,n.abrupt("return",k);case 51:case"end":return n.stop()}}),n)}))),s.apply(this,arguments)}e.default=function(n){var e=n.appName,t=n.rpcUrl,a=n.networkId,s=n.preferred,i=n.label,o=n.iconSrc;return{name:i||"Lattice",svg:n.svg||'\n  <svg width="41px" height="41px" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">\n  \x3c!-- Generated by Pixelmator Pro 1.8 --\x3e\n  <defs>\n    <image id="image" width="41px" height="41px" xlink:href="data:image/png;base64,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"/>\n  </defs>\n  <use id="image-1" xlink:href="#image" x="0px" y="0px" width="41px" height="41px"/>\n  </svg>\n',iconSrc:o,wallet:function(){var n=c(Object(r.a)().mark((function n(s){var i,o,p,l;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return i=s.BigNumber,o=s.networkName,p=s.resetWalletState,n.next=3,u({appName:e,rpcUrl:t,networkId:a,BigNumber:i,networkName:o,resetWalletState:p});case 3:return l=n.sent,n.abrupt("return",{provider:l,interface:{name:"Lattice",connect:l.enable,disconnect:l.disconnect,address:{get:function(){var n=c(Object(r.a)().mark((function n(){return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",l.getPrimaryAddress());case 1:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()},network:{get:function(){var n=c(Object(r.a)().mark((function n(){return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",a);case 1:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()},balance:{get:function(){var n=c(Object(r.a)().mark((function n(){var e;return Object(r.a)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e=l.getPrimaryAddress(),n.abrupt("return",e&&l.getBalance(e));case 2:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()}}});case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}(),type:"hardware",desktop:!0,mobile:!0,osExclusions:["iOS"],preferred:s}}}}]);
//# sourceMappingURL=82.e5f07a02.chunk.js.map