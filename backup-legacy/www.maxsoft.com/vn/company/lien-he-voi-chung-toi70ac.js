/****************************************************************************************************
1. Create Date : 2018.01.17
2. Creator     : ChaInChul
3. Description : Contact Us
4. Precaution  : WWW
5. History     : 
6. Old file    :
****************************************************************************************************/
iFrame_UrlECK = "/" + getLocation() + "/ECK/ECK006P_04.aspx";
$(function () {
  $(".location-vn .location-box").show();
  $(".location-vn .map-country").addClass("map-country-on");
  $(".country-info").mouseover(mapOver).mouseout(mapOut);
  $(".map-point").mouseover(mapOver).mouseout(mapOut);

  if ($(window).width() <= 1024) {
    $(".country-info").unbind()
  }

    reloadframe("contactFrame");
  $(window).resize(function () {

    if ($(window).width() <= 1024) {
      $(".location-box").show();
      $(".country-info").unbind();
      $(".map-point").unbind();
    } else {
      $(".location-box").hide();
      $(".country-info").mouseover(mapOver).mouseout(mapOut);
      $(".map-point").mouseover(mapOver).mouseout(mapOut);
    }

  })

});

function mapOver() {
  $(".location-box").hide();
  $(".map-country").removeClass("map-country-on");
  $(this).children(".location-box").show();
  $(this).children(".map-country").addClass("map-country-on");
}

function mapOut() {
  $(this).children(".location-box").hide();
  $(this).children(".map-country").removeClass("map-country-on");
}