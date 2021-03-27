$(document).ready(function () {

    $('body.home').removeClass('hide-right');
    $('body.home').addClass('slide-in');
    
    let appUserobject = get_appUser();
    $("#user-name").html(appUserobject != null && appUserobject.firstName != "" ? appUserobject.firstName : "Guest");

    $('#badminton').click(function () {
            goToSportCourts("badminton");
        });
        $('#tennis').click(function () {
            goToSportCourts("tennis");
        });
        $('#volleyball').click(function () {
            goToSportCourts("volleyball");
        });
        

}); //Document Ready Closed