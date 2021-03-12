$(document).ready(function () {

    const apikey = "lDNGOihuwicB9jy3du63gNr5gUGwCAZC";
    let userSelectedLocation = { lat: 49.2176865, lon: -123.09937450000001 } // to be fetched from user profile

    const urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }
    let sports = urlParam("sport"); // fetched from url
    let radius = $("#radius").val() * 1000 // fetched from dropdown
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
        $.getJSON(`https://api.tomtom.com/search/2/poiSearch/${sports}.JSON?key=${apikey}&typeahead=true&lat=${userSelectedLocation.lat}&lon=${userSelectedLocation.lon}&limit=20&radius=${radius}`, function (response) {
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
                        imgSrc = callPoiDetails(apikey, element.dataSources.poiDetails[0].id);
                        havePOIDetails = true;
                    }

                    // CODE TO CHECK NUMBER OF PLAYERS PLAYING
                    players = 999;

                    // if(havePOIDetails && imgSrc != defaultImgSrc)
                    // output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">${element.dataSources.poiDetails[0].id}</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`
                    // else output += `<li id="entry-${count}"><a><h3 class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="img-${count}" src="${imgSrc}" class="c-img"></div><div class="meta-data"><div class="poiIDHidden">NA</div><div class="address">${element.address.freeformAddress}</div><div class="players-playing-count">${players} active players</div></div></a></li>`

                    output += `<li class="apiResultRow" id="entry-${count}"><a><h3 id="entry-court-name-${count}" class="court-name">${element.poi.name}</h3><div class="img-wrapper"><img id="entry-img-${count}" src="${imgSrc}" class="c-img"></div><div id="metadata-${count}" class="meta-data"><div class="hidden"><div class="poiIDHidden">${(havePOIDetails && imgSrc != defaultImgSrc)? element.dataSources.poiDetails[0].id :"NA"}</div><div id="entry-phone-${count}" class="hiddenPhone">${ (element.poi.hasOwnProperty("phone"))? JSON.stringify(element.poi.phone): "Not Available"}</div><div class="hiddenPosition">${JSON.stringify(element.position)}</div></div><div id="entry-address-${count}" class="address">${element.address.freeformAddress}</div><div id="entry-players-${count}" class="players-playing-count">${players} active players</div></div></a></li>`
                    
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

    $(document.body).on('click', '.apiResultRow' ,function(){

        let selectedRow = $(this).attr('id').substr($(this).attr('id').indexOf("-")+1);
        console.log(selectedRow);

        $("#selected-name").html($(`#entry-court-name-${selectedRow}`).html());
        $("#selected-address").html($(`#entry-address-${selectedRow}`).html());

        // $("#selected-distance").html(); To be Calculated through another API

        $("#selected-phone").html($(`#entry-phone-${selectedRow}`).html());
    
    });

});