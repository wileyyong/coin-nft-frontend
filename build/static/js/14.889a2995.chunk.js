(this["webpackJsonppuml-nft-frontend"]=this["webpackJsonppuml-nft-frontend"]||[]).push([[14,16,80,92],{1041:function(r,e,n){"use strict";n.r(e),n.d(e,"generateAddresses",(function(){return f})),n.d(e,"isValidPath",(function(){return d}));var i=n(994),t=n(990),u=n.n(t),s=n(15),a=i.publicToAddress,c=i.toChecksumAddress;function f(r,e){var n=r.publicKey,i=r.chainCode,t=r.path,f=new u.a;f.publicKey=new s.Buffer(n,"hex"),f.chainCode=new s.Buffer(i,"hex");for(var d=[],o=e;o<5+e;o++){var h=f.deriveChild(o),p=a(h.publicKey,!0).toString("hex");d.push({dPath:"".concat(t,"/").concat(o),address:c("0x".concat(p))})}return d}function d(r){var e=r.split("/");if("m"!==e[0])return!1;if("44'"!==e[1])return!1;if(!["60'","1'","73799'","246'"].includes(e[2]))return!1;if(void 0===e[3]||"0'"===e[3])return!0;var n=Number(e[3].slice(0,-1));if(isNaN(n)||n<0||"'"!==e[3].slice(-1))return!1;if(void 0===e[4])return!0;var i=Number(e[4]);if(isNaN(i)||i<0)return!1;if(void 0===e[5])return!0;var t=Number(e[5]);return!(isNaN(t)||t<0)}},1092:function(r,e){}}]);
//# sourceMappingURL=14.889a2995.chunk.js.map