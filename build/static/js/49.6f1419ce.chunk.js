(this["webpackJsonppuml-nft-frontend"]=this["webpackJsonppuml-nft-frontend"]||[]).push([[49],{756:function(n,e,t){"use strict";t.r(e);var r=t(3),o=t.n(r),a=t(791);function l(n,e,t,r,o,a,l){try{var i=n[a](l),s=i.value}catch(c){return void t(c)}i.done?e(s):Promise.resolve(s).then(r,o)}e.default=function(n){var e=n.preferred,t=n.label,r=n.iconSrc,i=n.svg,s=window.location.origin||window.location.host,c=encodeURIComponent(s);return{name:t||"D'CENT",svg:i||'\n<svg xmlns="http://www.w3.org/2000/svg" id="\uad6c\uc131_\uc694\uc18c_171_4" width="48" height="48" viewBox="0 0 48 48">\n<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n\t viewBox="0 0 62.27 71.11" style="enable-background:new 0 0 62.27 71.11;" xml:space="preserve">\n<style type="text/css">\n\t.st0{fill:#B3B5B5;}\n\t.st1{fill:#72BFBC;}\n\t.st2{fill:#6D6E70;}\n</style>\n<g>\n\t<polygon class="st0" points="32.04,13.43 37.34,10.37 37.34,3.06 32.04,0 32.04,0 \t"/>\n\t<path class="st1" d="M12.53,45.25V24.69l17.71-10.22V0L0.9,16.94C0.34,17.26,0,17.86,0,18.5v33.88c0,0.03,0.01,0.07,0.01,0.1\n\t\tL12.53,45.25z"/>\n\t<path class="st2" d="M48.86,46.69L31.14,56.93L13.52,46.75L0.99,53.99l29.25,16.89c0.28,0.16,0.59,0.24,0.9,0.24\n\t\tc0.31,0,0.62-0.08,0.9-0.24l29.34-16.94c0.01,0,0.01-0.01,0.02-0.01L48.86,46.69z"/>\n\t<g>\n\t\t<path class="st0" d="M61.38,16.94l-11.63-6.71v7.3l-12.5,7.22l12.5,7.21v13.16l12.53,7.23V18.5\n\t\t\tC62.27,17.86,61.93,17.26,61.38,16.94z"/>\n\t</g>\n\t<polygon class="st2" points="24.93,31.85 24.94,46.18 37.1,39.16 37.1,24.83 \t"/>\n</g>\n</svg>\n',iconSrc:r,wallet:function(){var n,e=(n=o.a.mark((function n(e){var t,r,a,l;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t=e.getProviderName,r=e.createModernProviderInterface,a=e.createLegacyProviderInterface,l=window.ethereum||window.web3&&window.web3.currentProvider,n.abrupt("return",{provider:l,interface:l&&"D'CENT"===t(l)?"function"===typeof l.enable?r(l):a(l):null});case 3:case"end":return n.stop()}}),n)})),function(){var e=this,t=arguments;return new Promise((function(r,o){var a=n.apply(e,t);function i(n){l(a,r,o,i,s,"next",n)}function s(n){l(a,r,o,i,s,"throw",n)}i(void 0)}))});return function(n){return e.apply(this,arguments)}}(),type:"injected",link:"https://link.dcentwallet.com/DAppBrowser/?url="+c,installMessage:a.a,mobile:!0,preferred:e}}},791:function(n,e,t){"use strict";t.d(e,"a",(function(){return r})),t.d(e,"b",(function(){return o}));var r=function(n){var e=n.currentWallet,t=n.selectedWallet;return e?'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    We have detected that you already have\n    <b>'.concat(e,"</b>\n    installed. If you would prefer to use\n    <b>").concat(t,'</b>\n    instead, then click below to install.\n    </p>\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    <b>Tip:</b>\n    If you already have ').concat(t,' installed, check your\n    browser extension settings to make sure that you have it enabled\n    and that you have disabled any other browser extension wallets.\n    <span\n      class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick="window.location.reload();">\n      Then refresh the page.\n    </span>\n    </p>\n    '):'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    You\'ll need to install <b>'.concat(t,'</b> to continue. Once you have it installed, go ahead and\n    <span\n    class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick={window.location.reload();}>\n      refresh the page.\n    </span>\n    ').concat("Opera"===t?'<br><br><i>Hint: If you already have Opera installed, make sure that your web3 wallet is <a style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;" class="bn-onboard-clickable" href="https://help.opera.com/en/touch/crypto-wallet/" rel="noreferrer noopener" target="_blank">enabled</a></i>':"","\n    </p>\n    ")},o=function(n){var e=n.selectedWallet;return'\n  <p style="font-size: 0.889rem;">\n  Tap the button below to <b>Open '.concat(e,"</b>. Please access this site on ").concat(e,"'s in-app browser for a seamless experience.\n  </p>\n  ")}}}]);
//# sourceMappingURL=49.6f1419ce.chunk.js.map