$(document).ready(function () {

    let appUserobject = get_appUser();

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

    const loadResult = () => {
        $.getJSON(`https://api.tomtom.com/search/2/poiSearch/${sports}.JSON?key=${tomtomApiKey}&typeahead=true&lat=${userSelectedLocation.lat}&lon=${userSelectedLocation.lon}&limit=20&radius=${radius}`, function (response) {
            let output = $('#api-result ul').html();
            output = "";

            if (response.hasOwnProperty("results")) {
                courtsRetrieved = response.results.filter(data => data.poi.categories.filter(c => c === 'sports center'));
                let count = 0;
                let players = 0;

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



                    // if(havePOIDetails && imgSrc != defaultImgSrc)
                    // output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">${element.dataSources.poiDetails[0].id}</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`
                    // else output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">NA</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`

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

    function callPoiDetails(apikey, poiId) {
        // $.getJSON(`https://api.tomtom.com/search/2/poiDetails.json?key=${apikey}&id=${poiId}`, {async:false},  function (response) {
        //     let imgSrc = "https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=500";

        //     if (response.hasOwnProperty("result") && response.result.hasOwnProperty("photos")) {
        //         let photoId = response.result.photos[0].id;

        //         imgSrc = `https://api.tomtom.com/search/2/poiPhoto?key=${apikey}&id=${photoId}`
        //     }

        //     return imgSrc
        // });

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
        radius = $("#radius").val() * 1000;
        loadResult();
    });

    $("#sortby").on('change', function () {
        let sortBy = $("#sortby").val();
        sort(sortBy);

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
        $("#selected-address").html("<span>Address: </span>" + $(`#entry-address-${selectedRow}`).html());

        $("#selected-distance").html("<span>Distance: </span>" + ($(`#entry-distance-${selectedRow}`).html() / 1000).toFixed(2) + " Km");



        if ($(`#entry-phone-${selectedRow}`).html() != "" && $(`#entry-phone-${selectedRow}`).html().trim() != "Not Available") {
            $("#selected-phone").html("<span>Contact: </span>" + $(`#entry-phone-${selectedRow}`).html().trim());
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

    async function checkUserCourtStatus(sport, uniqueCourtId) {

        let isSavedCourt = await isActiveCourt(sport, "savedCourts", uniqueCourtId);
        let isChallengeCourt = await isActiveCourt(sport, "challengeCourts", uniqueCourtId);

        if(isSavedCourt){
            $(".user-options .save-container").addClass('court-active');
        }

        if(isChallengeCourt){
            $(".user-options .challenge-container").addClass('court-active');   
            $(".players-list-container h3").html('Players you can challenge');
            $(".inactive-message").hide();
            $("#players-list").removeClass().addClass("active-players-list");
        }
        else{
            $(".players-list-container h3").html('Players registered at this Court');
            $(".inactive-message").show();
            $("#players-list").removeClass().addClass("inactive-players-list");
        }
        
    }

    $("#save-court").click(function () {

        let courtId = $("#selected-court-id").html().trim();
        let courtName = $("#selected-name").html().trim();

        if (courtId != null && courtId != undefined && courtId != ""
            && courtName != null && courtName != undefined && courtName != "") 
            {
                setCourts(sports, "savedCourts", courtId, courtName); 
            }

    });
    $("#challenge-court").click(function () {

        let courtId = $("#selected-court-id").html().trim();
        let courtName = $("#selected-name").html().trim();

        if (courtId != null && courtId != undefined && courtId != ""
            && courtName != null && courtName != undefined && courtName != "") {
            setCourts(sports, "challengeCourts", courtId, courtName);
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
    });

    // $("#show-players-list").click(function () {

    //     let sport = urlParam("sport");
    //     let uniqueCourtId = $("#selected-court-id").html().trim();
    //     getCourtPlayers(sport, uniqueCourtId);

    // });

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
                    $(`#${divId}`).html(courtPlayers.length);
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
                        playersList += `<li id="courtPlayer-${playerCount}" class="court-player">
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

    $(document.body).on('click', '.court-player', function () {

        let selectedRow = $(this).attr('id').substr($(this).attr('id').indexOf("-") + 1);
        let cPlayerId = $(`#courtPlayerId-${selectedRow}`).html().trim();

        if (appUserobject.auid != cPlayerId) {
            window.location.href = `single-player-info.html?courtPlayerId=${cPlayerId}&sport=${sports}`;
        }
        else {
            console.log("Why you wanna chat with yourself!");
        }

    });

});