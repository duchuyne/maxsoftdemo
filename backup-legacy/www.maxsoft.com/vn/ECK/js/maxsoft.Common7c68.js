/**************************************************************************************************** 
1. Create Date : 2018.01.17
2. Creator     : Cha InChul
3. Description : 영업페이지 공통 JS
4. Precaution  : 
5. History     :	2021.01.14 (김동수) : A21_00179 - KR 홈페이지 내 업그레이드 게시판 추가
					 2022.06.13 (김동수) : A22_03116 - 영업사이트 가입 후 CMS 신청시 IE > 크롬 으로 ASSIT 체크 하도록 처리
					 2022.07.19 (김동수) : A22_04129 - 영업 홈페이지 Assistant 설치 관련 로직 수정
					2022.08.03 (seongbeom kim) A22_03339 - Assistant 공인인증서 등록시 사업자 번호 체크. ERP 적용. - assi용 url파라미터에 session, host값 추가
					2023.02.02 (이경익) : A23_00016 - COUNT테이블 제거
					2023.03.03 (김동수) : A23_01243 - CN 홈페이지 > 오류 메일 데이터 F존으로 연결
					2023.07.11 (김동수) : A23_02670 - 고객센터>동영상 강좌에 진입할 수 없는 문제
                    2023.07.21 (장정민) : A23_02630_필리핀 홈페이지 및 00000 연결 요청
					2024.02.22 (김동수) : A24_01062 - US 홈페이지 상담문의, Demo, RFT 신청화면 수정 요청
					2024.06.26 (김동수) : ZEUS URL 변경(센터 배포 안함)
6. Old file    : 
* ***************************************************************************************************/
var isTest = true;
var TargetServer = "";
var isSend = false;
var isDuple = false;

String.prototype.format = function () {
	var theString = this;

	for (var i = 0; i < arguments.length; i++) {
		var regExp = new RegExp('\\{' + i + '\\}', 'gm');
		theString = theString.replace(regExp, arguments[i]);
	}
	return theString;
}

function makeGmcHost(notUseCN) {
	var host = window.location.host.toLowerCase(),
		hostPrefix = '',
		protocol = window.location.protocol,
		hostParser = {
			center: /^(www[78]?|login[78]?|cs[78]?|pay[78]?)([a-z]?)(\d*)(-dev)?\./i,
			dev: /^(stage|zeus|apollo)([\d]+)?(_(www|kr|us|es|cn|tw|jp|vn|my|id|th|ph|uz|hk))?([\d]+)?([a-z]?)(-dev)?\./i
		}
		;

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
					//hostPrefix = 'zeus04';
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
}

function gmcFormApi(param) {
	$.ajax({
		type: "POST",
		async: false,
		url: param.sessionURL, //api 호출.
		data: param.data,
		contentType: false,
		processData: false,
		success: function (result) {
			var jsonResult = result;
			if (jsonResult.Status != "200") {
				alert("make GMC Session error : " + result.Error.Message);
			} else {
				if (param.callbackApi) {
					param.callbackApi(jsonResult);
				}
				else
					return jsonResult;
			}
		},
		error: function (request, status, error) {
			saveContactException(param);    // 에러발생 시 askmail로 메일발송
			alert(getErrorMsgByLanType());
			//var errmsg = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
		},
		crossDomain: true
	});
}

function gmcApi(param) {
	$.ajax({
		type: "POST",
		async: false,
		url: param.sessionURL, //api 호출.
		data: param.data != undefined ? typeof param.data === "object" ? JSON.stringify(param.data) : param.data : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		//dataType: "json",
		success: function (result) {
			var jsonResult = result;
			if (!param.ignoreServerError && jsonResult.Status != "200") {
				alert("make GMC Session error : " + result.Error.Message);
			} else {
				if (param.callbackApi) {
					param.callbackApi(jsonResult);
				}
				else
					return jsonResult;
			}
		},
		error: function (request, status, error) {
			saveContactException(param);    // 에러발생 시 askmail로 메일발송
			alert(getErrorMsgByLanType());
			// var errmsg = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
		},
		crossDomain: true
	});
}

function gmcSessionApi(param) {
	var _apiUrl = "/ECAPI/Bulk/Common/Infra/MakeGMCSession";
	$.ajax({
		type: "POST",
		async: false,
		url: makeGmcHost().concat(_apiUrl), //api 호출.
		data: param.data != undefined ? JSON.stringify(param.data) : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		success: function (result) {
			var jsonResult = result;
			if (jsonResult.Status != "200") {
				alert("make GMC Session error : " + result.Error.Message);
			} else {
				if (param.callbackApi) {
					param.sessionURL = makeGmcHost().concat(param.sessionURL + "?SESSION_ID=" + result.Data.apiSessionKey);
					if (param.form != undefined && param.form) {
						gmcFormApi(param);
					}
					else {
						gmcApi(param);
					}
				}
				else
					return jsonResult;
			}

			//saveContactException(param);    // 에러발생 시 askmail로 메일발송 - 테스트용(배포시 삭제후 위 API 호출 메서드 주석해제)
		},
		error: function (request, status, error) {
			saveContactException(param);    // 에러발생 시 askmail로 메일발송
			alert(getErrorMsgByLanType());
		},
		crossDomain: true
	});
}

function saveContactException(param) {
	// Demo, Live Demo, Contact Us 또는 RFT 일 때 실행
	if (location.href.indexOf("ECK004M") > 0 || location.href.indexOf("ECK011M") > 0 || location.href.indexOf("ECK013M") > 0 || location.href.indexOf("ECK014M") > 0 || location.href.indexOf("ECK006M") > 0 || location.href.indexOf("ECK006P_04") > 0 || location.href.indexOf("ECK009M") > 0) {
		var referPage = "";

		if (location.href.indexOf("ECK004M") > 0) {
			//referPage = " (Demo. Email authentication page - Check if you are an existing demo user)";

			// Demo 메일주소 입력 팝업에서 에러발생 시 상세정보 입력 페이지로 이동하도록
			var selectedValue = $("#uldropLanguage li.active").find("a").attr("id").split("∬");
			var strNewMail = $("#login_email").val();
			var selectedLanguage = selectedValue[0];
			var paramString = "&newmail=" + strNewMail + "&SelLanType=" + selectedLanguage ;

			if ($("#IsModal").val() == "Y") {
				if ($("#locType").val() == "_KR") {
					self.location.href = "ECK013M.aspx?IsModal=" + $("#IsModal").val() + "&FromPage=" + $("#FromPage").val() + paramString;
				} else {
					self.location.href = "ECK011M.aspx?IsModal=" + $("#IsModal").val() + paramString;
				}
			}
			else {
				if ($("#locType").val() == "_KR") {
					self.location.href = "ECK013M.aspx?IsModal=" + $("#IsModal").val() + paramString;
				} else {
					self.location.href = "ECK011M.aspx?IsModal=" + $("#IsModal").val() + paramString;
				}
			}

			return false;
		}
		if (location.href.indexOf("ECK011M") > 0 || location.href.indexOf("ECK013M") > 0) {
			referPage = " (Demo. Information input page)";
		}
		if (location.href.indexOf("ECK014M") > 0) {
			referPage = " (Live Demo)";
		}
		if (location.href.indexOf("ECK006M") > 0 || location.href.indexOf("ECK006P_04") > 0) {
			if (param.sessionURL.indexOf("/GetListCobsHolDetail") > 0) {
				return false;
			}
			referPage = " (Contact Us)";
		}
		if (location.href.indexOf("ECK009M") > 0) {
			referPage = " (RFT)";
		}

		var exceptionParam = {
			COMPANY_DES: "",
			Q_NAME: "",
			ADDRESS: "",
			COM_PHONE: "",
			CONTACT_NUMBER: "",
			FROM_EMAIL: "",
			Q_CONTENTS: "",
			DS_TOMAILADDRESS: "askmail@maxsofterp.com",  // 기본 값(메일발송 API에서 각 국가별 PIC로 등록된 메일주소를 사용)
			DS_SUBJECT: "maxsoft - Sales Management" + referPage,
			//BRN_CD: $("#SaleSite").val() + "-" + referPage,
			BRN_CD: $("#SaleSite").val(),
			Request: {
				NEW_CODE_ZONE: $("#newCodeZone").val(),
				NEW_DB_SHARD_NO: $("#newDbShardNo").val(),
			},
			JOIN_ZONE: $("#newCodeZone").val()
		};

		if (location.href.indexOf("ECK004M") > 0) {
			exceptionParam.COMPANY_DES = "";
			exceptionParam.Q_NAME = "";
			exceptionParam.ADDRESS = "";
			exceptionParam.COM_PHONE = "";
			exceptionParam.CONTACT_NUMBER = "";
			exceptionParam.FROM_EMAIL = param.data.EMAIL;
			exceptionParam.Q_CONTENTS = "";
		}
		else {
			var dataObj = param.data.Request.ConsultDataInfos ? JSON.parse(param.data.Request.ConsultDataInfos) : param.data.Request.ConsultData ? param.data.Request.ConsultData : param.data.ConsultData;
			exceptionParam.COMPANY_DES = dataObj.COM_NM;
			exceptionParam.Q_NAME = dataObj.APLT_NM;
			exceptionParam.ADDRESS = dataObj.VICON_ADDR;
			exceptionParam.COM_PHONE = dataObj.TEL_NO;
			exceptionParam.CONTACT_NUMBER = dataObj.MBPH_NO;
			exceptionParam.FROM_EMAIL = dataObj.CLNT_EMAIL;
			exceptionParam.Q_CONTENTS = dataObj.CNTS_CTT;
		}

		var apiParam = {
			sessionURL: TargetServer + "/ECAPI/Admin/Common/InsertTbMailSendOnCSException",
			data: exceptionParam,
			method: "POST",
			callbackApi: function (result) {
				if (result.Status == "200") {
					alert(getContactMsgByLanType());

					var isInIFrame = (window.location != window.parent.location);
					if (isInIFrame == true) {
						if ($("#IsModal").val() == "N") {
							window.close();
						} else {
							parent.$('.modal-panel').css({
								'visibility': 'hidden',
								'z-index': '-30'
							});
							parent.$(".modal-panel iframe").attr("src", "about:blank");
							parent.$('.modal-panel-overlay').css('display', 'none');
							parent.$('body').css('overflow-y', 'scroll');
						}
					}
					else {
						window.close();
					}
				}
			}
		};

		zoneSessionApi(apiParam);
	}
}

