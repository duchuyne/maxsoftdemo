/**************************************************************************************************** 
1. Create Date : 2023.03.08
2. Creator     : 김동수
3. Description : 영업>Email 상담
4. Precaution  : 
5. History     : 
    2023.03.08 (김동수) : A23_01271 - 전체 국가 영업사이트 > 신청페이지 리뉴얼
	2023.03.28 (김동수) : A23_01670 - TW 영업홈페이지 신청페이지 새탭
	2023.04.10 (김동수) : A23_01833_02 - 영업 홈페이지 신청페이지 새탭으로 띄우기
	2023.04.12 (김동수) : A23_01833_02 - 영업 홈페이지 신청페이지 새탭으로 띄우기(추가)
	2023.04.13 (김동수) : A23_01833_02_4 - 영업 홈페이지 신청페이지 새탭으로 띄우기(추가2)
	2023.04.27 (김동수) : A23_02238 - 이카운트 영업페이지 상담문의 중복클릭막도록
	2023.05.25 (김동수) : A23_02703 - TW 상담문의에 페이스북, 구글 픽셀 삽입 요청
    2023.07.21 (장정민) : A23_02630_필리핀 홈페이지 및 00000 연결 요청
	2024.02.22 (김동수) : A24_01062 - US 홈페이지 상담문의, Demo, RFT 신청화면 수정 요청
	2024.02.29 (김동수) : A24_01229 - CN 홈페이지 영업팀문의 신청창 오류
	2024.03.07 (김동수) : A24_01327 - CN 홈페이지 바이두 태그 삽입
	2024.03.08 (김동수) : A24_01095 - Sales Management 이상 유입 차단 요청
6. Old file    : None 
* ***************************************************************************************************/
var dataForm = { TEL: "" };
var CountryList = [];
var dialCd = "";

