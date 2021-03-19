$(document).ready(function () {

    // const apikey = "lDNGOihuwicB9jy3du63gNr5gUGwCAZC";
    let appUserobject = get_appUser();
    // let userSelectedLocation = { lat: 49.2176865, lon: -123.09937450000001 } // to be fetched from user profile
    let userSelectedLocation = { lat: appUserobject.userLocation.latitude, lon: appUserobject.userLocation.longitude } // to be fetched from user profile

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


                // cats = arr.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

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
                    players = 999;

                    // if(havePOIDetails && imgSrc != defaultImgSrc)
                    // output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">${element.dataSources.poiDetails[0].id}</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`
                    // else output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">NA</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`

                    output += `<li class="apiResultRow" id="entry-${count}">

                                    <div class="img-wrapper">
                                        <img id="entry-img-${count}" src="${imgSrc}" class="c-img">
                                    </div>
                                    <h3 id="entry-court-name-${count}" class="court-name">${element.poi.name}</h3>
                                    <div id="entry-players-${count}" class="players-playing-count">${players}</div>

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
                                </li>`

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

    $(document.body).on('click', '.apiResultRow', function () {

        let selectedRow = $(this).attr('id').substr($(this).attr('id').indexOf("-") + 1);

        $("#court-id").html($(`#entry-location-id-${selectedRow}`).html());
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

        $(".select-court-container").slideUp(1000);
        setTimeout(() => {
            $(".single-court-info-container").slideDown(1000);
        }, 1000);



    });

    $("#save-court").click(function () {

        let courtId = $("#court-id").html().trim();
        let courtName = $("#selected-name").html().trim();

        if (courtId != null && courtId != undefined && courtId != ""
            && courtName != null && courtName != undefined && courtName != "") { setCourts(sports, "savedCourts", courtId, courtName); }

    });
    $("#challenge-court").click(function () {

        let courtId = $("#court-id").html().trim();
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
                $(".select-court-container").slideDown(1000);
            }, 1000);
        }
    });


});