// 가입 zone 저장 - 임시 =========================================
function saveContactZone(param) {
    var apiParam = {
        sessionURL: TargetServer + "/ECAPI/Svc/Admin/Marketing/SaveSalesManagement",
        data: param,
        method: "POST",
        callbackApi: function (result) {
            // nothing
        }
    };

    zoneSessionApiTemp(apiParam);
}

function zoneSessionApiTemp(param) {
    var _apiUrl = "/ECAPI/Common/Infra/MakeZONESessionSales";
    var apiHost = makeZoneHost(param.data.Request.NEW_CODE_ZONE);

    if (apiHost == false) {
        //saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
        return false;
    }

    param.data.JOIN_ZONE = param.data.Request.NEW_CODE_ZONE;

    //apiHost = "https://test.maxsoft.com";
    $.ajax({
        type: "POST",
        async: false,
        url: apiHost.concat(_apiUrl), //api 호출.
        data: param.data != undefined ? JSON.stringify(param.data) : JSON.stringify({}),
        contentType: 'application/json',
        proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
        success: function (result) {
            if (result.Status != "200") {
                //saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
            } else {
                param.sessionURL = apiHost.concat(param.sessionURL + "?SESSION_ID=" + result.Data.apiSessionKey);
                if (param.form != undefined && param.form)
                    zoneFormApi(param);
                else
                    zoneApi(param);
            }
        },
        error: function (request, status, error) {
            
        },
        crossDomain: true
    });
}
// ===============================================================

function filterException() {
	//$("#frm1").get(0).method = "post";
	//$("#frm1").get(0).action = "ECK043M.aspx";
	//$("#frm1").submit();
	location.href = "../../index.html";
}

function saveJoinException(param, isError) {
	// 가입(FT 포함) 일 때 실행
	if (isSend == false && (location.href.indexOf("ECK043M") > 0 || (location.href.indexOf("ECK001M") > 0 && (param.sessionURL.indexOf("/SVC/Admin/NewCode/InsertMemberForNewCode") > 0 || param.sessionURL.indexOf("/Common/Infra/MakeZONESessionSales"))))) {
		var referPage = "";

		if (location.href.indexOf("ECK001M") > 0 || location.href.indexOf("ECK043M") > 0) {
			if ($("#locType").val() == "_KR") {
				referPage = " / New Code : Register as a paid member";
			} else {
				referPage = " / FT : Register as a free trial";
			}
		}

		var host = window.location.host.toLowerCase(),
			hostParser = {
				dev: /^(test|stage|zeus|apollo)(_(www|kr|us|es|cn|tw|jp|vn|my|id|th|ph|uz|hk))?([\d]+)?([a-z]?)(-dev)?\./i
			};

		var match = hostParser.dev.exec(host);

		var brnCd = $("#hidHomePageType").val() == "es" || $("#hidHomePageType").val() == "jp" ? "US" : $("#hidHomePageType").val().toUpperCase();
		var exceptionParam = {
			COMPANY_DES: "",
			APPLY_NAME: "",
			APPLY_MOBILE: "",
			MASTER_NAME: "",
			MASTER_PHONE: "",
			MASTER_MOBILE: "",
			MASTER_EMAIL: "",
			LAN_TYPE: "",
			DS_TOMAILADDRESS: "askmail@maxsofterp.com",  // 기본 값(메일발송 API에서 각 국가별 PIC로 등록된 메일주소를 사용)
			DS_SUBJECT: (match != null ? "[TEST] " : "") + (isError ? "[Phone Number] " : "") + "maxsoft - " + brnCd + referPage,
			BRN_CD: brnCd
		};

		if (!isError) {
			exceptionParam.APPLY_NAME = getReplacedSpecialRemoveTag($("#ApplicantName").val()); //param.data.Request.MEMBER.NAME1;
			exceptionParam.APPLY_MOBILE = $("#ApplicantMobile").val();  //param.data.Request.MEMBER.APPLICANT_NO;
			exceptionParam.COMPANY_DES = getReplacedSpecial2to1(getReplacedSpecialRemoveTag($("#CompanyName").val()), true); //param.data.Request.MEMBER.COM_NAME;
			exceptionParam.MASTER_NAME = getReplacedSpecial2to1(getReplacedSpecialRemoveTag($("#MasterName").val()), true);  //param.data.Request.MEMBER.MASTER_NAME;
			exceptionParam.MASTER_PHONE = $("#OfficeNum").val(); //param.data.Request.ACCT.TEL_NO1;
			exceptionParam.MASTER_MOBILE = $("#MasterMobile").val();    //param.data.Request.ACCT.TEL_NO;
			exceptionParam.MASTER_EMAIL = getReplacedSpecialRemoveTag($("#MasterEmail").val());  //param.data.Request.ACCT.EMAIL;
            exceptionParam.LAN_TYPE = ($("#btnLanguage").attr("data-selvalue") == "en-MY" || $("#btnLanguage").attr("data-selvalue") == "en-PH") ? "en-US" : $("#btnLanguage").attr("data-selvalue");   //param.data.Request.ACCT.LAN_TYPE;
		}
		else {
			if (brnCd == "KR") {
				exceptionParam.APPLY_NAME = getReplacedSpecialRemoveTag($("#ApplicantName").val()); //param.data.Request.MEMBER.NAME1;
				exceptionParam.APPLY_MOBILE = $("#ApplicantMobile").val();  //param.data.Request.MEMBER.APPLICANT_NO;
			}
			else {
				exceptionParam.MASTER_NAME = getReplacedSpecialRemoveTag($("#ApplicantName").val()); //param.data.Request.MEMBER.NAME1;
				exceptionParam.MASTER_PHONE = $("#ApplicantMobile").val();  //param.data.Request.MEMBER.APPLICANT_NO;
			}
		}

		if (brnCd == "CN") {
			exceptionParam.JOIN_ZONE = "F";
			exceptionParam.Request = {
				NEW_CODE_ZONE: "F"
			};

			var apiParamCN = {
				sessionURL: TargetServer + "/ECAPI/Admin/Common/InsertTbMailSendOnJoinException",
				data: exceptionParam,
				method: "POST",
				callbackApi: function (result) {
					if (result.Status == "200") {
						isSend = true;
						$("#frm1").get(0).method = "post";
						$("#frm1").get(0).action = "ECK044M.aspx";
						$("#frm1").submit();
					}
				}
			};

			zoneSessionApi(apiParamCN);
		}
		else {
			var apiParam = {
				sessionURL: TargetServer + "/GMCAPI/Admin/Common/InsertTbMailSendOnJoinException",
				data: exceptionParam,
				method: "POST",
				callbackApi: function (result) {
					if (result.Status == "200") {
						isSend = true;
						$("#frm1").get(0).method = "post";
						$("#frm1").get(0).action = "ECK044M.aspx";
						$("#frm1").submit();
					}
				}
			};

			gmcSessionApi(apiParam);
		}
	}
}

