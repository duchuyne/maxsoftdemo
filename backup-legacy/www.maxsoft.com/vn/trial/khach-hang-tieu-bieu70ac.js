/**************************************************************************************************** 
1. Create Date : 2020.05.19
2. Creator     : Nam jin sung
3. Description : 기업 성공사례
4. Precaution  : 
5. History     : 
6. Old file    :
* ***************************************************************************************************/

//$(function () {
//    $.get('/vn/company/success-stories.xml?ver=2019051601', function (data) {
//        $(data).find('code').each(function () {
//            var $entry = $(this);
//            var code = $entry.attr('id')
//            var logo = "/vn/common/images/story/" + $entry.find('logo').text() + ".png"
//            var company = $entry.find('company').text()
//            var business = $entry.find('business').text()
//            var employee = $entry.find('employee').text()
//            var sales = $entry.find('sales').text()
//            var legacy = $entry.find('legacy').text()
//            var href = "/vn/maxsoft/company/success-stories-view?code=" + code;

//            var li = $("<li data-code='" + code + "' data-company='" + company + "' data-business='" + business + "' data-employee='" + employee + "' data-sales='" + sales + "' data-legacy='" + legacy + "'><a href='" + href + "' title='" + company + "' class='wrapper-customer-overlay'><img src=" + logo + " alt='" + company + "' /><div><div>" + company + "</div></div></a>")
//            $('.trial-success-customer').append(li);
//        })
//    });
//});

//$(document).ready(function () {
//    $(".list-select-box > li").click(function () {
//        if ($(this).hasClass("active")) {
//            $(this).removeClass("active");
//        } else {
//            $(".list-select-box > li").removeClass("active");
//            $(this).addClass("active");
//        }
//    })
//    $("html").click(function (e) {
//        if (!$(e.target).hasClass("non-closing-area")) {
//            $(".list-select-box > li").removeClass("active");
//        }
//    });
//    $(".list-select-box-item > li").click(function () {
//        var select_text = $(this).text();
//        $(this).parent().prev().text(select_text);
//        sortItem();
//    })
//});

//function sortItem() {
//    var selected_business = $(".select-box-business > .selected-item").text();
//    var selected_employee = $(".select-box-employee > .selected-item").text();
//    var selected_sales = $(".select-box-sales > .selected-item").text();
//    var selected_legacy = $(".select-box-legacy > .selected-item").text();
//    var business = "";
//    var employee = "";
//    var sales = "";
//    var legacy = "";
//    var all_option = "";

//    if (selected_business == "업종" && selected_employee == "직원수" && selected_sales == "연매출" && selected_legacy == "이전 프로그램") {
//        $(".trial-success-customer > li").removeClass("hide");
//    } else {
//        if (selected_business == "업종") selected_business = "";
//        if (selected_employee == "직원수") selected_employee = "";
//        if (selected_sales == "연매출") selected_sales = "";
//        if (selected_legacy == "이전 프로그램") selected_legacy = "";
//        selected_all_option = selected_business + selected_employee + selected_sales + selected_legacy;

//        $(".trial-success-customer > li").each(function () {
//            $(this).addClass("hide");

//            business = $(this).data("business");
//            if (business.match(selected_business)) business = selected_business;
//            if (selected_business == "") business = "";
//            employee = $(this).data("employee");
//            if (selected_employee == "") employee = "";
//            sales = $(this).data("sales");
//            if (selected_sales == "") sales = "";
//            legacy = $(this).data("legacy");
//            if (selected_legacy == "") legacy = "";
//            all_option = business + employee + sales + legacy;

//            if (selected_all_option == all_option) {
//                $(this).removeClass("hide");
//            }

//        })
//    }
//}






$(function () {
	$.get('../../trial/success-stories1eff.xml?ver=2023051001', function (data) {
		$(data).find('code').each(function () {
			var $entry = $(this);
			var code = $entry.attr('id')
			var logo = "/vn/common/images/trial/story/" + $entry.find('logo').text() + ".png"
			var company = $entry.find('company').text()
			var homepage = $entry.find('homepage').text()
			//var li = $("<li data-code='" + code + "' data-company='" + company + "'><img alt=" + company + " src=" + logo + '?ver=2023112301' + " \/><div class='company-info'>" + company + "<\/div>")
			var li = $("<li data-code='" + code + "' data-company='" + company + "'><span class=img></span><div class='company-info'>" + company + "<\/div>")
			$('.trial-success-customer').append(li)
		})
	})
});