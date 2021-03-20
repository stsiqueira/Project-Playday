$(document).ready(function () {
    $('body.home').removeClass('hide-right');
    $('body.home').addClass('slide-in');

    // let firstName = localStorage.getItem('username').substring(0, localStorage.getItem('username').indexOf(" "));
    // $("#user-name").html(firstName);

    // select-court.html?sport=volleyball
    // user-level.html?sport=volleyball
    let appUserobject = get_appUser();
    $("#user-name").html(appUserobject.firstName);

    
        // $("#badminton").attr("href", !appUserobject.sports.badminton.userLevel == "" ? "select-court.html?sport=badminton" : "user-level.html?sport=badminton");
        // $("#tennis").attr("href", !appUserobject.sports.tennis.userLevel == "" ? "select-court.html?sport=tennis" : "user-level.html?sport=tennis");
        // $("#volleyball").attr("href", !appUserobject.sports.volleyball.userLevel == "" ? "select-court.html?sport=volleyball" : "user-level.html?sport=volleyball");

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