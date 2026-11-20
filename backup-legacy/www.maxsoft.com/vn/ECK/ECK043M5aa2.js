/**************************************************************************************************** 
1. Create Date : 2018.02.22
2. Creator     : Kim Seon-Woong
3. Description : 영업페이지 온라인 가입에러 입력 템플릿
4. Precaution  : 
5. History     :	
6. Old file    : 
* ***************************************************************************************************/
var isvalid = true;
var validateItem = [];

var $focusControls = $("[data-focus]").filter(function () {
    return $(this).css('display') != 'none';
});

$(document).ready(function () {
    fnSetValidator();   //저장로직세팅
   
    $focusControls.each(function (i, item) {
        $(item).attr("tabIndex", i);
    });

    eventBind();

    $("input:visible").get(0).focus();    
});

function eventBind() {
    $("#save").on("click", function (e) {
        $(".wrapper-overlay").addClass('show');
        $(".wrapper-page-progress").removeClass('hidden');

        setTimeout(function () {
            fnsave();
        }, 100);
    });

    $focusControls.on("keydown", function (e) {
        if (e.keyCode == 13 || e.keyCode == 9) {
            onNextFocus(e.target);
            return false;
        }
    });

    $("[data-special]").on("keyup", fnSpecialValidationChk);

    $("[data-required]").on("blur", function (e) {
        fnRequiredInPanel($(this).attr("panelindex"));
    });
}

// 입력 시 특수문자 체크
function fnSpecialValidationChk(e) {
    var obj = $(e.target);
    var specialValidChk = isContainsLimitedSpecial(obj);

    fnPopoverRemove(obj);

    if (!specialValidChk.result) {
        fnErrMsgSet($(obj), specialValidChk.message, false);
        $(obj).popover("show");
    } else {
        return false;
    }
}

//경고메세지처리
function fnErrMsgSet(obj, msg, flag) {
    $(".wrapper-overlay").removeClass('show');
    $(".wrapper-page-progress").addClass('hidden');

    isvalid = false;

    obj.closest("td").addClass("has-error");    //빨간테두리표시    
    obj.popover("destroy");
    obj.popover({                               //팝오버장착
        content: msg == "" ? "" : /^(LBL|MSG|BTN)/i.test(msg) ? maxsoft.resource[msg] : msg,
        container: "body",
        toggle: "popover",
        placement: "top",
        html: true,
        delay: flag ? { show: 600 } : { show: 0 },
        trigger: "focus"
    });

    obj.one("blur", function (e) {
        fnPopoverRemove(obj);
    });
}

function fnBasicPopOver(obj, msg, flag) {
    obj.popover("destroy");
    obj.popover({                               //팝오버장착
        content: msg,
        container: "body",
        toggle: "popover",
        placement: "top",
        html: true,
        delay: flag ? { show: 600 } : { show: 0 },
        trigger: "focus"
    });
}

//팝오버 해제
function fnPopoverRemove(obj) {
    obj.closest("td").removeClass("has-error");     //빨간테두리표시 해제
    obj.popover("destroy");                         //팝오버해제 

    if (obj.data("basicmsg") != "") {
        fnBasicPopOver(obj, obj.data("basicmsg"), false);
    }
}

//유효성 체크할 항목 셋팅
function fnSetValidator() {
    $("#ApplicantName").attr("data-required", "true")
        .attr("data-requiredmsg", maxsoft.resource.LBLECK043MNAME)
        .attr("data-special", "true");

    $("#ApplicantMobile").attr("data-required", "true")
        .attr("data-requiredmsg", maxsoft.resource.LBLECK043MPHONE);
}

//유효성체크
function fnValidate() {
    isvalid = true;
    validateItem = [];
    fnRequired();
    fnErrFocus();
}

//에러난 항목에 포커스 처리
function fnErrFocus() {
    var $target = null;
    $("td.has-error").find(".form-control").each(function (i, item) {
        if (i == 0) {
            $target = $(item);
        } else {
            if (Number($target.attr("tabIndex")) > Number($(item).attr("tabIndex"))) {
                $target = $(item);
            }
        }
    });

    if ($target != null)
        $target.focus();
}

//패널별 필수값 체크
function fnRequiredInPanel(panelindex) {
    var errCount = 0,
        $validateControls = $("[data-required]").filter(function (i, item) {
            return $(item).attr("panelindex") == panelindex;
        });

    $validateControls.each(function (i, item) {
        if ($(item).css("display") != "none" && $(item).val().trim() == "")
            errCount++;
    });

    if (errCount == 0)
        $("div.panel.panel-default[panelindex=" + panelindex + "]").find("div.panel-title").addClass("complete");
    else
        $("div.panel.panel-default[panelindex=" + panelindex + "]").find("div.panel-title").removeClass("complete");
}

//다음으로 포커스 넘기기
function onNextFocus(target) {
    var $focusControls = $("[data-focus]");
        $target = $(target),
        targetIndex = Number($target.attr("tabIndex")),
        $nextTarget = findNextFocusTarget(targetIndex);

    if ($target.attr("id") == "save") {
        fnsave();

        return false;
    }

    $nextTarget.focus();

    function findNextFocusTarget(index) {
        var targetIndex = index + 1;

        for (var $item, i = 0, len = $focusControls.length; i < len; i++) {
            $item = $focusControls.eq(i);

            if ($item.attr("tabIndex") === targetIndex.toString()) {
                if ($item.css("display") == "none" || $item.attr("readonly")) {
                    targetIndex++;
                    continue;
                }
                return $item;
            }
        }
    }
}

var saveComplete = true;

function fnsave() {    
    if (!saveComplete) {
        return false;
    }

    fnValidate();

    if (isvalid) {
        saveComplete = false;
        fnSaveApi();
    }
    else {
        $(".wrapper-overlay").removeClass('show');
        $(".wrapper-page-progress").addClass('hidden');

        saveComplete = true;
        return false;
    }
}

function fnSaveApi() {
    var param = {
        sessionURL: ""
    };

    saveJoinException(param, true);
}
