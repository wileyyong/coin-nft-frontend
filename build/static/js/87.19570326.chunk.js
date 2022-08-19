(this["webpackJsonppuml-nft-frontend"]=this["webpackJsonppuml-nft-frontend"]||[]).push([[87],{818:function(e,t,r){"use strict";r.r(t);var n=r(20);function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=e&&("undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null==r)return;var n,a,c=[],o=!0,u=!1;try{for(r=r.call(e);!(o=(n=r.next()).done)&&(c.push(n.value),!t||c.length!==t);o=!0);}catch(s){u=!0,a=s}finally{try{o||null==r.return||r.return()}finally{if(u)throw a}}return c}(e,t)||i(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||i(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){if(e){if("string"===typeof e)return l(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?l(e,t):void 0}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function p(e,t,r,n,a,c,o){try{var u=e[c](o),s=u.value}catch(i){return void r(i)}u.done?t(s):Promise.resolve(s).then(n,a)}function f(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var c=e.apply(t,r);function o(e){p(c,n,a,o,u,"next",e)}function u(e){p(c,n,a,o,u,"throw",e)}o(void 0)}))}}function h(e){return d.apply(this,arguments)}function d(){return d=f(Object(n.a)().mark((function e(t){var a,o,i,l,p,h,d,b,w,m,y,v,g,x,O,k,j,P,S,A,E,L,T,C,I,M,N,z,B,U,D,K,V,W,Z,J,_,G,H,$,q,F,Q,R,X,Y,ee,te,re,ne,ae;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return ae=function(){return(ae=f(Object(n.a)().mark((function e(t){var r,a,c;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==C.size){e.next=3;break}return e.next=3,V();case 3:return r=u(s(C.entries())[0],2),a=r[0],c=r[1],e.abrupt("return",new Promise((function(e,r){y.ethereumSignMessage({path:c,message:h.stripHexPrefix(t.data),hex:!0}).then((function(t){if(t.success){t.payload.address!==h.toChecksumAddress(a)&&r(new Error("signature doesnt match the right address"));var n="0x".concat(t.payload.signature);e(n)}else r(new Error(t.payload&&t.payload.error||"There was an error signing a message"))}))})));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)},ne=function(e){return ae.apply(this,arguments)},re=function(){return(re=f(Object(n.a)().mark((function e(t){var r,a,o,u,l,f,d,b,w,m;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==C.size){e.next=3;break}return e.next=3,V();case 3:return a=s(C.values())[0],o=h.BN,u=h.toBuffer,l=new p({chain:E||A(O)}),(f=i.fromTxData(c(c({},t),{},{gasLimit:null!==(r=t.gas)&&void 0!==r?r:t.gasLimit}),{common:l,freeze:!1})).v=new o(u(O)),f.r=f.s=new o(u(0)),e.next=11,ee(a,t);case 11:if((d=e.sent).success){e.next=14;break}throw new Error(d.payload.error);case 14:return b=d.payload.v.toString(16),(w=parseInt(b,16))!==(m=2*O+35)&&(w&m)!==w&&(m+=1),b=m.toString(16),f.v=new o(u("0x".concat(b))),f.r=new o(u("".concat(d.payload.r))),f.s=new o(u("".concat(d.payload.s))),e.abrupt("return","0x".concat(f.serialize().toString("hex")));case 23:case"end":return e.stop()}}),e)})))).apply(this,arguments)},te=function(e){return re.apply(this,arguments)},ee=function(e,t){var r=t.nonce,n=t.gasPrice,a=t.gas,c=t.to,o=t.value,u=t.data;return y.ethereumSignTransaction({path:e,transaction:{nonce:r,gasPrice:n,gasLimit:a,to:c,value:o||"",data:u||"",chainId:O}})},Y=function(e){return new Promise((function(t,r){z.sendAsync({jsonrpc:"2.0",method:"eth_getBalance",params:[e,"latest"],id:42},(function(e,n){e&&r(e);var a=n&&n.result;t(null!=a?new S(a).toString(10):null)}))}))},X=function(e){return Promise.all(e.map((function(e){return new Promise(function(){var t=f(Object(n.a)().mark((function t(r){var a;return Object(n.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Y(e.toLowerCase());case 2:a=t.sent,r({address:e,balance:a});case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())})))},R=function(){return(R=f(Object(n.a)().mark((function e(t){return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(I){e.next=2;break}return e.abrupt("return",[void 0]);case 2:if(!(C.size>0)||t){e.next=4;break}return e.abrupt("return",J());case 4:if(""===T&&(T=x),N){e.next=15;break}return e.prev=6,e.next=9,G();case 9:N=e.sent,e.next=15;break;case 12:throw e.prev=12,e.t0=e.catch(6),e.t0;case 15:return m(N,C.size).forEach((function(e){var t=e.dPath,r=e.address;C.set(r,t)})),e.abrupt("return",J());case 18:case"end":return e.stop()}}),e,null,[[6,12]])})))).apply(this,arguments)},Q=function(e){return R.apply(this,arguments)},F=function(){return(F=f(Object(n.a)().mark((function e(){var t;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Q(!0);case 2:return t=e.sent,e.abrupt("return",X(t));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)},q=function(){return F.apply(this,arguments)},$=function(){return I?J()[0]:void 0},H=function(){return(H=f(Object(n.a)().mark((function e(){var t;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(T){e.next=2;break}throw new Error("a derivation path is needed to get the public key");case 2:return e.prev=2,e.next=5,y.getPublicKey({path:T,coin:"eth"});case 5:if((t=e.sent).success){e.next=8;break}throw new Error(t.payload.error);case 8:return N={publicKey:t.payload.publicKey,chainCode:t.payload.chainCode,path:t.payload.serializedPath},e.abrupt("return",N);case 12:throw e.prev=12,e.t0=e.catch(2),new Error("There was an error accessing your Trezor accounts.");case 15:case"end":return e.stop()}}),e,null,[[2,12]])})))).apply(this,arguments)},G=function(){return H.apply(this,arguments)},_=function(e){var t=s(C.entries()),r=t.findIndex((function(t){return u(t,1)[0]===e}));t.unshift(t.splice(r,1)[0]),C=new Map(t)},J=function(){return Array.from(C.keys())},Z=function(){return(Z=f(Object(n.a)().mark((function e(t){var r,a;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="Unable to derive address from path ".concat(t),e.prev=1,e.next=4,y.ethereumGetAddress({path:t,showOnTrezor:!1});case 4:if((a=e.sent).success){e.next=7;break}throw new Error(r);case 7:return e.abrupt("return",a.payload.address);case 10:throw e.prev=10,e.t0=e.catch(1),new Error(r);case 13:case"end":return e.stop()}}),e,null,[[1,10]])})))).apply(this,arguments)},W=function(e){return Z.apply(this,arguments)},V=function(){return I=!0,Q()},K=function(){return M},D=function(){return(D=f(Object(n.a)().mark((function e(t,r){var a;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==T&&(C=new Map),!r){e.next=15;break}return e.prev=2,e.next=5,W(t);case 5:return a=e.sent,C.set(a,t),T=t,M=!0,e.abrupt("return",!0);case 12:throw e.prev=12,e.t0=e.catch(2),new Error("There was a problem deriving an address from path ".concat(t));case 15:return M=!1,T=t,e.abrupt("return",!0);case 18:case"end":return e.stop()}}),e,null,[[2,12]])})))).apply(this,arguments)},U=function(e,t){return D.apply(this,arguments)},B=function(){T="",C=new Map,I=!1,z.stop()},e.next=25,r.e(28).then(r.t.bind(null,1834,7));case 25:return a=e.sent,e.next=28,Promise.resolve().then(r.t.bind(null,287,7));case 28:return o=e.sent,i=o.Transaction,e.next=32,Promise.resolve().then(r.t.bind(null,235,7));case 32:return l=e.sent,p=l.default,e.next=36,Promise.all([r.e(6),r.e(16)]).then(r.t.bind(null,993,7));case 36:return h=e.sent,e.next=39,Promise.all([r.e(0),r.e(1),r.e(2),r.e(3)]).then(r.bind(null,890));case 39:return d=e.sent,b=d.default,e.next=43,Promise.all([r.e(7),r.e(6),r.e(14)]).then(r.bind(null,1040));case 43:return w=e.sent,m=w.generateAddresses,y=a.default,v=a.DEVICE_EVENT,g=a.DEVICE,x="m/44'/60'/0'/0",O=t.networkId,k=t.email,j=t.appUrl,P=t.rpcUrl,S=t.BigNumber,A=t.networkName,E=t.customNetwork,L=t.resetWalletState,T="",C=new Map,I=!1,M=!1,y.manifest({email:k,appUrl:j}),z=b({getAccounts:function(e){Q().then((function(t){return e(null,t)})).catch((function(t){return e(t,null)}))},signTransaction:function(e,t){te(e).then((function(e){return t(null,e)})).catch((function(e){return t(e,null)}))},processMessage:function(e,t){ne(e).then((function(e){return t(null,e)})).catch((function(e){return t(e,null)}))},processPersonalMessage:function(e,t){ne(e).then((function(e){return t(null,e)})).catch((function(e){return t(e,null)}))},signMessage:function(e,t){ne(e).then((function(e){return t(null,e)})).catch((function(e){return t(e,null)}))},signPersonalMessage:function(e,t){ne(e).then((function(e){return t(null,e)})).catch((function(e){return t(e,null)}))},rpcUrl:P}),y.on(v,(function(e){e.type===g.DISCONNECT&&(z.stop(),L({disconnected:!0,walletName:"Trezor"}))})),z.setPath=U,z.dPath=T,z.enable=V,z.setPrimaryAccount=_,z.getPrimaryAddress=$,z.getAccounts=Q,z.getMoreAccounts=q,z.getBalance=Y,z.getBalances=X,z.send=z.sendAsync,z.disconnect=B,z.isCustomPath=K,e.abrupt("return",z);case 68:case"end":return e.stop()}}),e)}))),d.apply(this,arguments)}t.default=function(e){var t=e.rpcUrl,r=e.networkId,a=e.email,c=e.appUrl,o=e.preferred,u=e.label,s=e.iconSrc,i=e.svg,l=e.customNetwork;return{name:u||"Trezor",svg:i||'\n\t<svg width="40px" height="40px" viewBox="0 0 114 166" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n\t\t<g id="Styles" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n\t\t\t<path d="M17,51.453125 L17,40 C17,17.90861 34.90861,-1.0658141e-14 57,-1.0658141e-14 C79.09139,-1.0658141e-14 97,17.90861 97,40 L97,51.453125 L113.736328,51.453125 L113.736328,139.193359 L57.5,166 L0,139.193359 L0,51.453125 L17,51.453125 Z M37,51.453125 L77,51.453125 L77,40 L76.9678398,40 C76.3750564,29.406335 67.6617997,21 57,21 C46.3382003,21 37.6249436,29.406335 37.0321602,40 L37,40 L37,51.453125 Z M23,72 L23,125 L56.8681641,140.966797 L91,125 L91,72 L23,72 Z" id="Trezor-logo" fill="currentColor"></path>\n\t\t</g>\n\t</svg>\n',iconSrc:s,wallet:function(){var e=f(Object(n.a)().mark((function e(o){var u,s,i,p;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=o.BigNumber,s=o.networkName,i=o.resetWalletState,e.next=3,h({rpcUrl:t,networkId:r,email:a,appUrl:c,BigNumber:u,networkName:s,customNetwork:l,resetWalletState:i});case 3:return p=e.sent,e.abrupt("return",{provider:p,interface:{name:"Trezor",connect:p.enable,disconnect:p.disconnect,address:{get:function(){var e=f(Object(n.a)().mark((function e(){return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",p.getPrimaryAddress());case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},network:{get:function(){var e=f(Object(n.a)().mark((function e(){return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",r);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},balance:{get:function(){var e=f(Object(n.a)().mark((function e(){var t;return Object(n.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=p.getPrimaryAddress(),e.abrupt("return",t&&p.getBalance(t));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}}});case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),type:"hardware",desktop:!0,mobile:!0,osExclusions:["iOS"],preferred:o}}}}]);
//# sourceMappingURL=87.19570326.chunk.js.map