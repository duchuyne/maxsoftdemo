/**************************************************************************************************** 
1. Create Date : 2019.10.29 
2. Creator     : 남진성
3. Description : 업데이트용 주석
4. Precaution  : 
5. History     : 
6. Old file    : 
* ***************************************************************************************************/
(function ($) {
    /* support IE8/9 CORS when it's not supported  */
    window.supportXDomainRequest = !(window.XMLHttpRequest && ('withCredentials' in new XMLHttpRequest())) && window.XDomainRequest;

    $.ajaxPrefilter('+*', function (s, originalOptions, jqXHR) {
        if (s.crossDomain && s.proxyUrl != undefined && window.supportXDomainRequest) {
            s.xhrFields = null;

            // For internal proxy requests to syncronize response in IE8/9.
            jqXHR.setRequestHeader("X-TRANSFER-TO", encodeURIComponent(s.url));
            s.url = s.proxyUrl;
            s.crossDomain = false;
        }
    });
	
})(jQuery);
