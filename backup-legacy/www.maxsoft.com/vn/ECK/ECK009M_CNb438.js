/**************************************************************************************************** 
1. Create Date : 2023.03.08
2. Creator     : 김동수
3. Description : ECK009M_CN.aspx 회원가입
4. Precaution  : 
5. History     : 
    2023.03.08 (김동수) : A23_01271 - 전체 국가 영업사이트 > 신청페이지 리뉴얼
	2023.04.10 (김동수) : A23_01833_02 - 영업 홈페이지 신청페이지 새탭으로 띄우기
	2023.05.25 (김동수) : A23_02703 - TW 상담문의에 페이스북, 구글 픽셀 삽입 요청
    2024.02.22 (김동수) : A24_01062 - US 홈페이지 상담문의, Demo, RFT 신청화면 수정 요청
    2024.03.07 (김동수) : A24_01327 - CN 홈페이지 바이두 태그 삽입
    2024.03.08 (김동수) : A24_01095 - Sales Management 이상 유입 차단 요청
6. Old file    : None 
* ***************************************************************************************************/
var dataForm = { TEL : ""};
var CountryList = [];
var dialCd = "";

$(document).ready(function () {
    if ($("#hidCountry").val() != "") {
        var siteLanType = $("#siteLanType").val().toUpperCase();
        if (siteLanType == "EN-US" || siteLanType == "ES") {
            getIsoState($("#hidCountry").val(), function (dialCd) {
                $("#TEL").val(dialCd);

                if (dataForm.TEL != "") {
                    $("#PHONE").val(dataForm.TEL);
                } else {
                    $("#PHONE").val(dialCd);
                }
                this.dialCd = dialCd;
            });
        }
    }

    $(document).click(function (e) {
        //$(".dropdown-menu").removeClass("show");
        $("#btnCNTY_CD").removeClass("is-open");
        //return false;
    });


    fnLocalDate();

    //유효성 체크할 항목 지정
    fnSetValidator();

	// US 전화번호 삭제
	var viewLanType = $("#siteLanType").val();	// 다른ECK와 다른 변수
	if (viewLanType == "en-US") {
		$(".call").addClass("is-hide");
	}

    // 특수문자 통제
    $("[data-special]").on("keyup", function (e) {
		CN_fnSpecialValidationChk(e);
    });

	// 전화번호 통제
    $("#TEL, #PHONE, #MBPH_NO2").on("keyup", function () {
        jsOnlyNumberKey5(this);
    });

    // 국가번호 통제
    $("[name=MBPH_NO2_PRE]").on("keyup", function () {
        jsOnlyNumberKeyNation(this);
        fnNationNumChk(this);
    });

	// 에러메시지 초기화
    $("#COMPANY_NM, #USER_NAME, #TEL, #PHONE, #EMAIL").on("blur", function () {
		$(".is-error").removeClass("is-error");
	});

	// 모달:완료팝업
	$(".wrap-modal").on("click", function () {
		modal_toggle(false);
	});

    // Country
    fnCountrySetting($("#siteLanType").val());

    // Country 클릭이벤트
    $("#btnCNTY_CD").on("click", function () {
        $("#btnCNTY_CD").toggleClass("is-open");
        return false;
    });

	// 포커스 이동
	$(function () {
		$(document).on('keydown', 'input', function (event) {
			if (event.which == 13) {
				event.preventDefault();
				var $this = $(event.target);
				var index = parseFloat($this.attr('data-index'));
				$('[data-index="' + (index + 1).toString() + '"]').focus();
			}
		});
	});

	$("#COMPANY_NM").focus();

	var lanType = $("#siteLanType").val();
	if (lanType == 'zh-CN') {
		$("#li36").addClass("is-hide");
	}
});