// 가입 프로세스 사용 =======================================
function makeZoneHost(zone) {
	var host = window.location.host.toLowerCase(),
		hostPrefix = 'login',
		protocol = window.location.protocol,
		hostParser = {
			center: /^(www[78]?|login[78]?|cs[78]?|pay[78]?)([a-z]?)(\d*)(-dev)?\./i,
			dev: /^(stage|zeus|apollo)([\d]+)?(_(www|kr|us|es|cn|tw|jp|vn|my|id|th|ph|uz|hk))?([\d]+)?([a-z]?)(-dev)?\./i
		};

	if ($.isEmpty(zone) || zone == null || zone == undefined) {
		return false;
	}

	var match = hostParser.center.exec(host);
	if (match != null) {
		var svrno = match[1].substring(match[1].length - 1);

		if (svrno == '7' || svrno == '8') {
			hostPrefix = 'login' + svrno;
		}
	}
	else {  // Match attempt failed
		if (fnStartsWith(host, "maxsoft")) {    // 센터 CDN(Cloud Front)을 통해 서브 도메인 없이 접속했을 경우
			hostPrefix = 'login';
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
	return protocol + "//" + hostPrefix.concat(zone.toLowerCase()) + (zone.toUpperCase() == "F" ? ".maxsoft.cn" : ".maxsoft.com");
}

// startsWith 기능을 지원하지 않는 브라우저가 있음(IE11)
function fnStartsWith(data, find) {
	if (data.startsWith) {
		return data.startsWith(find);
	}
	else {
		return data.substr(0, find.length) === find;
	}
}

function zoneFormApi(param) {
	$.ajax({
		type: "POST",
		async: false,
		url: param.sessionURL, //api 호출.
		data: param.data,
		contentType: false,
		processData: false,
		success: function (result) {
			if (result.Status != "200") {
				saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
				alert("make session error : " + result.Error.Message);
			} else {
				if (param.callbackApi) {
					param.callbackApi(result);
				}
				else
					return result;
			}
		},
		error: function (request, status, error) {
			if (isDuple == false) {
				alert(getErrorMsgByLanType());
				isDuple = true;
			}
			filterException();
		},
		crossDomain: true
	});
}

function zoneApi(param) {
	$.ajax({
		type: "POST",
		async: false,
		url: param.sessionURL, //api 호출.
		data: param.data != undefined ? typeof param.data === "object" ? JSON.stringify(param.data) : param.data : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		//dataType: "json",
		success: function (result) {
			if (!param.ignoreServerError && result.Status != "200") {
				saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
				alert("make session error : " + result.Error.Message);
			} else {
				if (param.callbackApi) {
					param.callbackApi(result);
				}
				else
					return result;
			}
		},
		error: function (request, status, error) {
			if (isDuple == false) {
				alert(getErrorMsgByLanType());
				isDuple = true;
			}
			filterException();
		},
		crossDomain: true
	});
}

function zoneSessionApi(param) {
	var _apiUrl = "/ECAPI/Common/Infra/MakeZONESessionSales";
	var apiHost = makeZoneHost(param.data.Request.NEW_CODE_ZONE);

	if (apiHost == false) {
		alert("No ZONE infomation in config.");
		$(".wrapper-overlay").removeClass('show');
		$(".wrapper-page-progress").addClass('hidden');
		saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
		return false;
	}

	//apiHost = "https://test.maxsoft.com";
	$.ajax({
		type: "POST",
		async: false,
		url: apiHost.concat(_apiUrl), //api 호출.
		data: param.data != undefined ? JSON.stringify(param.data) : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		success: function (result) {
			if (result.Status != "200") {
				saveJoinException(param, false);    // 에러발생 시 askmail로 메일발송
				alert("make session error : " + result.Error.Message);
				$(".wrapper-overlay").removeClass('show');
				$(".wrapper-page-progress").addClass('hidden');
			} else {
				if (param.callbackApi) {
					param.sessionURL = apiHost.concat(param.sessionURL + "?SESSION_ID=" + result.Data.apiSessionKey);
					if (param.form != undefined && param.form)
						zoneFormApi(param);
					else
						zoneApi(param);
				}
				else
					return result;
			}
		},
		error: function (request, status, error) {
			if (isDuple == false) {
				alert(getErrorMsgByLanType());
				isDuple = true;
			}
			filterException();
		},
		crossDomain: true
	});
}


function zoneApiAssistant(param) {

	// API 관련 zone, session정보 할당
	param.data.ErrMsgUrl = param.host + param.data.ErrMsgUrl + "?SESSION_ID=" + param.sessionKey;
	param.data.CertErrorUrl = param.host + param.data.CertErrorUrl + "?SESSION_ID=" + param.sessionKey;

	$.ajax({
		type: "POST",
		async: false,
		url: param.sessionURL, //api 호출.
		data: param.data != undefined ? typeof param.data === "object" ? JSON.stringify(param.data) : param.data : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		//dataType: "json",
		success: function (result) {
			if (param.callbackApi) {
				param.callbackApi(result);
			}
			else
				return result;
		},
		error: function (request, status, error) {
			if (param.callbackApi) {
				error.Status = "0";
				param.callbackApi(error);
			}
			else
				return error;
		},
		crossDomain: true
	});
}

function zoneAssistantSessionApi(param) {
	var _apiUrl = "/ECAPI/Common/Infra/MakeZONESessionSales";
	var apiHost = makeZoneHost(param.data.Zone);

	if (apiHost == false) {
		alert("No ZONE infomation in config.");
		$(".wrapper-overlay").removeClass('show');
		$(".wrapper-page-progress").addClass('hidden');
		return false;
	}

	//apiHost = "https://test.maxsoft.com";
	$.ajax({
		type: "POST",
		async: false,
		url: apiHost.concat(_apiUrl), //api 호출.
		data: param.data != undefined ? JSON.stringify(param.data) : JSON.stringify({}),
		contentType: 'application/json',
		proxyUrl: isIE89() ? "/" + getLocation() + "/ECK/ECK001M_Proxy.aspx" : undefined,
		success: function (result) {
			if (result.Status != "200") {
				alert("make session error : " + result.Error.Message);
				$(".wrapper-overlay").removeClass('show');
				$(".wrapper-page-progress").addClass('hidden');
			} else {
				if (param.callbackApi) {
					param.sessionURL = param.sessionURL + "?SESSION_ID=" + result.Data.apiSessionKey;
					param.sessionKey = result.Data.apiSessionKey;
					param.host = apiHost;
					if (param.form != undefined && param.form)
						zoneFormApi(param);
					else
						zoneApiAssistant(param);
				}
				else
					return result;
			}
		},
		//error: function (request, status, error) {
		//	if (isDuple == false) {
		//		alert(getErrorMsgByLanType());
		//		isDuple = true;
		//	}
		//	filterException();
		//},
		crossDomain: true
	});
}

// ==========================================================

function jsOnlyNumberKey5(e) {
	var t = $(e).val();
	$(e).val(t.replace(/([^0-9\-])/g, ""));
}

// 국가번호
function jsOnlyNumberKeyNation(e) {
	var t = $(e).val();
	$(e).val(t.replace(/([^0-9\+])/g, ""));
}


function fnErrChk(errList, focusList) {
	var err = $.isArray(errList) ? errList : errList.split("§");
	var focus = $.isEmpty(focusList) ? err : ($.isArray(focusList) ? focusList : focusList.split("§"));

	for (var i = 0; i < err.length; i++) {
		if (err[i] != "") {
			$("#" + err[i]).addClass("has-error");
			if (i == 0) {
				$("#" + focus[i].replace("td_", "")).focus();
			}
		}
	}
}

function fnRemoveClass(id) {
	$("#" + id).removeClass();
}

// 날짜
function fnLocalDate() {
	var date = new Date();
	var year = date.getFullYear().toString();
	var mont = fnSetZero((date.getMonth() + 1).toString());
	var day = fnSetZero(date.getDate().toString());
	var ho = fnSetZero(date.getHours().toString());
	var min = fnSetZero(date.getMinutes().toString());
	var sec = fnSetZero(date.getSeconds().toString());
	$("#hidTime").val(year + "-" + mont + "-" + day + "-" + ho + "-" + min + "-" + sec);
}

function fnSetZero(value) {
	if (value.toString().length == 1)
		return "0" + value;
	else
		return value;
}

// 날짜 유효성 체크
function fnCheckDateValidate(yearCtrl, monthCtrl, dayCtrl) {
	if (Number(checkDate2($("#" + yearCtrl).get(0).value, $("#" + monthCtrl).get(0).value)) < Number($("#" + dayCtrl).get(0).value)) {
		if (checkDate2($("#" + yearCtrl).get(0).value, $("#" + monthCtrl).get(0).value) == "-1") {
			alert("일자를 정확하게 입력 바랍니다.");
			$("#" + dayCtrl).get(0).value = "";
			$("#" + yearCtrl).get(0).focus();
		}
		else
			$("#" + dayCtrl).get(0).value = checkDate2($("#" + yearCtrl).get(0).value, $("#" + monthCtrl).get(0).value);
	}

	if ($("#" + dayCtrl).get(0).value.length > 0) {
		if ($("#" + dayCtrl).get(0).value.length == 1) {
			if ($("#" + dayCtrl).get(0).value == "0")
				$("#" + dayCtrl).get(0).value = "01"
			else
				$("#" + dayCtrl).get(0).value = "0" + $("#" + dayCtrl).get(0).value
		}

		if ($("#" + dayCtrl).get(0).value.length == 2 && $("#" + dayCtrl).get(0).value == "00")
			$("#" + dayCtrl).get(0).value = "01";
	}
	else {
		$("#" + dayCtrl).get(0).value = "01";
	}
}

//email 유효성체크
function validateEmail(email) {
	var re = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/;
	return re.test(email);
}

function MakeCustomerAlarmData(smsMessage, formType, email, userName, receiveNumber) {
	this.Dto.CustomerAlarm = {};
	if (smsMessage)
		this.Dto.CustomerAlarm.SMS_MESSAGE = smsMessage;
	if (formType)
		this.Dto.CustomerAlarm.FORM_TYPE = formType;
	if (email)
		this.Dto.CustomerAlarm.EMAIL = email;
	if (userName)
		this.Dto.CustomerAlarm.USER_NAME = userName;
	if (receiveNumber)
		this.Dto.CustomerAlarm.RECEIVE_NUMBER = receiveNumber;
}

function MakeManageAlarmData(menuId, smsMessage, memoMessage, useDefaultSmsMessage, useDefaultMemoMessage, lanType) {
	this.Dto.ManageAlarm = {};
	if (menuId)
		this.Dto.ManageAlarm.MENU_ID = menuId;
	if (smsMessage)
		this.Dto.ManageAlarm.SMS_MESSAGE = smsMessage;
	if (memoMessage)
		this.Dto.ManageAlarm.MEMO_MESSAGE = memoMessage;
	if (useDefaultSmsMessage)
		this.Dto.ManageAlarm.USE_DEFAULT_SMS_MESSAGE = useDefaultSmsMessage;
	if (useDefaultMemoMessage)
		this.Dto.ManageAlarm.USE_DEFAULT_MEMO_MESSAGE = useDefaultMemoMessage;
	if (lanType)
		this.Dto.ManageAlarm.LAN_TYPE = lanType;
}

function MakeReplaceParamsInfosData(fromsite, nation, company, username) {
	this.Dto.ReplaceParamsInfos = {};
	this.Dto.ReplaceParamsInfos.FROM_SITE = fromsite;
	this.Dto.ReplaceParamsInfos.NATION = nation;
	this.Dto.ReplaceParamsInfos.COMPANY = company;
	this.Dto.ReplaceParamsInfos.USER_NAME = username;
}

function MakeWebMailManageAlarmData(menuId) {
	this.Dto.WebMailManageAlarm = {};
	if (menuId)
		this.Dto.WebMailManageAlarm.MENU_ID = menuId;
}

// fnKeyDown
function fnKeyDown() {
	var k = (netscape) ? window.event.which : window.event.keyCode;

	if (k == 13) {
		sendit();
		return false;
	}
}

function eventKeyDown() {
	k = (netscape) ? window.event.which : window.event.keyCode;

	if (k == 13) {
		if (nextfield == 'done') {
			excuteLogin();
		}
		else {
			document.getElementById(nextfield).focus();
		}
	}
}

//전화번호입력란에 숫자, '-'만 입력되도록
function fnNumChk(e) {
	var strValChk = e.value.replace(/-/gi, "");
	if (/[^0123456789]/g.test(strValChk)) {
		if (e.value.length > 0) {
			e.value = e.value.substr(0, e.value.length - 1)
		}
		e.focus();
	}
}

//국가번호입력란에 숫자, '+'만 입력되도록
function fnNationNumChk(e) {
	var strValChk = e.value.replace(/\+/gi, "");
	if (/[^0123456789]/g.test(strValChk)) {
		if (e.value.length > 0) {
			e.value = e.value.substr(0, e.value.length - 1)
		}
		e.focus();
	}
}

var nextfield = "done";
var nextline = "done";
var netscape = "";
var f_move = ",";
ver = navigator.appVersion; len = ver.length;
for (iln = 0; iln < len; iln++) {
	if (ver.charAt(iln) == "(") break;
}
netscape = (ver.charAt(iln + 1).toUpperCase() != "C");

//=====================PoST-BACK 막기 시작============================

function checkCR(evt) {
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type == "text")) { return false; }
}
document.onkeypress = checkCR;

