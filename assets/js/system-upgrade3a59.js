/****************************************************************************************************
1. Create Date : 2021.01.21
2. Creator     : 김동수
3. Description : 무료 업그레이드
4. Precaution  : WWW
5. History     :  2021.01.21 (김동수) : A21_00456 - 해외 홈페이지 > 업그레이드 게시판 추가
6. Old file    :
****************************************************************************************************/

// ----------------------------------------------------------------------------------
// 전역변수 선언 영역
// ----------------------------------------------------------------------------------
var PAGE_SIZE = 10;			// 게시판 1페이지에 보여지는 게시글 건수
var PAGE_CURRENT = 1;		// 현재 페이지
var MAXCNT = 0;				// 게시글 전체 건수
var SEQ_CURRENT = 0;		// 선택된 게시글 번호(상세 내역에서 번호 출력)

// ----------------------------------------------------------------------------------
// 초기 실행 함수 영역
// ----------------------------------------------------------------------------------
$(document).ready(function () {

    // HTML에 기본값이 있을 경우 설정값 변경
    if ($("#PAGE_CURRENT").val() != "" && $("#PAGE_CURRENT").val() > 0)
        PAGE_CURRENT = $("#PAGE_CURRENT").val();

    // 업그레이드 게시판 목록 API
    fnBoardList();
});

// ----------------------------------------------------------------------------------
// API 호출
// ----------------------------------------------------------------------------------

// 업그레이드 게시판 목록 API
function fnBoardList() {
    /*
	var formData = new FormData();
	formData.append("LANG_CD", "vi-VN");
	formData.append("PAGE_CURRENT", PAGE_CURRENT);
	formData.append("PAGE_SIZE", PAGE_SIZE);

	var param = {
		sessionURL: TargetServer + "/ECAPI/Service/CustomerCenter/GetUpdateInformationList",
		data: formData,
		method: "POST",
		form: true,
		callbackApi: function (result) {
			if (result.Status != "200") {
				return false;
			} else {
				if (result.Data != null && result.Data.length > 0) {
					fnDrawTable(result.Data);
				} else {
					return false;
				}
			}
		}
	};
	SESSION_ID = "";
	gmcSessionApi(param);
    */
    $.ajax({
        type: "GET",
        url: "/vn/service/system-upgrade-list.aspx?pageNo=" + PAGE_CURRENT, //api 호출.
        contentType: 'application/json',
        success: function (result) {
            if (result && result.length > 0) {
                fnDrawTable(result);
            } else {
                fnDrawTable(_defaultList);
            }
        },
        error: function () {
            fnDrawTable(_defaultList);
        }
    });
}

// ----------------------------------------------------------------------------------
// HTML 생성
// ----------------------------------------------------------------------------------

// 업그레이드 게시판 HTML
function fnDrawTable(data) {
    var strHtml = "";

    if (document.getElementById("SystemUpgradeList")) {

        // 페이징
        MAXCNT = data[0].MAXCNT;
        fnPaging();

        // 타이틀
        strHtml += "     <li class='list-head'>";
        strHtml += "       <div class='title'>Tiêu đề </div>";
        strHtml += "       <div class='date'>Ngày</div>";
        strHtml += "    </li>";

        // 목록
        for (var i = 0; i < data.length; i++) {

            // 게시판 목록
            strHtml += "<li>";
            if (data[i].VER == "o") {
                strHtml += "    <div class='title'><a href='/vn/popup/system-upgrade-view/" + data[i].SEQ + "' title='" + data[i].TITLE + "' data-seq='" + data[i].SEQ + "' data-ver='" + data[i].VER + "'>" + data[i].TITLE + "</a></div>";
            }
            else {
                strHtml += "    <div class='title'><a href='/vn/service/system-upgrade-view/" + data[i].SEQ + "' title='" + data[i].TITLE + "' data-seq='" + data[i].SEQ + "' data-ver='" + data[i].VER + "'>" + data[i].TITLE + "</a></div>";
            }
            strHtml += "    <div class='date'>" + data[i].UPGRADE_DATE + "</div>";
            strHtml += "</li>";
        }

        document.getElementById("SystemUpgradeList").innerHTML = strHtml;

        // 제목클릭 이벤트 등록
        fnViewEvent();
    }
}

// 업그레이드 게시판 상세내용 POPUP
function fnBoardDetailPopup(seq, ver) {
    var obj = $(".wrapper-upgrade-board");
    var top = window.screen.availHeight / 2 - 200;
    var left = window.screenLeft + obj.offset().left + obj.width() / 2 - 300;

    if (top < 1)
        top = 0;
    if (left < 1)
        left = 0;

    if (ver == "o") {
        var blankUrl = "/vn/popup/system-upgrade-view/" + seq;
        window.open(blankUrl, "popupView", "height=400, width=600, top=" + top + ", left=" + left);
    }
    else {
        var blankUrl = "/vn/service/system-upgrade-view/" + seq;
        window.open(blankUrl, "popupView", "height=400, width=600, top=" + top + ", left=" + left);
    }
}

