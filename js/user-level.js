$(document).ready(function () {
    
    let sport = urlParam("sport"); // fetched from url

    $('#level-beginner').click(function () {
        updateLevel(sport, "Beginner");
        window.location.assign(`../html/select-court.html?sport=${sport}`);
    });
    $('#level-intermediate').click(function () {
        updateLevel(sport, "Intermediate");
        window.location.assign(`../html/select-court.html?sport=${sport}`);
    });
    $('#level-advance').click(function () {
        updateLevel(sport, "Advance");
        window.location.assign(`../html/select-court.html?sport=${sport}`);
    });

});