//=====================PoST-BACK 막기 끝============================

function keyDown(DnEvents) {
	k = (netscape) ? DnEvents.which : window.event.keyCode;
	var tagtype = GetTagType(DnEvents);
	switch (k) {       // -----------0
		case 13:
			if (GetTagType(DnEvents) == "textarea") {
			} else {

				if (nextline != "done" && window.event.ctrlKey && window.event.srcElement.name != null && $("[name=" + window.event.srcElement.name + "]").length > 1 && window.event.keyCode == 13) {
					var arrNextline = new Array();
					var tab = 0;
					arrNextline = nextline.split('/');
					if (arrNextline.length > 1)
						tab = Number(arrNextline[1]);
					var iFindex = $("[name=" + window.event.srcElement.name + "]").index($("#" + window.event.srcElement.id)) + 2 + tab;
					if (arrNextline[0] == "acct_no" || nextline == "cr_dr")
						iFindex -= 1;
					$("#" + arrNextline[0] + iFindex).focus();
				}
				else {
					switch (nextfield) {   //  ------------1
						case 'done':
							return true;
							break;
						case 'save':
							Click_F8();
							break;
						case 'search_bt':
							searchit();
							break;
						default:

							if ($("#" + nextfield) == undefined)
								$(nextfield).focus();
							else
								$("#" + nextfield).focus();
							return false;
							break;
					}   // ------------1
				}
			}
			break;
		case 113:   //F2단축키
			if (window.Click_F2 && window.Click_F2 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F2();
			}
			break;
		case 115:   //F4단축키
			if (window.Click_F4 && window.Click_F4 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F4();
			}
			break;
		case 116:   //F5단축키
			if (window.Click_F5 && window.Click_F5 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F5();
			}
			break;
		case 117:   //F6단축키
			if (window.Click_F6 && window.Click_F6 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F6();
			}
			break;
		case 118:   //F7단축키
			if (window.Click_F7 && window.Click_F7 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F7();
			}
			break;
		case 119:   //F8단축키
			if (window.Click_F8 && window.Click_F8 instanceof Function) {
				if (window.event) {
					if (tagtype == "file") {
						window.event.returnValue = false;
					}
					else {
						window.event.keyCode = 0;
						window.event.returnValue = false;
					}
				} else {

					DnEvents.preventDefault();
				}
				Click_F8();
			}
			break;
		case 120:   //F9단축키
			if (window.Click_F9 && window.Click_F9 instanceof Function) {
				if (window.event) {
					window.event.keyCode = 0;
					window.event.returnValue = false;
				} else {

					DnEvents.preventDefault();
				}
				Click_F9();
				return false;
			}
			break;
		case 38:   //방향키중 위로키
			if (f_move != "," && f_move != "") {
				var fc_move = f_move.split(",")
				try {
					if (fc_move[0] != "") $("#" + fc_move[0]).get(0).focus();
				} catch (e) { return true; }
				return false;
			}
			break;
		case 40:   //방향키중 아래키
			if (f_move != "," && f_move != "") {
				var fc_move = f_move.split(",")
				try {
					if (fc_move[1] != "") $("#" + fc_move[1]).get(0).focus();
				} catch (e) { return true; }

				return false;
			}
			break;
	}         //------------0


}

document.onkeydown = keyDown;
if (netscape) document.captureEvents(Event.KEYDOWN | Event.KEYUP);

//########●설 명       :  모든 문자열중 공백 제거 함수   ●return 값   : String
/// 왼쪽 공백없애는 함수

//########●설 명:  문자 바꾸기, 사용법●return 값: String

String.prototype.replaceAll = function (str1, str2) {
	var temp_str = "";
	if (this.trim && this.trim() != "" && str1 != str2) {
		temp_str = this.trim();
		while (temp_str.indexOf(str1) > -1) {
			temp_str = temp_str.replace(str1, str2);
		}
	}
	return temp_str;
}

//########●설 명:  숫자만 가져 오기●return 값: number
function unformatNumber(num, numType) {
	numType = numType || 0;
	if (numType == 0)  //rturn : number type
		return (num.trim().replace(/([^0-9\.\-])/g, '') * 1);
	else                        // return : string type
		return num.trim().replace(/([^0-9\.\-])/g, '');
}

//keyCode 설정
function KeycodeCommon(e) {
	var result;
	if (window.event)
		result = window.event.keyCode;
	else if (e)
		result = e.which;
	return result;
}


//해당태그의 타입을 가져온다.
function GetTagType(e) {
	var result;
	if (window.event)
		result = event.srcElement.type;
	else if (e)
		result = e.target.type;
	return result;
}
////정수' + Lpoint + '자리\n\n 실수 ' + point + '자리까지 입력가능합니다.

var oldNum = 0;
function formatNumber(num, point, e, prefix, Lpoint, altTxt) {
	point = point || 0;
	Lpoint = Lpoint || 0;
	prefix = prefix || '';
	altTxt = altTxt || "입력 최대 길이를 초과하였습니다.";
	e = e || '';
	num += '';
	var sign = '';
	var keycode = KeycodeCommon(e);
	if (e != "" && (keycode == 107 || keycode == 187))
		num = num.trim().replace(/([+])/, '000');
	if (!(keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40 || keycode == 9 || keycode == 13)) {
		if (keycode == 109 && num.length > 2) {
			if (e == '') {
				return prefix + sign + splitLeft + splitRight;
			} else {
				e.value = prefix + sign + num;
				return;
			}
		}
		if (num.substring(0, 1) == "-" || num.substring(0, 2) == "0-") {
			if (num.substring(0, 2) == "0-") {
				sign = '-';
				num = num.substring(1, num.length);
			} else {
				sign = num.substring(0, 1);
				num = num.substring(1, num.length);
			}
		}
		if (num == ".") {
			num = "0.";
		}
		var splitStr = num.split('.');
		var splitLeft = '';
		if (!(splitStr[0] == '' || isNaN(unformatNumber(splitStr[0])))) {
			var splitLeft = unformatNumber(splitStr[0]).toString();
			if (splitLeft.length > Lpoint && Lpoint != 0) {
				//=================2011.03.11임명식 추가 시작
				if (e != "") {
					splitLeft = splitLeft.substring(0, Lpoint);
					if (num.indexOf(".") == -1 || point == 0) {
						splitRight = "";
					} else {
						splitRight = splitStr.length > 1 ? '.' + unformatNumber(splitStr[1].substring(0, point), 1) : '';
					}
					var regx = /(\d+)(\d{3})/;
					while (regx.test(splitLeft)) {
						splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
					}
					e.value = splitLeft + splitRight;
				}
				//==============2011.03.11임명식 추가 끝
				alert(altTxt);
				//formatNumber(oldNum, point, e, prefix, Lpoint, altTxt)
				return;
			}
		}
		var splitRight = "";
		if (num.indexOf(".") == -1 || point == 0) {
			splitRight = "";
		} else {
			splitRight = splitStr.length > 1 ? '.' + unformatNumber(splitStr[1].substring(0, point), 1) : '';
		}
		var regx = /(\d+)(\d{3})/;
		while (regx.test(splitLeft)) {
			splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
		}
		if (e == '') {
			oldNum = prefix + sign + splitLeft + splitRight;
			return prefix + sign + splitLeft + splitRight;
		} else {
			if (num.indexOf(".") == -1 || point == 0) {
				num = splitLeft;
			} else {
				if (splitStr[1] == undefined) {
					num = splitLeft + ".";
				} else {
					num = splitLeft + splitRight;
				}
			}
			if (isNaN(unformatNumber(num))) {
				e.value = 0;
				oldNum = 0;
			} else {
				e.value = prefix + sign + num;
				oldNum = prefix + sign + num;
			}
		}
	}
}