// ----------------------------------------------------------------------------------
// 페이지 이동
// ----------------------------------------------------------------------------------

// 페이징 생성
function fnPaging() {
    var pageListCount = 5;	// 페이징 목록 갯수
    var pageListTotalCount = parseInt(MAXCNT / PAGE_SIZE);
    var posStart = parseInt((PAGE_CURRENT - 1) / pageListCount) * pageListCount;
    var strHtml = "";
    var pageTitles = ['Trang đầu tiên', 'Trước', 'Sau', 'Trang cuối', 'Nhập số trang', 'Di chuyển đến'];

    // page-first
    if (posStart > 0)
        strHtml += "<a class='button-page-first' title='" + pageTitles[0] + "' href='javascript:fnGoPage(1);'>&lt;&lt;</a> ";

    // page-prev
    if (posStart > 0)
        strHtml += "<a class='button-page-prev' title='" + pageTitles[1] + "' href='javascript:fnGoPage(" + posStart + ");'>&lt;</a> ";

    for (var i = 0; i < pageListCount; i++) {
        var posCurrent = i + posStart + 1;
        var activeCss = "";
        if (posCurrent == parseInt(PAGE_CURRENT))
            activeCss = "is-active";

        strHtml += "<a class='button-page-number " + activeCss + "' title='" + posCurrent + "' href='javascript:fnGoPage(" + posCurrent + ");'>" + posCurrent + "</a> ";

        // 중단
        if (posCurrent >= pageListTotalCount)
            break;
    }

    // page-next
    if (posCurrent < pageListTotalCount)
        strHtml += "<a class='button-page-next' title='" + pageTitles[2] + "' href='javascript:fnGoPage(" + (posCurrent + 1) + ");'>&gt;</a> ";

    // page-last
    if (posCurrent < pageListTotalCount)
        strHtml += "<a class='button-page-last' title='" + pageTitles[3] + "' href='javascript:fnGoPage(" + pageListTotalCount + ");'>&gt;&gt;</a> ";

    // page-count
    strHtml += "<div class='wrapper-page-count'>"
        + "<input id='board_direct_go' type='number' title='" + pageTitles[4] + "' value='' onkeypress='fnGoPageDirectEvent();'>"
        + "<span class='number-page-count'>" + pageListTotalCount + "</span>"
        + "<a class='button-page-go' href='javascript:fnGoPageDirect()' title='" + pageTitles[5] + "'>&gt;</a>"
        + "</div>";

    document.getElementById("page_navigation").innerHTML = strHtml;
}

// 페이지 이동
function fnGoPage(strPage) {
    PAGE_CURRENT = strPage;
    // 업그레이드 게시판 목록 API
    fnBoardList();
}

// 페이지 직접이동 keypress
function fnGoPageDirectEvent() {
    if (event.keyCode === 13) {
        fnGoPageDirect();
    }
}

// 페이지 직접이동
function fnGoPageDirect() {
    if ($("#board_direct_go").val() != "") {
        var strPage = parseInt($("#board_direct_go").val());
        fnGoPage(strPage);
    }
    else {
        $("#board_direct_go").focus();
    }
}


// ----------------------------------------------------------------------------------
// 기타 기능
// ----------------------------------------------------------------------------------

// 특수문자 치환(상세 페이지에 있는 태크 변환)
function ReplaceData(data) {
    var reVal = data;

    reVal = reVal.replaceAll("\n", "<br />");
    reVal = reVal.replaceAll("  ", "&nbsp;&nbsp;");
    reVal = reVal.replaceAll("&amp;", "&");
    reVal = reVal.replaceAll("&lt;", "<");
    reVal = reVal.replaceAll("&gt;", ">");
    reVal = reVal.replaceAll("&quot;", "'");

    return reVal;
}
function ReplaceDataReverse(data) {
    var reVal = data;

    reVal = reVal.replaceAll("<br />", "\n");
    reVal = reVal.replaceAll("&nbsp;&nbsp;", "  ");
    reVal = reVal.replaceAll("&", "&amp;");
    reVal = reVal.replaceAll("<", "&lt;");
    reVal = reVal.replaceAll(">", "&gt;");
    reVal = reVal.replaceAll("'", "&quot;");

    return reVal;
}

// 제목클릭 이벤트 등록
function fnViewEvent() {
    $(".list-upgrade .title a").click(function (e) {
        e.preventDefault();
        var strSeq = e.target.getAttribute("data-seq");
        var strVer = e.target.getAttribute("data-ver");
        fnBoardDetailPopup(strSeq, strVer);
    });
}