//유효성 체크할 항목 지정
function fnSetValidator() {
    var site = $("#SaleSite").val();

    // 회사명
    $('#COMPANY_NM').attr("data-special", true);

    // 이름
    $('#USER_NAME').attr("data-special", true);
	$('#USER_NAME').attr("data-required", true);
	$('#USER_NAME').attr("data-requiredmsg", maxsoft.resource.MSG70061);


    // 이메일
	$('#EMAIL').attr("data-special", true);
	$('#EMAIL').attr("data-checkdmsg", maxsoft.resource.MSG70070);

    switch (site) {
        case "US":
            $('#btnCNTY_CD').attr("data-required", true);
            $('#btnCNTY_CD').attr("data-requiredmsg", "Please select your country.");
            $('#MBPH_NO2_PRE').attr("data-required", true);
            $('#MBPH_NO2_PRE').attr("data-requiredmsg", "Enter a country code.");
            $('#MBPH_NO2').attr("data-required", true);
            $('#MBPH_NO2').attr("data-requiredmsg", "Enter a mobile number.");

            $("#li_PHONE").addClass("is-hide");
            $("#li_MBPH_NO2").removeClass("is-hide");
            $("#li_CNTY_CD").removeClass("is-hide");
            break;
        default:
            // 전화번호
            $('#PHONE').attr("data-required", true);
            $('#PHONE').attr("data-requiredmsg", maxsoft.resource.MSG70060);
            break;
    }


}

// 완료팝업, 창닫기
function modal_toggle(flag) {
	if (flag) {
		var folder = "";
		var site = $("#SaleSite").val();
		if (site != "CN")
			folder = "/" + $("#SaleSite").val();

		$('#iframeECK040').attr('src', folder + "/ECK/ECK040M_CN.aspx");
		setTimeout(function () {
			$(".wrap-modal").removeClass("is-hide");
			$(".application").addClass("is-no-scroll");
		}, 500);
	}
	else {
		window.close();
	}
}

// Country 목록
function fnCountrySetting(lanType) {

    var areaTemplate = "<li><a href=\"#\" onclick=\"fnSelectCountry(this); return false;\" id=\"{{code}}\">{{name}}</a></li>";

    var params = {
        LAN_TYPE: $("#viewLanType").val(),//"en-US",
        PARAM: ""
    };

    var param = {
        sessionURL: TargetServer + "/GMCAPI/Common/Infra/GetListCountry",
        data: params,
        method: "POST",
        callbackApi: function (result) {
            if (result.Status != "200") {
                alert("error : " + result.Error.Message);
                return false;
            } else {
                var $area = $(areaTemplate.replace(/{{(\w*)}}/g, function (match, t) {
                    switch (t) {
                        case "code":
                            return "";
                        case "name":
                            return "Select your country";
                        default:
                            return match;
                    }
                }));
                $area.appendTo($("#uldropCNTY_CD"));

                if (result.Data.length > 0) {
                    CountryList = result.Data;
                    result.Data.forEach(function (data) {
                        var $area = $(areaTemplate.replace(/{{(\w*)}}/g, function (match, t) {
                            switch (t) {
                                case "code":
                                    return data.STATE_CODE;
                                case "name":
                                    return data.RESX_DES || maxsoft.resource[data.RESX_CD] || data.STATE_TEXT;
                                default:
                                    return match;
                            }
                        }));
                        if (!$.isEmpty(data.NATION_DIAL_CD))
                            $area.appendTo($("#uldropCNTY_CD"));
                    });

                    // 기본값
                    var countryCode = $("#hidCountry").val();
                    if ($.isEmpty(countryCode)) {
                        $("#btnCNTY_CD").text($("#uldropCNTY_CD > li").first().text());
                    }
                    else {
                        fnSelectCountry($("#uldropCNTY_CD > li").find("[id='" + countryCode + "']"));
                    }
                }
            }
        }
    };

    gmcSessionApi(param);
}


// Country 선택
function fnSelectCountry(obj) {

    $("#btnCNTY_CD").text($(obj).text());

    $("#uldropCNTY_CD").find("li").removeClass("is-active");
    $(obj).parent().addClass("is-active");

    $("#btnCNTY_CD").removeClass("is-open");

    if (CountryList.length > 0) {
        var contry = CountryList.find(function (b) { return b.STATE_CODE == $(obj).attr("id"); });
        if (contry) {
            $("#MBPH_NO2_PRE").val("+" + contry.NATION_DIAL_CD.replace("+", ""));
        }
    }
}


