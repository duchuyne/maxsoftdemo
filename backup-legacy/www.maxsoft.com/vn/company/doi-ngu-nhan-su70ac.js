/**************************************************************************************************** 
1. Create Date : 2021.05.14 
2. Creator     : 남진성
3. Description : 직원소개 버전관리
4. Precaution  : 
5. History     : 
6. Old file    :
* ***************************************************************************************************/

$(function () {

	$.get('../../company/people70ac.xml?ver=2026101401', function (data) {
		$(data).find('entry').each(function () {
			var $entry = $(this);
			var name = $entry.attr('name')
			var part = $entry.attr('part')
			var definition = $entry.find('definition').text();
			var className = $entry.attr('className');
			var staff = $('<div>').addClass('staff');

			var html = "<div class='definition'>"
			html += "<div class='desc'>" + definition + "</div>"
			html += "<div class='desc-arrow'></div>"
			html += "</div>"
			html += "<div class='staffimg " + className + "'><img src='/vn/common/images/company/employee/empty.png' alt='" + name + "' /></div>"
			html += "<div class='staffinfo'>"
			html += "<div class='staffname'>" + name + "</div>"
			html += "<div class='staffpart'>" + part + "</div>"
			html += "</div>"
			staff.append(html)

			$('.page-wrap-people').append(staff);

			$('.staffimg').hover(function () {
				$(this).prev().show();
				$(this).addClass("staff-hover");
			}, function () {
				$(this).prev().hide();
				$(this).removeClass("staff-hover");
			});
		});
	});
});