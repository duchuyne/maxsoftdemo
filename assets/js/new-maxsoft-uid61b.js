/**************************************************************************************************** 
1. Create Date : 2018.09.27
2. Creator     : Jung Dong Woo
3. Description : site jquery
4. Precaution  : 
5. History     :	2023.04.10 (김동수) : A23_01833_02 - 영업 홈페이지 신청페이지 새탭으로 띄우기
					2023.04.12 (김동수) : A23_01973 - 영업 홈페이지 사이드, 하단 영업전화 클릭시 Path Tracking 구분값 부여
					2023.04.24 (김동수) : A23_02071 - KR 방문 설명 버튼 및 새탭 신청페이지 추가
					2023.06.20 (김동수) : A23_03122 - KR, TW, TH, VN 홈페이지 페이스북 픽셀 삽입
					2024.02.20 (김동수) : A24_00391 - KR, VN 홈페이지 후속 수정사항
					2024.02.21 (김동수) : A24_01000 - VN 라이브 데모 신청창 URL 수정사항
					2024.02.21 (김동수) : A24_01000 - VN 라이브 데모 신청창 URL 수정사항2
6. Old file    :
* ***************************************************************************************************/

// JavaScript Document
var strSite = "";
if (typeof (menuLv03) != "undefined") {
	var Menu03 = menuLv03.substr(5, menuLv03.length);
	Menu03 = Number(Menu03) - 1;
}

function isBot() {
	const userAgent = navigator.userAgent.toLowerCase();
	return /googlebot|google-inspectiontool|Yeti|bingbot|slurp|duckduckbot|baiduspider|yandex/.test(userAgent);
}

