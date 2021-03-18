$(document).ready(function () {
    
    let sport = urlParam("sport"); // fetched from url

    $('#level-beginner').click(function () {
        updateLevel(sport, "Beginner", `../html/select-court.html?sport=${sport}`);
    });
    $('#level-intermediate').click(function () {
        updateLevel(sport, "Intermediate", `../html/select-court.html?sport=${sport}`);
    });
    $('#level-advance').click(function () {
        updateLevel(sport, "Advance", `../html/select-court.html?sport=${sport}`);
    });

});