//wname 사용
function gfnPopUp1(desurl, wname, scflag, width, height) {
	var newurl = desurl;
	window.open(newurl, wname, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scflag + ',resizable=yes,copyhistory=no,width=' + width + ',height=' + height);
}

function checkDate(yy, mm, dd) {
	if (yy == "" || mm == "" || dd == "") {
		return -1;
	}
	var yy = Number(yy);
	var mm = Number(mm);
	var dd = Number(dd);

	var md = 31;
	if ((mm < 1) || (mm > 12)) {
		return -1;
	} else if (mm == 2) { //윤달체크
		if (((yy % 4 == 0) && (yy % 100 != 0)) || (yy % 400 == 0)) { // 윤달이 아니면...
			md = 29;
		} else {
			md = 28;
		}
	} else if ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) {
		md = 30;
	}
	if ((dd >= 1) && (dd <= md)) {
	} else {
		return -1;
	}
	return 0;
}

function checkDate2(yy, mm) {
	if (yy == "" || mm == "" || dd == "") {
		return -1;
	}
	var yy = Number(yy);
	var mm = Number(mm);
	var dd = Number(dd);
	var md = 31;
	if ((mm < 1) || (mm > 12)) {
		return -1;
	} else if (mm == 2) { //윤달체크
		if (((yy % 4 == 0) && (yy % 100 != 0)) || (yy % 400 == 0)) { // 윤달이 아니면...
			md = 29;
		} else {
			md = 28;
		}
	} else if ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) {
		md = 30;
	}

	return md;
}

/*--------------------------------------------------
  기능   : Cookie Setting
  INPUT  : name, value
           expireFg : 'Y' : 2020년 까지 쿠키저장
           expireFg : 'N' : session이 끊어질때 쿠키지움
  RETURN : NONE
----------------------------------------------------*/
function setCookie(name, value, expireFg) {
	var expireDate = new Date(2020, 1, 1, 1, 1, 1);

	if (expireFg == 'Y')
		document.cookie = name + "=" + value + "; expires=" + expireDate.toGMTString();
	else
		document.cookie = name + "=" + value + ";";

}