// 저장
var saveComplete = true;
function sendit() {
	var lanType = $("#siteLanType").val();
	var isMobile = $("#hidIsFromMobile").val().toUpperCase() == "TRUE" ? true : false;
    var mbphNo = "";

    if (!saveComplete) {
        return false;
    }
	$(".is-error").removeClass("is-error");

	// 필수값 체크
	var $validateControl = $("[data-required]");
	var upPopover = false;

	$validateControl.each(function (i, item) {
		if ($(item).css("display") != "none") {
			//이메일 유효성 x, 길이 0일 경우
			if ($(item)[0].id == "EMAIL" && $(item).val().length != 0 && fnEmailCheck($(item)[0])) {
				CN_showMessage($(item));
				return false;
				//전화번호
			} else if ($(item)[0].id == "PHONE") {
                if (($("#siteLanType").val() == 'en-US' && $(item).val().trim() == this.dialCd) || ($(item).val().trim() == "")) {
                    upPopover = true;
                }
            } else if ($(item)[0].id == "btnCNTY_CD") {
                var selectedValue = $("#uldropCNTY_CD li.is-active").find("a").attr("id");
                if (selectedValue == undefined || selectedValue == "") {
                    upPopover = true;
                }
            } else if ($(item)[0].id == "MBPH_NO2_PRE") {
                if ($(item).val().trim() == "") {
                    CN_showMessage($("#MBPH_NO2_PRE"), $(item).data("requiredmsg"));
                    upPopover = true;
                    return false;
                }
            } else if ($(item)[0].id == "MBPH_NO2") {
                if ($(item).val().trim() == "") {
                    CN_showMessage($("#MBPH_NO2"), $(item).data("requiredmsg"));
                    upPopover = true;
                    return false;
                }
			} else {
				if ($(item).val().trim() == "") {
					upPopover = true;
				}
			}

			if (upPopover) {
				CN_showMessage($(item));
				return false;
			}
		}
	});

	if (!$.isEmpty($("#EMAIL").val())) {
		if (fnEmailCheck($("#EMAIL")[0])) {
			CN_showMessage($("#EMAIL"), $("#EMAIL").data("checkdmsg"));
			return false;
		}
	}

	if (upPopover) {
		saveComplete = true;
		return false;
	}

    // 특수문자 통제
	if (!CN_fnSpecial()) {
        saveComplete = true;
        return false;
    }

    var cntyCd = $("#hidCountry").get(0).value;
    if (lanType.toUpperCase() == "EN-US") {
        mbphNo = String.format("{0}{1}", $("#MBPH_NO2_PRE").val().replaceAll("+", ""), $("#MBPH_NO2").val().replaceAll("-", ""));
        cntyCd = $("#uldropCNTY_CD li.is-active").find("a").attr("id");
    }
    else {
        mbphNo = $("#PHONE").val().replaceAll("-", "");
    }


	saveComplete = false;
    var dataSave = {};
    dataSave.MARKETING_TYPE = "S";
    dataSave.LAN_TYPE = $("#viewLanType").get(0).value;
    dataSave.LANG_TYPE = $("#siteLanType").get(0).value;
    dataSave.LOCAL_TIME = $("#hidTime").get(0).value;

    dataSave.ConsultData = {
        CNTY_CD: cntyCd,
        USER_IP: $("#hidEditIP").val(),
        BUSS_SITE_CNTY_CD: $("#SaleSite").val(),
        BRN_CD: $("#SaleSite").val(),
        CNSL_PRGS_STAT_CD: "NEW",
        DEVC_TYPE_CD: $("#hidIsFromMobile").val().toUpperCase() == "TRUE" ? "MB" : "DT",
        USER_COKI_ID: getCookie('ecinccid'),
        VIST_COKI_ID: getCookie('ecyearcid'),

		CNSLG_TYPE_CD: $("#hidFromDemoYn").get(0).value == "Y" ? "12" : "9",
        COM_NM: getReplacedSpecialRemoveTag($("#COMPANY_NM").get(0).value),
        CLNT_EMAIL: getReplacedSpecialRemoveTag($("#EMAIL").val()),
		TEL_NO: "",
        MBPH_NO: mbphNo.replaceAll("-", ""),
        APLT_NM: getReplacedSpecialRemoveTag($("#USER_NAME").val())
    };

    dataSave.CustomerAlarm = {
        SMS_MESSAGE: "",
        FORM_TYPE: "XH002", // you want i deploy on local or apolo now. appolo
        EMAIL: $("#EMAIL").val(),
        USER_NAME: $("#USER_NAME").val(), //
        RECEIVE_NUMBER: ""
    };

    dataSave.ManageAlarm = {
        MENU_ID: "FTREQUEST",
        SMS_MESSAGE: "",
        MEMO_MESSAGE: "", //need
        USE_DEFAULT_SMS_MESSAGE: "N",
        USE_DEFAULT_MEMO_MESSAGE: "N",
        LAN_TYPE: $("#siteLanType").get(0).value
    };

    dataSave.ReplaceParams = {
        ETYPE: "Free Trial",
        FROM_SITE: $("#siteLanType").get(0).value, //this.strLanType
        NATION: $("#hidCountry").get(0).value, //strComcode
        COM_CODE: "GUEST",
        COMPANY: $("#COMPANY_NM").get(0).value,
        USER_NAME: $("#USER_NAME").get(0).value
    };

    dataSave.Request = {
        NEW_CODE_ZONE: $("#newCodeZone").val(),
        NEW_DB_SHARD_NO: $("#newDbShardNo").val(),
    };

    $(".wrapper-overlay").addClass('show');
    $(".wrapper-page-progress").removeClass('hidden');

    var param = {
        sessionURL: TargetServer + "/GMCAPI/Svc/Admin/Marketing/SaveSalesManagement",
        data: dataSave,
        method: "POST",
        callbackApi: function (result) {
            if (result.Status != "200") {
                $(".wrapper-overlay").removeClass('show');
                $(".wrapper-page-progress").addClass('hidden');
                alert(result.fullErrorMsg);
                saveComplete = true;
                return false;
            }
            else {
                if (result.Data && result.Data.ERROR_MSG != null && result.Data.ERROR_MSG != "") {
                    var mbphNoTitle = $("#li_PHONE").hasClass("is-hide") ? $("#li_MBPH_NO2 > .title").text() : $("#li_PHONE > .title").text();
                    var msg = result.Data.ERROR_MSG.replaceAll(/\[MBPH_NO]/g, mbphNoTitle).replaceAll(/\[TEL_NO]/g, mbphNoTitle);
                    msg = msg.replaceAll(/\[MBPH_NO]/g, mbphNoTitle).replaceAll(/\[TEL_NO]/g, mbphNoTitle);
                    alert(msg);
                    saveComplete = true;
                    return false;
                } 

                var jsonData = "";

                try {
                    jsonData = JSON.stringify(dataSave);
                } catch (e) {
                    jsonData = "JSON.stringify ERROR: " + e.message;
                }

                if (parseInt(result.Data.MarketingDataResult || "-1") >= 0) {
                    // 바이두 전환 태그
                    if ($("#siteLanType").get(0).value.toUpperCase() == "ZH-CN") {
                        $("#btnBaiduRft").trigger('click');
                    }

                    // 데모코드 통해서 유입된 경우
                    if ($("#hidFromDemoYn").get(0).value == "Y") {
                        SendTrackingData('/maxsoft/DemoRft');
                    }

                    SendTrackingData("#CONVERSION_9", function () {
						setTimeout(function () {
							modal_toggle(true);
							//location.href = String.format("ECK040M.aspx?FromPage=FREETRIAL&IsModal={0}&FromUrl={1}", $("#hidOpenPopupYn").val() == "Y" ? "N" : "Y", $("#hidFromUrl").val());
                        }, 1000);
                    }, jsonData);
                } else if (parseInt(result.Data.MarketingDataResult || "-1") < 0) {
                    $(".wrapper-overlay").removeClass('show');
                    $(".wrapper-page-progress").addClass('hidden');
                    alert("error");
                    saveComplete = true;
                    return false;
                }
            }
        }
    };

    if (typeof gtag == "function")
        gtag('event', 'Click', { 'event_category': 'RFT' });

    if (typeof fbq == "function") {
        fbq('track', 'Lead');
    }

    // 바이두
    window._agl && window._agl.push(['track', ['success', { t: 2 }]])

    gmcSessionApi(param);

}