$(document).ready(function () {
	if ($("#hidCountry").val() != "") {
		var siteLanType = $("#siteLanType").val().toUpperCase();
		if (siteLanType == "ES") {
			getIsoState($("#hidCountry").val(), function (dialCd) {
				$("#MBPH_NO").val(dialCd);

				if (dataForm.TEL != "") {
					$("#TEL_NO").val(dataForm.TEL);
				} else {
					$("#TEL_NO").val(dialCd);
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

	//유효성 체크할 항목 지정
	fnSetValidator();

	// US 전화번호 삭제
	var viewLanType = $("#viewLanType").val();
	if (viewLanType == "en-US") {
		$(".call").addClass("is-hide");
	}

	// 탭이동
	$("#tab1").on("click", function () {
		changeTab("1");
	});
	$("#tab2").on("click", function () {
		changeTab("2");
	});

 	// 전화번호 통제
	$("[name=TEL_NO], [name=MBPH_NO], [name=MBPH_NO2]").on("keyup", function () {
        jsOnlyNumberKey5(this);
    });

	// 국가번호 통제
	$("[name=MBPH_NO2_PRE]").on("keyup", function () {
		jsOnlyNumberKeyNation(this);
		fnNationNumChk(this);
	});

	$("[data-special]").on("keyup", function (e) {
		CN_fnSpecialValidationChk(e);
    });

	// 에러메시지 초기화
	$("#COM_NM, #APLT_NM, #TEL_NO, #TEL, #CNTS_CTT").on("blur", function () {
		$(".is-error").removeClass("is-error");
	});

	// 모달:완료팝업
	$(".wrap-modal").on("click", function () {
		modal_toggle(false);
	});

	// 개인정보 동의
	$(".wrap-checkbox #button-layer-agree-privacy").click(function () {
		$("#layer-agree-privacy").toggleClass("is-hide");
	});
	$("#layer-agree-privacy .button-layer-agree-close").click(function () {
		$("#layer-agree-privacy").toggleClass("is-hide");
	});

	// 마케팅정보 동의
	$(".wrap-checkbox #button-layer-agree-marketing").click(function () {
		$("#layer-agree-marketing").toggleClass("is-hide");
	});
	$("#layer-agree-marketing .button-layer-agree-close").click(function () {
		$("#layer-agree-marketing").toggleClass("is-hide");
	});

	// 전체 동의 체크박스
	$("#consulting-agreemodal0").on("click", function () {
		var is_checked = $(this).is(":checked");
		$("#consulting-agreemodal1").prop("checked", is_checked);
		$("#consulting-agreemodal2").prop("checked", is_checked);
		$(".is-error").removeClass("is-error");
	});


	// 개별 체크박스 변경 시 전체 동의 상태 업데이트
	$("#consulting-agreemodal1, #consulting-agreemodal2").change(function () {
		if ($("#consulting-agreemodal1").is(":checked")) {
			$(".is-error").removeClass("is-error");
		}

		var all_checked = $("#consulting-agreemodal1").is(":checked") && $("#consulting-agreemodal2").is(":checked");
		$("#consulting-agreemodal0").prop("checked", all_checked);
	});

	$(".wrap-checkbox").click(function () {
		if ($("#consulting-agreemodal").is(":checked")) {
			$("#lbl_consulting-agreemodal").removeClass("is-error");
			$("#span_consulting-agreemodal").removeClass("is-error");
		}
	});

	


	// iFrame으로 호출(Desktop), 페이지 이동으로 호출(Mobile)에 따른 닫기 버튼 예외처리
	var isInIFrame = (window.location != window.parent.location);
	if (isInIFrame == true) {
		$(".close-modal.mobile").addClass("hide");
	} else {
		$(".close-modal.mobile").removeClass("hide");
	}

	// Country
	fnCountrySetting($("#siteLanType").val());

	// Country 클릭이벤트
	$("#btnCNTY_CD").on("click", function () {
		$("#btnCNTY_CD").toggleClass("is-open");
		return false;
	});

	// 포커스 이동
	$(function () {
		var seq = 0;
		$("input:visible, textarea:visible").each(function (i, item) {
			seq++;
			$(item).attr('data-index', seq);
		});


		$(document).on('keydown', 'input', function (event) {
			if (event.which == 13) {
				event.preventDefault();
				var $this = $(event.target);
				var index = parseFloat($this.attr('data-index'));
				if (index < seq)
					$('[data-index="' + (index + 1).toString() + '"]').focus();
				else
					sendit();
			}
		});
	});

	setTimeout(function () {
		$(".apply").removeClass("is-hide");
	}, 2000);

    $("input:visible").first().focus();
});

//유효성 체크할 항목 지정
function fnSetValidator() {
	var site = $("#SaleSite").val();
	switch (site) {
		case "CN":
			// 필수여부
			$('#APLT_NM').attr("data-special", true);
			$('#APLT_NM').attr("data-required", true);
			$('#APLT_NM').attr("data-requiredmsg", maxsoft.resource.MSG70061);

			$('#TEL_NO').attr("data-required", true);
			$('#TEL_NO').attr("data-requiredmsg", maxsoft.resource.MSG70060);

			$('#CNTS_CTT').attr("data-special", true);

			// 화면처리
			$(".apply > .wrap-button").removeClass("is-hide");

			$("#li_COM_NM").addClass("is-hide");
			$("#li_MBPH_NO").addClass("is-hide");
			$("#li33").addClass("is-hide");
			$(".wrap-checkbox").addClass("is-hide");	
			break;
		case "KR":
			// 필수여부
			$('#COM_NM').attr("data-special", true);
			$('#COM_NM').attr("data-required", true);
			$('#COM_NM').attr("data-requiredmsg", maxsoft.resource.MSG70065);

			$('#APLT_NM').attr("data-special", true);
			$('#APLT_NM').attr("data-required", true);
			$('#APLT_NM').attr("data-requiredmsg", maxsoft.resource.MSG70061);

			$('#MBPH_NO').attr("data-required", true);
			$('#MBPH_NO').attr("data-requiredmsg", maxsoft.resource.MSG70060);

			$('#CLNT_EMAIL').attr("data-special", true);
			$('#CLNT_EMAIL').attr("data-required", true);
			$('#CLNT_EMAIL').attr("data-requiredmsg", maxsoft.resource.MSG70069);
			$('#CLNT_EMAIL').attr("data-checkdmsg", maxsoft.resource.MSG70070);

			$('#CNTS_CTT').attr("data-special", true);

			// 화면처리
			$("#li33").removeClass("is-hide");
			$("#li_CLNT_EMAIL").removeClass("is-hide");
			$("#li_CNSLG_TYPE_CD").removeClass("is-hide");
			$("#ALL_AGREE").removeClass("is-hide");
			$("#PERSONAL_AGREE").removeClass("is-hide");
			$("#MARKETING_AGREE").removeClass("is-hide");

			$(".apply > .wrap-button").addClass("is-hide");
			$("#li_TEL_NO").addClass("is-hide");
			break;
		case "TW": 
		case "TH":
		case "VN":
		case "MY":
        case "ID":
		case "PH":
		case "UZ":
		case "HK":
			// 필수여부
			$('#COM_NM').attr("data-special", true);
			$('#COM_NM').attr("data-required", true);
			$('#COM_NM').attr("data-requiredmsg", maxsoft.resource.MSG70065);

			$('#APLT_NM').attr("data-special", true);
			$('#APLT_NM').attr("data-required", true);
			$('#APLT_NM').attr("data-requiredmsg", maxsoft.resource.MSG70061);

			$('#MBPH_NO').attr("data-required", true);
			$('#MBPH_NO').attr("data-requiredmsg", maxsoft.resource.MSG70060);

			$('#CLNT_EMAIL').attr("data-special", true);
			$('#CLNT_EMAIL').attr("data-required", true);
			$('#CLNT_EMAIL').attr("data-requiredmsg", maxsoft.resource.MSG70069);
			$('#CLNT_EMAIL').attr("data-checkdmsg", maxsoft.resource.MSG70070);

			$('#CNTS_CTT').attr("data-special", true);

			// 화면처리
			$("#li33").removeClass("is-hide");
			$("#li_CLNT_EMAIL").removeClass("is-hide");
			$("#li_CNSLG_TYPE_CD").removeClass("is-hide");

			$(".apply > .wrap-button").addClass("is-hide");
			$("#li_TEL_NO").addClass("is-hide");

			if (site == "TH") {
				$("#divAgree").removeClass("is-hide");	// 개인정보 동의
			}

			break;
		case "US":
			// 필수여부
			$('#COM_NM').attr("data-special", true);
			$('#COM_NM').attr("data-required", true);
			$('#COM_NM').attr("data-requiredmsg", maxsoft.resource.MSG70065);

			$('#APLT_NM').attr("data-special", true);
			$('#APLT_NM').attr("data-required", true);
			$('#APLT_NM').attr("data-requiredmsg", maxsoft.resource.MSG70061);


			$('#btnCNTY_CD').attr("data-required", true);
			$('#btnCNTY_CD').attr("data-requiredmsg", "Please select your country.");
			$('#MBPH_NO2_PRE').attr("data-required", true);
			$('#MBPH_NO2_PRE').attr("data-requiredmsg", "Enter a country code.");
			$('#MBPH_NO2').attr("data-required", true);
			$('#MBPH_NO2').attr("data-requiredmsg", "Enter a mobile number.");


			$('#CLNT_EMAIL').attr("data-special", true);
			$('#CLNT_EMAIL').attr("data-required", true);
			$('#CLNT_EMAIL').attr("data-requiredmsg", maxsoft.resource.MSG70069);
			$('#CLNT_EMAIL').attr("data-checkdmsg", maxsoft.resource.MSG70070);

			$('#CNTS_CTT').attr("data-special", true);

			// 화면처리
			$("#li33").removeClass("is-hide");
			$("#li_CLNT_EMAIL").removeClass("is-hide");
			$("#li_CNSLG_TYPE_CD").removeClass("is-hide");

			$("#li_MBPH_NO").addClass("is-hide");
			$("#li_MBPH_NO2").removeClass("is-hide");
			$("#li_CNTY_CD").removeClass("is-hide");
			
			$(".apply > .wrap-button").addClass("is-hide");
			$("#li_TEL_NO").addClass("is-hide");
			break;
	}

}

// 탭이동
function changeTab(target) {
	if (target == "2") {
		$("#tab1").removeClass("is-active");
		$("#tab2").addClass("is-active");
		$("#form2").removeClass("is-hide");
		$("#form1").addClass("is-hide");
	}
	else {
		$("#tab2").removeClass("is-active");
		$("#tab1").addClass("is-active");
		$("#form1").removeClass("is-hide");
		$("#form2").addClass("is-hide");

		$("input:visible").first().focus();
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
			$(".apply").removeClass("is-hide");
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
			$("#MBPH_NO2_PRE").val("+"+contry.NATION_DIAL_CD.replace("+",""));
		}
	}
}


// 저장
var Dto = {};
var saveComplete = true;

function sendit() {
    if (!saveComplete) {
        return false;
    }
	saveComplete = false;

	var site = $("#SaleSite").val();
	$(".is-error").removeClass("is-error");

	// 필수값 체크
	var $validateControl = $("[data-required]");
	var upPopover = false;
	var lanType = $("#siteLanType").val();

	$validateControl.each(function (i, item) {
		if ($(item).css("display") != "none") {
			//이메일 유효성 x, 길이 0일 경우
			if ($(item)[0].id == "CLNT_EMAIL" && $(item).val().length != 0 && fnEmailCheck($(item)[0])) {
				CN_showMessage($(item), $(item).data("checkdmsg"));
				upPopover = true;
				return false;
				//전화번호
			} else if ($(item)[0].id == "li_TEL_NO" && /-$/.test($(item).val())) {
				if (($("#siteLanType").val() == 'en-US' && $(item).val().trim() == this.dialCd) || ($(item).val().trim() == "")) {
					upPopover = true;
				}
			} else if ($(item)[0].id == "MBPH_NO") {
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

	if ($("#divAgree").attr('class').indexOf("is-hide") == -1 && !$("#consulting-agreemodal").is(":checked")) {
		CN_showMessage($("#lbl_consulting-agreemodal"), maxsoft.resource.MSGECK006M_AGREE_REQUIRE);
		upPopover = true;
	}

	if ($("#PERSONAL_AGREE").attr('class').indexOf("is-hide") == -1 && !$("#consulting-agreemodal1").is(":checked")) {
		CN_showMessage($("#lbl_consulting-agreemodal0"), maxsoft.resource.MSGECK006M_AGREE_REQUIRE);
		upPopover = true;
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

	// 파라메터 생성
	var selectedTab = $('input[name="contact-method"]:checked').val();
	var form = $("#form1");
    var postSerialize = form.serializeArray();
	var postValue = {}, ConsultDetailData = [];

	if ($.isEmpty(selectedTab))
		selectedTab = "call";

	for (var i = 0, len = postSerialize.length; i < len; i++) {
		var v = postSerialize[i];
        var $obj = form.find(String.format("[name='{0}']", v.name));

        switch (v.name.toUpperCase()) {
			case "COM_NM":
            case "APLT_NM":
			case "CNTS_CTT":
			case "CLNT_EMAIL":
				postValue[v.name] = getReplacedSpecialRemoveTag($.trim(v.value));
                break;
            case "TEL_NO":
            case "MBPH_NO":
				postValue[v.name] = $.trim(v.value || "").replaceAll("-", "");
                break;
			case "MBPH_NO2":	// 국가번호 분리(US만 적용)

				// 화면에 없으면 처리하지 않음.
				if ($("#li_MBPH_NO2").hasClass("is-hide"))
					break;

				var preObj = postSerialize.find(function (a) { return a.name == "MBPH_NO2_PRE" });
				var preValue = "";
				if (preObj && preObj != undefined) {
					preValue = preObj.value;
				}
				postValue["MBPH_NO"] = String.format("{0}{1}", preValue.replaceAll("+", ""), $.trim(v.value || "").replaceAll("-", ""));
				break;
            default:
                break;
        }
    }

	var mobile = ((postValue.MBPH_NO == undefined ? postValue.TEL_NO : postValue.MBPH_NO) || "").replaceAll("-", "");
	if (site == "KR" && mobile != "") {
		MakeCustomerAlarmData(maxsoft.resource.MSG70728, null, null, postValue.APLT_NM, mobile); // 상담문의 요청이 정상적으로 접수되었습니다. 담당자가 전화드릴 예정입니다. 감사합니다.
	}
	var cntyCd = $("#hidCountry").get(0).value;
	if (site == "US") {
		cntyCd = $("#uldropCNTY_CD li.is-active").find("a").attr("id");
	}

	MakeManageAlarmData("CONTACT", maxsoft.resource.MSG70729, null, "N", "N", lanType); // 상담문의&이메일 문의가 접수되었습니다.
	MakeReplaceParamsInfosData(lanType, $("#hidCountry").val(), "", postValue.APLT_NM);

	var ConsultData = $.extend({}, postValue, {
		CNTY_CD: cntyCd,
        USER_IP: $("#hidEditIP").val(),
        BUSS_SITE_CNTY_CD: $("#SaleSite").val(),
        BRN_CD: $("#SaleSite").val(),
        CNSL_PRGS_STAT_CD: "NEW",
        DEVC_TYPE_CD: $("#hidIsFromMobile").val().toUpperCase() == "TRUE" ? "MB" : "DT",
        USER_COKI_ID: getCookie('ecinccid'),
        VIST_COKI_ID: getCookie('ecyearcid'),
		CNSLG_TYPE_CD: getCnslgTypeCd(selectedTab),
		MKTG_RCV_AGRM_TF: $("#SaleSite").val() != "KR" ? null : $("#consulting-agreemodal2").is(":checked")
	});
	ConsultDetailData.push({
		Key: { CNTS_CLAS_CD: "RQ" },
		CNTS_CTT: postValue.CNTS_CTT
	});

    var dataSet = {
        LAN_TYPE: $("#siteLanType").val(),
        ConsultDataInfos: JSON.stringify(ConsultData),
        ConsultDetailDataInfos: JSON.stringify(ConsultDetailData),
        ManageAlarmInfos: JSON.stringify(Dto.ManageAlarm),
        CustomerAlarmInfos: JSON.stringify(Dto.CustomerAlarm),
        ReplaceParamsInfos: JSON.stringify(Dto.ReplaceParamsInfos),
		NEW_CODE_ZONE: $("#newCodeZone").val(),
		NEW_DB_SHARD_NO: $("#newDbShardNo").val(),
    };

    var param = {
        sessionURL: TargetServer + "/GMCAPI/Svc/Admin/Marketing/SaveSalesManagement",
        data: { Request: dataSet },
        method: "POST",
        callbackApi: function (data) {
            if (data.Status != "200") {
				saveComplete = true;
                alert("error");
                return false;
			} else {
				if (data.Data && data.Data.ERROR_MSG != null && data.Data.ERROR_MSG != "") {
					var mbphNoTitle = $("#li_TEL_NO").hasClass("is-hide") ? $("#li_MBPH_NO > .title").text() : $("#li_TEL_NO > .title").text();
					var msg = data.Data.ERROR_MSG.replaceAll(/\[MBPH_NO]/g, mbphNoTitle).replaceAll(/\[TEL_NO]/g, mbphNoTitle);
					msg = msg.replaceAll(/\[MBPH_NO]/g, mbphNoTitle).replaceAll(/\[TEL_NO]/g, mbphNoTitle);
					alert(msg);
					saveComplete = true;
					return false;
				} 

                var jsonData = "";

                try {
                    jsonData = JSON.stringify(dataSet);
                } catch (e) {
                    jsonData = "JSON.stringify ERROR: " + e.message;
                }

                SendTrackingData(getConversionName(selectedTab), function () {
					setTimeout(function () {
						modal_toggle(true);
						//location.href = String.format("ECK040M.aspx?FromPage=CONTACTUS&IsModal=Y&FromUrl={0}", $("#hidFromUrl").val());
                    }, 1000);
                }, jsonData);
            }
        }
    };



    if (typeof fbq == "function")
		fbq('track', 'Lead');

	// 바이두
	window._agl && window._agl.push(['track', ['success', { t: 2 }]])

    gmcSessionApi(param);

}

function getConversionName(tab) {
	var res = "";
	switch (tab) {
		case "visit": res = "#CONVERSION_21"; break;
		case "call": res = "#CONVERSION_22"; break;
		case "email": res = "#CONVERSION_23"; break;
		case "skype": res = "#CONVERSION_24"; break;
		case "line": res = "#CONVERSION_25"; break;
		case "qq": res = "#CONVERSION_26"; break;
		case "wechat": res = "#CONVERSION_27"; break;
		case "zalo": res = "#CONVERSION_28"; break;
		case "whatsapp": res = "#CONVERSION_29"; break;
		default:
			break;
	}

	return res;
}

function getCnslgTypeCd(tab) {
	var res = 0;
	switch (tab) {
		case "visit": res = 21; break;
		case "call": res = 22; break;
		case "email": res = 23; break;
		case "skype": res = 24; break;
		case "line": res = 25; break;
		case "qq": res = 26; break;
		case "wechat": res = 27; break;
		case "zalo": res = 28; break;
		case "whatsapp": res = 29; break;
		default:
			break;
	}

    return res;
}