//만료
function setCookieDay(cName, cValue, cDay) {
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if (typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	document.cookie = cookies;
}

/*--------------------------------------------------
  기능   : Cookie Get
  INPUT  : name
  RETURN : 쿠키값( 없으면 "" )
----------------------------------------------------*/
function getCookie(name) {
	var cookieFound = false;
	var start = 0;
	var end = 0;
	var cookieString = document.cookie;

	var i = 0;

	// name에 해당되는 cookie를 찾는다.
	while (i <= cookieString.length) {
		start = i;
		end = start + name.length;
		if (cookieString.substring(start, end) == name) {
			cookieFound = true;
			break;
		}
		i++;
	}

	// cookie를 찾았으면 해당하는 값을 그렇지 않으면 ""을 return ;
	if (cookieFound) {
		start = end + 1;
		end = document.cookie.indexOf(";", start);
		if (end < start)
			end = document.cookie.length;
		return document.cookie.substring(start, end);
	}

	return "";
}

/*--------------------------------------------------
  기능   : text 입력시 숫자이외의 키를 눌렀을때 무효화시킨다.
  INPUT  : 없음
  RETURN : 이벤트 무효화

  주의!  : onKeypress 이벤트만 사용할것
          예) <input type="text" onKeypress="jsOnlyNumberKey();">
----------------------------------------------------*/
function jsOnlyNumberKey() {
	if (event != null) {
		if (event.keyCode < 48 || event.keyCode > 57) {
			event.returnValue = false;
		}
	}
}

// 내  용 : 이메일 유효성 체크(빈값허용)
//           영문,숫자를 제외한 다른 문자는 기본적으로 허용 안함
//           예외 특수문자허용: '-', '_', '.'
//           '@'값 1개만 허용 및 해당 문자 전후로 글자수 입력 체크
// 사용법 : onblur 및 sendit
function fnEmailCheck(email) {
	email.value = email.value.trim();

	if (email.value == "") {
		return true;
	}

	var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/;
	if (regex.test(email.value) == false) {
		email.focus();
		return true;
	}
	else
		return false;
}

// trim(), ltrim(), rtrim() 사용방법  
// var strOrg = " abcd ";
// var trimStr = strOrg.trim();
// var ltrimStr = strOrg.ltrim();
// var rtrimStr = strOrg.rtrim();  

// trim() : 선행, 후행 공백제거
String.prototype.trim = function (chars) {
	if (chars) {
		var str = "[" + chars + "\\s]+";
		return this.replace(new RegExp(str, "g"), "");
	}

	return this.replace(/^\s+|\s+$/g, "");
}

String.prototype.ltrim = function (chars) {
	if (chars) {
		var str = "^[" + chars + "\\s]+";
		return this.replace(new RegExp(str, "g"), "");
	}

	return this.replace(/^\s+/, "");
}

String.prototype.rtrim = function (chars) {
	if (chars) {
		var str = "[" + chars + "\\s]+$";
		return this.replace(new RegExp(str, "g"), "");
	}

	return this.replace(/\s+$/, "");
}

//-->

// 작성자 : 신선미
// 내  용 : 특수기호 제거
// 사용법 : fnReturnValue(obj)
function fnReturnValue(obj) {
	var text = obj.value;
	text = text.replace(/[\{\}\[\]\/?,;:|\)*~`!^\+<>@\#$%&\\\=\(\'\"]/gi, "");
	obj.value = text;
}

/*--------------------------------------------------
기능   : 날짜와 날짜 사이의 일수를 리턴한다.
INPUT  : startDt(YYYYMMDD), endDt(YYYYMMDD)
RETURN : rtnValue : 날짜와 날짜 사이의 일수
           -1       : ERROR..!
     MSG :

----------------------------------------------------*/
function jsGetBetweenDay(startDt, endDt) {
	var rtnValue = 0;

	// input date의 날짜 체크
	var yyyy = startDt.substring(0, 4) + "";
	var mm = startDt.substring(4, 6) + "";
	var dd = startDt.substring(6, 8) + "";
	var startDate = new Date(yyyy, parseInt(mm) - 1, dd); // 달 은 한달이 느리므로 1을 빼준다.

	yyyy = endDt.substring(0, 4) + "";
	mm = endDt.substring(4, 6) + "";
	dd = endDt.substring(6, 8) + "";
	var endDate = new Date(yyyy, parseInt(mm) - 1, dd);

	// 1000분의 1초 단위를 일 단위로 바꾸기
	rtnValue = ((endDate - startDate) / 60 / 60 / 24 / 1000);

	return rtnValue;
}

// 날짜를 YYYYMMDD 형식으로 변경
Date.prototype.yyyymmdd = function () {
	var mm = this.getMonth() + 1; // getMonth() is zero-based
	var dd = this.getDate();

	return [this.getFullYear(),
	(mm > 9 ? '' : '0') + mm,
	(dd > 9 ? '' : '0') + dd
	].join('');
};

// 날짜 더하기
Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
}

// 특수문자 및 script 태그 포함 여부 체크
// 리턴형태 {result: false,message =""}
function isContainsLimitedSpecial(e) {
	var returnValue = $(e).val();
	if (returnValue == "")
		return {
			result: true,
			message: ""
		};

	//"입력 제한된 문자가 입력되었습니다.\n아래 문자는 입력할 수 없습니다. \n∬—(Em대쉬)";
	var regex1 = /[∬—]/g;
	if (regex1.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG05340
		};


	//"입력 제한된 태그가 입력되었습니다.\n스크립트는 입력할 수 없습니다.";
	var regex2 = /<script|<\/script>/gi;
	if (regex2.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG05341
		};

	//리스폰스.라이트, 플러시, 버퍼, 시스템 괄호 같은 시스템에 영향을 주는 스크립트 입력시 차단 정규식
	var regex3 = /response.(flush|write|buffer)|system\(/ig

	if (regex3.test(returnValue)) {
		return {
			result: false,
			message: maxsoft.resource.MSG04743
		};
	}

	return {
		result: true,
		message: ""
	};
}

// 특수문자 및 script 태그 포함 여부 체크
// 리턴형태 {result: false,message =""}
function isContainsBasicLimitedSpecial(e) {
	var returnValue = $(e).val();
	if (returnValue == "")
		return {
			result: true,
			message: ""
		};

	//"입력 제한된 문자가 입력되었습니다.\n아래 문자는 입력할 수 없습니다. \n∬—(Em대쉬)";
	var regex1 = /[\u0013\u0010\u0008\u202D\u202C?∬?"＇'\s\\]/g;
	if (regex1.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG05380
		};


	//"입력 제한된 태그가 입력되었습니다.\n스크립트는 입력할 수 없습니다.";
	var regex2 = /<script|<\/script>/gi;
	if (regex2.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG05341
		};

	//리스폰스.라이트, 플러시, 버퍼, 시스템 괄호 같은 시스템에 영향을 주는 스크립트 입력시 차단 정규식
	var regex3 = /response.(flush|write|buffer)|system\(/ig;

	if (regex3.test(returnValue)) {
		return {
			result: false,
			message: maxsoft.resource.MSG04743
		};
	}

	return {
		result: true,
		message: ""
	};
}

function isContainsBasicNameLimitedSpecial(e) {
	var returnValue = $(e).val();
	if (returnValue == "")
		return {
			result: true,
			message: ""
		};

	//"입력 제한된 문자가 입력되었습니다.\n아래 문자는 입력할 수 없습니다. \n∬—(Em대쉬)";
	var regex1 = /['"∬—\\]/g;
	if (regex1.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG04672
		};


	//"입력 제한된 태그가 입력되었습니다.\n스크립트는 입력할 수 없습니다.";
	var regex2 = /<script|<\/script>/gi;
	if (regex2.test(returnValue))
		return {
			result: false,
			message: maxsoft.resource.MSG05341
		};

	//리스폰스.라이트, 플러시, 버퍼, 시스템 괄호 같은 시스템에 영향을 주는 스크립트 입력시 차단 정규식
	var regex3 = /response.(flush|write|buffer)|system\(/ig;

	if (regex3.test(returnValue)) {
		return {
			result: false,
			message: maxsoft.resource.MSG04743
		};
	}

	return {
		result: true,
		message: ""
	};
}

function getReplacedSpecial2to1(value, removeMultiSpace) {
	if (value == "")
		return "";

	// 1바이트 치환대상 문자 처리
	var returnValue = value.replace(/[＆｜？＝　]/g, function (match) {
		switch (match) {
			case "＆":
				return "&";
			case "｜":
				return "|";
			case "？":
				return "?";
			case "＝":
				return "=";
			case "　":
				return " ";
		}
		return "";
	});

	if (removeMultiSpace == true) {
		returnValue = returnValue.replace(/[  \t]{2,}|[ \t]/g, " ");
	}

	return returnValue;
}

// 태그 제거 및 특수문자 치환
function getReplacedSpecialRemoveTag(value, scriptNames) {
	if (value == "")
		return "";

	//2바이트 치환대상 문자 처리|앞공백제거|뒷공백제거
	value = value.replace(/[&|?=]|^ *| *$/g, function (match) {
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

	// html에서 주석 및 script 내용 제거
	value = value.replace(/<style([\s\S]*?)<\/style>/gi, function (match, contents, offset, s) {
		return "<style" + contents.replace(/(<!--)|(-->)/g, '') + "</style>";
	})
		.replace(/<!--[^>]*-->/g, "")
		.replace(/<script[^<]*<\/script>/g, "")
		.replace(/ /g, "&nbsp;")

	// 입력받은 태그 제거
	if (!scriptNames) {
		scriptNames = ['noframes', 'noscript', 'noembed', "meta", "iframe", 'script'];
	}

	if (!$.isArray(scriptNames)) {
		scriptNames = [scriptNames];
	}

	for (var i = 0; i < scriptNames.length; i++) {
		var scriptName = scriptNames[i];
		value = value.replace(new RegExp("<" + scriptName + "([^'\\\"]|\\\"[^\\\"]*\\\"|'[^']*')*?</" + scriptName + ">", 'igm'), '')
			.replace(new RegExp('<' + scriptName + ".*?/>", 'igm'), '')
			.replace(new RegExp('<' + scriptName + ".*?>", 'igm'), '');
	}

	return value;
}

/*
* 입력값이 특정 문자(chars)만으로 되어있는지 체크
* 특정 문자만 허용하려 할 때 사용
* ex) if (!containsCharsOnly(form.blood,"ABO")) {
*         alert!("혈액형 필드에는 A,B,O 문자만 사용할 수 있습니다.");
*     }
*/
function containsCharsOnly(input, chars) {
	for (var inx = 0; inx < input.length; inx++) {
		if (chars.indexOf(input.charAt(inx)) == -1)
			return false;
	}
	return true;
}

function isIE89() {
	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	var browser;

	// MS 계열 브라우저를 구분하기 위함.
	if (name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
		browser = 'ie';
		if (name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
			agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
			if (parseInt(agent[1]) <= 9)
				return true;
		}
	}

	return false;
}

function getErrorMsgByLanType(forceLanType) {
	var resource = "";
	var lanType = "";

	if (lanType == "" && $("#viewLanType").length > 0 && $("#viewLanType").val() != "")
		lanType = $("#viewLanType").val();

	if (lanType == "" && $("#siteLanType").length > 0 && $("#siteLanType").val() != "")
		lanType = $("#siteLanType").val();

	if (forceLanType != undefined && forceLanType != null && forceLanType != "")
		lanType = forceLanType;

	if (lanType == "") {
		if (document.location.host.indexOf(".maxsoft.com") > 0) {
			var subDomain = document.location.pathname.substring(1, 3);
			if (subDomain == "kr")
				lanType = "ko-kr";
			else if (subDomain == "es")
				lanType = "es";
			else if (subDomain == "id")
				lanType = "id-id";
			else if (subDomain == "jp")
				lanType = "ja-jp";
			else if (subDomain == "my")
				lanType = "en-my";
			else if (subDomain == "th")
				lanType = "th-th";
			else if (subDomain == "tw")
				lanType = "zh-tw";
			else if (subDomain == "us")
				lanType = "en-us";
			else if (subDomain == "vn")
				lanType = "vi-vn";
			else if (subDomain == "uz")
				lanType = "ru-UZ";
			else if (subDomain == "hk")
				lanType = "zh-HK";
		}
		else if (document.location.host.indexOf(".maxsoft.cn") > 0) {
			lanType = "zh-cn";
		}
		else {
			lanType = "en-us";
		}
	}

	switch (lanType.toLowerCase()) {
		case "ko-kr": resource = "신청이 완료되지 않았습니다.(브라우저 버전이 원인일 가능성)\r\n\r\n* 해결방법\r\n    1) 영업팀으로 연락(1566-5333)주시면 즉시 신청을 도와드리겠습니다.\r\n    2) 아래 확인 버튼 클릭 후, 이름/연락처를 남겨주시면 영업팀에서 도와드리기 위해 연락드리겠습니다.\r\n\r\n감사합니다."; break;
		case "zh-cn": resource = "申请未成功。(可能是浏览器版本问题)\r\n\r\n* 解决方法\r\n    1) 请联系我们(400-876-8200)，我们将人工为您开通。\r\n    2) 或者点击确定后，填写您的联系方式，我们将联系您协助您开通。\r\n\r\n谢谢。"; break;
		case "zh-tw": resource = "申請尚未完成。(可能是瀏覽器版本的問題)\r\n\r\n* 解決方式\r\n    1) 請與我們聯繫(02-8660-3660)，業務專員將會為您服務。\r\n    2) 點擊下端確定按鈕，留下您的姓名與電話，業務專員將 會與您聯繫協助操作。\r\n\r\n謝謝。"; break;
		case "vi-vn": resource = "Đăng ký chưa được hoàn tất(Có thể là do phiên bản trình duyệt)\r\n\r\n* Cách xử lý\r\n    1) Liên hệ bộ phận kinh doanh(028-3837-3100) để được hỗ trợ đăng ký ngay.\r\n    2) Nhấn nút Xác nhận, và để lại tên/số điện thoại, bộ phận kinh doanh sẽ liên hệ để hỗ trợ bạn.\r\n\r\nXin chân thành cảm ơn."; break;
		case "id-id": resource = "Pengajuan belum selesai (Masalah pada Versi Browser)\r\n\r\n* Panduan\r\n    1) Mohon hubungi (021-5051-5105), tim penjualan kami akan membantu Anda.\r\n    2) Klik konfirmasi, mohon tinggalkan nama dan detail kontak Anda, tim penjualan kami akan menghubungi dan memandu Anda.\r\n\r\nTerima kasih."; break;
		case "en-my": resource = "Submission has not been completed (Browser Version Issue)\r\n\r\n* How to\r\n    1) Please contact (+603-2774 7444), our sales team will guide you through.\r\n    2) Click confirm, please leave your name and contact details, our sales team will contact you and guide you through.\r\n\r\nThank you."; break;
		case "th-th": resource = "การสมัครไม่สำเร็จ (อาจเป็นเพราะเวอร์ชันเบราว์เซอร์)\r\n\r\n* วิธีแก้ไข\r\n    1) โปรดติดต่อฝ่ายขาย (02-026-6231) ฝ่ายขายจะช่วยคุณในการสมัคร\r\n    2) เมื่อคลิกปุ่มยืนยันที่ด้านล่าง ให้คุณระบุชื่อ/ข้อมูลในการติดต่อกลับ ฝ่ายขายจะติดต่อคุณเพื่อดำเนินการช่วยเหลือ\r\n\r\nขอขอบคุณ"; break;
		case "ru-uz": resource = "Submission has not been completed (Browser Version Issue)\r\n\r\n Click confirm, please leave your name and contact details, our sales team will contact you and guide you through.\r\n\r\nThank you."; break;
		case "zh-hk": resource = "申請尚未完成。(可能是瀏覽器版本的問題)\r\n\r\n* 解決方式\r\n    1) 請與我們聯繫(+852-84805036)，業務專員將會為您服務。\r\n    2) 點擊下端確定按鈕，留下您的姓名與電話，業務專員將 會與您聯繫協助操作。\r\n\r\n謝謝。"; break;
		default: resource = "Submission has not been completed (Browser Version Issue)\r\n\r\n Click confirm, please leave your name and contact details, our sales team will contact you and guide you through.\r\n\r\nThank you."; break;
	}

	return resource;
}

function getContactMsgByLanType(forceLanType) {
	var resource = "";
	var lanType = "";

	if (lanType == "" && $("#viewLanType").length > 0 && $("#viewLanType").val() != "")
		lanType = $("#viewLanType").val();

	if (lanType == "" && $("#siteLanType").length > 0 && $("#siteLanType").val() != "")
		lanType = $("#siteLanType").val();

	if (forceLanType != undefined && forceLanType != null && forceLanType != "")
		lanType = forceLanType;

	switch (lanType.toLowerCase()) {
		case "ko-kr": resource = "정상적으로 접수되었습니다.\r\n\r\n담당자가 곧 연락드리겠습니다.\r\n감사합니다."; break;
		case "ja-jp": resource = "お申込みが完了しました。\r\n\r\n担当の者がご連絡申し上げます。\r\nお申込みいただき、ありがとうございます。"; break;
		case "zh-cn": resource = "试用申请已提交成功。\r\n\r\n专业顾问会马上与您联系并提供账号。\r\n感谢您的关注和支持。"; break;
		case "zh-tw": resource = "已收到您的申請。\r\n\r\n專業顧問將立即與您聯繫。\r\n謝謝。"; break;
		case "vi-vn": resource = "maxsoft đã tiếp nhận yêu cầu của bạn.\r\n\r\nĐội tư vấn sẽ liên hệ với bạn sớm nhất.\r\nXin cảm ơn."; break;
		case "es": resource = "Su solicitud ha sido enviado.\r\n\r\nUn consultor de maxsoft se comunicará con usted.\r\nGracias."; break;
		case "id-id": resource = "Pengajuan telah kami terima.\r\n\r\nPihak kami akan segera menghubungi anda.\r\nTerimakasih."; break;
        case "en-my": resource = "Your request has been submitted successfully.\r\n\r\nmaxsoft consultant will contact you shortly.\r\nThank you."; break;
        case "en-ph": resource = "Your request has been submitted successfully.\r\n\r\nmaxsoft consultant will contact you shortly.\r\nThank you."; break;
		case "th-th": resource = "ลงทะเบียนสำเร็จ\r\n\r\nจะมีผู้เชียวชาญติดต่อคุณไปในไม่ช้านี้\r\nขอขอบพระคุณ"; break;
		case "ru-uz": resource = "Your request has been submitted successfully.\r\n\r\nmaxsoft consultant will contact you shortly.\r\nThank you."; break;
		case "zh-hk": resource = "已收到您的申請。\r\n\r\n專業顧問將立即與您聯繫。\r\n謝謝。"; break;
		default: resource = "Your request has been submitted successfully.\r\n\r\nmaxsoft consultant will contact you shortly.\r\nThank you."; break;
	}

	return resource;
}

//암호화
function encryptXor(str, key) {
	var input = toUtf8(str),
		output = [];

	for (var x = 0, len = input.length; x < len; x++) {
		var hexVal = (input[x] ^ key.charCodeAt(x % key.length)).toString(16);
		output.push((hexVal.length < 2 ? '0' : '') + hexVal.toLowerCase());
	}
	return output.join('');
}

function toUtf8(key) {
	var str = key,
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
}

// 방문교육요청용 start
function getAddressByApi() {
	var param = {
		sessionURL: TargetServer + "/GMCAPI/Service/SaleSite/GetAddressSiDoKR",
		callbackApi: function (data) {
			if (data.Data != null && data.Data.length > 0) {
				var str = "<li value=\"\"><a href=\"# return false;\" onclick=\"fnSetAddress_1('',this,'시/도');\">시/도</a></li>";
				for (var i = 0; i < data.Data.length; i++) {
					str += "<li value=\"\"" + data.Data[i].SIDO + "\"><a href=\"# return false;\" onclick=\"fnSetAddress_1('" + data.Data[i].SIDO + "',this,'" + data.Data[i].SIDO + "');\">" + data.Data[i].SIDO + "</a></li>";
				}
				$("#Address_1Div").html(str);
			}

			var paramGuBun = {
				sessionURL: TargetServer + "/GMCAPI/Service/SaleSite/GetAddressGuBunBySiDo",
				callbackApi: function (data) {
					if (data.Data != null && data.Data.length > 0) {
						dsGugun = data.Data;
					}
				}
			};

			gmcSessionApi(paramGuBun);
		}
	};

	gmcSessionApi(param);
}

function setEducationTime(isKr) {
	//현재 시간 이전의 방문요청 시간 안나오게 처리
	var min = Number($('#hidMinute').val());
	if (min < 10)
		min = "0" + min;
	var time = Number($('#hidHour').val() + min);
	var lunchTime = isKr ? 1330 : 1400;

	//10시 2시 4시
	$('#A').removeClass();
	$('#P').removeClass();
	$('#F').removeClass();
	$('#spAMPM_TYPE').attr("disabled", false);

	if (time >= 0 && time <= 959) {
		//실제 시간 값 hidAMPM_TYPE이 날아감. hidAMPM_TYPE 값 10시로 변경
		$("#hidAMPM_TYPE").val("A");
		$('#spAMPM_TYPE').text((isKr ? "오전" : "AM") + " 10:00");
		$('#A').show().addClass("active");
		$('#P').show();
		$('#F').show();
	} else if (time >= 1000 && time <= (lunchTime - 1)) {
		var lunchText = (lunchTime - 1200).toString();
		if (lunchText.length < 4)
			lunchText = ("00" + lunchText).substr(-4);

		//hidAMPM_TYPE 값 2시로 변경
		$("#hidAMPM_TYPE").val("P");
		$('#spAMPM_TYPE').text((isKr ? "오후" : "PM") + " " + lunchText.substr(0, 2) + ":" + lunchText.substr(-2));
		$('#A').addClass("disabled");
		$('#P').show().addClass("active");
		$('#F').show();

	} else if (time >= lunchTime && time <= 1559) {
		//hidAMPM_TYPE 값 4시로 변경
		$("#hidAMPM_TYPE").val("F");
		$('#spAMPM_TYPE').text((isKr ? "오후" : "PM") + " 04:00");
		$('#A').addClass("disabled");
		$('#P').addClass("disabled");
		$('#F').show().addClass("active");
	} else {
		//오후 4시 이후엔 다음 날로 변경하도록 변경
		var tomorrow = new Date();
		tomorrow.setTime(tomorrow.getTime() + 1000 * 60 * 60 * 24);

		var tomorrowMonth = tomorrow.getMonth() + 1;
		var tomorrowMonthStr = ("0" + tomorrowMonth.toString()).substr(-2);
		var $monthli = $("#MonthDiv li[value='" + tomorrowMonthStr + "']");
		if ($monthli.length == 0)
			$monthli = $("#MonthDiv li[value='" + tomorrowMonth.toString() + "']");

		//hidAMPM_TYPE 값 10시로 변경
		$("#hidAMPM_TYPE").val("A");
		$('#spYear').text(tomorrow.getFullYear());
		fnSetMonth(tomorrowMonthStr, $monthli.find("a").get(0), $monthli.find("a").text());
		$('#txtDay').val(tomorrow.getDate());

		$('#spAMPM_TYPE').text((isKr ? "오전" : "AM") + " 10:00");
		$('#spAMPM_TYPE').removeClass("active");
	}
}

function setTime(e, currentDate, isKr) {
	var changeYear = $('#hidYear').val();
	var changeMonth = $('#hidMonth').val().replace("월", "");
	if (changeMonth.length == 1) changeMonth = '0' + changeMonth;
	var changeDay = $('#txtDay').val();
	var changeDate, betweenDay;
	changeDate = changeYear + changeMonth + changeDay;
	betweenDay = jsGetBetweenDay(currentDate, changeDate);

	$('#A').removeClass();
	$('#P').removeClass();
	$('#F').removeClass();

	//희망일시 과거의 경우
	if (betweenDay < 0) {
		$('#spAMPM_TYPE').text((isKr ? "오전" : "AM") + " 10:00");
		$("#hidAMPM_TYPE").val("A");
		$('#A').addClass("disabled active");
		$('#P').addClass("disabled");
		$('#F').addClass("disabled");
		$('#spAMPM_TYPE').attr("disabled", true);
		//희망일 시 미래일 경우
	} else if (betweenDay > 0) {
		$('#spAMPM_TYPE').text((isKr ? "오전" : "AM") + " 10:00");
		$("#hidAMPM_TYPE").val("A");
		$('#A').addClass("active");
		$('#A').removeClass("disabled");
		$('#P').removeClass("disabled");
		$('#F').removeClass("disabled");
		$('#spAMPM_TYPE').attr("disabled", false);
		//희망 일시 금일의 경우
	} else {
		if (betweenDay == 0) setEducationTime(isKr);
	}
}

function fnSetAMPM_TYPE(value, obj, txt) {
	if ($(obj).parent().is(".disabled")) {
		$("#AMPM_TYPEDiv").show();
	} else {
		$("#hidAMPM_TYPE").val(value);
		$("#spAMPM_TYPE").text(txt);
		$("#AMPM_TYPEDiv").find("li").removeClass("active");
		$(obj.parentNode).addClass("active");
	}
}

function fnSetMonth(value, obj, txt) {
	$("#hidMonth").val(value);
	$("#spMonth").text(txt);
	$("#MonthDiv").find("li").removeClass("active");
	$(obj.parentNode).addClass("active");
}

function fnSetYear(value, obj, txt) {
	$("#hidYear").val(value);
	$("#spYear").text(txt);
	$("#YearDiv").find("li").removeClass("active");
	$(obj.parentNode).addClass("active");
}

//주소1
function fnSetAddress_1(value, obj, txt) {
	var chk = value == "세종특별자치시";

	$("#spAddress_2").attr("disabled", chk);
	$("#hidAddress_1").val(value);
	$("#spAddress_1").text(txt);
	$("#Address_1Div").find("li").removeClass("active");
	$(obj.parentNode).addClass("active");
	fnSetAddress(value);

	if (chk) {
		$('#Address_2Div').children().hide();
		$("#Address_detail").val($("#hidAddress_1").val());
		$("#Address_detail").attr("disabled", true);
		$("#spAddress_2").closest("td").removeClass("has-error");
		$("#Address_detail").closest("td").removeClass("has-error");
		$('#Address_2Div').children().hide();
		$("#Address_detail2").select();
	}
}

//주소2
function fnSetAddress_2(value, obj, txt) {
	$("#hidAddress_2").val(value);
	$("#spAddress_2").text(txt);
	$("#Address_2Div").find("li").removeClass("active");
	$(obj.parentNode).addClass("active");
	$("#Address_detail").val($("#hidAddress_1").val() + " " + value);
	$("#Address_detail").attr("disabled", true);
	$("#Address_detail").closest("td").removeClass("has-error");
	$("#Address_detail2").select();
}

function fnSetAddress(SIDO) {
	$("#spAddress_2").text("구/읍/면/동");
	$("#hidAddress_2").val("");

	if (dsGugun != null) {
		var gugun = "<li value=\"\"><a href=\"# return false;\" onclick=\"fnSetAddress_2('',this,'구/읍/면/동');\">구/읍/면/동</a></li>";
		dsGugun.forEach(function (x) {
			if (x['SIDO'] == $("#hidAddress_1").val()) {
				gugun += "<li value='" + x['GUGUN'] + "'><a href='#' onclick='fnSetAddress_2(\"" + x['GUGUN'] + "\",this,\"" + x['GUGUN'] + "\")'>" + x['GUGUN'] + "</a></li>";
			}
		});

		Address_2Div.innerHTML = gugun;
	}
}
// 방문교육요청용 end

//팝오버 해제
function fnPopoverRemove(obj) {
	obj.closest("td").removeClass("has-error");     //빨간 테두리 표시 해제
	obj.popover("destroy");                         //팝오버 해제 
}

//특수문자 체크
function fnSpecial(callback) {
	var isvalid = true;

	var $validateControls = $("[data-special]");
	$validateControls.each(function (i, item) {
		if (!$(item).attr("readOnly") && $(item).css("display") != "none" && $.trim($(item).val()) != "") {
			//fnPopoverRemove($(item));
			var specialValidate = isContainsLimitedSpecial($(item));
			if (!specialValidate.result) {
				fnErrMsgSet($(item), specialValidate.message, false);
				callback && callback(item);
				isvalid = false;
				return false;
			}
		}
	});

	return isvalid;
}

// 필수입력 체크
function fnRequired() {
	var $validateControl = $("[data-required]");

	$validateControl.each(function (i, item) {
		if ($(item).css("display") != "none") {
			var upPopover = ($(item).attr("type") == "checkbox" && !$(item).is(":checked")) ||
				($(item).attr("type") != "checkbox" && $(item).val().trim() == "");

			if (upPopover) {
				fnErrMsgSet($(item), $(item).data("requiredmsg"), false);
			}
		}
	});
}

function fnchkAgree() {
	if ($("#chkAgree").get(0).checked)
		$("#chkAgree").prop("checked", false)
	else {
		if ($("#divAgree").hasClass("has-error")) {
			$("#divAgree").removeClass("has-error");
		}
		$("#chkAgree").prop("checked", true)
	}
}

// 입력 시 특수문자 체크
function fnSpecialValidationChk(e, exceptList) {
	var obj = $(e.target);
	var specialValidChk = isContainsLimitedSpecial(obj);

	fnPopoverRemove(obj);

	if (!specialValidChk.result) {
		if ($.isArray(exceptList) && !$.isEmpty(exceptList) && exceptList.some(function (v) { return v.objId == obj.attr("id"); })) {
			var except = exceptList.find(function (v) { return v.objId == obj.attr("id"); });

			fnErrMsgSet($(obj), specialValidChk.message, false);
			fnErrChk(except.tdId, except.focusId);
		} else {
			fnErrMsgSet($(obj), specialValidChk.message, false);
			fnErrChk((typeof exceptList == "boolean" && exceptList == true ? "" : "td_") + $(obj).attr("id"), $(obj).attr("id"));
		}
	} else {
		return false;
	}
}

function GetResource(code) {
	if (window.maxsoft && window.maxsoft.resource && window.maxsoft.resource[code])
		return window.maxsoft.resource[code];
	else
		return code;
}

//경고메세지처리
function fnErrMsgSet(obj, msg, flag, option) {
	//obj.popover("destroy");
	obj.popover({
		content: msg == "" ? "" : /^(LBL|MSG|BTN)/gi.test(msg) ? GetResource(msg) : msg,
		container: "body",
		toggle: "popover",
		placement: option && option.placement ? option.placement : "top",
		html: true,
		delay: flag ? { show: 600 } : { show: 0 },
		trigger: "focus"
	});
	//obj.popover("show");

	obj.one("blur", function (e) {
		fnPopoverRemove(obj);
	});
}

function checkState(e) {
	var obj = $(e.target);
	obj.popover("destroy");
}

function getIsoState(stateCode, callback) {
	var dataCode = {
		STATE_CODE: stateCode
	};
	var param = {
		sessionURL: TargetServer + "/GMCAPI/Service/SaleSite/GetViewIsoState",
		data: dataCode,
		method: "POST",
		callbackApi: function (data) {
			if (data.Data != null && data.Data.length > 0) {
				callback && callback(data.Data);
			}
		}
	};

	gmcSessionApi(param);
}

var getLocation = function () {
	var url = location.host;
	var path = location.pathname.toLowerCase().split('.aspx')[0];
	path = path.replace(/\/\/+/g, '/');
	var regx = /\.cn$/i;

	if (regx.test(url)) {
		return "";
	}
	else {
		return path.substring(1, 3);
	}
};

///////////////////// CN /////////////////////

// 입력 시 특수문자 체크
function CN_fnSpecialValidationChk(e, exceptList) {
	var item = $(e.target);
	var specialValidate = isContainsLimitedSpecial(item);

	item.removeClass("is-error");

	if (!specialValidate.result) {
		var p = $(item).parent().find(".wrap-error");
		if (p && p[0]) {
			p[0].innerText = specialValidate.message;
		}
		item.addClass("is-error");
	} else {
		return false;
	}
}

//특수문자 체크
function CN_fnSpecial(callback) {
	var isvalid = true;

	var $validateControls = $("[data-special]");
	$validateControls.each(function (i, item) {
		if (!$(item).attr("readOnly") && $(item).css("display") != "none" && $.trim($(item).val()) != "") {
			var specialValidate = isContainsLimitedSpecial($(item));
			if (!specialValidate.result) {
				var p = $(item).parent().find(".wrap-error");
				if (p && p[0]) {
					p[0].innerText = specialValidate.message;
				}
				$(item).addClass("is-error");

				callback && callback(item);
				isvalid = false;
				return false;
			}
		}
	});

	return isvalid;
}

// 에러메시지
function CN_showMessage(obj, msg) {
	$(obj).focus();

	var p = $(obj).parent().find(".wrap-error");
	if (p && p.length > 0) {
		if (msg)
			p[0].innerText = msg;
		else
			p[0].innerText = $(obj).data("requiredmsg");
	}
	else {
		var p = $(obj).parent().parent().find(".wrap-error");
		if (p && p.length > 0) {
			if (msg)
				p[0].innerText = msg;
			else
				p[0].innerText = $(obj).data("requiredmsg");
		}
	}
	setTimeout(function () {
		obj.addClass("is-error");
	}, 200);

}

///////////////////// CN /////////////////////