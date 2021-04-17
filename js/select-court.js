$(document).ready(function () {

    let appUserobject = get_appUser();
    isLoggedIn();

    let userSelectedLocation = { lat: appUserobject.userLocation.latitude, lon: appUserobject.userLocation.longitude }

    let sports = urlParam("sport"); // fetched from url
    let radius = $("#radius").val() != undefined && $("#radius").val() != null && $("#radius").val() != 0 ? $("#radius").val() * 1000 : 5000; // fetched from dropdown
    let defaultImgSrc = "https://images.unsplash.com/photo-1556719779-e1413cb43bb6?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

    let noImg = () => {
        switch (sports) {
            case "badminton":
                return "https://images.pexels.com/photos/2202685/pexels-photo-2202685.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            case "tennis":
                return "https://images.pexels.com/photos/1277397/pexels-photo-1277397.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            case "volleyball":
                return "https://images.pexels.com/photos/6203521/pexels-photo-6203521.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            default:
                return defaultImgSrc;
        };
    };

    let courtsRetrieved = [];

    //fetch the result from tomtom api and load in html container
    const loadResult = async () => {
        return $.getJSON(`https://api.tomtom.com/search/2/poiSearch/${sports}.JSON?key=${tomtomApiKey}&typeahead=true&lat=${userSelectedLocation.lat}&lon=${userSelectedLocation.lon}&limit=20&radius=${radius}`, function (response) {
            let output = $('#api-result ul').html();
            output = "";

            if (response.hasOwnProperty("results")) {
                $(".message-container").addClass("hidden");
                courtsRetrieved = response.results.filter(data => data.poi.categories.filter(c => c === 'sports center'));
                let count = 0;
                let players = 0;

                if (courtsRetrieved.length == 0) {
                    $(".message-container").removeClass("hidden");
                    return;
                }

                courtsRetrieved.forEach(element => {
                    count++;
                    let imgSrc = noImg();
                    let havePOIDetails = false;

                    if (element.hasOwnProperty("dataSources") && element.dataSources.hasOwnProperty("poiDetails")) {
                        // console.log(element.dataSources.poiDetails[0].id);
                        imgSrc = callPoiDetails(tomtomApiKey, element.dataSources.poiDetails[0].id);
                        havePOIDetails = true;
                    }

                    // CODE TO CHECK NUMBER OF PLAYERS PLAYING

                    output += `<li class="apiResultRow" id="entry-${count}" data-distance="${element.dist}" data-playersCount="0">

                                    <div class="img-wrapper">
                                        <img id="entry-img-${count}" src="${imgSrc}" class="c-img">
                                    </div>
                                    <h3 id="entry-court-name-${count}" class="court-name">${element.poi.name}</h3>
                                    <div id="entry-players-${count}" class="players-playing-count"></div>

                                    <div class="hidden" id="metadata-${count}" class="meta-data">
                                        <div id="entry-location-id-${count}">${element.id}</div>                                    
                                        <div class="poiID-Hidden">
                                            ${(havePOIDetails && imgSrc != defaultImgSrc) ? element.dataSources.poiDetails[0].id : "NA"}
                                        </div>
                                        <div id="entry-phone-${count}" class="hiddenPhone">
                                            ${(element.poi.hasOwnProperty("phone")) ? JSON.stringify(element.poi.phone) : "Not Available"}
                                        </div>
                                        <div class="hiddenPosition">
                                            ${JSON.stringify(element.position)}
                                        </div>
                                        <div class="entry-hidden-distance" id="entry-distance-${count}">
                                            ${element.dist}  
                                        </div>
                                        <div id="entry-address-${count}" class="address">
                                            ${element.address.freeformAddress}                                    
                                        </div>
                                    <div>
                                </li>`;
                    getCourtPlayers(sports, element.id, `entry-players-${count}`, true);

                });
            }
            $("#api-result ul").html(output);
        });
    }

    //get images of court from tom tom api
    function callPoiDetails(apikey, poiId) {

        let imgSrc = noImg();
        $.ajax({
            url: `https://api.tomtom.com/search/2/poiDetails.json?key=${apikey}&id=${poiId}`,
            dataType: 'json',
            async: false,
            // data: myData,
            success: function (response) {

                if (response.hasOwnProperty("result") && response.result.hasOwnProperty("photos")) {
                    let photoId = response.result.photos[0].id;

                    imgSrc = `https://api.tomtom.com/search/2/poiPhoto?key=${apikey}&id=${photoId}`
                }
            }
        });
        return imgSrc;
    }

    loadResult();
    $("#radius").on('change', function () {
        radiusChange();
        $("#sortby").val("none");
    });

    //change the rradius distance
    async function radiusChange(){
        radius = $("#radius").val() * 1000;
        await loadResult();
    }

    $("#sortby").on('change', function () {
        let sortBy = $("#sortby").val();
        if (sortBy != "none") {
            sort(sortBy);
        }
    });

    function sort(sortBy) {

        if (sortBy == "playerscount") {
            $(".sortResult").each(function () {
                $(this).html($(this).children('li').sort(function (a, b) {
                    return ($(b).data(sortBy)) > ($(a).data(sortBy)) ? 1 : -1;
                }));
            });
        }
        else {
            $(".sortResult").each(function () {
                $(this).html($(this).children('li').sort(function (a, b) {
                    return ($(b).data(sortBy)) < ($(a).data(sortBy)) ? 1 : -1;
                }));
            });
        }
    }

    $(document.body).on('click', '.apiResultRow', function () {

        let selectedRow = $(this).attr('id').substr($(this).attr('id').indexOf("-") + 1);

        $("#selected-court-id").html($(`#entry-location-id-${selectedRow}`).html());
        $("#selected-img").attr("src", $(`#entry-img-${selectedRow}`).attr('src'));
        $("#s-p-playing").html($(`#entry-players-${selectedRow}`).html());

        $("#selected-name").html($(`#entry-court-name-${selectedRow}`).html());
        let selectedAddress =  $(`#entry-address-${selectedRow}`).html().trim().slice(0,-7);
        $("#selected-address").html("<span>Address: </span>" + selectedAddress);

        $("#selected-distance").html("<span>Distance: </span>" + ($(`#entry-distance-${selectedRow}`).html() / 1000).toFixed(2) + " Km");



        if ($(`#entry-phone-${selectedRow}`).html() != "" && $(`#entry-phone-${selectedRow}`).html().trim() != "Not Available") {
            let phoneNumber = $(`#entry-phone-${selectedRow}`).html().trim().replace(/['"]+/g, '');
            $("#selected-phone").html(`<span>Contact: </span> <a href="${phoneNumber}">${phoneNumber}</a>` );
            $("#selected-phone").show();
        }
        else {
            $("#selected-phone").hide();
        }

        $(".select-court-container").fadeOut(1000);

        setTimeout(() => {
            $(".single-court-info-container").slideDown(1000);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            let sport = urlParam("sport");
            let uniqueCourtId = $("#selected-court-id").html().trim();
            getCourtPlayers(sport, uniqueCourtId);


            // let savedCourt = isActiveCourt(sport, "savedCourts", uniqueCourtId);
            // console.log(savedCourt);

            checkUserCourtStatus(sport, uniqueCourtId);

        }, 1000);
    });

    //apply styles to save court and resgister button
    async function checkUserCourtStatus(sport, uniqueCourtId) {

        let isSavedCourt = await isActiveCourt(sport, "savedCourts", uniqueCourtId);
        let isChallengeCourt = await isActiveCourt(sport, "challengeCourts", uniqueCourtId);

        if (isSavedCourt) {
            $(".user-options .save-container").addClass('court-active');
        }
        else {
            $(".user-options .save-container").removeClass('court-active');
        }

        if (isChallengeCourt) {
            $(".user-options .challenge-container").addClass('court-active');
            $(".players-list-container h3").html('Players you can challenge');
            $(".inactive-message").hide();
            $("#players-list").removeClass().addClass("active-players-list");
        }
        else {
            $(".user-options .challenge-container").removeClass('court-active');
            $(".players-list-container h3").html('Players registered at this Court');
            $(".inactive-message").show();
            $("#players-list").removeClass().addClass("inactive-players-list");
        }

    }

    $("#save-court").click(function () {

        let courtId = $("#selected-court-id").html().trim();
        let courtName = $("#selected-name").html().trim();

        if (courtId != null && courtId != undefined && courtId != ""
            && courtName != null && courtName != undefined && courtName != "") {

            let notSaved = ($(".user-options .save-container").hasClass('court-active')) ? false : true;
            if (notSaved)
                setCourts(sports, "savedCourts", courtId, courtName);
            else {
                let deleteCourt = `sports.${sports}.savedCourts.${courtId}`;
                updateDbDetails('user', appUserobject.auid, deleteCourt, firebase.firestore.FieldValue.delete());
            }

            checkUserCourtStatus(sports, courtId);
        }

    });
    $("#challenge-court").click(function () {

        let courtId = $("#selected-court-id").html().trim();
        let courtName = $("#selected-name").html().trim();

        if (courtId != null && courtId != undefined && courtId != ""
            && courtName != null && courtName != undefined && courtName != "") {

            let notSaved = ($(".user-options .challenge-container").hasClass('court-active')) ? false : true;
            if (notSaved)
                setCourts(sports, "challengeCourts", courtId, courtName);
            else {
                let deleteCourt = `sports.${sports}.challengeCourts.${courtId}`;
                updateDbDetails('user', appUserobject.auid, deleteCourt, firebase.firestore.FieldValue.delete());
            }

            checkUserCourtStatus(sports, courtId);
        }
    });
    $("#goBack").click(function () {

        if ($(".single-court-info-container").is(":visible")) {

            $(".single-court-info-container").slideUp(1000);

            setTimeout(() => {
                $(".select-court-container").fadeIn(1000);
                $(".save-container, .challenge-container").removeClass('court-active');
            }, 1000);
            $("#players-list").html("");
        }
        else {
            window.location.href = "home.html";
        }
    });

    //fetch all players registered to a single court
    const getCourtPlayers = (sport, uniqueCourtId, divId = "", countOnly = true) => {

        let query = `sports.${sport}.challengeCourts.${uniqueCourtId}`;
        let db = firebase.firestore();

        let courtPlayers = [];

        db.collection("user")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.get(query) != null) {
                        courtPlayers.push(doc);
                    }
                });
            }).then(() => {
                if (divId != "" && countOnly) {
                    $(`#${divId}`).html("<i class='far fa-user'></i>" + courtPlayers.length);
                    let rowCount = divId.substring(divId.lastIndexOf("-") + 1, divId.length);
                    $(`#entry-${rowCount}`).attr("data-playersCount", courtPlayers.length);
                }
                else {
                    $("#players-list").html("");
                    let playerName; let playerId; let playerPic; let playerLevel;
                    let playersList = "";
                    let playerCount = 0;
                    for (let i of courtPlayers) {
                        playerCount++;
                        playerName = i.data().name;
                        playerId = i.data().userID;
                        playerPic = i.data().profilePic;
                        let self = false;

                        if (playerId == appUserobject.auid) {
                            self = true;
                        }

                        switch (sport) {
                            case "badminton":
                                playerLevel = i.data().sports.badminton.userLevel;
                                break;
                            case "tennis":
                                playerLevel = i.data().sports.tennis.userLevel;
                                break;
                            case "volleyball":
                                playerLevel = i.data().sports.volleyball.userLevel;
                                break;
                        }
                        playersList += `<li id="courtPlayer-${playerCount}" class="court-player ${self ? "self" : "other"}">
                                            <div class="cp-img">
                                                <img src="${playerPic}" alt="court player profile pic"></img>
                                            </div>
                                            <div class="cp-name">${playerName}</div>
                                            <div class="cp-level">Player Level: ${playerLevel}</div>                                            
                                            <div id ="courtPlayerId-${playerCount}" style="display:none">${playerId}</div>
                                        </li>`
                    }
                    $("#players-list").html(playersList);
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    };

    const isActiveCourt = async (sport, courtType, uniqueCourtId) => {

        let isActive = false;
        let user = firebase.auth().currentUser;

        let query = `sports.${sport}.${courtType}.${uniqueCourtId}`;
        let db = firebase.firestore();

        return db.collection("user").where("userID", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.get(query) != null) { //check if the selected court exists in saved court array.
                        isActive = true;
                    }
                    else {
                        isActive = false;
                    }
                });
                return isActive;
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                return false;
            });


    }
    //this function is not used, but still kept here as reference for future project to use Promise.
    const isActiveCourtCheck = function (sport, courtType, uniqueCourtId) {
        let isActive = false;
        return new Promise(function (resolve, reject) {

            let user = firebase.auth().currentUser;

            let query = `sports.${sport}.${courtType}.${uniqueCourtId}`;
            let db = firebase.firestore();

            db.collection("user").where("userID", "==", user.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.get(query) != null) { //check if the selected court exists in saved court array.
                            isActive = true;
                        }
                        else {
                            isActive = false;
                        }
                    });
                }).then(() => {
                    resolve(isActive);
                })
                .catch((error) => {
                    reject(Error("Whatever!"));
                    console.log("Error getting documents: ", error);
                });
        });
    }

    //route to other user details while clicking on active users list
    $(document.body).on('click', '.court-player', function () {

        let selectedRow = $(this).attr('id').substr($(this).attr('id').indexOf("-") + 1);
        let cPlayerId = $(`#courtPlayerId-${selectedRow}`).html().trim();

        if (appUserobject.auid != cPlayerId) {
            window.location.href = `single-player-info.html?courtPlayerId=${cPlayerId}&sport=${sports}`;
        }
        else {
            console.log("Self chat isn't allowed!");
        }

    });

});