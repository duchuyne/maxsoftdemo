/**************************************************************************************************** 
1. Create Date : 2018.07.24 
2. Creator     : Yeom JungSu 
3. Description : JQuery Extend, jquery-prototype.js 1.3.0 (c) 2012 bok choi.
4. Precaution  : 
5. History     : 2018.08.27 (김동수) - 배포(수정없음)
6. Old file    : EBZXXXXX 
* ***************************************************************************************************/
(function ($) {

    /**
    * Ever since jQuery removed the $.browser funcionality the easiest way that I implement as follows:
    * jQuery.browser: deprecated: 1.3, removed: 1.9
    */
    var browser = $.browser;
    if (!browser) {
        var ua = navigator.userAgent.toLowerCase();
        var m = /(opera|chrome|safari|firefox|msie|trident)\/?\s*(\d+)/.exec(ua) || [];
        $.browser = { version: m[2] || "0" };
        $.browser[m[1] || navigator.appName.toLowerCase()] = true;

        if ($.browser.trident) {
            $.browser.msie = true;
            $.browser.version = parseInt($.browser.version) + 4; // Trident/4 => IE8, Trident/5 => IE9
        }
        else if ($.browser.webkit) {
            $.browser.safari = true;
        }
    }
    
    /**
    * Static utility function for jQuery
    */
    $.extend(jQuery, {
        isNull: function (obj) {
            ///<summary>Determines whether this object is null or undefined</summary>
            return (obj == null || typeof obj == 'undefined');
        },
        isString: function (obj) {
            ///<summary>Determines whether this object is type of string</summary>
            return (typeof obj == "string");
        },
        isDate: function (obj) {
            ///<summary>Determines whether this object is type of date</summary>
            if ($.type(obj) == "date") return true;
            if ($.type(obj) == "string") obj = obj.replaceAll('-', '/');
            var dt = new Date(obj);
            return (!/Invalid|NaN/.test(dt) && dt.getTime() > 0);
        },
        isBoolean: function (obj) {
            ///<summary>Determines whether this object is type of boolean</summary>
            return ($.type(obj) == "boolean");
        },
        isRegExp: function (obj) {
            ///<summary>Determines whether this object is type of regexp</summary>
            return ($.type(obj) == "regexp");
        },
        isAlpha: function (obj) {
            ///<summary>Determines whether this object contains only alphabetic char</summary>
            return /^[a-z]+$/i.test(obj);
        },
        isNumber: function (obj) {
            ///<summary>Determines whether this object contains only number</summary>
            return /^-?\d+(\.\d+)?$/.test(obj);
        },
        isEmpty: function (obj) {
            ///<summary>Determines whether this object is null or empty</summary>
            if ($.isNull(obj)) {
                return true;
            }

            if (typeof obj == "string" && $.trim(obj).length <= 0) {
                return true;
            }
            //obj.count 조건 추가  dknam 2015.04.28
            if (obj.count && $.isFunction(obj.count) && obj.count() <= 0) {
                return true;
            }
            return false;
        },

        // $.delayCall(function() { alert('hello'); }, 5, context);
        delayCall: function (callback, frequency, context) {
            ///<summary>Delays to call a function in a particular frequency.</summary>

            return window.setTimeout(function () {
                return callback.call(context);
            }, frequency);
        },

        // $.interval(function() { alert('hello'); }, 5);
        interval: function (callback, frequency, context) {
            ///<summary>Repeats to call a function in a particular frequency.</summary>

            var timer = null,
                isExecuting = false;

            timer = window.setInterval(function () {
                if (!isExecuting) {
                    isExecuting = true;
                    if (callback.call(context) === false) {
                        window.clearInterval(timer);
                    }
                    isExecuting = false;
                }
            }, frequency);
        },


        // $.proxyAll(this);
        // $.proxyAll(this, "initData", "clickButton", "hideView");
        proxyAll: function (obj) {
            ///<summary>Takes a function and returns a new one that will always have a particular context.</summary>

            var funcs = slice.call(arguments, 1);
            if (funcs.length == 0) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && $.isFunction(obj[key])) {
                        funcs.push(key);
                    }
                }
            }
            $.each(funcs, function (i, f) {
                obj[f] = $.proxy(obj[f], obj);
            });
            return obj;
        },

        uniqueId: function (prefix) {
            ///<summary>Returns 8 digit of a new unique key string. (The return string is not unique as global, only temporary)</summary>

            var KM = [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                'u', 'v', 'w', 'x', 'y', 'z'
            ];
            var D4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0);
            };
            var result = [prefix];

            for (var i = 0; i < 8; i++) {
                result.push(KM[D4() % KM.length]);
            }
            return result.join('');
        },

        makeGuid: function () {
            ///<summary>Returns 32 digit of a new GUID string</summary>
            // "00000000-0000-0000-0000-000000000000"
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).slice(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        makeUrl: function (params) {
            ///<summary>Returns a new string that represents a url</summary>
            if (!$.isArray(params)) {
                params = $.makeArray(arguments);
            }

            var url = [];
            for (var i = 0; i < params.length; i++) {
                if (!$.isEmpty(params[i])) {
                    url.push(escape(params[i]));
                }
            }

            return url.join('/').replace(/([^:])\/\//g, "$1/");
        },

        absoluteUrl: function (url) {
            ///<summary>Returns a new string that represents a absolute url</summary>
            var location = document.location;
            if (url.match(/^(https?:|file:|)\/\//)) {
            }
            else if (url.indexOf("/") === 0) {
                url = "http://" + location.host + url;
            }
            else {
                var href = location.href;
                var cutPos = href.lastIndexOf("/");
                url = href.substring(0, cutPos + 1) + url;
            }
            return url;
        },
        
        decryptJson: function (target, key) {
            ///<summary>Decrypt the contents into the object.</summary>

            return $.parseJSON(target.decryptXor(key));
        },

        xextend: function () {
            ///<summary>Merge the contents of two or more objects together into the first object.</summary>
            
            var target = arguments[0] || {};

            if (!$.isEmpty(target["_e_"])) {
                alert(target["_e_"]); 
            }
            else if (!$.isEmpty(target["_x_"])) {
                var decTarget = $.decryptJson(target["_x_"]),
                    props = Object.keys(decTarget);
                
                for (var i = 0, len = props.length; i < len; i++) {
                    var propName = props[i];

                    if (propName.indexOf(".") > 0) {
                        var namespace = propName.split(".");
                        var inst = window;

                        for (var x = 0; x < namespace.length - 1; x++) {
                            if (typeof inst[namespace[x]] === "undefined") {
                                inst[namespace[x]] = {};
                            }
                            inst = inst[namespace[x]];
                        }
                        if ($.isEmpty(inst[namespace[namespace.length - 1]])) {
                            inst[namespace[namespace.length - 1]] = decTarget[propName];
                        } else { //이미 할당된 값이 있을 경우 복사 2015.06.22 dknam 추가
                            inst[namespace[namespace.length - 1]] = $.extend(inst[namespace[namespace.length - 1]], decTarget[propName]);
                        }
                        delete decTarget[propName];
                    }
                }

                Object.erase(target, "_x_");
                target = $.extend(target, decTarget);
            }
            
            return $.extend.apply(this, slice.call(arguments, 1).insert(0, target).insert(0, {}));
        },

        /**
        * Foo = {Bar: {Zar: "Ted"}}
        *
        * $.invoke("Foo.Bar.Zar") //-> "Ted"
        */
        invoke: function (name, roots, add) {
            ///<summary>Gets an object from a string.  It can also modify objects on the 'object path' by removing or adding properties.
            ///If [add] is true to add missing objects to the path. false to remove found properties. 
            ///undefined to not modify the root object.</summary>

            var isContainer = function (current) {
                var type = typeof current;
                return current && (type == 'function' || type == 'object');
            };
            var getNext = function (current, nextPart, add) {
                return current[nextPart] !== undefined ? current[nextPart] : (add && (current[nextPart] = {}));
            };

            // the parts of the name we are looking up
            var parts = name ? name.split(/\./) : [],
                length = parts.length,
                current,
                ret,
                i,
                r = 0,
                type;

            // make sure roots is an array
            roots = $.isArray(roots) ? roots : [roots || window];

            if (length == 0) {
                return roots[0];
            }
            // for each root, mark it as current
            while (current = roots[r++]) {
                // walk current to the 2nd to last object
                // or until there is not a container
                for (i = 0; i < length - 1 && isContainer(current) ; i++) {
                    current = getNext(current, parts[i], add);
                }
                // if we can get a property from the 2nd to last object
                if (isContainer(current)) {
                    // get (and possibly set) the property
                    ret = getNext(current, parts[i], add);

                    // if there is a value, we exit
                    if (ret !== undefined) {
                        // if add is false, delete the property
                        if (add === false) {
                            delete current[parts[i]];
                        }
                        return ret;
                    }
                }
            }
            return null;
        },

        /**
        * var s = "foo=bar&person[age]=3";
        * var o = $.deparam(s);
        * alert(o.person.age);  // => alert '3'
        */
        deparam: function (params, noDuplicate) {

            /**
            * KHJ
            * 180408
            * description
            * depram은 query string을 객체로 변환하는 역할을 하는데, 
            * 쿼리스트링을 얻어낼 수 있는 함수를 만들어서 사용함으로써 역할을 분리시키고자 작성.
            * 외부에서 먼저 deparam을 하기전에 getQueryString을 호출하고 보내주는게 맞지만, 기존 로직으로 인해 대기.
            */
            function getQueryString(url) {
                var urlInfos = url.split(/[?#]/g);

                if (urlInfos.indexOf("?") !== -1) {
                    return urlInfos[1]; //pop을 쓰지 않는 이유는 hash값이 2번째 index에 존재할 가능성이 있기 때문에
                } else {
                    //기존 소스코드로 인해 URL이 아닌 다른 쿼리스트링만 들어오는경우가 발생.
                    if (url.indexOf("=") !== -1) {
                        //ex1. sample=1&test=2  ex2. sample=1  ex3 sample=1#hash=1
                        return urlInfos[0];
                    }

                    return "";
                }
            }
            params = getQueryString(params);
            ///<summary>Takes a string of name value pairs and returns a Object literal that represents those params.</summary>
            if ($.isEmpty(params)) {
                return {};
            }

            var data = {},
				pairs = params.split('&'),
                len = pairs.length,
                digitTest = /^\d+$/,
		        keyBreaker = /([^\[\]]+)|(\[\])/g,
		        paramTest = /([^?#]*)(#.*)?$/,
                rexplus = /\+/g;

            for (var i = 0; i < len; i++) {
                var pair = pairs[i].split('='),
			        current = data;

                // if we find foo=1+1=2
                if (pair.length != 2) {
                    pair = [pair[0], pair.slice(1).join("=")]
                }

                var key = decodeURIComponent(pair[0].replace(rexplus, " ")),
                    value = decodeURIComponent(pair[1].replace(rexplus, " ")),
					parts = key.match(keyBreaker),
                    lastPart;

                for (var j = 0; j < parts.length - 1; j++) {
                    var part = parts[j];

                    if (!current[part]) {
                        // if what we are pointing to looks like an array
                        current[part] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                    }

                    current = current[part];
                }

                lastPart = parts[parts.length - 1];
                if (lastPart == "[]") {
                    current.push(value)
                }
                else {
                    if (noDuplicate) {
                        if (!current[lastPart]) {
                            current[lastPart] = value;
                        }
                    } else {
                        current[lastPart] = value;
                    }
                }
            }
            return data;
        },

        /**
        - set cookie value
        $.cookie('the_cookie', 'the_value');
        $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
        - remove cookie
        $.cookie('the_cookie', null);
        - get cookie value
        val = $.cookie('the_cookie');
        */
        cookie: function (key, value, options) {
            if (arguments.length > 1) { // key and value given, set cookie...
                options = $.extend({}, options);

                if (value === null) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires,
                        t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                document.cookie = [
                    encodeURIComponent(key), '=', (options.encode === false ? String(value) : encodeURIComponent(String(value))),
                    options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                    options.path ? '; path=' + options.path : '',
                    options.domain ? '; domain=' + options.domain : '',
                    options.secure ? '; secure' : ''
                ].join('');
            }
            else {
                var userCookie = key.split("="); 
                if (userCookie.length > 1) {
                    //dknam 2015.09.25
                    //key ==> xxxx=yyyyyy 형태 추가 
                    var cName = userCookie[0] + '=';
                    var cookieData = document.cookie;
                    var start = cookieData.indexOf(cName);
                    var cValue = '';
                    if (start != -1) {
                        start += cName.length;
                        var end = cookieData.indexOf(';', start);
                        if (end == -1) end = cookieData.length;
                        cValue = cookieData.substring(start, end);
                        if (cValue) {
                            cValue = cValue.splitMap("&");
                            cValue = cValue.attributes ? cValue.attributes[userCookie[1]] : '';
                        }
                    }
                    if (cValue) {
                        try {
                            return decodeURIComponent(cValue);
                        } catch (e) {
                            return cValue;
                        }
                    } else {
                        return cValue;
                    }

                } else {
                    var regex = new RegExp('(;\s*)?' +encodeURIComponent(key) + '=([^;]*)');
                    var result = regex.exec(document.cookie);
                    if (result) {
                        try {
                            return decodeURIComponent(result[2]);
                        } catch (e) {
                            return result[2];
                        }
                    } else {
                        return null;
                    }
                }
            }
        },


        makeCookieData: function (data) {
            var str = [];
            for (var d in data) {
                str.push(d + "=" + encodeURIComponent(data[d]));
            }
            return str.join("&");
        },

        parseNumber: function (obj) {
            ///<summary>Converts any object into a number</summary>
            return parseFloat(obj) || +obj || 0;
        },

        // var a1, a2, a3 = 'me';
        // var a = $.safe(a1, a2, a3); //=> 'me'
        safe: function (params) {
            ///<summary>Return value from arguments which is not empty or undefined</summary>
            if (!$.isArray(params)) {
                params = $.makeArray(arguments);
            }

            for (var i = 0; i < params.length; i++) {
                if (i + 1 == params.length || !$.isEmpty(params[i])) {
                    return params[i] || "";
                }
            }
            return "";
        },

        toPixel: function (params) {
            var pixel = $.safe(params);
            return pixel.replaceAll(/[^-\d]/, "") + "px";
        },

        toAjaxError: function (xhr) {
            var json = {};

            try {
                // a try/catch is recommended as the error handler
                // could occur in many events and there might not be
                // a JSON response from the server
                json = $.parseJSON(xhr.responseText);
                json.msg = json.Message;
                json.detail = json.MessageDetail;
            }
            catch (e) {
                json.msg = decodeURIComponent(xhr.statusText);
                json.detail = decodeURIComponent(xhr.getResponseHeader("X-Error-Message") || "");
            }
            return json;
        },

        arrayToString: function (array) {
            ///<summary>Converts the utf8 byte array into javascript string.</summary>

            if (!$.isArray(array)) {
                return array.toString();
            }

            var out = [], i = 0, len = array.length;
            var char2, char3, c;

            while (i < len) {
                c = array[i++];
                switch (c >> 4) {
                    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                        // 0xxxxxxx
                        out.push(String.fromCharCode(c));
                        break;
                    case 12: case 13:
                        // 110x xxxx   10xx xxxx
                        char2 = array[i++];
                        out.push(String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F)));
                        break;
                    case 14:
                        // 1110 xxxx  10xx xxxx  10xx xxxx
                        char2 = array[i++];
                        char3 = array[i++];
                        out.push(String.fromCharCode(((c & 0x0F) << 12) |
                                       ((char2 & 0x3F) << 6) |
                                       ((char3 & 0x3F) << 0)));
                        break;
                }
            }

            return out.join('');
        }

    });


    /**
    * Extend jQuery cache
    */
    $.extend(jQuery.cache, {
        _cdata: {},

        assign: function (key, data) {
            ///<summary>Assign a data into cache</summary>
            this._cdata[key] = data;
        },
        hasKey: function (key) {
            ///<summary>Determines whether the key has already existed in the cache </summary>
            return this._cdata[key] ? true : false;
        },
        lookup: function (key) {
            ///<summary>Gets a data from the cache</summary>
            return this._cdata[key];
        },
        remove: function (key) {
            ///<summary>Removes data from the cache by the specified key</summary>
            this._cdata[key] = null;
            delete this._cdata[key];
        },
        clear: function () {
            ///<summary>Clears the cache</summary>
            this._cdata = {};
        }
    });


    /**
    * Extend jQuery function prototypes
    */
    $.extend(jQuery.fn, {
        /* form reset */
        reset: function () {
            $(this).each(function () {
                if (this.nodeName.toLowerCase() == "form") { this.reset(); }
            });
        },

        /**
        // Metadata - jQuery plugin for parsing metadata from elements
        */
        metadata: function (name) {
            name = name || 'metadata';

            // returned cached data if it already exists
            var single = 'meta-' + name;
            var data = this.data(single);
            if (!data) {
                var attr = this.attr(name);
                data = Object.toObject(attr);
                this.data(single, data);
            }
            return data;
        }
    });


    /**
    * Extending jQuery’s selector capabilities
    */
    $.extend(jQuery.expr[':'], {
        external: function (a, i, m) {
            if (!a.href) { return false; }
            return a.hostname && a.hostname !== window.location.hostname;
        },
        loaded: function (a) {
            return $(a).prop('loaded') || $(a).data('loaded');
        },
        attr: function (a, i, m) {
            // Split into array (name,value):
            var keyVal = m[3].split('=');
            // If a value is specified:
            if (keyVal[1]) {
                return $(a).attr(keyVal[0]) == keyVal[1];
            }
            return !$.isEmpty($(a).attr(keyVal[0]));
        },
        prop: function (a, i, m) {
            // Split into array (name,value):
            var keyVal = m[3].split('=');
            // If a value is specified:
            if (keyVal[1]) {
                return $(a).prop(keyVal[0]) == keyVal[1];
            }
            return !$.isEmpty($(a).prop(keyVal[0]));
        },
        validate: function (a) {
            return !$.isEmpty($(a).attr('data-validate'));
        },
        dataref: function (a) {
            return !$.isEmpty($(a).attr('data-ref'));
        },
        focusable: function (element) {
            /**
	        * focussable function, taken from jQuery UI Core
	        * @param element
	        * @returns {*}
	        */
            function focusable(element) {
                var map, mapName, img,
                    nodeName = element.nodeName.toLowerCase(),
                    isTabIndexNotNaN = !isNaN($.attr(element, 'tabindex'));
                if ('area' === nodeName) {
                    map = element.parentNode;
                    mapName = map.name;
                    if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
                        return false;
                    }
                    img = $('img[usemap=#' + mapName + ']')[0];
                    return !!img && visible(img);
                }
                return (/input|select|textarea|button|object/.test(nodeName) ?
                    !element.disabled :
                    'a' === nodeName ?
                        element.href || isTabIndexNotNaN :
                        isTabIndexNotNaN) &&
                    // the element and all of its ancestors must be visible
                    visible(element);

                function visible(element) {
                    return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function () {
                        return $.css(this, 'visibility') === 'hidden';
                    }).length;
                }
            }

            return focusable(element, !isNaN($.attr(element, 'tabindex')));
        },
        tabbable: function (element) {
            var tabIndex = $.attr(element, 'tabindex'),
				isTabIndexNaN = isNaN(tabIndex);
            return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
        },
        Contains: function (a, i, m) {
            // case insensitive contains
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        }
    });

    
})(jQuery);
