/**************************************************************************************************** 
1. Create Date : 2018.01.17
2. Creator     : 김형래
3. Description : PathTracking JS
4. Precaution  : 
5. History     : 
6. Old file    : 
* ***************************************************************************************************/
function SendTrackingData(urlName, callback, extra) {
    var getServerType = function () {
        var host = location.host.split(':')[0];
        var subHost = location.host.split('.')[0];

        var realServerPattern = /^(((login|app)([a-z|A-Z])?([\d])?(-dev)?$)|(www|gmc|maxsoft|maxsofterp|taxtw))/i;
        var zeusServerPattern = /^zeus([\d])?(_(www|taxtw))?([1-9]|10)?(gmc)?([a-z|A-Z])?(-dev)?$/i;
        var apolloServerPattern = /^((apollo(_(www|taxtw))?)|zeus)((1[1-9])|([2-4][0-9]))?(gmc)?([a-z|A-Z])?(-dev)?$/i;
        var stageServerPattern = /^stage_www$/i;
        var heraServerPattern = /^h(era|us|cn|tw|jp|vn|my|id|th|ph|uz|hk|erazone|taxtw)([\d])?([a-z|A-Z])?(-dev)?$/i;

        if (realServerPattern.test(subHost)) {
            return 'real';
        }
        else if (zeusServerPattern.test(subHost)) {
            return 'zeus';
        }
        else if (apolloServerPattern.test(subHost)) {
            return 'apollo';
        }
        else if (stageServerPattern.test(subHost)) {
            return 'stage';
        }
        else if (heraServerPattern.test(subHost)) {
            return 'hera';
        }
        else {
            return 'test';
        }
    };

    var getTargetServer = function (serverType, locationType) {
        var host = '//' + location.host;
        switch (locationType) {
            case '0': //국문
                return host + '/kr';
            case '1': //영문
                return host + '/us';
            case '2': //스페니쉬
                return host + '/es';
            case '3': //중문
                return host;
            case '4': //베트남
                return host + '/vn';
            case '5': //말레이시아
                return host + '/my';
            case '6': //콜롬비아
                return host + '/us';
            case '7': //일본
                return host + '/jp';
            case '8': //타이완
                return host + '/tw';
            case '9': //메일
                if (location.host.indexOf('maxsoftmail') >= 0) {
                    return host;
                }
                return host + "/wmail/" + location.pathname.toLowerCase().split('/')[2];
            case '10': //인도네시아
                return host + '/id';
            case '11': //화피아오 TW
                return host;
            case '12': //태국
                return host + '/th';
            case '14': //필리핀
                return host + '/ph';
            case '13': //POS
                return host + '/pos';
            case '15': //우즈베키스탄
                return host + '/uz';
            case '16': //홍콩
                return host + '/hk';
            default: //국문
                return '//www.maxsoft.com/kr';
        }
    };

    var getBrowser = function () {
        'use strict';
        var agent = navigator.userAgent.toLowerCase();
        var name = navigator.appName;
        var browser;

        // MS 계열 브라우저를 구분하기 위함.
        if (name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
            browser = 'ie';
            if (name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
                agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
                browser += parseInt(agent[1]);
            } else { // IE 11+
                if (agent.indexOf('trident') > -1) { // IE 11 
                    browser += 11;
                } else if (agent.indexOf('edge/') > -1) { // Edge(구)
                    browser = 'edge';
                }
            }
        } else if (agent.indexOf('chrome') > -1 || agent.indexOf('crios') > -1) { // Chrome
            browser = 'chrome';

            if (agent.indexOf('edg') > -1) {    // Edge Chromium
                browser = 'edge';
            }
        } else if (agent.indexOf('safari') > -1) { // Chrome or Safari
            if (agent.indexOf('opr') > -1) { // Opera
                browser = 'opera';
            } else { // Safari
                browser = 'safari';
            }
        } else if (agent.indexOf('firefox') > -1) { // Firefox
            browser = 'firefox';
        }

        return browser;
    };

    var isMobile = function () {
        //var filter = 'win16|win32|win64|mac|macintel';

        //if (navigator.userAgent) {
        //    if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
        //        return true;
        //    } else {
        //        return false;
        //    }
        //}

		return /iPhone|iPad|iPod|Android|BlackBerry|SymbianOS|webOS|IEMobile|Opera Mini|SCH-M[0-9]+/i.test(navigator.userAgent);
    };

    var getRequestParameters = function (locationHref) {
        var params = {};
        //현재 주소를 decoding
        var url = "";
        try {
            url = decodeURIComponent(locationHref).split('#')[0];
        }
        catch (ex1) {
            url = unescape(locationHref).split('#')[0];
        }

        //파라미터만 자르고, 다시 & 구분자를 잘라서 배열에 넣는다. 
        var paramArr = (url.substring(url.indexOf('?') + 1, url.length)).split('&');

        for (var i = 0; i < paramArr.length; i++) {
            params[paramArr[i].split('=')[0].toLowerCase()] = paramArr[i].split('=')[1];
        }

        return params;
    };

    var getLocationType = function (locType, access_site, serverType) {
        if (locType) {
            switch (locType.toUpperCase()) {
                case '_KR':
                    return '0'; //국문
                case '_US':
                    return '1'; //영문
                case '_ES':
                    return '2'; //스페니쉬
                case '_CN':
                    return '3'; //중문
                case '_VN':
                    return '4'; //베트남
                case '_MY':
                    return '5'; //말레이시아
                case '_CO':
                    return '6'; //콜롬비아
                case '_JP':
                    return '7'; //일본
                case '_TW':
                    return '8'; //타이완
                case '_MAIL':
                    return '9'; //메일
                case '_ID':
                    return '10'; //인도네시아
                case '_TAXTW':
                    return '11'; //화피아오 TW
                case '_TH':
                    return '12'; //태국
                case '_POS':
                    return '13'; //POS
                case '_PH':
                    return '14'; //필리핀
                case '_UZ':
                    return '15'; //우즈베키스탄
                case '_HK':
                    return '16'; //홍콩
                default:
                    return '0'; //국문
            }
        }
        else {
            if ((location.host.indexOf('maxsoftmail') >= 0) || location.pathname.indexOf("https://www.maxsoft.com/wmail/") > -1 || (access_site && access_site.toLowerCase() == 'webmail')) {
                return '9'; //메일
            }

            switch (serverType) {
                case 'real':
                case 'zeus':
                case 'apollo':
                case 'stage':
                case 'test':
                    var host = location.host.split(':')[0];
                    if (/\.com$/i.test(host)) {
                        if (/^\/us/i.test(location.pathname) || /^\/us\//i.test(location.pathname)) {
                            return '1';//영문
                        }
                        else if (/^\/es/i.test(location.pathname) || /^\/es\//i.test(location.pathname)) {
                            return '2';//스페니쉬
                        }
                        else if (/^\/vn/i.test(location.pathname) || /^\/vn\//i.test(location.pathname)) {
                            return '4';//베트남
                        }
                        else if (/^\/my/i.test(location.pathname) || /^\/my\//i.test(location.pathname)) {
                            return '5';//말레이시아
                        }
                        else if (/^\/co/i.test(location.pathname) || /^\/co\//i.test(location.pathname)) {
                            return '6';//콜롬비아
                        }
                        else if (/^\/jp/i.test(location.pathname) || /^\/jp\//i.test(location.pathname)) {
                            return '7';//일본
                        }
                        else if (/^\/tw/i.test(location.pathname) || /^\/tw\//i.test(location.pathname)) {
                            return '8';//타이완
                        }
                        else if (/^\/id/i.test(location.pathname) || /^\/id\//i.test(location.pathname)) {
                            return '10';//인도네시아
                        }
                        else if (/taxtw/i.test(host)) {
                            return '11'; //화피아오 TW
                        }
                        else if (/^\/th/i.test(location.pathname) || /^\/th\//i.test(location.pathname)) {
                            return '12';//태국
                        }
                        else if (/^\/pos/i.test(location.pathname) || /^\/pos\//i.test(location.pathname)) {
                            return '13';//POS
                        }
                        else if (/^\/ph/i.test(location.pathname) || /^\/ph\//i.test(location.pathname)) {
                            return '14';//필리핀
                        }
                        else if (/^\/uz/i.test(location.pathname) || /^\/uz\//i.test(location.pathname)) {
                            return '15';//우즈베키스탄
                        }
                        else if (/^\/hk/i.test(location.pathname) || /^\/hk\//i.test(location.pathname)) {
                            return '16';//홍콩
                        }

                        return '0';//국문
                    }
                    else if (/\.cn$/i.test(host)) {
                        return '3';//중문
                    } else {
                        return '0';//국문
                    }
                    break;
                default:
                    return '0';//국문
            }
        }
    };

    var getLocType = function (locationType) {
        switch (locationType) {
            case '0':
                return '_KR';
            case '1':
                return '_US';
            case '2':
                return '_ES';
            case '3':
                return '_CN';
            case '4':
                return '_VN';
            case '5':
                return '_MY';
            case '6':
                return '_CO';
            case '7':
                return '_JP';
            case '8':
                return '_TW';
            case '9':
                return '_MAIL';
            case '10':
                return '_ID';
            case '11':
                return '_TAXTW';
            case '12':
                return '_TH';
            case '13':
                return '_POS';
            case '14':
                return '_PH';
            case '15':
                return '_UZ';
            case '16':
                return '_HK';
            default:
                return '_KR';
        }
    };

    var cookie = {
        setCookie: function (name, value, day) {
            if (name && value) {
                var cookie = name + '=' + escape(value) + '; path=/';
                var domain = location.host.toLowerCase().split(':')[0];
                domain = domain.substring(domain.indexOf('maxsoft'));

                cookie += ';domain=' + domain;

                if (day) {
                    var expire = new Date();
                    expire.setDate(expire.getDate() + day);
                    cookie += ';expires=' + expire.toGMTString();
                }
                else {
                    var expire = new Date();
                    expire.setDate(expire.getDate() + 1);
                    cookie += ';expires=' + expire.toGMTString();
                }
                document.cookie = cookie;
                return true;
            }

            return false;
        },
        getCookie: function (name) {
            var cookies = document.cookie;
            var start = cookies.indexOf(name + '=');
            if (start >= 0) {
                start += name.length + 1;
                var end = cookies.indexOf(';', start);
                if (end == -1) end = cookies.length;
                return cookies.substring(start, end);
            }

            return null;
        }
    };

    var getRandomKey = function () {        
        var getRandomNumber = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const dateNow = Date.now();
        var result = dateNow + '' + getRandomNumber(1000, 9999);

        return result;
    };

    var getUrl = function () {
        var url = location.pathname.toLowerCase().split('.aspx')[0];
        url = url.replace(/\/\/+/g, '/');
        var regx = /\/(es|co|jp|kr|us|id|my|th|tw|vn|ph|uz|hk|pos)/i;

        if (regx.test(url)) {
            var startPos = 3;
            if (url.indexOf("https://www.maxsoft.com/wmail/") >= 0)
                startPos = 9;

            var urlPath = url.substring(startPos);
            if (urlPath.length < 1) {
                return '/';
            }

            if (regx.exec(url)[1] == "pos") {
                if (url.substring(4).length < 1) {
                    return '/';
                }
                return url.substring(4);
            }

            return url.substring(startPos);
        }
        else {
            return url;
        }
    };

    // startsWith 기능을 지원하지 않는 브라우저가 있음(IE11)
    function fnStartsWith(data, find) {
        if (data.startsWith) {
            return data.startsWith(find);
        }
        else {
            return data.substr(0, find.length) === find;
        }
    }

    makeGmcHostPathTracking = function () { 
        var host = window.location.host.toLowerCase(),
            hostPrefix = '',
            protocol = window.location.protocol,
            hostParser = {
                center: /^(www[78]?|login[78]?|cs[78]?|pay[78]?)([a-z]?)(\d*)(-dev)?\./i,
                dev: /^(stage|zeus|apollo)([\d]+)?(_(www|kr|us|es|cn|tw|jp|vn|my|id|th|ph|uz|hk))?([\d]+)?([a-z]?)(-dev)?\./i
            };

        var match = hostParser.center.exec(host);
        if (match != null) {
            var svrno = match[1].substring(match[1].length - 1);

            if (svrno == '7' || svrno == '8') {
                hostPrefix = 'login' + svrno;
            }
        }
        else {  // Match attempt failed
            if (fnStartsWith(host, "maxsoft")) {    // 센터 CDN(Cloud Front)을 통해 서브 도메인 없이 접속했을 경우
                hostPrefix = '';
            }
            else {
                match = hostParser.dev.exec(host);

                if (match != null) {
                    var srv_cd = match[1].substring(0, 1);

                    if (srv_cd == 'z') {
                        //hostPrefix = 'zeus01';
                        if (match[2] == undefined || match[2] == '') {
                            hostPrefix = 'zeus04';
                        }
                        else {
                            hostPrefix = match[1] + match[2];
                        }
                    }
                    else if (srv_cd == 'a') {
                        hostPrefix = 'apollo';
                    }
                    else if (srv_cd == 's') {
                        hostPrefix = 'stage';
                    }
                    else {
                        hostPrefix = 'hera';
                    }

                    hostPrefix += (match[5] || ""); // append server number
                }
                else {
                    return protocol + "//test.maxsoft.com";// + host;  // test.maxsoft.com
                }
            }
        }

        return protocol + "//" + hostPrefix + "gmc.maxsoft.com";
    };

    var locationHref;

    try {
        locationHref = $.url().source;
    }
    catch (e) {
        locationHref = location.href;
    }

    var param = getRequestParameters(locationHref);
    var serverType = getServerType();
    var locationType = getLocationType(param.loctype, param.access_site, serverType);
    var locType = param.loctype ? param.loctype : getLocType(locationType);

    var instanceCookieValue = cookie.getCookie('ecinccid');
    var yearlyCookieValue = cookie.getCookie('ecyearcid');

    if (param.coi) {
        instanceCookieValue = param.coi;
    }
    else {
        instanceCookieValue = cookie.getCookie('ecinccid');

        if (instanceCookieValue == null || instanceCookieValue.length == 0) {
            instanceCookieValue = getRandomKey() + locType;
        }
        else {
            instanceCookieValue = instanceCookieValue.split('_')[0] + locType;
        }
    }

    if (param.ci) {
        yearlyCookieValue = param.ci;
    }
    else {
        yearlyCookieValue = cookie.getCookie('ecyearcid');

        if (yearlyCookieValue == null || yearlyCookieValue.length == 0) {
            yearlyCookieValue = getRandomKey() + locType;
        }
        else {
            yearlyCookieValue = yearlyCookieValue.split('_')[0] + locType;
        }
    }

    cookie.setCookie('ecinccid', instanceCookieValue);
    cookie.setCookie('ecyearcid', yearlyCookieValue, 365);

    instanceCookieValue = cookie.getCookie('ecinccid');
    yearlyCookieValue = cookie.getCookie('ecyearcid');

    var data = {
        USER_COOKIE_ID: param.coi ? param.coi : instanceCookieValue,
        VISIT_COOKIE_ID: param.ci ? param.ci : yearlyCookieValue,
        IP: param.uip,
        REF_URL: (param.mrefurl ? param.mrefurl : (param.refurl ? param.refurl : document.referrer)),
        URL: locationHref,
        URL_NAME: urlName ? urlName : getUrl(),
        LOCATION_TYPE: locationType,
        BROWSER: getBrowser(),
        DEVICE_TYPE: (isMobile() ? 'M' : 'D'),
        LAN_TYPE: (navigator.language || navigator.userLanguage).split(',')[0],
        KEYWORD_CD: param.k,
        ENGINE_CD: param.s,
        CAMPAIGN_CD: param.c,
        MKT_TYPE_CD: param.l,
        EXTRA: extra,
        KWRD_CTT: encodeURIComponent(param.keyword || ""),
        SRCH_TYPE_CD: param.matchtype,
        AGENT_VAL : navigator.userAgent
    };

    var array = [];

    for (var p in data) {
        if (data.hasOwnProperty(p)) {
            array.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p] ? data[p] : ''));
        }
    }

    var xmlHttp = new XMLHttpRequest();
    if (callback) {
        xmlHttp.onload = function (e) {
            callback();
        };
        xmlHttp.onerror = function (e) {
            callback();
        };
    }

    var url = getTargetServer(serverType, locationType) + "/PathTracking/set.aspx";

    xmlHttp.open("POST", url, true);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(array.join("&") + "&date=" + (new Date()).getTime());
    xmlHttp.onreadystatechange = function () {

    };

    var callbackApi = function (url, err) {
        var data = {
            ExceptionTitle: "[Application] : " + location.href,
            SummaryMessage: "[Path Tracking] data file create error",
            Detail: "\n\n* [Error path] : /PathTracking/set.aspx\n-> 영업 홈페이지(ECWWW 솔루션 > PathTracking 프로젝트)\n상세 Exception 내용은 에러가 발생한 홈페이지(로그 Title 참조)로 접속하여 /PathTracking/set.aspx 가 호출될 때 Http 응답결과 확인!\n* [Status] : " + err + "\n"
        }; 

        xmlHttpApi = new XMLHttpRequest();
        xmlHttpApi.open("POST", url, true);
        xmlHttpApi.setRequestHeader('Content-type', 'application/json');
        xmlHttpApi.send(JSON.stringify(data));
    };
}

SendTrackingData();

if (window.PathTrackingTimeInterval) {
    clearInterval(window.PathTrackingTimeInterval);
}

window.PathTrackingTimeInterval = setInterval(function () {
    SendTrackingData('#TIME');
}, 30000);