/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-audio-es6array-fetch-geolocation-indexeddb-notification-promises-vibrate-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,i,a,s;for(var f in h)if(h.hasOwnProperty(f)){if(e=[],n=h[f],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,'function')?n.fn():n.fn,i=0;i<e.length;i++)a=e[i],s=a.split('.'),1===s.length?Modernizr[s[0]]=o:(!Modernizr[s[0]]||Modernizr[s[0]]instanceof Boolean||(Modernizr[s[0]]=new Boolean(Modernizr[s[0]])),Modernizr[s[0]][s[1]]=o),g.push((o?'':'no-')+s.join('-'))}}function i(e){var n=w.className,t=Modernizr._config.classPrefix||'';if(x&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp('(^|\\s)'+t+'no-js(\\s|$)');n=n.replace(r,'$1'+t+'js$2')}Modernizr._config.enableClasses&&(n+=' '+t+e.join(' '+t),x?w.className.baseVal=n:w.className=n)}function a(){return'function'!=typeof n.createElement?n.createElement(arguments[0]):x?n.createElementNS.call(n,'http://www.w3.org/2000/svg',arguments[0]):n.createElement.apply(n,arguments)}function s(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,'')}function f(e,n){return!!~(''+e).indexOf(n)}function l(e,n){return function(){return e.apply(n,arguments)}}function u(e,n,t){var o;for(var i in e)if(e[i]in n)return t===!1?e[i]:(o=n[e[i]],r(o,'function')?l(o,t||n):o);return!1}function d(e){return e.replace(/([A-Z])/g,function(e,n){return'-'+n.toLowerCase()}).replace(/^ms-/,'-ms-')}function p(){var e=n.body;return e||(e=a(x?'svg':'body'),e.fake=!0),e}function c(e,t,r,o){var i,s,f,l,u='modernizr',d=a('div'),c=p();if(parseInt(r,10))for(;r--;)f=a('div'),f.id=o?o[r]:u+(r+1),d.appendChild(f);return i=a('style'),i.type='text/css',i.id='s'+u,(c.fake?c:d).appendChild(i),c.appendChild(d),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(n.createTextNode(e)),d.id=u,c.fake&&(c.style.background='',c.style.overflow='hidden',l=w.style.overflow,w.style.overflow='hidden',w.appendChild(c)),s=t(d,e),c.fake?(c.parentNode.removeChild(c),w.style.overflow=l,w.offsetHeight):d.parentNode.removeChild(d),!!s}function y(n,r){var o=n.length;if('CSS'in e&&'supports'in e.CSS){for(;o--;)if(e.CSS.supports(d(n[o]),r))return!0;return!1}if('CSSSupportsRule'in e){for(var i=[];o--;)i.push('('+d(n[o])+':'+r+')');return i=i.join(' or '),c('@supports ('+i+') { #modernizr { position: absolute; } }',function(e){return'absolute'==getComputedStyle(e,null).position})}return t}function m(e,n,o,i){function l(){d&&(delete A.style,delete A.modElem)}if(i=r(i,'undefined')?!1:i,!r(o,'undefined')){var u=y(e,o);if(!r(u,'undefined'))return u}for(var d,p,c,m,v,g=['modernizr','tspan','samp'];!A.style&&g.length;)d=!0,A.modElem=a(g.shift()),A.style=A.modElem.style;for(c=e.length,p=0;c>p;p++)if(m=e[p],v=A.style[m],f(m,'-')&&(m=s(m)),A.style[m]!==t){if(i||r(o,'undefined'))return l(),'pfx'==n?m:!0;try{A.style[m]=o}catch(h){}if(A.style[m]!=v)return l(),'pfx'==n?m:!0}return l(),!1}function v(e,n,t,o,i){var a=e.charAt(0).toUpperCase()+e.slice(1),s=(e+' '+P.join(a+' ')+a).split(' ');return r(n,'string')||r(n,'undefined')?m(s,n,o,i):(s=(e+' '+b.join(a+' ')+a).split(' '),u(s,n,t))}var g=[],h=[],C={_version:'3.3.1',_config:{classPrefix:'',enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){h.push({name:e,fn:n,options:t})},addAsyncTest:function(e){h.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr,Modernizr.addTest('geolocation','geolocation'in navigator),Modernizr.addTest('notification',function(){if(!e.Notification||!e.Notification.requestPermission)return!1;if('granted'===e.Notification.permission)return!0;try{new e.Notification('')}catch(n){if('TypeError'===n.name)return!1}return!0}),Modernizr.addTest('es6array',!!(Array.prototype&&Array.prototype.copyWithin&&Array.prototype.fill&&Array.prototype.find&&Array.prototype.findIndex&&Array.prototype.keys&&Array.prototype.entries&&Array.prototype.values&&Array.from&&Array.of)),Modernizr.addTest('promises',function(){return'Promise'in e&&'resolve'in e.Promise&&'reject'in e.Promise&&'all'in e.Promise&&'race'in e.Promise&&function(){var n;return new e.Promise(function(e){n=e}),'function'==typeof n}()});var w=n.documentElement,x='svg'===w.nodeName.toLowerCase();Modernizr.addTest('audio',function(){var e=a('audio'),n=!1;try{(n=!!e.canPlayType)&&(n=new Boolean(n),n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,''),n.mp3=e.canPlayType('audio/mpeg; codecs="mp3"').replace(/^no$/,''),n.opus=e.canPlayType('audio/ogg; codecs="opus"')||e.canPlayType('audio/webm; codecs="opus"').replace(/^no$/,''),n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,''),n.m4a=(e.canPlayType('audio/x-m4a;')||e.canPlayType('audio/aac;')).replace(/^no$/,''))}catch(t){}return n}),Modernizr.addTest('fetch','fetch'in e);var T='Moz O ms Webkit',P=C._config.usePrefixes?T.split(' '):[];C._cssomPrefixes=P;var _=function(n){var r,o=prefixes.length,i=e.CSSRule;if('undefined'==typeof i)return t;if(!n)return!1;if(n=n.replace(/^@/,''),r=n.replace(/-/g,'_').toUpperCase()+'_RULE',r in i)return'@'+n;for(var a=0;o>a;a++){var s=prefixes[a],f=s.toUpperCase()+'_'+r;if(f in i)return'@-'+s.toLowerCase()+'-'+n}return!1};C.atRule=_;var b=C._config.usePrefixes?T.toLowerCase().split(' '):[];C._domPrefixes=b;var S={elem:a('modernizr')};Modernizr._q.push(function(){delete S.elem});var A={style:S.elem.style};Modernizr._q.unshift(function(){delete A.style}),C.testAllProps=v;var N,E=C.prefixed=function(e,n,t){return 0===e.indexOf('@')?_(e):(-1!=e.indexOf('-')&&(e=s(e)),n?v(e,n,t):v(e,'pfx'))};try{N=E('indexedDB',e)}catch(z){}Modernizr.addTest('indexeddb',!!N),N&&Modernizr.addTest('indexeddb.deletedatabase','deleteDatabase'in N),Modernizr.addTest('vibrate',!!E('vibrate',navigator)),o(),i(g),delete C.addTest,delete C.addAsyncTest;for(var j=0;j<Modernizr._q.length;j++)Modernizr._q[j]();e.Modernizr=Modernizr}(window,document);