// Iframe 관련 변수(ECK), 각 페이지에서 변경함
var iFrame_UrlECK = "";
var iFrame_Height = 0;
function createRequestParams(param) {
	var paramToString = function (p) {
		var returnString = "";
		if ($.isArray(p))
			returnString = p.join("&");
		else if (typeof (p) == "object") {
			var q = [];
			for (var key in p) {
				if (p.hasOwnProperty(key)) {
					var value = p[key];
					if (value === null || value === undefined) { // 다른 falsy value 들은 값으로 출력되어야 한다.
						value = "";
					}
					q.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
				}
			}
			returnString = q.join("&");
		}
		else if (typeof (p) == "string") {
			returnString = p.substring(0, 1) == "?" || p.substring(0, 1) == "&" ? p.substring(1) : p;
		}
		return returnString;
	};
	var queryString = "ts=" + Date.now();
	if (param)
		queryString += "&" + paramToString(param);

	if (this.iFrame_param)
		queryString += "&" + paramToString(this.iFrame_param);
	return queryString;
}
function check_ie8() {
	var agt = navigator.userAgent.toLowerCase();
	var trident = navigator.userAgent.match(/Trident\/(\d)/i);
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat(RegExp.$1);
	}
	if (rv == 7 && trident == "Trident/4,4") {
		$('#browser_check').show()
	}
}
//모바일디바이스 판단
var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};
//상단전화번호링크연결
if (isMobile.any()) {
	$(".quick-call > a").click(function () {
		$(location).attr("href", "tel:028-3837-3100");
	});
} else {
	$(".quick-call > a").click(function () {
		$(location).attr("href", "/vn/maxsoft/company/lien-he-voi-chung-toi?p=T1");
	})
}
//플레시 관련
//flashView(경로, ID, 너비, 높이, middle)
function flashView(objPath, objID, objWidth, objHeight, objAlign) {
	document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="' + objWidth + '" height="' + objHeight + '" id="' + objID + '" align="' + objAlign + '">');
	document.write('<param name="allowScriptAccess" value="sameDomain" />');
	document.write('<param name="movie" value="' + objPath + '" />');
	document.write('<param name="quality" value="high" />');
	document.write('<param name="loop" value="false">');
	document.write('<param name="menu" value="false">');
	document.write('<param name="wmode" value="transparent" />');
	document.write('<param name="bgcolor" value="#FFFFFF" />');
	document.write('<embed src="' + objPath + '" quality="high" ');
	document.write('wmode="transparent" ');
	document.write('bgcolor="#FFFFFF" width="' + objWidth + '" height="' + objHeight + '" name="' + objID + '" align="' + objAlign + '" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" />');
	document.write('</object>');
}
//새로운창(크기 조절 가능)
//newWindowR(경로, 창이름, 스크롤바 유무-yes or no, 너비, 높이)
function newWindowR(url, wname, scflag, width, height) {
	window.open(url, wname, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scflag + ',resizable=yes,copyhistory=no,width=' + width + ',height=' + height + '');
}
//-->
//edumovie 팝업창(크기 조절 가능)
//edumovie(경로)
function edu_movie(url) {
	window.open(url, 'edu_movie', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=850 ,height=700');
}
//-->
//youtube 팝업창(크기 조절 가능)
//youtube(경로)
function youtube(url) {
	window.open(url, 'youtube', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=1050 ,height=820');
}
//-->
//promote_movie 팝업창(크기 조절 가능)
//promote_movie(경로)
function promote_movie(url) {
	window.open(url, 'promote_movie', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=1100 ,height=740');
}
//-->
//captureImg 팝업창(크기 조절 가능)
//captureImg(경로)
function captureImg(url) {
	window.open(url, 'captureImg', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=1050 ,height=820');
}
//-->
//범용 show, hide 기능
//menuclick(클릭타이틀 ID, 컨텐츠 ID, 메뉴갯수)
function menuclick(test1, test2, menuCnt) {
	//policy_title_1
	var tId = test1;
	var cId = test2;
	var maxCnt = menuCnt + 1 || 0;
	var tempLen = tId.length;
	var tempIdx = tId.lastIndexOf("_");
	var tempIdx2 = cId.lastIndexOf("_");
	var tempId1 = tId.substring(0, tempIdx);	//policy_title
	var tempId2 = tId.substring(tempIdx + 1, tempLen);	//1
	var tempId3 = cId.substring(0, tempIdx2);
	for (var i = 1; i < maxCnt; i++) {
		$("#" + tempId1 + "_" + i).removeClass();
		$("#" + tempId3 + "_" + i).css("display", "none");
	}
	$("#" + tempId1 + "_" + tempId2).addClass("on");
	$("#" + tempId3 + "_" + tempId2).css("display", "block");
}
//제품기능 메인화면 아코디언
$(function () {
	$(".func_main").accordion({ autoHeight: false, collapsible: true });
});
//제품기능 메인화면 링크
function pagelink(pagenum) {
	document.location.href = "product_" + pagenum + ".maxsoft";
}
//데모, free trial 아코디언
$(function () {
	$("#acc01").accordion({ autoHeight: false, collapsible: true, active: false });
});
//faq 아코디언
$(function () {
	$("#acc02").accordion({ heightStyle: "content", collapsible: true });
});
//why 다양한 출력물
function showCaptureImage(id) {
	var iMaxNum = 12;
	for (var i = 1; i <= iMaxNum; i++) {
		if (id == i)
			document.getElementById("capture" + i.toString()).style.display = "block";
		else
			document.getElementById("capture" + i.toString()).style.display = "none";
	}
}
//accordion
$('.accordion-section-title').click(function (e) {
	var currentAttrValue = $(this).attr('href');
	if ($(this).is('.active')) {
		$('.accordion .accordion-section-title').removeClass('active');
		$('.accordion .accordion-section-content').slideUp(100).removeClass('open');
	} else {
		$('.accordion .accordion-section-title').removeClass('active');
		$('.accordion .accordion-section-content').slideUp(100).removeClass('open');
		$(this).addClass('active');
		$('.accordion ' + currentAttrValue).slideDown(100).addClass('open');
	}
	e.preventDefault();
});
/*상담센터*/
$(function () {
	$(".info_list > li > h4").click(function () {
		var acc = $(this).parent().hasClass("on");
		if (acc == true) {
			$(this).parent().removeClass("on");
		} else {
			$(".info_list > li.on").removeClass("on");
			$(this).parent().addClass("on");
		}
	});
});
//youtube동영상 팝업 열기
function edu_youtube(movieName) {
	window.open('/vn/popup/edu_youtube.aspx?erp-lecture=' + movieName, 'edu_youtube', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=820 ,height=653');
}
//youtube-wide동영상 팝업 열기
function edu_youtube_wide(movieName) {
	window.open('/vn/popup/edu_youtube_wide.aspx?erp-lecture=' + movieName, 'edu_youtube', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=883 ,height=533');
}
function edu_youtube_es(movieName) {
	window.open('https://www.maxsoft.com/es/popup/edu_youtube.jsp?erp-lecture=' + movieName, 'edu_youtube', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=820 ,height=650');
}
function edu_youtube_cn(movieName) {
	window.open('https://www.maxsoft.com/cn/popup/edu_youtube.jsp?erp-lecture=' + movieName, 'edu_youtube', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=820 ,height=650');
}
/*하단 언어별 select div */
$(function () {
	$(".lang_selectbox").mouseover(
		function () {
			$(".lang_list").show();
		}
	);
	$(".lang_selectbox").mouseout(
		function () {
			$(".lang_list").hide();
		}
	);
});
//상담가능시간 보여주기 
function showCalltime() {
	$('div.timeTable').toggle();
}
//언어선택
$(".lang-selectbox").hover(
	function () {
		$(".lang-list").slideDown(100);
	},
	function () {
		$(".lang-list").slideUp(100)
	}
)
//새로운창(크기 조절 가능)
function nW0(desurl, wname, scflag, width, height) {
	var newurl = desurl;
	window.open(newurl, wname, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=' + scflag + ',resizable=yes,copyhistory=no,width=' + width + ',height=' + height + '');
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
//쿠키 날짜지정(X일 안보기에 쓰임) expiredays일 동안 안보기
function setCookie1(name, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}
function setCookiePath(name, value, expireFg) {
	var expireDate = new Date(2050, 1, 1, 1, 1, 1);
	var path = location.pathname.substr(0, 3);
	if (expireFg == 'Y')
		document.cookie = name + "=" + value + "; path=" + path + "; expires=" + expireDate.toGMTString();
	else
		document.cookie = name + "=" + value + "; path=" + path + ";";
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
function OpenPageForGMC(url) {
	if (fnEckPageChk(url)) {
		var urlEck = url.split("?");
		if (urlEck[0].indexOf(".aspx") < 0) {
			if (urlEck[0].indexOf("/" + getLocation() + "/ECK/") < 0) {
				url = "/" + getLocation() + "/ECK/" + urlEck[0] + ".aspx?" + urlEck[1];
			} else {
				url = urlEck[0] + ".aspx?" + urlEck[1];
			}
		}
		window.open(url, "R_Demo_L");
	} else {
		var domain = '',
			hostUrl = '';
		if (window.location.host.indexOf("test") > -1 || window.location.host.indexOf("sale") > -1) {
			domain = "test.maxsoft.com";
		} else if (window.location.host.indexOf("zeus") > -1) {
			domain = "zeusgmc.maxsoft.com";
		} else if (window.location.host.indexOf("apollo") > -1) {
			domain = "apollogmc.maxsoft.com";
		} else if (window.location.host.indexOf("hera") > -1) {
			domain = "heragmc.maxsoft.com";
		} else {
			domain = "gmc.maxsoft.com";
		}
		var openUrl = "//" + domain + "/ECERP/GeneralPage/OpenPageForGMC?RetUrl=" + encodeURIComponent(url) + "&IsSessionmaxsoft=true";
		window.open(openUrl, "R_Demo_L");
	}
}
/*-- new api gmc  --*/
//new page sales
function ServerChk_GMC(value, windowId, width, height) {
	//debugger;

	if (strSite == 'NO') {
		newWindowR('http://login.maxsoft.com/', 'sever_check', 'yes', 700, 700);
	} else {
		//newWindowR('//test.maxsoft.com/ECMain/ECK/'+value,windowId,'yes',width,height);
		if (fnEckPageChk(value)) {
			fnOpenPage(value, windowId, width, height);
		} else {
			OpenPageFor_GMC('/ecerp/GMC.GCK/' + value, windowId, width, height);
		}
	}
}
//영업홈페이지에 있는 KCP 체크
function fnEckPageChk(url) {
	var openUrl = url.toUpperCase()
	if (openUrl.indexOf("ECK006M") > -1 || openUrl.indexOf("ECK001M") > -1 || openUrl.indexOf("ECK004M") > -1 || openUrl.indexOf("ECK006P_01") > -1 || openUrl.indexOf("ECK006P_02") > -1 || openUrl.indexOf("ECK006P_03") > -1 || openUrl.indexOf("ECK009M") > -1 || openUrl.indexOf("ECK011M") > -1 || openUrl.indexOf("ECK013M") > -1 || openUrl.indexOf("ECK014M") > -1 || openUrl.indexOf("ECK018M") > -1 || openUrl.indexOf("ECK018M_01") > -1 || openUrl.indexOf("ECK018P_01") > -1 || openUrl.indexOf("ECK019M") > -1 || openUrl.indexOf("ECK029M") > -1 || openUrl.indexOf("ECK033M") > -1 || openUrl.indexOf("ECK034") > -1) {
		return true;
	} else {
		return false;
	}
}
//영업홈페이지에 있는 KCP page로 이동
function fnOpenPage(value, name, width, height) {
	var urlEck = value.split("?");
	if (urlEck[0].indexOf(".aspx") < 0) {
		if (urlEck[0].indexOf("/" + getLocation() + "/ECK/") < 0) {
			value = "/" + getLocation() + "/ECK/" + urlEck[0] + ".aspx?" + urlEck[1];
		} else {
			value = urlEck[0] + ".aspx?" + urlEck[1];
		}
	}
	window.open(value, name, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=' + width + ',height=' + height + '');
}
//open gmc
function OpenPageFor_GMC(url, name, width, height) {
	var domain = '',
		hostUrl = '';
	if (window.location.host.indexOf("test") > -1 || window.location.host.indexOf("sale") > -1) {
		domain = "test.maxsoft.com";
	} else if (window.location.host.indexOf("z") > -1 || window.location.host.indexOf("hera") > -1) {
		hostUrl = window.location.host.split(".")[0];
		//hostUrl = "zeus11"
		domain = hostUrl + "gmc.maxsoft.com";
	} else {
		domain = "gmc.maxsoft.com";
	}
	var openUrl = "//" + domain + "/ECERP/GeneralPage/OpenPageForGMC?RetUrl=" + encodeURIComponent(url) + "&IsSessionmaxsoft=true";
	newWindowR(openUrl, name, 'yes', width, height);
}
/*--end new api gmc  --*/
// 서브페이지 동영상 관련 스크립트
var country = "_vn_";
var verManagement = "?ver=2018011201";
$(function () {
	gifPlayer()
	loadGif()
	$(document).scroll(function () {
		gifPlayer()
	})
})
function gifPlayer() {
	$(".mov-img").each(function (index) {
		playGif($(this), index)
	})
}
function loadGif(index) {
	$(".mov-img").each(function (index) {
		var fileName = getFileName()
		var img = $("<img>").attr('src', fileName + country + (index + 1) + ".gif" + verManagement)
		$(".gif-movie").append(img)
	});
}
function playGif(obj, index) {
	var $bh = $(window).height()
	var $bhs = $(window).height() + $(document).scrollTop()
	var $it = $(".mov-img:eq(" + index + ")").offset().top
	var $ib = $it + $(".mov-img:eq(" + index + ")").height() + $bh
	var fileName = getFileName()
	if ($bhs >= $it && $bhs <= $ib) {
		if (obj.attr("src") != fileName + country + (index + 1) + ".gif" + verManagement) {
			obj.attr("src", fileName + country + (index + 1) + ".gif" + verManagement)
		}
	} else {
		obj.attr("src", "assets/images/product/default.gif" + verManagement)
	}
}
function getFileName() {
	var pathName = $(location).attr('pathname')
	var fileName = "/assets/images/product/product_mov/" + pathName.split('/')[3]
	return fileName
}
var isLoadComplete = false;
// iFrame 모달 팝업
$(document).ready(function () {
	$(".wrapper-page-progress").css("display", "none");
	$('.open-modal, .button-demo, .button-trial').click(function (e) {
		var page = $(this).data("page");
		var p = $(this).data("p");
		var ci = getCookie("ecyearcid");
		var coi = getCookie("ecinccid");

		var param = "";
		if (p != undefined) {
			param = "?p=" + p;
		}

		if (page == "freecontact") {
			OpenPageForGMC('/' + getLocation() + '/ECK/ECK034M_CN.aspx' + param, 'explorer_freecontact', 770, 560);
			return;
		}
		if (page == "trydemo") {
			OpenPageForGMC('/' + getLocation() + '/ECK/ECK004M_CN.aspx' + param, 'explorer_trydemo', 770, 560);
			return;
		}

		if (page == "livedemo") {
			OpenPageForGMC('/' + getLocation() + '/ECK/ECK014M_CN.aspx' + param, 'explorer_livedemo', 770, 560);
			return;
		}
		if (page == "freetial") {
			OpenPageForGMC('/' + getLocation() + '/ECK/ECK009M_CN.aspx' + param, 'explorer_freetrial', 770, 560);
			return;
		}

		if ((page == "signup" || page == "ft" || page == "demo" || page == "contactus") && !isMobile.any()) {
		}
		else {
			e.preventDefault();
			isLoadComplete = false;
			iFrame_param = "IsModal=Y";
			$('.modal-panel').css({
				'visibility': 'visible',
				'z-index': '30'
			});
			$('.modal-panel-overlay').css('display', 'block');
			$('body').css('overflow-y', 'hidden');
			setTimeout(function () {
				if (!isLoadComplete)
					$(".wrapper-page-progress").css("display", "block");
			}, 2000);
		}
		if (page == "ft") {
			if (isMobile.any()) {
				iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK009M.aspx";
				iFrame_Height = 360;
				$(".modal-panel").removeClass().addClass("modal-panel modal-panel-free-trial");
			}
			else {
				OpenPageForGMC('/' + getLocation() + '/ECK/ECK009M_CN.aspx' + param, 'login_freetrial', 770, 560);
			}
		} else if (page == "ft_old") {
			iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK009M.aspx";
			iFrame_Height = 360;
			$(".modal-panel").removeClass().addClass("modal-panel modal-panel-free-trial");
		} else if (page == "demo_old") {
			iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK004M.aspx";
			iFrame_Height = 378;
			$(".modal-panel").removeClass().addClass("modal-panel modal-panel-demo");
		} else if (page == "demo") {
			if (isMobile.any()) {
				iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK004M.aspx";
				iFrame_Height = 378;
				$(".modal-panel").removeClass().addClass("modal-panel modal-panel-demo");
			}
			else {
				OpenPageForGMC('/' + getLocation() + '/ECK/ECK004M_CN.aspx' + param, 'login_demo', 770, 560);
			}
		} else if (page == "live-demo") {
			iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK014M.aspx";
			iFrame_Height = 350;
			$(".modal-panel").removeClass().addClass("modal-panel modal-panel-live-demo");
		} else if (page == "visiting") {
			iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK006P_03.aspx";
			iFrame_Height = 350;
			$(".modal-panel").removeClass().addClass("modal-panel modal-panel-visiting");
		} else if (page == "contactus") {
			if (isMobile.any()) {
				iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK006M.aspx";
				iFrame_Height = 670;
				$(".modal-panel").removeClass().addClass("modal-panel modal-panel-contactus");
			}
			else {
				OpenPageForGMC('/' + getLocation() + '/ECK/ECK006M_CN.aspx' + param, 'login_contactus', 770, 560);
			}
		}
		if ((page == "ft" || page == "demo" || page == "contactus") && !isMobile.any()) {
			// 아래 스크립트가 호출되면 iFrame에 자기 페이지를 다시 호출함(PathTracking에 2번 찍히는 문제 발생)
		}
		else {
			reloadframe();
			bindIframe();
		}
	});
	$('.close-modal, .modal-panel-overlay').click(function () {
		$('.modal-panel').css({
			'visibility': 'hidden',
			'z-index': '-30'
		});
		$(".modal-panel iframe").attr("src", "about:blank");
		$('.modal-panel-overlay').css('display', 'none');
		$('body').css('overflow-y', 'scroll');
	});
	sortIframe()
});
$(window).resize(function () {
	var winHeight = $(window).height();
	var winWidth = $(window).width();
	var offsetShame = 80;
	$('.modal-panel').css({
		'height': winHeight - offsetShame + 'px',
		'width': winWidth - offsetShame / 2 + 'px'
	});
	sortIframe();
});
function modalCenterSort(callback) {
	callback();
};
function bindIframe(height, width) {
	var windowHeight = $(window).height(),
		iframeHeight,
		resultHeight,
		offsetHeight = 100;
	$('.modal-panel').height(this.iFrame_Height + 'px');
	$('.modal-panel').css({ 'max-height': this.iFrame_Height + 30 + 'px' });
	iframeHeight = height || this.iFrame_Height;
	if (iframeHeight > windowHeight - offsetHeight) {
		resultHeight = windowHeight - offsetHeight;
	} else {
		resultHeight = iframeHeight;
	}
	$('.modal-panel').height(resultHeight + 'px');
	$('.modal-panel').css({ 'max-height': iframeHeight + 30 + 'px' });
	if (width) {
		$('.modal-panel').width(width + 'px');
		$('.modal-panel').css({ 'max-width': width + 'px' });
	}
	else {
		$('.modal-panel').css("width", "");
		$('.modal-panel').css("max-width", "");
	}
	modalCenterSort(function () {
		sortIframe();
	});
};
function reloadframe(frameId, param) {
	var openUrl = this.iFrame_UrlECK + "?" + createRequestParams(param);
	var targetFrame = frameId || "iFrameECK";
	$("#" + targetFrame).one("load", function () {
		isLoadComplete = true;
		$(".wrapper-page-progress").hide();
	});
	$('#' + targetFrame).attr('src', openUrl);
};
function sortIframe() {
	var width = ($(window).width() - $('.modal-panel').width()) / 2;
	var height = ($(window).height() - $('.modal-panel').height()) / 2;
	$('.modal-panel').css({
		'left': width,
		'top': height
	});
};
$(function () {
	getFaqEvent();
});
function getFaqEvent() {
	$('.faq-contents-body ul li').on('click', function () {
		$('.faq-contents-body ul li').removeClass('active');
		$(this).addClass('active');
	});
	$('.sub-contents .wrapper-faq ul li').first().addClass('active');
};
var getLocation = function () {
	var url = location.pathname.toLowerCase().split('.aspx')[0];
	url = url.replace(/\/\/+/g, '/');
	var regx = /\.cn$/i;
	if (regx.test(url)) {
		return "cn";
	}
	else {
		return url.substring(1, 3);
	}
};




/* EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ */
// 아래 부분은 홈페이지 코드입니다.
// 되도록 EUX팀 외에 작업 하지 말아주세요.
// 수정 발생 시에는 EUX팀으로 연락 부탁드립니다.
// 코드 추가 시 "EUX ▼" 주석 위에 코드 추가 부탁드립니다.
/* EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ EUX ▼ */
$(document).ready(function () {
	/**********/
	/* COMMON */
	/**********/
	/* VARIABLE */
	if ($("body").length > 0) {
		// Main Variable 
		var urlFull = $(location).attr("href");
		var urlPathname = $(location).attr("pathname");
		// Navigation Depth Variable
		if (typeof (menuNum) != "undefined") {
			depth = menuNum.split('/');
			depth1 = depth[0];
			depth2 = depth[1];
			depth3 = depth[2];
		}
		// PC Nav
		var menuList = $("header > div.wrap-header > nav").html();
	}
	/* WINDOW RESIZE */
	$(window).resize(function () {
		// No Scroll
		noScrollBody();
		// GNB
		mobileGNB();
		//Footer Global
		$("footer a.button-present-state").removeClass("is-active").next().removeClass("is-active");
		// Certification
		mobileCertificationCenter();
		rowScroll($("footer > section.info > div.wrap-info > ul.certification"));
		// SUB
		if ($("body#sub").length > 0) {
			//HR
			sectionHRTop();
			// Depth2
			mobileDepth2Center();
			rowScroll($("header > nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2"));
			// Depth3
			if ($("header > nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2 > li.is-active > ul.depth3").length > 0) {
				mobileDepth3Center();
				mobileDepth3PCclose();
				rowScroll($("header > nav.mobile-depth2 > nav.mobile-depth3 > ul"));
				$("header > nav.mobile-depth2 > nav.mobile-depth3").removeClass("is-active");
			}
			// SUB join sign-up
			if ($("article.join").hasClass("sign-up")) {
				rowScroll($("article.join.sign-up > section.application > .policy > .list-button-tab"));
			}
			// SUB company about-us
			if ($("article.company").hasClass("gioi-thieu")) {
				rowScroll($("article.company.gioi-thieu > section.introduce > .list-tab-team-introduction"));
			}
		}
		// SUB Youtube Usecase
		if ($("body#sub article > section.youtube-usecase").length > 0) {
			slickYoutube();
		}
		// Parameter
		setParameter();
	});
	/* WINDOW SCROLL */
	if ($("body").length > 0) {
		$(window).scroll(function () {
			headerShadow();
			topButton();
			sectionAnimation();
			mobileDepth2View();
			if ($("body#sub").length > 0) {
				sectionHRTop();
				//if ($("article.product").length > 0) {
				//	titleYoutubeControl();
				//}
			}
		});
		// Header Shadow
		function headerShadow() {
			if ($(window).scrollTop() > 0) {
				$("header").addClass("is-scroll");
			} else {
				$("header").removeClass("is-scroll");
			}
		}
		// Top button
		function topButton() {
			if ($(window).scrollTop() > 0) {
				$("footer > div.button-top").addClass("is-scroll");
				$("footer > div.button-top").click(function () {
					$("html, body").stop().animate({ scrollTop: 0 }, 200);
				})
			} else {
				$("footer > div.button-top").removeClass("is-scroll");
			}
		}
		// MobileDepth2View
		var currentScrollTop = $(window).scrollTop();
		function mobileDepth2View() {
			if ($("body#sub article").length > 0 && $("header nav.mobile-depth3").hasClass("is-show") && $(window).scrollTop() > currentScrollTop) {
				$("header nav.mobile-depth2 > ul.depth1").addClass("is-scroll");
				currentScrollTop = $(window).scrollTop();
			} else {
				$("header nav.mobile-depth2 > ul.depth1").removeClass("is-scroll");
				setTimeout(function () { $("header nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2").css("overflow", "hidden"); }, 0);
				setTimeout(function () { $("header nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2").css("overflow", "auto"); }, 50);
				currentScrollTop = $(window).scrollTop();
			}
		}
		//MP4 Video Out-Pause and Reset, In-Play
		$(window).scroll(function () {
			var scroll_top = $(window).scrollTop();
			var win_height = $(window).height();
			var video = $("video");
			video.each(function () {
				var video_top = $(this).offset().top;
				var video_height = $(this).outerHeight(true);
				if (scroll_top > (video_top - win_height + (win_height * 0.2)) && scroll_top < (video_top + video_height - (win_height * 0.2))) {
					$(this).get(0).play();
				} else if ($(this).get(0).currentTime > 0.1) {
					$(this).get(0).currentTime = 0;
					$(this).get(0).pause();
				}
			});
		});
	}
	/* DRAG & SCROLL */
	if ($("body").length > 0) {
		function rowDrag(Obj) {
			let x, left, down;
			var covercheck = 0;
			Obj.mousedown(function (e) {
				e.preventDefault();
				down = true;
				x = e.pageX;
				left = $(this).scrollLeft();
			});
			Obj.mousemove(function (e) {
				if (down) {
					var newX = e.pageX;
					if (covercheck == 0) {
						$(this).scrollLeft(left - newX + x);
						covercheck = 1;
						$(document).on("click", function (e) {
							e.preventDefault();
						})
					} else {
						$(this).scrollLeft(left - newX + x);
					}
				}
			});
			Obj.mouseleave(function (e) {
				down = false;
				covercheck = 0;
			});
			Obj.mouseup(function (e) {
				down = false;
				setTimeout(function () { $(document).off(); }, 100);
				covercheck = 0;
			});
		}
		function colDrag(Obj) {
			let y, top, down;
			var covercheck = 0;
			Obj.mousedown(function (e) {
				e.preventDefault();
				down = true;
				y = e.pageY;
				top = $(this).scrollTop();
			});
			Obj.mousemove(function (e) {
				if (down) {
					var newY = e.pageY;
					if (covercheck == 0) {
						$(this).scrollTop(top - newY + y);
						covercheck = 1;
						$(document).on("click", function (e) {
							e.preventDefault();
						})
					} else {
						$(this).scrollTop(top - newY + y);
					}
				}
			});
			Obj.mouseleave(function (e) {
				down = false;
				covercheck = 0;
			});
			Obj.mouseup(function (e) {
				down = false;
				setTimeout(function () { $(document).off(); }, 100);
				covercheck = 0;
			});
		}
		function rowScroll(Obj) {
			var deltaX = 0;
			var deltaXWidth;
			function mobileDeltaXWidthValue() {
				var liLength = Obj.find("> li").length;
				var liWidth = 0;
				for (i = 1; i <= liLength; i++) {
					liWidth += Obj.find("> li:nth-child(" + i + ")").outerWidth(true);
				}
				if (window.innerWidth > 889) {
					deltaXWidth = liWidth - window.innerWidth + $(".wrap-lnb").outerWidth() + 50;
				} else {
					deltaXWidth = liWidth - window.innerWidth + 50;
				}
			} mobileDeltaXWidthValue();
			Obj.on('mousewheel DOMMouseScroll', function (event, delta) {
				if (deltaX <= 0) {
					deltaX = 0;
				} else if (deltaX >= deltaXWidth) {
					deltaX = deltaXWidth;
				}
				deltaX -= (delta * 30);
				$(this).scrollLeft(deltaX);
				event.preventDefault();
			});
		}
	}
	/* MENU CLONE */
	if ($("body").length > 0) {
		if ($("header > nav.mobile-depth2").length > 0)
			$("header > nav.mobile-depth2").prepend(menuList);
		if ($("div.wrap-container > div.wrap-lnb > nav").length > 0)
			$("div.wrap-container > div.wrap-lnb > nav").prepend(menuList);
		if ($("footer > section.menu > nav").length > 0)
			$("footer > section.menu > nav").prepend(menuList);
		if ($("article.etc.so-do-website > section.menu > nav").length > 0)
			$("article.etc.so-do-website > section.menu > nav").prepend(menuList);
	}
	/* SECTION ANIMATION */
	function sectionAnimation() {
		var section = $("article > section");
		section.each(function () {
			var scroll_top = $(window).scrollTop();
			var win_height = $(window).innerHeight();
			var section_top = $(this).offset().top;
			var section_margin_top = 0; // 섹션이 어느 높이까지 닿으면 올라올지 결정하는 변수
			if ($("article").hasClass("bang-gia") || $("article").hasClass("khach-hang-tieu-bieu") || $("article").hasClass("tu-van-tai-van-phong") || $("article").hasClass("phien-ban-demo")
				|| $("article").hasClass("demo-truc-tuyen") || $("article").hasClass("phien-ban-dung-thu")) {
				var section_margin_top = 200;
			}
			if (section_top <= win_height + section_margin_top) { // 윈도우 높이 + 마진 변수 보다 섹션의 위치가 작거나 같을 때 올라오기 결국 이거 최초아닌가?
				if ($(this).hasClass("title") && $(this).hasClass("is-typing") == false) {
					//titleEffect($(this).find('h1'));
					//$(this).addClass("is-typing");
				}
				if ($(this).hasClass("is-fadein") || $(this).hasClass("is-no-fade") || $(this).hasClass("is-typing")) { } else {
					$(this).addClass("is-fadein");
					$(this).addClass("is-typing");
					if ($("article").hasClass("main") && $(this).hasClass("video")) {
						titleEffect($(this).find('h3'));
					} else if ($("article").hasClass("main") && $(this).hasClass("video-title")) { }
					else if ($("body").hasClass("mobile") && $("article").hasClass("main") && $(this).hasClass("tag")) { }
					else {
						titleEffect($(this).find('h2'));
					}
				}
			}
			else if (section_top - win_height - (section_margin_top * 0.8) <= scroll_top) {
				if ($(this).hasClass("is-fadein") || $(this).hasClass("is-no-fade") || $(this).hasClass("is-typing")) { } else {
					if ($(this).hasClass("youtube-usecase") || $(this).hasClass("bottom-link")) {
						$(this).addClass("is-fadein");
					} else {
						$(this).addClass("is-fadein");
						$(this).addClass("is-typing");
						if ($("article").hasClass("main") && $(this).hasClass("video")) {
							titleEffect($(this).find('h3'));
						} else if ($("article").hasClass("main") && $(this).hasClass("video-title")) { } else {
							titleEffect($(this).find('h2'));
						}
					}
				}

			}
		});
	} sectionAnimation();
	/* TYPING EFFECT */
	function typeEffect($element) {
		var originalText = $element.html();
		var nodes = $element.contents().toArray();
		$element.css("opacity", 1);
		$element.empty();
		$.each(nodes, function (index, node) {
			var replaceSpanTag = "<span style='opacity: 0; display: inline; font-size: inherit; color:inherit; font-weight: inherit; line-height:inherit; letter-spacing: inherit;'>";
			var replaceSpanEndTag = "</span>";
			if (node.nodeType === 3) {
				var text = node.textContent;
				var newText = ""; // 공백을 모아 담을 변수
				for (var i = 0; i < text.length; i++) {
					if (text[i] === " ") {
						newText += text[i]; // 공백 모으기
					} else {
						if (newText !== "") { // 모아둔 공백이 있으면 span 태그로 감싸서 추가
							$element.append(replaceSpanTag + newText + replaceSpanEndTag);
							newText = ""; // 공백 초기화
						}
						$element.append(replaceSpanTag + text[i] + replaceSpanEndTag);
					}
				}
				if (newText !== "") { // 마지막 공백 처리
					$element.append(replaceSpanTag + newText + replaceSpanEndTag);
				}
			} else {
				var $tag = $(node);
				var tagText = $tag.text();
				$tag.empty();
				var newText = "";

				for (var i = 0; i < tagText.length; i++) {
					if (tagText[i] === " ") {
						newText += tagText[i];
					} else {
						if (newText !== "") {
							$tag.append(replaceSpanTag + newText + replaceSpanEndTag);
							newText = "";
						}
						$tag.append(replaceSpanTag + tagText[i] + replaceSpanEndTag);
					}
				}
				if (newText !== "") {
					$tag.append(replaceSpanTag + newText + replaceSpanEndTag);
				}
				$element.append($tag);
			}
		});
		var delay = 20;
		var totalDelay = 0;
		$element.find("span").each(function (index) {
			$(this).delay(delay * index).animate({ opacity: 1 }, 0);
			totalDelay = delay * index;
		});
		setTimeout(function () {
			$element.html(originalText);
			$element.css("opacity", 1);
		}, totalDelay + delay);
	}
	function titleEffect(title) {
		if (isBot()) {
			title.css("opacity", 1)
		} else {
			setTimeout(function () {
				typeEffect(title)
			}, 400);
		}
	}
	/* NAMEANCHOR TOP POSITION*/
	function nameAnchorTopPositon(){
		$(function () {
			$('a[href^="#"]').on('click', function (e) {
				e.preventDefault();
				var targetId = $(this).attr('href');
				var $target = $(targetId);
				if (!$target.length) return;
				var startTime = null;
				var duration = 1000;
				// 헤더 높이
				var addOffset = 0;
				if($("body").hasClass("mobile") == false && $(window).outerWidth() >= 1200){
				addOffset = 122;
				}
				if($("body").hasClass("mobile") == false && $(window).outerWidth() < 1199 && $(window).outerWidth() > 889){
				addOffset = 84;
				}
				if($("body").hasClass("mobile") == false && $(window).outerWidth() <= 889){
				addOffset = 105;
				}				
				if($("body").hasClass("mobile") == true && $(window).outerWidth() <= 889){
				addOffset = 130;
				}				 
				if($("body").hasClass("mobile") == true && $(window).outerWidth() < 1199 && $(window).outerWidth() > 889){
				addOffset = 130;
				}
				if($("body").hasClass("mobile") == true && $(window).outerWidth() >= 1200){
				addOffset = 152;
				}
				var headerHeight = $('.header').outerHeight() + addOffset;
				function scrollToTarget(timestamp) {
					if (!startTime) {
						startTime = timestamp;
					}
					var elapsed = timestamp - startTime;
					var progress = Math.min(elapsed / duration, 1);

					// 목적지 위치 - 헤더 높이
					var targetTop = $target.offset().top - headerHeight;
					var currentScroll = $(window).scrollTop();
					var distance = targetTop - currentScroll;
					$('html, body').scrollTop(
						currentScroll + (distance * 0.3)
					);
					// console.log('target:', targetTop);
					// console.log('scroll:', currentScroll);
					// console.log('distance:', distance);
					if (progress < 1 && Math.abs(distance) > 1) {
						requestAnimationFrame(scrollToTarget);
					}
				}
				requestAnimationFrame(scrollToTarget);
			});
		});
	}nameAnchorTopPositon();

	/* SUB */
	if ($("body#sub").length > 0) {
		// Section Animation 
		// Section HR 
		function sectionHRTop() {
			if ($("section.youtube-usecase").hasClass("is-fadein") || $("section.bottom-link").hasClass("is-fadein")) {
				if ($("section").hasClass("youtube-usecase")) {
					hrSectionWidth();
					setTimeout(function () {
						$("hr.section").css("top", $("article > section.youtube-usecase").offset().top);
					}, 500);
				} else if ($("section").hasClass("bottom-link")) {
					hrSectionWidth();
					setTimeout(function () {
						$("hr.section").css("top", $("article > section.bottom-link").offset().top);
					}, 500);
				}
			}
			function hrSectionWidth() {
				var outMargin = ($(window).innerWidth() - $("div.wrap-container").outerWidth()) / 2;
				var lnbMargin = $(".wrap-lnb").outerWidth();
				if ($("body").hasClass("mobile") == true) {
					$("hr.section").css({ "width": "100%", "opacity": "1" });
				} else if (window.innerWidth <= 889) {
					$("hr.section").css({ "width": "100%", "opacity": "1" });
				} else if (window.innerWidth > 889) {
					$("hr.section").css({ "width": $(window).innerWidth() - outMargin - lnbMargin - 1, "opacity": "1" });
				}
			}
		} sectionHRTop();
		function sectionHRTopQuick() {
			if ($("section.youtube-usecase").hasClass("is-fadein") || $("section.bottom-link").hasClass("is-fadein")) {
				if ($("section").hasClass("youtube-usecase")) {
					$("hr.section").css("top", $("article > section.youtube-usecase").offset().top);
				} else if ($("section").hasClass("bottom-link")) {
					$("hr.section").css("top", $("article > section.bottom-link").offset().top);
				}
			}
		} sectionHRTopQuick();
		// Bottom Link 
		if ($("article").length > 0) {
			$("article").append("<section class='bottom-link is-hide'><nav>" + menuList + "</nav></section>");
			var moreViewText = "Xem thêm"
			if (depth1 == 1 && $("article").hasClass("product")) {
				var titleText = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + depth2 + ") > a").text();
				var liHtml = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + depth2 + ") > ul.depth3").html();
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul").removeClass("depth1").html(liHtml);
			} else if ((depth1 == 2 && depth2 == 2) || (depth1 == 2 && depth2 == 3)) {
				var titleText = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > a").text();
				$("article > section.bottom-link > nav").prepend("<h2>Tại sao chúng ta cần đến maxsoft ?</h2>");
				var a = 2; var b = 3; if (depth2 == 3) { a = 3; b = 2; }
				var subTitleText = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + a + ") > a").text();
				$("article > section.bottom-link > nav").append("<h3>" + subTitleText + "</h3>");
				var liHtml = "<ul>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + a + ") > ul.depth3").html() + "</ul>";
				$("article > section.bottom-link > nav").append(liHtml);
				subTitleText = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + b + ") > a").text();
				$("article > section.bottom-link > nav").append("<h3>" + subTitleText + "</h3>");
				liHtml = "<ul>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + b + ") > ul.depth3").html() + "</ul>";
				$("article > section.bottom-link > nav").append(liHtml);
				$("article > section.bottom-link").removeClass("is-hide").find("nav > ul.depth1").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 1) {
				var titleText = "Tính năng Kho & Sản xuất"
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(19)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				var titleText2 = "bài viết khác của maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 2) {
				var titleText = "phân hệ kế toán của maxsoft"
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				var titleText2 = "bài viết khác của maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 3) {
				var titleText = "phân hệ quản lý kho của maxsoft"
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(30)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				var titleText2 = "bài viết khác của maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 4) {
				var titleText = "Tính năng phần mềm MaxSoft"
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				var titleText2 = "bài viết khác của maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 5) {
				var titleText = "phân hệ kế toán của maxsoft"
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(13)").html() + "</li>";
				var titleText2 = "bài viết khác của maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 6) {
				var titleText = "Phân hệ bán hàng của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(19)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(13)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 7) {
				var titleText = "phân hệ quản lý kho của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(12)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(30)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 8) {
				var titleText = "Tính năng phần mềm MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 9) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 10) {
				var titleText = "phân hệ sản xuất của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 11) {
				var titleText = "Tính năng phần mềm MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 12) {
				var titleText = "đặc điểm chính của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(19)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 13) {
				var titleText = "phân hệ bán hàng của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 14) {
				var titleText = "Tính năng phần mềm MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 15) {
				var titleText = "phân hệ kế toán của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(29)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 16) {
				var titleText = "đặc điểm chính của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 17) {
				var titleText = "phân hệ quản lý kho của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(12)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(30)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 18) {
				var titleText = "phân hệ sản xuất của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 19) {
				var titleText = "phân hệ quản lý kho của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 20) {
				var titleText = "phân hệ mua hàng của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 21) {
				var titleText = "Tính năng phần mềm MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 22) {
				var titleText = "phân hệ Groupware của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(8) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 23) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(26)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(25)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 24) {
				var titleText = "phân hệ sản xuất maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 25) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(26)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 26) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(26)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(25)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 27) {
				var titleText = "Tính năng phần mềm MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			}  else if (depth1 == 2 && depth2 == 5 && depth3 == 28) {
				var titleText = "đặc điểm chính của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(20)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(1) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 29) {
				var titleText = "phân hệ kế toán của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 30) {
				var titleText = "phân hệ quản lý kho của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 31) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(26)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(25)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 32) {
				var titleText = "Phân hệ quản lý bán hàng của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 33) {
				var titleText = "Phân hệ Sản xuất của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(6)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 34) {
				var titleText = "Tính năng chính của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				var titleText2 = "bài viết liên quan";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 35) {
				var titleText = "Các tính năng MaxSoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				var titleText2 = "bài viết liên quan";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 36) {
				var titleText = "Phân hệ kế toán của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(8)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(10)").html() + "</li>";	
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(13)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				var titleText2 = "bài viết liên quan";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 37) {
				var titleText = "phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(31)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(25)").html() + "</li>";
				var titleText2 = "bài viết liên quan";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 38) {
				var titleText = "phân hệ quản lý kho của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(7)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(9)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(11)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(10)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(12)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(30)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(2) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 39) {
				var titleText = "Phân hệ nhân sự của maxsoft";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(4)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(2)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(3)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(5)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else if (depth1 == 2 && depth2 == 5 && depth3 == 40) {
				var titleText = "Tính năng Kho & Sản xuất ";
				var liHtml = "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(2) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(3) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(4) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(5) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(6) > ul.depth3 > li:nth-child(1)").html() + "</li>";
				liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(7) > ul.depth3 > li:nth-child(1)").html() + "</li>";			
				var titleText2 = "bài viết khác maxsoft";
				var liLength2 = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml2 = "";
				for (i = 1; i <= liLength2; i++) {
					liHtml2 += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText2 + "</h2>").find("> ul").removeClass("depth1").html(liHtml2);
				$("article > section.bottom-link > nav").prepend("<ul>" + liHtml + "</ul>").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul > li > ul").remove();
			} else {
				var titleText = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > a").text();
				var liLength = $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li").length;
				var liHtml = "";
				for (i = 1; i <= liLength; i++) {
					liHtml += "<li>" + $("article > section.bottom-link > nav > ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + i + ")").html() + "</li>";
				}
				$("article > section.bottom-link").removeClass("is-hide").find("> nav").prepend("<h2>" + moreViewText + " " + titleText + "</h2>").find("> ul").removeClass("depth1").html(liHtml).find("> li > ul").remove();
			}
		}
	}

	/*******/
	/* GNB */
	/*******/
	/* MOBILE */
	if ($("body > div#wrap > header").length > 0) {
		// GNB 
		function mobileGNBSetting(device) {
			if (device == "pc") {
				$("header > div.wrap-header > nav").empty().html(menuList);
				resetHamburger();
			} else if (device == "mobile") {
				// Depth1
				var depth1Length = $("header > div.wrap-header > nav > ul.depth1 > li").length;
				var depth1HTML = "";
				for (i = 1; i <= depth1Length; i++) {
					depth1HTML += "<li>" + $("header > div.wrap-header > nav > ul.depth1 > li:nth-child(" + i + ") > a").wrap("</p>").parent().html() + "</li>";
					$("header > div.wrap-header > nav > ul.depth1 > li:nth-child(" + i + ") > p > a").unwrap();
				}
				// Function Depth2
				var functionDepth2Length = $("header > div.wrap-header > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li").length;
				var functionDepth2HTML = "";
				for (i = 1; i <= functionDepth2Length; i++) {
					functionDepth2HTML += "<li>" + $("header > div.wrap-header > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(" + i + ") > a").wrap("</p>").parent().html() + "</li>";
					$("header > div.wrap-header > nav > ul.depth1 > li:nth-child(1) > ul.depth2 > li:nth-child(" + i + ") > p > a").unwrap();
				}
				// HTML
				$("header > div.wrap-header > nav").prepend("<ul class='main-nav'>" + depth1HTML + "</ul>").find("> ul:first-child > li:first-child").append("<ul>" + functionDepth2HTML + "</ul>").end().find("> ul.main-nav").next("ul").addClass("sub-nav");
				// Main-Nav
				////////// 메인일때 엑티브 시키기
				if ($("body#main").length > 0) {
					$("header > div.wrap-header > nav > ul.main-nav > li:first-child > ul > li:first-child").addClass("is-active");
				} else if (depth1 == 1) {
					$("header > div.wrap-header > nav > ul.main-nav > li:first-child > ul > li:nth-child(" + depth2 + ")").addClass("is-active");
				} else {
					$("header > div.wrap-header > nav > ul.main-nav > li:first-child > ul").addClass("is-hide").closest("ul.main-nav").find("> li:nth-child(" + depth1 + ")").addClass("is-active");
				}
				// Sub-Nav
				$("header > div.wrap-header > nav > ul.sub-nav > li > a").remove();
				if ($("body#main").length > 0) {
					$("header > div.wrap-header > nav > ul.sub-nav > li > ul.depth2 > li > a").remove();
					$("header > div.wrap-header > nav > ul.sub-nav > li:first-child > ul.depth2").addClass("is-active").find("> li:nth-child(1) > ul.depth3").addClass("is-active")
				} else if (depth1 == 1) {
					$("header > div.wrap-header > nav > ul.sub-nav > li > ul.depth2 > li > a").remove();
					$("header > div.wrap-header > nav > ul.sub-nav > li:first-child > ul.depth2").addClass("is-active").find("> li:nth-child(" + depth2 + ") > ul.depth3").addClass("is-active").find("> li:nth-child(" + depth3 + ")").addClass("is-active");
				} else {
					$("header > div.wrap-header > nav > ul.sub-nav > li:nth-child(" + depth1 + ")").addClass("is-active");
					var isDpeth3 = $("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li > ul.depth3");
					isDpeth3.each(function () {
						$(this).parent().addClass("is-depth3").append("<div class='button-arrow'></div>");
					});
					$($("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li:nth-child(" + depth2 + ") > a")).addClass("is-active");
					if (depth3 > 0) {
						$("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li:nth-child(" + depth2 + ")").addClass("is-active").find("> ul.depth3 > li:nth-child(" + depth3 + ")").addClass("is-active");
					}
					$("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li.is-depth3 > div.button-arrow").click(function () {
						if ($(this).parent().hasClass("is-active")) {
							$(this).parent().removeClass("is-active");
						} else {
							$("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li.is-depth3").removeClass("is-active").find(">a").removeClass("is-active");
							$(this).parent().addClass("is-active");
						}
					});
				}
				// Col Drag
				colDrag($("header ul.main-nav"));
				colDrag($("header ul.sub-nav"));
			}
		}
		// Button Hamburger 
		$("header a.hamburger").click(function () {
			if ($(this).parent().find("nav").hasClass("is-active") == 0) {
				$("body").addClass("is-no-scroll");
				$("header").addClass("is-active").find("> div.wrap-header > nav").addClass("is-active").end().find("> nav.mobile-depth2 ul.depth2").addClass("is-no-scroll");
				$(this).addClass("is-active");
				navColScrollCenter();
			} else if ($(this).parent().find("nav").hasClass("is-active")) {
				resetHamburger();
			}
		});
		function resetHamburger() {
			$("body").removeClass("is-no-scroll");
			$("header").removeClass("is-active").find("> div.wrap-header > a.hamburger").removeClass("is-active").end().find("div.wrap-header > nav").removeClass("is-active").end().find("> nav.mobile-depth2 ul.depth2").addClass("is-no-scroll").end().find("> nav.mobile-depth2 > nav.mobile-depth3").removeClass("is-active");
			if (depth3 > 0) {
				$("header > div.wrap-header > nav > ul.sub-nav ul.depth2 > li.is-depth3").removeClass("is-active").find(">a").removeClass("is-active").closest("ul.depth2").find("> li:nth-child(" + depth2 + ")").addClass("is-active").find("> ul.depth3 > li:nth-child(" + depth3 + ")").addClass("is-active");
			}
		}
		function navColScrollCenter() {
			var navHeightHalf = $("header > div.wrap-header > nav").outerHeight(true) / 2;
			if ($("header > div.wrap-header > nav > ul.main-nav").length > 0) {
				$("header > div.wrap-header > nav > ul.main-nav").scrollTop(0);
				var term = 0;
				if (depth1 == 1) {
					term = 2;
				} else {
					term = 8;
				}
				var isActiveHeightHalf = ($("header > div.wrap-header > nav > ul.main-nav li.is-active").outerHeight(true) / 2) - term;
				var isActiveTop = $("header > div.wrap-header > nav > ul.main-nav li.is-active").position().top;
				var activeScroll = isActiveTop - navHeightHalf + isActiveHeightHalf;
				$("header > div.wrap-header > nav > ul.main-nav").stop().animate({ scrollTop: activeScroll }, 200);
			}
			if ($("header > div.wrap-header > nav > ul.sub-nav").length > 0) {
				$("header > div.wrap-header > nav > ul.sub-nav").scrollTop(0);
				if (depth1 == 1) {
					var isActiveHeightHalf = ($("header > div.wrap-header > nav > ul.sub-nav > li.is-active > ul.depth2.is-active ul.depth3.is-active li.is-active").outerHeight() / 2) + 21;
					var isActiveTop = $("header > div.wrap-header > nav > ul.sub-nav > li.is-active ul.depth2.is-active ul.depth3.is-active li.is-active").position().top;
					var activeScroll = isActiveTop - navHeightHalf + isActiveHeightHalf;
					$("header > div.wrap-header > nav > ul.sub-nav").stop().animate({ scrollTop: activeScroll }, 200);
				} else if (depth1 > 1 && depth3 == 0) {
					var isActiveHeightHalf = ($("header > div.wrap-header > nav > ul.sub-nav > li.is-active > ul.depth2 > li > a.is-active").outerHeight(true) / 2)
					var isActiveTop = $("header > div.wrap-header > nav > ul.sub-nav > li.is-active > ul.depth2 > li > a.is-active").offset().top - 55;
					var activeScroll = isActiveTop - navHeightHalf + isActiveHeightHalf;
					$("header > div.wrap-header > nav > ul.sub-nav").stop().animate({ scrollTop: activeScroll }, 200);
				} else if (depth1 > 1 && depth3 > 0) {
					var isActiveHeightHalf = ($("header > div.wrap-header > nav > ul.sub-nav > li.is-active > ul.depth2 > li.is-active > ul.depth3 > li.is-active").outerHeight(true) / 2) - 5;
					var isActiveTop = $("header > div.wrap-header > nav > ul.sub-nav > li.is-active > ul.depth2 > li.is-active > ul.depth3 > li.is-active").offset().top - 55;
					var activeScroll = isActiveTop - navHeightHalf + isActiveHeightHalf;
					$("header > div.wrap-header > nav > ul.sub-nav").stop().animate({ scrollTop: activeScroll }, 200);
				}
			}
		}
		// resize GNB 
		var resizeMobileGNBStatus = 0;
		if ($("body").hasClass("mobile")) {
			resizeMobileGNBStatus = 2;
		}
		function mobileGNB() {
			if ($("body").hasClass("mobile") && $("header > div.wrap-header > nav").length > 0 && resizeMobileGNBStatus == 2) {
				resizeMobileGNBStatus = 1;
				mobileGNBSetting("mobile");
			} else if ($("body").hasClass("mobile") == false && $("header > div.wrap-header > nav").length > 0 && window.innerWidth > 889 && resizeMobileGNBStatus == 1) {
				resizeMobileGNBStatus = 0;
				mobileGNBSetting("pc");
				if ($("body#sub > div#wrap > header").length > 0) {
					activeGNB();
				}
			} else if ($("body").hasClass("mobile") == false && $("header > div.wrap-header > nav").length > 0 && window.innerWidth <= 889 && resizeMobileGNBStatus == 0) {
				resizeMobileGNBStatus = 1;
				mobileGNBSetting("mobile");
			}
		} mobileGNB();
		// Body No Scroll 
		var resizeNoScrollBodyStatus = 0;
		function noScrollBody() {
			if ($("body").length > 0 && window.innerWidth > 889 && resizeNoScrollBodyStatus == 1) {
				resizeNoScrollBodyStatus = 0;
				if ($("header > div.wrap-header > nav").hasClass("is-active") == 0)
					$("body").removeClass("is-no-scroll");
			} else if ($("body").length > 0 && window.innerWidth <= 889 && resizeNoScrollBodyStatus == 0) {
				resizeNoScrollBodyStatus = 1;
			}
		} noScrollBody();
	}
	/* SUB PC Depth1 Active */
	if ($("body#sub > div#wrap > header").length > 0) {
		function activeGNB() {
			$("header > div.wrap-header > nav > ul.depth1 > li:nth-child(" + depth1 + ")").addClass("is-active");
		} activeGNB();
	}
	/* SUB MOBILE SUB */
	if ($("body#sub > div#wrap > header").length > 0) {
		// Depth2 
		$("header > nav.mobile-depth2 > ul.depth1 > li:nth-child(" + depth1 + ")").addClass("is-active").find("> ul.depth2 > li:nth-child(" + depth2 + ")").addClass("is-active");
		// Depth2 Drag & Scroll
		function mobileDepth2Center() {
			$("header > nav.mobile-depth2 ul.depth2").scrollLeft(0);
			var Obj = $("header > nav.mobile-depth2 ul.depth2 > li.is-active");
			var scrollX = (Obj.position().left) - ($(window).width() / 2) + (Obj.outerWidth(true) / 2) - ((Obj.outerWidth(true) - Obj.width()) / 2);
			$("header > nav.mobile-depth2 ul.depth2").scrollLeft(scrollX);
		} mobileDepth2Center();
		rowScroll($("header > nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2"));
		rowDrag($("header > nav.mobile-depth2 ul.depth2"));
		// Depth3
		if ($("header > nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2 > li.is-active > ul.depth3").length > 0) {
			var htmlDepth3 = $("header > nav.mobile-depth2 > ul.depth1 > li.is-active > ul.depth2 > li.is-active > ul.depth3").html();
			$("header > nav.mobile-depth2 > nav.mobile-depth3").addClass("is-show").find("> ul").html(htmlDepth3).find("> li:nth-child(" + depth3 + ")").addClass("is-active");
			if (htmlDepth3.length > 0) {
				$("div.wrap-container").addClass("is-depth3");
				$("div.wrapper-layer-nation").addClass("is-depth3");
			}
			// Resize Close
			var resiezeMobileDepth3PCcloseStatus = 0;
			function mobileDepth3PCclose() {
				var Obj = $("header > nav.mobile-depth2 > nav.mobile-depth3");
				if (Obj.length > 0 && window.innerWidth > 889 && resiezeMobileDepth3PCcloseStatus == 1) {
					resiezeMobileDepth3PCcloseStatus = 0;
					Obj.removeClass("is-active");
				} else if (Obj.length > 0 && window.innerWidth <= 889 && resiezeMobileDepth3PCcloseStatus == 0) {
					resiezeMobileDepth3PCcloseStatus = 1;
					Obj.removeClass("is-active");
				}
			} mobileDepth3PCclose();
			// Drag & Scroll
			function mobileDepth3Center() {
				$("header > nav.mobile-depth2 > nav.mobile-depth3 > ul").scrollLeft(0);
				if ($("header > nav.mobile-depth2 > nav.mobile-depth3").hasClass("is-active") == 0 && $("header > nav.mobile-depth2 > nav.mobile-depth3.is-show > ul > li").hasClass("is-active")) {
					var Obj = $("header > nav.mobile-depth2 > nav.mobile-depth3.is-show > ul > li.is-active");
					var scrollX = (Obj.offset().left) - ($(window).width() / 2) + (Obj.outerWidth(true) / 2) - ((Obj.outerWidth(true) - Obj.width()) / 2);
					$("header > nav.mobile-depth2 > nav.mobile-depth3 > ul").scrollLeft(scrollX);
				}
			} mobileDepth3Center();
			rowScroll($("header > nav.mobile-depth2 > nav.mobile-depth3 > ul"));
			rowDrag($("header > nav.mobile-depth2 > nav.mobile-depth3 > ul"));
			// Button Toggle
			$("header > nav.mobile-depth2 > nav.mobile-depth3 > a.button-toggle").click(function () {
				if ($(this).parent().hasClass("is-active") <= 0) {
					$("body").addClass("is-no-scroll");
					$("header").addClass("is-active").find("> nav.mobile-depth2 > nav.mobile-depth3 > ul").off();
					$(this).parent().addClass("is-active");
					// Drag & Scroll
					colDrag($("header > nav.mobile-depth2 > nav.mobile-depth3.is-active"));
				} else if ($(this).parent().hasClass("is-active")) {
					$("body").removeClass("is-no-scroll");
					$("header").removeClass("is-active");
					$(this).parent().removeClass("is-active");
					// Drag & Scroll
					mobileDepth3Center();
					rowScroll($("header > nav.mobile-depth2 > nav.mobile-depth3 > ul"));
					rowDrag($("header > nav.mobile-depth2 > nav.mobile-depth3 > ul"));
				}
			});
			//Mobile 3depth Nav Delete
			if ($("article.trial").hasClass("cau-chuyen-ve-erp")) {
				$("div.wrap-container").removeClass("is-depth3");
				$("div.wrap-container").addClass("is-delete-depth3");
				$("div.wrapper-layer-nation").removeClass("is-depth3");
				$("div.wrapper-layer-nation").addClass("is-delete-depth3");
				$("header nav.mobile-depth3").removeClass("is-show");
			}
		} else {
			$("header > nav.mobile-depth2 > nav.mobile-depth3").remove();
		}
	}

	/*******/
	/* LNB */
	/*******/
	if ($("body > div#wrap > div.wrap-container > div.wrap-lnb ").length > 0) {
		// Selected Menu
		$("div.wrap-lnb ul.depth1 > li:nth-child(" + depth1 + ")").addClass("is-active").find("> ul.depth2 > li:nth-child(" + depth2 + ")").addClass("is-active");
		if (depth3 > -1) {
			$("div.wrap-lnb ul.depth1 > li:nth-child(" + depth1 + ") > ul.depth2 > li:nth-child(" + depth2 + ") > ul.depth3 > li:nth-child(" + depth3 + ")").addClass("is-active");
		}
		// Depth3 Arrow 
		if ($("div.wrap-container div.wrap-lnb").length > 0) {
			$("div.wrap-lnb ul.depth2 > li > ul.depth3").parent().addClass("is-depth3");
		}
	}

	/**********/
	/* FOOTER */
	/**********/
	if ($("body > div#wrap > footer").length > 0) {
		// Global Select Button
		$("footer a.button-present-state").click(function () { globalList(); })
		$("footer div.wrap-list-state a.button-close").click(function () { globalList(); })
		function globalList() {
			if ($("footer a.button-present-state").hasClass("is-active") == false) {
				$("footer a.button-present-state").addClass("is-active").next().addClass("is-active");
			} else {
				$("footer a.button-present-state").removeClass("is-active").next().removeClass("is-active");
			}
		}
		// Drag & Scroll
		function mobileCertificationCenter() {
			$("footer > section.info > div.wrap-info > ul.certification").stop().animate({ scrollLeft: 0 }, 200)
		} mobileCertificationCenter();
		rowDrag($("footer > section.info > div.wrap-info > ul.certification"));
		rowScroll($("footer > section.info > div.wrap-info > ul.certification"));
		//Zalo
		$(".button-zalo").click(function () {
			var jsonData = "VN";
			SendTrackingData("T_Zalo", function () {
			}, jsonData);
		});
	}

	/******************/
	/* MENU PARAMETER */
	/******************/
	function setParameter() {
		$("header div.wrap-header nav a").each(function () {
			var resetHref = $(this).attr("href");
			resetHref = resetHref.replace("?p=T2", "").replace("?p=T3", "");
			$(this).attr("href", resetHref);
		});

		if (($("body.mobile > div#wrap > header").length > 0)) {
			$("header div.wrap-header nav a").each(function () {
				if ($(this).attr("href").charAt(0) === "#") return;
				if ($(this).attr("href").indexOf("?p=T3") < 0)
					$(this).attr("href", (($(this).attr("href")) + "?p=T3"));
			});
		} else if (($("body > div#wrap > header").length > 0)) {
			if (window.innerWidth > 889) {
				$("header div.wrap-header nav a").each(function () {
					if ($(this).attr("href").charAt(0) === "#") return;
					if ($(this).attr("href").indexOf("?p=T2") < 0)
						$(this).attr("href", (($(this).attr("href")) + "?p=T2"));
				});
			}
			if (window.innerWidth <= 889) {
				$("header div.wrap-header nav a").each(function () {
					if ($(this).attr("href").charAt(0) === "#") return;
					if ($(this).attr("href").indexOf("?p=T3") < 0)
						$(this).attr("href", (($(this).attr("href")) + "?p=T3"));
				});
			}
		}

		if ($("body footer").length > 0) {
			$("footer nav a").each(function () {
				if ($(this).attr("href").indexOf("?p=B2") < 0)
					$(this).attr("href", (($(this).attr("href")) + "?p=B2"));

			});
		}

		if ($("body#main").length > 0 && window.innerWidth > 889) {
			$("section.visual nav a").each(function () {
				if ($(this).attr("href").charAt(0) === "#") return;
				if ($(this).attr("href").indexOf("?p=Main") < 0)
					$(this).attr("href", (($(this).attr("href")) + "?p=Main"));

			});
		}
	} setParameter();

	/********/
	/* MAIN */
	/********/
	/* PC */
	if ($("body#main > div#wrap > article.main > section.visual").length > 0) {
		var functionMenuList = "<ul class='depth2'>" + $("section.visual > div.wrap-nav > nav > ul.depth1 > li:nth-child(1) > ul.depth2").html() + "</ul>"
		$("body#main > div#wrap > article.main > section.visual > div.wrap-nav > nav").empty().html(functionMenuList);
		$("body#main > div#wrap > article.main > section.visual > div.wrap-nav > nav > ul.depth2 > li").each(function () {
			var depth3Title = "<h4>" + $(this).find("> a").html(); + "</h3>"
			$(this).find("> ul.depth3").wrap("<div class='wrap-depth3'></div>");
			$(this).find("> div.wrap-depth3").prepend(depth3Title);
		})
	}
	/* Mobile */
	if ($("body#main.mobile > div#wrap > article.main > section.characteristics").length > 0) {
		$('body.mobile .wrapper-key-characteristic ul').slick({
			arrows: true,
			autoplay: true,
			autoplaySpeed: 2000,
			dots: true,
			touchMove: true,
			pauseOnHover: true,
			pauseOnFocus: true,
			infinite: true,
			slidesToScroll: 1
		});
	}
	/* Visual Animation */
	if ($("body#main").length > 0) {
		const swiper = new Swiper('div.visual-swiper', {
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			effect: "fade",
			loop: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			on: {
				init: function () {
					mainVisualTypingTitle();
				},
				slideChange: function () {
					mainVisualTypingTitle();
				}
			}
		});
		function mainVisualTypingTitle() {
			$(".swiper-slide h1").each(function () {
				if ($(this).closest(".swiper-slide").hasClass("swiper-slide-visible") && $(this).hasClass("is-typing") == false) {
					$(this).addClass("is-typing");
					// Keep the hero height stable so the CTA row does not jump while the slide changes.
					$(this).css("opacity", 1);
				}
			});
		}
	}

	/*******/
	/* SUB */
	/*******/
	/* COMMON */
	if ($(".toggle-list-faq").length > 0) {
		if ($(".section").hasClass("is-no-slide")) {
			$(".toggle-list-faq.is-no-slide ul.line-list > li > .copy").addClass("is-hide");
			$(".toggle-list-faq.is-no-slide ul.line-list > li.active > .copy").removeClass("is-hide");
			$(".toggle-list-faq.is-no-slide ul.line-list > li > .title-copy").click(function () {
				if ($(this).parent().hasClass("active")) {
					$(this).parent().removeClass("active");
					$(this).next().addClass("is-hide");
				} else {
					$(".toggle-list-faq ul.line-list > li").removeClass("active");
					$(".toggle-list-faq ul.line-list > li > .copy").addClass("is-hide");
					$(this).parent().addClass("active");
					$(this).next().removeClass("is-hide");
				}
				sectionHRTopQuick();
			});
		} else {
			$(".toggle-list-faq ul.line-list > li > .title-copy").click(function () {
				if ($(this).parent().hasClass("active")) {
					$(this).parent().removeClass("active");
					$(this).parent().find(".copy").slideUp(0);
				} else {
					$(".toggle-list-faq ul.line-list > li").removeClass("active");
					$(".toggle-list-faq ul.line-list > li > .copy").slideUp(0);
					$(this).parent().addClass("active");
					$(this).parent().find(".copy").slideDown(0);
				}
				sectionHRTopQuick();
			});
		}
	}
	// Slick Function
	function slickSlideFeature(Obj) {
		Obj.slick({
			arrows: false,
			autoplay: true,
			speed: 200,
			autoplaySpeed: 3000,
			dots: true,
			touchMove: true,
			pauseOnHover: false,
			pauseOnFocus: false,
			infinite: true,
			slidesToScroll: 1
		})
		slickSlideScrollStart(Obj);
	}
	function slickSlideFeature_Speed(Obj, Spd) {
		Obj.slick({
			arrows: false,
			autoplay: true,
			speed: 200,
			autoplaySpeed: Spd,
			dots: true,
			touchMove: true,
			pauseOnHover: false,
			pauseOnFocus: false,
			infinite: true,
			slidesToScroll: 1
		})
		slickSlideScrollStart(Obj);
	}
	function slickSlideScrollStart(Obj) {
		Obj.slick("slickPause");
		$(window).scroll(function () {
			if (Obj.closest("section").hasClass("is-fadein") == true && Obj.closest("section").hasClass("is-slide-started") == false) {
				Obj.slick("slickPlay");
				Obj.closest("section").addClass("is-slide-started");
			}
		});
	}
	/* FUNTION PAGES */
	if ($("body#sub > div#wrap > div.wrap-container > article").hasClass("product")) {
		// Slick Feature
		if ($("article.product").hasClass("congty_quan-ly-lich-trinh-va-hoat-dong-noi-bo")) {
			slickSlideFeature($("section.search.is-slide > figure > ul.slide"));
			function accountingBooksSlideDot() {
				var dotUl = $("section.search.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Lịch trình theo từng khoảng thời gian</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>Lịch trình hàng ngày</a>");
				dotUl.find("li:nth-child(3)").html("<a href='javascript:(0);'>Lịch trình hàng tuần</a>");
				dotUl.find("li:nth-child(4)").html("<a href='javascript:(0);'>Lịch trình hàng tháng</a>");
			} accountingBooksSlideDot();
		}
		if ($("article.product").hasClass("sanxuat_quan-ly-gia-thanh-san-xuat")) {
			slickSlideFeature($("section.report.is-slide > figure > ul.slide"));
			function accountingBooksSlideDot() {
				var dotUl = $("section.report.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Tình hình lợi nhuận</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>Biểu phí</a>");
			} accountingBooksSlideDot();
		}
		if ($("article.product").hasClass("erp_tuy-chinh-he-thong-erp")) {
			slickSlideFeature($("section.environment.is-slide > figure > ul.slide"));
			function accountingBooksSlideDot() {
				var dotUl = $("section.environment.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Thiết lập menu</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>Trang cá nhân</a>");
			} accountingBooksSlideDot();
		}
		if ($("article.product").hasClass("banhang_quan-ly-giao-hang")) {
			slickSlideFeature($("section.automatic.is-slide > figure > ul.slide"));
			function accountingBooksSlideDot() {
				var dotUl = $("section.automatic.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Vận chuyển chưa hoàn thành</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>Phiếu giao hàng</a>");
			} accountingBooksSlideDot();
		}
		if ($("article.product").hasClass("erp_bang-thong-bao-linh-hoat")) {
			slickSlideFeature_Speed($("section.connection.is-slide > figure > ul.slide"), 5000);
			function accountingBooksSlideDot() {
				var dotUl = $("section.connection.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Kanban</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>List</a>");
				dotUl.find("li:nth-child(3)").html("<a href='javascript:(0);'>Form</a>");
				dotUl.find("li:nth-child(4)").html("<a href='javascript:(0);'>Editor</a>");
			} accountingBooksSlideDot();
		}
		if ($("article.product").hasClass("erp_email-dung-chung")) {
			slickSlideFeature_Speed($("section.classification.is-slide > figure > ul.slide"), 5000);
			function accountingBooksSlideDot() {
				var dotUl = $("section.classification.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>Quy tắc phân loại email</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>Thiết lập quyền hạn</a>");
				dotUl.find("li:nth-child(3)").html("<a href='javascript:(0);'>Chặn spam</a>");
			} accountingBooksSlideDot();
		}
	} else {
		/* SUB PAGES */
		if ($("article.trial").hasClass("phien-ban-demo")) {
			$(this).find(".title-copy.button-toggle").click(function () {
				if ($(this).parent().hasClass("active")) {
					$(this).parent().removeClass("active");
					$(this).next().slideUp(0);
					sectionHRTopQuick();
				} else {
					$(this).parent().addClass("active");
					$(this).next().slideDown(0);
					sectionHRTopQuick();
				}
			});
		}
		if ($("article.trial").hasClass("phien-ban-dung-thu")) {
			$(this).find(".title-copy.button-toggle").click(function () {
				if ($(this).parent().hasClass("active")) {
					$(this).parent().removeClass("active");
					$(this).next().slideUp(0);
					sectionHRTopQuick();
				} else {
					$(this).parent().addClass("active");
					$(this).next().slideDown(0);
					sectionHRTopQuick();
				}
			});
		}
		if ($("article.join").hasClass("nganh-nghe-ung-dung-maxsoft")) {
			$(".tab-button-industries > li").click(function () {
				$(".tab-button-industries > li").removeClass("is-active");
				$(this).addClass("is-active");
				var list_icon_number = $(this).index() + 1;
				$(".list-icon-industries").addClass("is-hide");
				switch (list_icon_number) {
					case 1:
						$(".list-icon-industries.production").removeClass("is-hide");
						break;
					case 2:
						$(".list-icon-industries.distribution").removeClass("is-hide");
						break;
					case 3:
						$(".list-icon-industries.service").removeClass("is-hide");
						break;
					case 4:
						$(".list-icon-industries.etc").removeClass("is-hide");
						break;
				}
			})
			//Youtube Modal Open
			$(".list-icon-industries li").click(function () {
				if ($(this).hasClass("item-youtubecode")) {
					var youtubecode = $(this).data("youtubecode");
					$(".overlay-youtubemovie").removeClass("is-hide");
					$(".overlay-youtubemovie .wrapper-youtubemovie .position-youtubemovie .middle-youtubemovie .player-youtubemovie iframe").attr("src", "/vn/product/youtubemovie.aspx?y_movie_code=" + youtubecode);
				}
			});
			//Youtube Modal Close
			$(".overlay-youtubemovie .wrapper-youtubemovie .position-youtubemovie .middle-youtubemovie .btn-close-youtubemovie .close-modal").click(function () {
				$(".overlay-youtubemovie").addClass("is-hide");
				$(".player-youtubemovie").children("iframe").attr("src", "");
				$(".player-youtubemovie").children("iframe").empty();
			});
			//Youtube Modal Overlay
			$(".overlay-youtubemovie").click(function (e) {
				if (!$(e.target).hasClass("middle-youtubemovie")) {
					$(".layer-popup-groupware-discount").addClass("is-hide");
					$(".overlay-youtubemovie").addClass("is-hide");
					$(".player-youtubemovie").children("iframe").attr("src", "");
					$(".player-youtubemovie").children("iframe").empty();
				}
			})
		}
		if ($("article.trial").hasClass("cau-chuyen-ve-erp")) {
			var menuText = "";
			$("ul.list-button > li").click(function () {
				$("ul.list-button > li").removeClass("is-active");
				$(this).addClass("is-active");
				menuText = $(this).text();
				$("ul.list-thumbnail > li").addClass("is-hide");
				if ($(this).text() == "All") {
					$("ul.list-thumbnail > li").removeClass("is-hide");
					sectionHRTop();
				} else {
					$(".list-thumbnail .category").each(function () {
						if ($(this).text() == menuText) {
							$(this).parents("li").removeClass("is-hide");
							sectionHRTop();
						}
					});
				}
			})
		}
		if ($("article.company").hasClass("gioi-thieu")) {
			slickSlideFeature_Speed($("section.system.is-slide > figure > ul.slide"), 5000);
			function accountingBooksSlideDot() {
				var dotUl = $("section.system.is-slide > figure > ul.slide > ul.slick-dots");
				dotUl.find("li").empty();
				dotUl.find("li:nth-child(1)").html("<a href='javascript:(0);'>8 chi nhánh</a>");
				dotUl.find("li:nth-child(2)").html("<a href='javascript:(0);'>70 quốc gia sử dụng</a>");
			} accountingBooksSlideDot();
		}
	}
})