/**************************************************************************************************** 
1. Create Date : 2019.12.19 
2. Creator     : 남진성
3. Description : 이미지 로딩 관련 js
4. Precaution  : 
5. History     : 
6. Old file    : EBZXXXXX 
* ***************************************************************************************************/

/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2011 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.7.0-dev
 *
 */

/*
용도: 실제 이미지가 표시되기전에 대체 이미지를 지정. placeholder를 지정하지 않고 이미지 src값에 바로 대체 이미지 src값을 지정해도 된다.
사용법: $('img.lazy').lazyload({placeholder : '/img/loding.gif'});

용도: 이미지가 등장시의 효과를 변경. 기본적으로 show()의 형태로 나타나나 'fadeIn' 값을 지정하여 fadeIn() 형태로 출력 가능.
사용법 :$('img.lazy').lazyload({effect : 'fadeIn'});

용도: 이미지가 등장시 효과지속시간을 변경. (1초 = 1000)
사용법: $('img.lazy').lazyload({effect : 'fadeIn', effectTime : 1000});

용도: 이미지가 뷰포트에 출력되기 이전부터 호출 하도록 설정. 가령 200값을 지정할 경우 뷰포트에 등장하기 200px전부터 이미지를 호출한다.
사용법: $('img.lazy').lazyload({threshold : 200});

용도: 이미지 호출이벤트를 변경. 기본적으로 스크롤을 변경하여 이미지가 뷰포트에 출력되면 호출을 시작하지만
'click'이나 'mouseover'값을 지정하여 클릭시 또는 마우스 오버시 호출하도록 이벤트를 변경가능하며 'sporty'나 'foobar'를 사용하여 커스텀 이벤트로 호출가능.
($('img.lazy').trigger('sporty') 형태로 이벤트 호출)
사용법: $('img.lazy').lazyload({event : 'click'});

용도: 이미지 호출이 완료되면 실행될 콜백함수 지정.
사용법: $('img.lazy').lazyload({load : function(){ alert('이미지 호출이 완료되었습니다.'); }});
*/
!function(e){e.fn.lazyload=function(t){var n={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:window,skip_invisible:!0};t&&(null!==t.failurelimit&&(t.failure_limit=t.failurelimit,delete t.failurelimit),e.extend(n,t));var o=this;return 0==n.event.indexOf("scroll")&&e(n.container).bind(n.event,function(t){var i=0;o.each(function(){if(!n.skip_invisible||e(this).is(":visible"))if(e.abovethetop(this,n)||e.leftofbegin(this,n));else if(e.belowthefold(this,n)||e.rightoffold(this,n)){if(++i>n.failure_limit)return!1}else e(this).trigger("appear")});var r=e.grep(o,function(e){return!e.loaded});o=e(r)}),this.each(function(){var t=this;t.loaded=!1,e(t).one("appear",function(){this.loaded||e("<img />").bind("load",function(){e(t).hide().attr("src",e(t).data("original"))[n.effect](n.effectspeed),t.loaded=!0}).attr("src",e(t).data("original"))}),0!=n.event.indexOf("scroll")&&e(t).bind(n.event,function(n){t.loaded||e(t).trigger("appear")})}),e(window).bind("resize",function(t){e(n.container).trigger(n.event)}),e(n.container).trigger(n.event),this},e.belowthefold=function(t,n){if(void 0===n.container||n.container===window)o=e(window).height()+e(window).scrollTop();else var o=e(n.container).offset().top+e(n.container).height();return o<=e(t).offset().top-n.threshold},e.rightoffold=function(t,n){if(void 0===n.container||n.container===window)o=e(window).width()+e(window).scrollLeft();else var o=e(n.container).offset().left+e(n.container).width();return o<=e(t).offset().left-n.threshold},e.abovethetop=function(t,n){if(void 0===n.container||n.container===window)o=e(window).scrollTop();else var o=e(n.container).offset().top;return o>=e(t).offset().top+n.threshold+e(t).height()},e.leftofbegin=function(t,n){if(void 0===n.container||n.container===window)o=e(window).scrollLeft();else var o=e(n.container).offset().left;return o>=e(t).offset().left+n.threshold+e(t).width()},e.extend(e.expr[":"],{"below-the-fold":function(t){return e.belowthefold(t,{threshold:0,container:window})},"above-the-fold":function(t){return!e.belowthefold(t,{threshold:0,container:window})},"right-of-fold":function(t){return e.rightoffold(t,{threshold:0,container:window})},"left-of-fold":function(t){return!e.rightoffold(t,{threshold:0,container:window})}})}(jQuery);var _extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e,t){"object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.LazyLoad=t()}(this,function(){"use strict";var e=function(e,t){return e.getAttribute("data-"+t)},t=function(t){return t.filter(function(t){return!e(t,"was-processed")})},n=function(e,t){var n,o=new e(t);try{n=new CustomEvent("LazyLoad::Initialized",{detail:{instance:o}})}catch(e){(n=document.createEvent("CustomEvent")).initCustomEvent("LazyLoad::Initialized",!1,!1,{instance:o})}window.dispatchEvent(n)},o=function(t,n,o){for(var i,r=0;i=t.children[r];r+=1)if("SOURCE"===i.tagName){var s=e(i,o);s&&i.setAttribute(n,s)}},i=function(e,t,n){n&&e.setAttribute(t,n)},r=function(t,n){var r=n.data_src,s=e(t,r),a=t.tagName;if("IMG"===a){var l=n.data_srcset,c=e(t,l),f=t.parentNode;return f&&"PICTURE"===f.tagName&&o(f,"srcset",l),i(t,"srcset",c),void i(t,"src",s)}if("IFRAME"!==a)return"VIDEO"===a?(o(t,"src",r),void i(t,"src",s)):void(s&&(t.style.backgroundImage='url("'+s+'")'));i(t,"src",s)},s="undefined"!=typeof window,a=s&&"IntersectionObserver"in window,l=s&&"classList"in document.createElement("p"),c=function(e,t){l?e.classList.add(t):e.className+=(e.className?" ":"")+t},f=function(e,t){e&&e(t)},d=function(e,t,n){e.removeEventListener("load",t),e.removeEventListener("error",n)},u=function(e,t,n){var o=e.target;(function(e,t){l?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\s+)"+t+"(\\s+|$)")," ").replace(/^\s+/,"").replace(/\s+$/,"")})(o,n.class_loading),c(o,t?n.class_loaded:n.class_error),f(t?n.callback_load:n.callback_error,o)},h=function(e,t){f(t.callback_enter,e),["IMG","IFRAME","VIDEO"].indexOf(e.tagName)>-1&&(function(e,t){var n=function n(i){u(i,!0,t),d(e,n,o)},o=function o(i){u(i,!1,t),d(e,n,o)};e.addEventListener("load",n),e.addEventListener("error",o)}(e,t),c(e,t.class_loading)),r(e,t),function(e,t,n){e.setAttribute("data-"+t,n)}(e,"was-processed",!0),f(t.callback_set,e)},v=function(e,t){this._settings=function(e){var t={elements_selector:"img",container:document,threshold:300,data_src:"src",data_srcset:"srcset",class_loading:"loading",class_loaded:"loaded",class_error:"error",callback_load:null,callback_error:null,callback_set:null,callback_enter:null};return _extends({},t,e)}(e),this._setObserver(),this.update(t)};v.prototype={_setObserver:function(){var e=this;if(a){var n=this._settings,o={root:n.container===document?null:n.container,rootMargin:n.threshold+"px"};this._observer=new IntersectionObserver(function(n){n.forEach(function(t){if(function(e){return e.isIntersecting||e.intersectionRatio>0}(t)){var n=t.target;h(n,e._settings),e._observer.unobserve(n)}}),e._elements=t(e._elements)},o)}},loadAll:function(){var e=this._settings;this._elements.forEach(function(t){h(t,e)}),this._elements=t(this._elements)},update:function(e){var n=this,o=this._settings,i=e||o.container.querySelectorAll(o.elements_selector);this._elements=t(Array.prototype.slice.call(i)),this._observer?this._elements.forEach(function(e){n._observer.observe(e)}):this.loadAll()},destroy:function(){var e=this;this._observer&&(t(this._elements).forEach(function(t){e._observer.unobserve(t)}),this._observer=null),this._elements=null,this._settings=null}};var w=window.lazyLoadOptions;return s&&w&&function(e,t){if(t.length)for(var o,i=0;o=t[i];i+=1)n(e,o);else n(e,t)}(v,w),v});