// jquery-prototype.js 1.3.0
// (c) 2012 bok choi. 

/**************************************************************************************************** 
1. Create Date : 2019.01.11
2. Creator     : Hong Gil Dong 
3. Description : string 암복호화 
4. Precaution  : 
5. History     : 
6. Old file    : EBZXXXXX 
* ***************************************************************************************************/

(function ($) {
    var DecimalConstructor = null;
    /**
    * Static function for String object
    */
    $.extend(String, {
        /**        
        * String.format("{0} is {1:MM/dd/yyyy}", time(), new Date());
        */
        format: function () {
            ///<summary>Replaces the format item in a specified string with the string representation of a corresponding object in a specified array</summary>

            //the first argument is the composite string 
            var rexPos = /{(\d+)}|{(\d+):([^}]+)}/,
                args = arguments;
            input = args[0];

            return input.replaceAll(rexPos, function (match) {
                var replacement = null;

                // if has format string
                if (match[2] && match[3]) {
                    replacement = args[parseInt(match[2]) + 1];

                    if (replacement.format) { // if object has prototype of format
                        replacement = replacement.format(match[3]);
                    }
                    else {
                        if ($.isDate(replacement)) {
                            replacement = Date.prototype.format.call(new Date(replacement), match[3]);
                        }
                        else if ($.isNumeric(replacement)) {
                            replacement = Number.prototype.format.call($.parseNumber(replacement), match[3]);
                        }
                        else {
                            replacement = Object.format(match[3], replacement);
                        }
                    }
                }
                else {
                    //type conversion is necessary 
                    replacement = '' + args[parseInt(match[1]) + 1];
                }

                return replacement;
            });
        },
        fastFormat: function (value, option) {
            option = option || {};
            option.removeFractionIfZero = option.removeFractionIfZero || false;
            option.fractionLimit = $.isEmpty(option.fractionLimit) ? 2 : option.fractionLimit;
            option.currencyComma = $.isEmpty(option.currencyComma) ? 3 : option.currencyComma;
            option.currencyCommaSeparator = option.currencySeparator || maxsoft.config.company.THOU_SEPARATOR || ',';
            option.fractionSeparator = option.fractionSeparator || maxsoft.config.company.DEC_SEPARATOR || '.';
            option.fractionFixFormat = (option.fractionFixFormat || 'round').toLowerCase();
            switch (option.fractionFixFormat.substring(0, 1)) {
                case 'r': option.fractionFixFormat = Decimal.ROUND_HALF_UP; break;
                case 'f': option.fractionFixFormat = Decimal.ROUND_FLOOR; break;
                case 'c': option.fractionFixFormat = Decimal.ROUND_CEIL; break;
                default: option.fractionFixFormat = Decimal.ROUND_HALF_UP; break;
            }

            //var CustomDecimal = Decimal.constructor({
            //    rounding: option.fractionFixFormat,
            //    format: {
            //        decimalSeparator: option.fractionSeparator,
            //        groupSeparator: option.currencyCommaSeparator,
            //        groupSize: option.currencyComma
            //    }
            //});
            if (!DecimalConstructor) {
                DecimalConstructor = Decimal.constructor();
            }

            DecimalConstructor.config({
                rounding: option.fractionFixFormat,
                format: {
                    decimalSeparator: option.fractionSeparator,
                    groupSeparator: option.currencyCommaSeparator,
                    groupSize: option.currencyComma
                }
            });

            var decimalResult = new DecimalConstructor(value).toDP(option.fractionLimit).toFormat(option.removeFractionIfZero ? null : option.fractionLimit);
            if (option.showValueZero === false) {
                var _value = decimalResult.split(option.fractionSeparator);
                _value[0] = _value[0].replace(new RegExp("\\" + option.currencyCommaSeparator, "g"), "");
                if (Number(_value.join(".")) == 0) {
                    decimalResult = "";
                }
            }
            return decimalResult;
        },
        interpret: function (value) {
            ///<summary>Returns a safe string to write</summary>
            return $.isNull(value) ? '' : ('' + value);
        },
        padding: function (count, padchar) {
            ///<summary>Returns a length of repeated string with padchar</summary>
            return count < 1 ? '' : new Array(count + 1).join(padchar || ' ');
        },
        escapeRegExp: /[-[\]{}()+?.,\\^$|#\s]/g,
        specialChars: {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '\\': '\\\\'
        }
    });

    /**
    * Extend String prototype
    */
    $.extend(String.prototype, {
        escapeRegExp: function () {
            return this.replace(String.escapeRegExp, "\\$&");
        },

        trim: function (regx) {
            ///<summary>Removes all leading and trailing white-space characters from the current string</summary>
            regx = regx || /^\s+|\s+$/g;
            if ($.isString(regx)) {
                regx = regx.escapeRegExp();
                regx = new RegExp("^" + regx + "|" + regx + "$", "g");
            }
            return this.replace(regx, '');
        },
        trimLeft: function (regx) {
            ///<summary>removes whitespace from the left end of the string</summary>
            regx = regx || /^\s+/g;
            if ($.isString(regx)) {
                regx = regx.escapeRegExp();
                regx = new RegExp("^" + regx, "g");
            }
            return this.replace(regx, '');
        },
        trimRight: function (regx) {
            ///<summary>removes whitespace from the right end of the string</summary>
            regx = regx || /\s+$/g;
            if ($.isString(regx)) {
                regx = regx.escapeRegExp();
                regx = new RegExp(regx + "$", "g");
            }
            return this.replace(regx, '');
        },
        trimSpace: function () {
            return this.trim().replace(/\s{2,}/ig, " ");
        },

        trimHtml: function () {
            ///<summary>Trims all the html tags and return only text. It's similar to stripTags, but it also strips content of script or style block.</summary>
            return this.replace(/(&nbsp;|&amp;|<(script|style)[^>]*>([\S\s]*?)<\/(script|style)>|<\/?([^>]+)?>)/gi, function (match) {
                if (match == "&nbsp;") {
                    return " ";
                }
                else if (match == "&amp;") {
                    return "&";
                }
                else if (match.startsWith("<br", true)) {
                    return "\r\n";
                }
                return "";
            });
        },

        trimWhiteSpaces: function () {
            ///<summary>Replace combinations of spaces(spaces, tabs, form feeds), carrige returns and line feeds into one space.</summary>
            return this.trim().replace(/[\s]+/ig, ' ');
        },
        removeMetaTags: function () {
            ///<summary>Remove meta tags and its contents.</summary>
            return this.replace(/<meta[^>]*>/ig, ' ');
        },
        ////소수점 뒤 0제거 
        //// 이거 separator 제거해도 될듯.
        //decimalRTrim: function (separator) {
        //    separator = separator || ".";
        //    var value = this.valueOf();
        //    var val = value.split(separator);
        //    var invalidValue = val[1] == "" ? false : true;   // . 입력시(keycode  190) => 232. 형태

        //    if (val.length > 1) {
        //        val[1] = val[1].replace(/0*$/g, "");    //소수부 뒤에 있는 0 제거
        //        return (invalidValue && value != val.join(separator) && val[1] == "") ? val[0] : val.join(separator);   //변경된 내용이 있으면
        //    } else {
        //        return this;
        //    }
        //},

        //소수점 뒤 0제거 
        decimalRTrim: function () {
            var value = this.valueOf();
            var val = value.split(".");
            var invalidValue = val[1] == "" ? false : true;   // . 입력시(keycode  190) => 232. 형태

            if (val.length > 1) {
                val[1] = val[1].replace(/0*$/g, "");    //소수부 뒤에 있는 0 제거
                return (invalidValue && value != val.join(".") && val[1] == "") ? val[0] : val.join(".");   //변경된 내용이 있으면
            } else {
                return this;
            }
        },

        reverse: function () {
            ///<summary>Returns a reversed string</summary>
            return this.split("").reverse().join("");
        },

        /**
        * var s = "mfcpro@gmail.com";
        * s = s.left('@');  //=> "mfcpro"
        * s = s.left(3); //=> "mfc"
        */
        left: function (len, includeSeparator, ensureNotEmpty) {
            ///<summary>Returns the first few characters of the string with a length specified by the given parameter.</summary>
            if ($.isString(len)) {
                len = this.indexOf(len);
                if (len == -1) {
                    return ensureNotEmpty ? this : "";
                }
            }
            if (len < 0) {
                len = Math.Max(this.length + len, 0);
            }
            if (this.length > len) {
                return this.substring(0, len + (includeSeparator ? 1 : 0));
            }
            return this;
        },

        /**
        * var s = "mfcpro@gmail.com";
        * s = s.right('@');  //=> "gmail.com"
        * s = s.right(3); //=> "com"
        */
        right: function (len, includeSeparator, ensureNotEmpty) {
            ///<summary>Returns the last few characters of the string with a length specified by the given parameter.</summary>
            if ($.isString(len)) {
                len = this.indexOf(len);
                if (len == -1) {
                    return ensureNotEmpty ? this : "";
                }
            }
            if (len < 0) {
                len = Math.Max(this.length + len, 0);
            }
            if (this.length > len) {
                return this.substring(len + (includeSeparator ? 0 : 1));
            }
            return this;
        },

        /**
        *  alert("Chris West".indexOfAny("s", "ri")); ==> // Return: 2
        */
        indexOfAny: function (anyOf) {
            ///<summary>Reports the index of the first occurrence in this instance of any character in a specified array of characters</summary>

            for (var i = 0, len = arguments.length; i < len; i++) {
                var index = this.indexOf(arguments[i]);
                if (index != -1)
                    return index;
            }
            return -1;
        },

        /**
        *  alert("Chris West".lastIndexOfAny("s", "ri")); ==> // Return: 8
        */
        lastIndexOfAny: function (anyOf) {
            ///<summary>Reports the index position of the last occurrence in this instance of any character in a specified array of characters</summary>

            for (var i = 0, len = arguments.length; i < len; i++) {
                var index = this.lastIndexOf(arguments[i]);
                if (index != -1)
                    return index;
            }
            return -1;
        },

        /**
        * alert("Chris".find("hr", true)); //=> 1
        */
        find: function (pattern, ignoreCase) {
            ///<summary>Reports the index of the first occurrence of the specified string in this instance</summary>

            if ($.isString(pattern)) {
                pattern = new RegExp(pattern.escapeRegExp(), ignoreCase ? "i" : null);
            }
            return this.search(pattern);
        },

        /**
        * alert("Chris".contains("hr")); //=> true
        */
        contains: function (pattern, ignoreCase) {
            ///<summary>Determines whether the specified string in this string</summary>

            return this.find(pattern, ignoreCase) >= 0;
        },

        /**
        * alert("Chris".equals("chris")); //=> false
        * alert("Chris".equals("chris", true)); //=> true
        */
        equals: function (str, ignoreCase) {
            ///<summary>Determines whether this instance and another specified string object have the same value</summary>
            return (ignoreCase ? this.toLowerCase() : this) == (ignoreCase ? str.toLowerCase() : str);
        },

        /**
        * alert("Chris".startsWith("Ch")); //=> true
        */
        startsWith: function (str, position, ignoreCase) {
            ///<summary>Determines whether the beginning of this string instance matches the specified string</summary>
            if ($.isNull(position)) {
                position = 0;
            }
            else if ($.isBoolean(position)) {
                ignoreCase = position;
                position = 0;
            }

            var d = this.substring(position, str.length);
            return d.equals(str, ignoreCase);
        },

        /**
        * alert("Chris".endsWith("is")); //=> true
        */
        endsWith: function (str, ignoreCase) {
            ///<summary>Determines whether the end of this string instance matches the specified string</summary>
            var d = this.substring(this.length - str.length);
            return d.equals(str, ignoreCase);
        },

        padLeft: function (maxsize, padchar) {
            ///<summary>Returns a new string that right-aligns the characters in this instance by padding them with spaces on the left, for a specified total length</summary>
            return String.padding(Math.max(0, maxsize - this.length), padchar) + this;
        },

        padRight: function (maxsize, padchar) {
            ///<summary>Returns a new string that left-aligns the characters in this string by padding them with spaces on the right, for a specified total length</summary>
            return this + String.padding(Math.max(0, maxsize - this.length), padchar);
        },

        mask: function (maskChar, numExposed) {
            ///<summary>Returns a new masked string to protect account numbers or other personal data).</summary>
            var exposed = this.right(numExposed);
            var masked = this.left(-numExposed).replace(/[a-zA-Z\d]/g, maskChar);

            return masked + exposed;
        },

        capitalize: function () {
            ///<summary>Returns a capitalized string</summary>
            return this.replace(/\w+/g, function (a) {
                return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
            });
        },

        /**
        * "one_two".camelize() //-> "oneTwo"
        */
        camelize: function () {
            ///<summary>Returns a camelized string</summary>
            var s = this.capitalize().replace(/[_\-\s]/g, "");
            return s.charAt(0).toLowerCase() + s.slice(1);
        },

        ecCapitalize: function (strict) {
            ///<summary>Returns a capitalized string</summary>
            return this.replace(/[^\s_\-]+/g, function (a) {
                return a.charAt(0).toUpperCase() + (strict ? a.slice(1) : a.slice(1).toLowerCase());
            });
        },

        /**
        * "one_two".ecCamelize() //-> "oneTwo"
        */
        ecCamelize: function (strict) {
            ///<summary>Returns a camelized string</summary>
            var s = this.ecCapitalize(strict).replace(/[_\-\s]/g, "");
            return s.charAt(0).toLowerCase() + s.slice(1);
        },

        /**
        * "one_two.three".classize() //-> "OneTwoThree"
        */
        ecClassize: function (join) {
            ///<summary>Returns a classized string. Like [camelize], but the first part is also capitalized</summary>
            return this.ecCapitalize().replace(/[_\-\s\.]/g, "");
        },


        /**
        * "one_two.three".classize() //-> "OneTwoThree"
        */
        classize: function (join) {
            ///<summary>Returns a classized string. Like [camelize], but the first part is also capitalized</summary>
            return this.capitalize().replace(/[_\-\s\.]/g, "");
        },


        /**
        * 'Some random text'.truncate();   //=> 'Some random text'
        * 'Some random text'.truncate(10); //=> 'Some ra...'
        */
        truncate: function (length, truncation) {
            ///<summary>Returns a truncated a string to given length and appends suffix to it</summary>

            length = length || 30;
            truncation = $.isNull(truncation) ? '...' : truncation;

            return (this.length > length) ? this.slice(0, length - truncation.length) + truncation : ('' + this);
        },

        /**
        var path = "D:\My Resource\javascript\jquery-easyui-1.2.5";
        path.ellipsis(20); ==> 'D:\My Resource\java...easyui-1.2.5'
        */
        ellipsis: function (limit) {
            ///<summary>Returns a ellipsised string</summary>

            var result = this,
                limit = limit || 80;

            if (this.length > limit) {
                var lLetters = limit / 2;
                var rLetters = this.length - (limit / 2 - 3);

                result = this.slice(0, lLetters) + '...' + this.slice(rLetters);
            }

            return result;
        },

        _getRegexForTag: function (tag, contents) {
            var regstr = contents ? "<" + tag + "(?!\w)[^>]*>([\s\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>";
            return new RegExp(regstr, "gi");
        },

        /**
        * var html = "<b>This is a string with <i>html</i> in it.</b>"
        * html.getTags(); //=> ["<b>", "<i>", "</i>", "</b>"]
        * html.getTags('i'); //=> ["<i>", "</i>"]
        * html.getTags('i', true); //=> ["<i>html</i>"]
        */
        getTags: function (tag, contents) {
            ///<summary>Get all the HTML tags array from a given string.</summary>

            return this.match(this._getRegexForTag(tag, contents)) || [];
        },

        /**
        * var html = "<b>This is a string with <i>html</i> in it.</b>"
        * html.stripTags(); //=> "This is a string with html in it."
        * html.stripTags('i'); //=> "<b>This is a string with html in it.</b>"
        * html.stripTags('i', true); //=> "<b>This is a string with  in it.</b>"
        */
        stripTags: function (tag, contents) {
            ///<summary>Strips a string of any HTML tags.</summary>

            return this.replace(this._getRegexForTag(tag, contents), '');
        },

        /**
        * var html = "<p>This is a test.<script>alert("Look, a test!");</script>End of test</p>";
        * html.stripScripts(); //=> "<p>This is a test.End of test</p>"
        */
        stripScripts: function (scriptPattern) {
            ///<summary>Strips a string of things that look like an HTML script blocks</summary>

            return this.replace(scriptPattern || /<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        },

        tidy: function () {
            ///<summary>Replaces common special characters with their ASCII counterparts (smart quotes, ellipse characters, stuff from MS Word, etc.)</summary>

            var result = this,
                replacements = {
                    ' ': /[\xa0\u00A0\u2002\u2003\u2009]/g,
                    '*': /[\xb7]/g,
                    '\'': /[\u2018\u2019]/g,
                    '"': /[\u201c\u201d]/g,
                    '...': /[\u2026]/g,
                    '-': /[\u2013]/g,
                    '--': /[\u2014]/g,
                    '&raquo;': /[\uFFFD]/g
                };

            for (var key in replacements) {
                result = result.replace(replacements[key], key);
            }
            return result;
        },

        /**
        var str="Hello world!";
        str.test(/hello/); //=> false (because of case senstive)
        str.test(/hello/i); //=> true
        */
        test: function (pattern) {
            ///<summary>Executes the search for a match between a regular expression and a specified string. Returns true or false.</summary>
            if ($.isString(pattern)) {
                pattern = new RegExp(pattern.escapeRegExp());
            }
            return pattern.test(this);
        },

        /**
        * var s = "The quick ${brown} fox jumped over the ${lazy} dog",
        *     data = {'brown': 'red', 'lazy': 'slow'};
        *
        * s.resolve(data); //=> 'The quick red fox jumped over the slow dog'
        * s.resolve(data, function(val) { //=> 'The quick RED fox jumped over the SLOW dog'
        *     return val.toUpperCase(); 
        * });
        */
        resolve: function (data, iterator) {
            ///<summary>Returns a formatted string by resolving object</summary>

            return Object.format(this, data, iterator);
        },

        /**
        * var mouseEvents = 'click, dblclick, mousedown, mouseup';
        *
        * mouseEvents.grep(/\w+/);  //=> ['click', 'dblclick', 'mousedown', 'mouseup']
        * mouseEvents.grep(/\w+/, function(match) {  //=> ['onclick', 'ondblclick', 'onmousedown', 'onmouseup']
        *      return 'on'+match[0];
        * });
        */
        grep: function (pattern, iterator) {
            ///<summary>Allows iterating over every occurrence of the given pattern, return new array</summary>

            var source = this,
                match = null,
                results = [];

            if ($.isString(pattern)) {
                pattern = new RegExp(pattern.escapeRegExp());
            }

            iterator = iterator || reflect;
            while (source.length > 0) {
                if (match = pattern.exec(source)) {
                    results.push(iterator(match));
                    source = source.slice(match.index + match[0].length);
                }
                else {
                    break;
                }
            }
            return results;
        },

        /**
        * var mouseEvents = 'click dblclick mousedown mouseup';
        *
        * mouseEvents.replaceAll(' ', ' on'); //=> 'click ondblclick onmousedown onmouseup'
        * mouseEvents.replaceAll(/\s+/, ', '); //=> 'click, dblclic, mousedown, mouseup'
        * mouseEvents.replaceAll(/mouse\w+/, '<a on{0}="" />'); //=> '<a onmousedown="" /><a onmouseup="" />'
        * mouseEvents.replaceAll(/mouse\w+/, function(match) { //=> '<a onmousedown="" />mousedown</a><a onmouseup="" />mouseup</a>'
        *   return '<a on' + match + '="" />' + match + '</a>'; 
        * }
        */
        replaceAll: function (pattern, replacement) {
            ///<summary>Returns the string with every occurrence of a given pattern replaced by either a regular string</summary>

            var result = [],
                source = this, match,
                iscbfunc = $.isFunction(replacement);

            if ($.isString(pattern)) {
                pattern = new RegExp(pattern.escapeRegExp());
            }

            while (source.length > 0) {
                if (match = pattern.exec(source)) {
                    if (match.index > 0) {
                        result.push(source.slice(0, match.index));
                    }

                    if (iscbfunc) {
                        result.push(String.interpret(replacement(match)));
                    }
                    else {
                        result.push(String.format.apply(null, $.merge([replacement], match)));
                    }

                    source = source.slice(match.index + match[0].length);
                }
                else {
                    result.push(source);
                    break;
                }
            }
            return result.join('');
        },

        /**
        * var s = '12345678';
        * s.chop(3); //=> ['123', '456', '78']
        * s.chop(-3); //=> ['12', '345', '678']
        */
        chop: function (slice) {
            ///<summary>Returns an array that contains chopped string with specific length</summary>

            var source = this,
                result = [],
                length = slice.abs();

            if (source.length <= length) {
                result.push(source);
            }
            else {
                // did we get a negative slice
                if (slice < 0) {
                    var remind = source.length % length;
                    if (remind > 0) {
                        result.push(source.slice(0, remind));
                        source = source.slice(remind);
                    }
                }

                while (source.length > 0) {
                    result.push(source.slice(0, length));
                    source = source.slice(length);
                }
            }
            return result;
        },

        /**
        * var s = 'ab-cd-ef';
        * s.tokenizer('-'); //=> ['ab', 'cd', 'ef']
        */
        tokenizer: function (token) {
            ///<summary>Gets a new tokenizer or an array of tokenized string</summary>

            var tokener = function (data) {
                this._data = data;
                this._len = this._data.length;
                this._pos = 0;
                this._ch = null;

                this.isEOF = function () {
                    return this.peek() == null;
                }
                this.get = function (bPeek) {
                    var c1 = this._ch;

                    if (c1 != null) {
                        if (bPeek !== true)
                            this._ch = null; // reset value                
                    }
                    else if (this._pos < this._len) {
                        c1 = this._data.charAt(this._pos);
                        if (bPeek !== true)
                            this._pos++;
                    }
                    return c1;
                };
                this.peek = function () {
                    return this.get(true);
                };
                this.eat = function (token) {
                    if (this.peek() == token) {
                        this.get();
                        return true;
                    }
                    return false;
                };
                this.put = function (ch) {
                    this._ch = ch;
                };
                this.trim = function (tokens) {
                    var c1;

                    tokens = tokens || " \t\r\n";
                    while ((c1 = this.peek()) != null) {
                        if (tokens.indexOf(c1) == -1) {
                            break;
                        }
                        this.get();
                    }
                    return this;
                };
                this.next = function (token, useBlockHandler) {
                    var c1, sb = [];

                    if (arguments.length > 1) {
                        token = Array.prototype.join.call(arguments, '');
                    }
                    while ((c1 = this.get()) != null) {
                        if (token.indexOf(c1) != -1) {
                            break;
                        }
                        else if (useBlockHandler !== false) {
                            if (c1 == '(') {
                                this.readBlock(sb, '(', ')');
                            }
                            else if (c1 == '{') {
                                this.readBlock(sb, '{', '}');
                            }
                            else if (c1 == '[') {
                                this.readBlock(sb, '[', ']');
                            }
                            else if (c1 == '\"' || c1 == '\'') {
                                this.readQuotation(sb, c1);
                            }
                            else {
                                sb.push(c1);
                            }
                        }
                        else {
                            sb.push(c1);
                        }
                    }
                    return sb.join('');
                };
                this.readBlock = function (sb, begin, end) {
                    var c1, depth = 1;

                    sb.push(begin);
                    while ((c1 = this.get()) != null) {
                        if (c1 == '\"' || c1 == '\'') {
                            c1 = this.readQuotation(sb, c1);
                        }
                        else {
                            if (c1 == begin) {
                                depth++;
                            }
                            else if (c1 == end) {
                                if (--depth <= 0) {
                                    sb.push(end);
                                    break;
                                }
                            }

                            sb.push(c1);
                        }
                    }
                    return depth;
                };
                this.readQuotation = function (sb, ch) {
                    var c1;

                    sb.push(ch);
                    while ((c1 = this.get()) != null) {
                        sb.push(c1);

                        if (c1 == '\\') {   // escape char
                            if (this.peek() == ch)
                                sb.push(this.get());
                        }
                        else if (c1 == ch) {
                            break;
                        }
                    }
                    return c1;
                };
            };

            var tok = new tokener(this);
            if (token) {
                var result = [],
                    isfunc = $.isFunction(token);

                if (arguments.length > 1) {
                    token = Array.prototype.join.call(arguments, '');
                }

                while (!tok.isEOF()) {
                    result.push(isfunc ? token.call(tok) : tok.next(token));
                }
                return result;
            }
            return tok;
        },

        splitSet: function (separator) {
            var hash = new $.HashSet(),
                splits;

            if (arguments.length > 1 || separator.length == 1) {
                splits = this.tokenizer.apply(this, arguments);
            }
            else {
                splits = this.split(separator);
            }

            splits.forEach(function (value) {
                value = decodeURI(value).trim();
                if (value.length > 0)
                    hash.set(value);
            });
            return hash;
        },

        splitMap: function (separator) {
            var hash = new $.HashMap(),
                splits;

            if (arguments.length > 1 || separator.length == 1) {
                splits = this.tokenizer.apply(this, arguments);
            }
            else {
                splits = this.split(separator);
            }

            splits.forEach(function (item) {
                try {
                    var n = item.IndexOf('=');  //IndexOf  ??
                } catch (e) {
                    var n = item.indexOf('=');
                }

                if (n != -1) {
                    var name = decodeURI(item.substring(0, n));
                    var value = decodeURI(item.substring(n + 1));

                    hash.set(name.trim(), value.trim());
                }
            });
            return hash;
        },

        escapeRegExp: function () {
            ///<summary>Escapes Regular expression string</summary>

            return this.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
        },

        escapeHTML: function (excludeWhitespace) {
            ///<summary>Escapes HTML string</summary>
            return this.replace(/(\s|\u00A0|\t|&|"|'|<|>)/g, function (match) {
                if (match == '&') {
                    return '&amp;';
                }
                else if (match == '\t') {
                    return '&nbsp;&nbsp;&nbsp;&nbsp;';
                }
                else if (match == '"') {
                    return '&quot;';
                }
                else if (match == "'") {
                    return '&#39;';
                }
                else if (match == '<') {
                    return '&lt;';
                }
                else if (match == '>') {
                    return '&gt;';
                }
                return excludeWhitespace ? match : '&nbsp;';
            });
        },

        /*
       * 문자열을 정해진 바이트수 만큼으로 자름
       */
        subStringBytes: function (byte) {
            var str = this,
                count = 0;
            for (var i = 0; i < str.length; i++) {
                if (escape(str.charAt(i)).length >= 4)
                    count += 2;
                else
                    if (escape(str.charAt(i)) != "%0D")
                        count++;
                if (count > byte) {
                    //if(escape(str.charAt(i)) == "%0A")
                    //    i--;
                    break;
                }
            }
            return str.substring(0, i);
        },
        /*
        * 문자열의 바이트수를 반환
        */
        // Youngjun 추가 2015.04.07 -byte length display
        byte: function () {
            var str = this,
                length = 0;
            for (var i = 0; i < str.length; i++) {
                if (escape(str.charAt(i)).length >= 4)
                    length += 2;
                else if (escape(str.charAt(i)) == "%A7")
                    length += 2;
                else
                    if (escape(str.charAt(i)) != "%0D")
                        length++;
            }
            return length;
        },

        unescapeHTML: function () {
            ///<summary>Unescapes HTML string</summary>
            return this.replace(/(&amp;|&quot;|&#39;|&nbsp;|&#160;|&lt;|&gt;)/g, function (match) {
                if (match == '&amp;') {
                    return '&';
                }
                else if (match == '&quot;') {
                    return '"';
                }
                else if (match == '&#39;') {
                    return "'";
                }
                else if (match == '&lt;') {
                    return '<';
                }
                else if (match == '&gt;') {
                    return '>';
                }
                return ' ';
            });
        },

        /**
        * (instance method extending String object). As per RFC 4648, no newlines are added.
        */
        encodeBase64: function () {
            ///<summary>Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]</summary>

            var o1, o2, o3, bits, h1, h2, h3, h4, e = [], pad = '', c, coded,
                b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                plain = this;

            c = plain.length % 3;  // pad string to length of multiple of 3
            if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }

            // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
            for (c = 0; c < plain.length; c += 3) {  // pack three octets into four hexets
                o1 = plain.charCodeAt(c);
                o2 = plain.charCodeAt(c + 1);
                o3 = plain.charCodeAt(c + 2);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hextets to index into b64 string
                e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            }
            coded = e.join('');  // join() is far faster than repeated string concatenation

            // replace 'A's from padded nulls with '='s
            return coded.slice(0, coded.length - pad.length) + pad;
        },

        /**
        * (instance method extending String object). As per RFC 4648, newlines are not catered for.
        */
        decodeBase64: function () {
            ///<summary>Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]</summary>

            var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain,
                b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                coded = this;

            // unpack four hexets into three octets
            for (var c = 0; c < coded.length; c += 4) {
                h1 = b64.indexOf(coded.charAt(c));
                h2 = b64.indexOf(coded.charAt(c + 1));
                h3 = b64.indexOf(coded.charAt(c + 2));
                h4 = b64.indexOf(coded.charAt(c + 3));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >>> 16 & 0xff;
                o2 = bits >>> 8 & 0xff;
                o3 = bits & 0xff;

                d[c / 4] = String.fromCharCode(o1, o2, o3);
                // check for padding
                if (h4 == 0x40) d[c / 4] = String.fromCharCode(o1, o2);
                if (h3 == 0x40) d[c / 4] = String.fromCharCode(o1);
            }
            plain = d.join('');  // join() is far faster than repeated string concatenation

            return plain;
        },

        /**
        * (BMP / basic multilingual plane only) (instance method extending String object).
        *
        * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
        */
        encodeUTF8: function () {
            ///<summary>Encode multi-byte Unicode string into utf-8 multiple single-byte characters </summary>

            // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            var str = this.replace(/[\u0080-\u07ff]/g, function (c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
                // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                .replace(/[\u0800-\uffff]/g, function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                });
            return str;
        },

        decodeUTF8: function () {
            ///<summary>Decode utf-8 encoded string back into multi-byte Unicode characters</summary>

            // 2-byte chars
            var str = this.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (c) {
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            })
                // 3-byte chars
                .replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (c) {
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                });
            return str;
        },

        encodeHex: function () {
            var input = this.toUtf8(),
                output = [];

            for (var i = 0, len = input.length; i < len; i++) {
                var hexVal = input[i].toString(16);
                output.push((hexVal.length < 2 ? '0' : '') + hexVal.toLowerCase());
            }
            return output.join('');
        },

        decodeHex: function () {
            var hex = [];

            for (var i = 0, len = this.length; i < len; i += 2) {
                hex.push(parseInt(this.substr(i, 2), 16));
            }
            return $.arrayToString(hex);
        },

        encryptXor: function (key) {
            var input = this.toUtf8(),
                output = [];

            for (var x = 0, len = input.length; x < len; x++) {
                var hexVal = (input[x] ^ key.charCodeAt(x % key.length)).toString(16);
                output.push((hexVal.length < 2 ? '0' : '') + hexVal.toLowerCase());
            }
            return output.join('');
        },

        decryptXor: function (key) {
            var input = this;
            var output = [];

            if ($.isEmpty(key)) {
                var klen = parseInt(input.substring(0, 1));
                key = input.substring(1, klen + 1);
                input = input.substring(1 + klen);
            }

            for (var i = 0, j = 0, len = input.length; i < len; i += 2) {
                var hexVal = parseInt(input.substr(i, 2), 16);
                output.push(hexVal ^ key.charCodeAt(j++ % key.length));
            }

            return $.arrayToString(output);
        },

        toUtf8: function () {
            var str = this,
                out = [],
                p = 0;

            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if (c < 128) {
                    out[p++] = c;
                }
                else if (c < 2048) {
                    out[p++] = (c >> 6) | 192;
                    out[p++] = (c & 63) | 128;
                }
                else {
                    out[p++] = (c >> 12) | 224;
                    out[p++] = ((c >> 6) & 63) | 128;
                    out[p++] = (c & 63) | 128;
                }
            }
            return out;
        },

        toJSON: function () {
            ///<summary>Returns json typed string</summary>

            var str = this.replace(/[\x00-\x1f\\]/g, function (c) {
                if (c in String.specialChars) {
                    return String.specialChars[c];
                }
                return '\\u00' + c.charCodeAt(0).padding(2, 16);
            });

            return '"' + str.replace(/"/g, '\\"') + '"';
        },

        cr2br: function () {
            return this.replace(/\r\n|\r|\n/g, '</br>');
        },

        //날짜 변환 2015.03.26 dknam
        toDate: function (format) {
            //var str = Date.format("yyyy-mm-dd", this.valueOf());
            var item;
            if (this.valueOf().test(/\D/)) {
                item = this.valueOf().split(/\D/);
            } else {
                item = this.valueOf().match(/^(.{4})(.{2})(.{2})$/);
                item.shift();
            }

            var date = new Date();
            date.setDate(1);
            date.setFullYear(parseInt(item[0], 10));
            date.setMonth(parseInt(item[1], 10) - 1);
            date.setDate(parseInt(item[2], 10));

            if (item[3] != undefined) {  //시
                date.setHours(parseInt(item[3], 10));
            }
            if (item[4] != undefined) {  //분
                date.setMinutes(parseInt(item[4], 10));
            }
            if (item[5] != undefined) {  //초
                date.setSeconds(parseInt(item[5], 10));
            }

            return date;//format ? Date.format(format, date) : date;
        },

        //천단위, 소수점 구분자를 Number 에서 사용할 수 있게 번환
        toECNumber: function (option) {
            var value = this.valueOf();
            var result;
            option = option || {};
            var currencySeparator = option.currencySeparator || maxsoft.config.company.THOU_SEPARATOR || ',';
            var fractionSeparator = option.fractionSeparator || maxsoft.config.company.DEC_SEPARATOR || '.';
            result = value.replace(new RegExp("\\" + currencySeparator, "g"), "");
            result = result.replace(fractionSeparator, ".");

            return result;
        },

        //UTC Date 변환 2016.1.15 dknam
        toDatetime: function () {
            return Date.parse(this.valueOf().replace(/\..+/, ''));
            //return new Date(this.valueOf().replace(/\..+/, ''));    //UTC Date 소수점 제거 
        },

        //특수문자 변환 2015.06.01 225
        //특수문자 => 특수기호로 변환,탭/반공백은 공백으로 변환, 앞뒤 공백 제거,공백 2개 이상은 1개로 변환
        replaceSpecial: function (strCase) {
            var returValue = this.valueOf();
            if (returValue == "")
                return "";

            if (typeof strCase == 'undefined')
                strCase = "";

            //공백이 2개이상 인경우 1개로 만들기, 탭/반공백 하나로 변경하기
            // 고객지원 129253
            // 기본적으로는 strCase 가 "" 인거와 같으나 공백만 제거 안함. 앞뒤공백은 제거함.
            if (strCase.toLowerCase() != "code" && strCase.toLowerCase() != "blank") {
                returValue = returValue.replace(/[  \t]{2,}|[ \t]/g, " ");
            }
            return returValue.convertSpecial(strCase);
        },

        //textarea는 특수문자 치환만 필요해서 replaceSpecial에서 분리함 dknam 2016.06.18
        convertSpecial: function (strCase) {
            var returValue = this.valueOf();
            if (returValue == "")
                return "";

            if (typeof strCase == 'undefined')
                strCase = "";

            if (strCase.toLowerCase() == "code") {
                //치환대상 문자 처리
                return returValue.replace(/[&|?=]/g, function (match) {
                    switch (match) {
                        case "&":
                            return "＆";
                        case "|":
                            return "｜";
                        case "?":
                            return "？";
                        case "=":
                            return "＝";
                    }
                    return "";
                });
            } else if (strCase.toLowerCase() == "search") {
                //치환대상 문자 처리
                return returValue.replace(/[&|?=]/g, function (match) {
                    switch (match) {
                        case "&":
                            return "＆";
                        case "|":
                            return "｜";
                        case "?":
                            return "？";
                        case "=":
                            return "＝";
                    }
                    return "";
                });
            } else {
                //치환대상 문자 처리|앞공백제거|뒷공백제거
                return returValue.replace(/[&|?=]|^ *| *$/g, function (match) {
                    switch (match) {
                        case "&":
                            return "＆";
                        case "|":
                            return "｜";
                        case "?":
                            return "？";
                        case "=":
                            return "＝";
                    }
                    return "";
                });
            }
        },


        //입력통제 문자 있는 지 확인 2015.06.01 225
        //리턴형태 {result: false,message =""}
        isContainsLimitedSpecial: function (strCase) {
            var returValue = this.valueOf();
            if (returValue == "")
                return {
                    result: false,
                    message: ""
                };

            if (typeof strCase == 'undefined')
                strCase = "";

            if (strCase.toLowerCase() == "code") {
                //"특수문자 또는 공백을 확인 바랍니다.\n다음의 기호들은 사용할 수 없습니다.\n\n  \ '  \"  ∬  — (Em대쉬)";
                var regex = /[∬—"＇'\s\\]/g;
                if (regex.test(returValue))
                    return {
                        result: true,
                        message: maxsoft.resource.MSG05380
                    };

            } else if (strCase.toLowerCase() == "code-textarea") { //textarea에서 사용되는 규칙 정규 표현식 엔터 관련 추가 
                //"특수문자 또는 공백을 확인 바랍니다.\n다음의 기호들은 사용할 수 없습니다.\n\n  \ '  \"  ∬  — (Em대쉬)";

                var regex = /^(\n)|[∬—"＇' \\]/g;
                if (regex.test(returValue))
                    return {
                        result: true,
                        message: maxsoft.resource.MSG05380
                    };

            } else if (strCase.toLowerCase() == "name") {
                //"특수기호를 확인 바랍니다.\n다음의 기호들은 사용할 수 없습니다.\n\n  \ '  \"  ∬  — (Em대쉬)";
                var regex = /[∬—"＇'\\]/g;
                if (regex.test(returValue))
                    return {
                        result: true,
                        message: maxsoft.resource.MSG04672
                    };

            } else if (strCase.toLowerCase() == "search") {
                //"특수기호를 확인 바랍니다.\n다음의 기호들은 사용할 수 없습니다.\n\n  \ '  \"  — (Em대쉬)";
                var regex = /[—"＇']/g;
                if (regex.test(returValue))
                    return {
                        result: true,
                        message: maxsoft.resource.MSG05538
                    };

            } else if (strCase.toLowerCase() == "noscript") {
                //모든 인풋

            } else {
                //"입력 제한된 문자가 입력되었습니다.\n아래 문자는 입력할 수 없습니다. \n∬—(Em대쉬)";
                var regex = /[∬—]/g;
                if (regex.test(returValue))
                    return {
                        result: true,
                        message: maxsoft.resource.MSG05340
                    };

            }
            //"입력 제한된 태그가 입력되었습니다.\n스크립트는 입력할 수 없습니다.";
            regex = /<script|<\/script>/gi;
            if (regex.test(returValue))
                return {
                    result: true,
                    message: maxsoft.resource.MSG05341
                };

            return {
                result: false,
                message: ""
            };
        },

        // Whether resource code
        isResource: function () {
            //ie10에서 지원되지 않아 오류발생하여 아래로 변경
            //var reg = new RegExp(/(LBL|MSG|BTN)\d{5}/, 'i');
            var reg = new RegExp(/(LBL|MSG|BTN)\d{5}/i);
            return reg.test(this);
        }
    });

    // for filepath
    $.extend(String.prototype, {
        fileName: function () {
            ///<summary>Gets the filename from the string</summary>
            var result = this,
                n = result.lastIndexOfAny('/\\');

            if (n != -1) {
                result = result.slice(n + 1);
            }
            return result;
        },
        fileExt: function () {
            ///<summary>Gets the file extension from the sting</summary>
            var result = this,
                n = result.lastIndexOf('.');

            if (n != -1) {
                return result.slice(n + 1);
            }
            return '';
        },
        isAllowExt: function (allows) {
            ///<summary>Determines whether a file extension is allowed or not</summary>
            if (arguments.length > 1) {
                // to make real array
                allows = slice.call(arguments, 0);
                return allows.contains(this.fileExt());
            }
            else if (!$.isEmpty(allows)) {
                allows = allows.replace(/,/g, '|');
                return this.test(new RegExp(".(" + allows + ")$", "i"));
            }
            return true;
        }

    });

    // Microsoft's JScript does not support negative values for the start index.
    // only run when the substr function is broken.     
    if ('ab'.substr(-1) != 'b') {
        String.prototype.substr = function (substr) {
            return function (start, length) {
                // did we get a negative start, calculate how much it is from the beginning of the string
                if (start < 0) start = Math.max(this.length + start, 0);

                // call the original function
                return substr.call(this, start, length);
            }
        }(String.prototype.substr);
    }

})(jQuery);

