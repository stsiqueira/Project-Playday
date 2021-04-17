$(document).ready(function () {

  isLoggedIn();
  
  let appUserobject = get_appUser();

  let storedDBpositions = false;

  let showSkip = false;
  let isSkip = urlParam("isSkip");
  let routeTo = urlParam("routeTo");

 

   // let hiddenCoordinates = { lat: 49.26357, lon: -123.13857 }; //Vancouver Coordinates
   let hiddenCoordinates = { lat: 0, lon: 0 };

  if (isSkip == 1) {
    showSkip = true;
  }
  else if (appUserobject.userLocation.latitude != "0" && appUserobject.userLocation.longitude != "0") {
    storedDBpositions = true;
    hiddenCoordinates.lat = appUserobject.userLocation.latitude;
    hiddenCoordinates.lon = appUserobject.userLocation.longitude;
  }

  let reset = () => {
    $("#message").html();
    $('#manual,#auto,#continue,#skip').hide();
    $("#map,#autoSearchBox").html("");
    $("#continue").prop('disabled', true).removeClass("continue-active");

  }

  let showButtons = () => {
    $('#auto').hide();
    $('#manual').show();
    if (showSkip) { $('#skip').show(); }

    $('#continue').show();
  }


  reset();

 

  $('#manual').click(function () {
    reset();
    if (showSkip)
      $('#skip').show();

    $('#continue').show();
    searchBoxShow();
  });

  $('#auto').click(function () {
    reset();
    getCurrentLocation();
  });

  $('#skip').click(function () {
    document.location.href = "home.html";
  });

  $('#continue').click(function () {
    $('.body-wrapper').addClass("blur");
    $('.loader').removeClass("hidden");
    routeTo != null ? updateUserLocation(routeTo) : updateUserLocation();  
    
  });

  if (storedDBpositions) {
    showMap(hiddenCoordinates.lat, hiddenCoordinates.lon, "map", "Your Selected Location");
    $("#continue").prop('disabled', false).addClass("continue-active");
    showButtons();
  } else {
    getCurrentLocation();    
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, function () {
        manualSelect("Disabled");
      },
        { maximumAge: 60000, timeout: 8000, enableHighAccuracy: true });
    } else {
      manualSelect("Not Supported");
    }
    showButtons();
  }

 //show coordinates on map.
  function showPosition(position) {

    hiddenCoordinates.lat = position.coords.latitude;
    hiddenCoordinates.lon = position.coords.longitude;

    // latitude = 49.2176865;    // longitude = -123.09937450000001;

    showMap(hiddenCoordinates.lat, hiddenCoordinates.lon, "map", "Your Selected Location");
    $("#continue").prop('disabled', false).addClass("continue-active");
    $("#hidden").html(JSON.stringify(hiddenCoordinates));
  }

  function manualSelect(option) {
    if (showSkip) {
      $('#skip').show();
    }
    $('#continue').show();
    if (option == "Disabled") {
      $("#message").html("Auto selection feature to locate you is disabled. You can set location manually.");
      $("#message").show();
      $("#continue").prop('disabled', true).removeClass("continue-active");
      searchBoxShow();
    }
    else if (option == "Not Supported") {
      $("#message").html("Auto selection feature to locate you is not supported by your browser. You can set location manually.")
      $("#message").show();
      $("#continue").prop('disabled', true).removeClass("continue-active");
      searchBoxShow();
    }
    else if (option == "Voluntary") {
      searchBoxShow();
    }
  }

  const updateUserLocation = (routeTo = "") => {
    let db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let document = db.collection("user").doc(appUserobject.auid);

        let reversecodeUrl = `https://api.tomtom.com/search/2/reverseGeocode/${hiddenCoordinates.lat},${hiddenCoordinates.lon}.json?key=${tomtomApiKey}`;
        let addressString = "Location not Selectedddd";   
        $.ajax({
          url: reversecodeUrl,
          dataType: 'json',
          async: false,
          success: function(data) {
            addressString = data.addresses[0].address.municipality;   
          }
        });       

        document.set({
          userLocation: new firebase.firestore.GeoPoint(hiddenCoordinates.lat, hiddenCoordinates.lon),
          userLocationCity: addressString
        }, { merge: true }).then(() => {          

          if(routeTo != ""){   
            // set_appUser().then(()=>{goToSportCourts(routeTo);});
            set_appUser(`goToSportCourts-${routeTo}`);           
          }
          else
          set_appUser("../html/home.html");
          
        });
      } else {
        // No user is signed in.
        window.location.assign('../index.html');
        sessionStorage.removeItem("appUser");
      }
    });

  }

  function searchBoxShow() {
    // $("#map").html("");
    $('#auto').show();
    $('#manual').hide();

    var options = {
      searchOptions: {
        key: tomtomApiKey,
        language: "en-GB",
        limit: 5,
      },
      autocompleteOptions: {
        key: tomtomApiKey,
        language: "en-GB",
      },
    };


    function SearchMarkersManager(map, options) {
      this.map = map;
      this._options = options || {};
      this._poiList = undefined;
      this.markers = {};
    }

    SearchMarkersManager.prototype.draw = function (poiList) {
      this._poiList = poiList;
      this.clear();
      this._poiList.forEach(function (poi) {
        var markerId = poi.id;
        var poiOpts = {
          name: poi.poi ? poi.poi.name : undefined,
          address: poi.address ? poi.address.freeformAddress : "",
          distance: poi.dist,
          classification: poi.poi
            ? poi.poi.classifications[0].code
            : undefined,
          position: poi.position,
          entryPoints: poi.entryPoints,
        };
        var marker = new SearchMarker(poiOpts, this._options);
        marker.addTo(this.map);
        this.markers[markerId] = marker;
      }, this);

      if (poiList.length == 1) {
        hiddenCoordinates.lat = poiList[0].position.lat;
        hiddenCoordinates.lon = poiList[0].position.lng;
        $("#hidden").html(JSON.stringify(hiddenCoordinates));
        $("#message").hide();
        $("#continue").prop('disabled', false).addClass("continue-active");
      }
      else if (poiList.length > 1) {
        $("#message").html("More than one result. Please refine your search.")
        $("#message").show();
        $("#continue").prop('disabled', true).removeClass("continue-active");
      }
      else {
        $("#message").html("No results found!")
        $("#message").show();
        $("#continue").prop('disabled', true).removeClass("continue-active");
      }

    };

    SearchMarkersManager.prototype.clear = function () {
      for (var markerId in this.markers) {
        var marker = this.markers[markerId];
        marker.remove();
      }
      this.markers = {};
      this._lastClickedMarker = null;
    };

    function SearchMarker(poiData, options) {
      this.poiData = poiData;
      this.options = options || {};
      this.marker = new tt.Marker({
        element: this.createMarker(),
        anchor: "bottom",
      });
      var lon = this.poiData.position.lng || this.poiData.position.lon;
      this.marker.setLngLat([lon, this.poiData.position.lat]);
    }

    SearchMarker.prototype.addTo = function (map) {
      this.marker.addTo(map);
      this._map = map;
      return this;
    };

    SearchMarker.prototype.createMarker = function () {
      var elem = document.createElement("div");
      elem.className = "tt-icon-marker-black tt-search-marker";
      if (this.options.markerClassName) {
        elem.className += " " + this.options.markerClassName;
      }
      var innerElem = document.createElement("div");
      innerElem.setAttribute(
        "style",
        "background: white; width: 10px; height: 10px; border-radius: 50%; border: 3px solid black;"
      );

      elem.appendChild(innerElem);
      return elem;
    };

    SearchMarker.prototype.remove = function () {
      this.marker.remove();
      this._map = null;
    };

    function handleResultsFound(event) {
      var results = event.data.results.fuzzySearch.results;

      if (results.length === 0) {
        searchMarkersManager.clear();
      }
      searchMarkersManager.draw(results);
      fitToViewport(results);
    }

    function handleResultSelection(event) {
      var result = event.data.result;
      if (result.type === "category" || result.type === "brand") {
        return;
      }
      searchMarkersManager.draw([result]);
      fitToViewport(result);
    }

    function fitToViewport(markerData) {
      if (
        !markerData ||
        (markerData instanceof Array && !markerData.length)
      ) {
        return;
      }
      var bounds = new tt.LngLatBounds();
      if (markerData instanceof Array) {
        markerData.forEach(function (marker) {
          bounds.extend(getBounds(marker));
        });
      } else {
        bounds.extend(getBounds(markerData));
      }
      map.fitBounds(bounds, { padding: 100, linear: true });
    }

    function getBounds(data) {
      var btmRight;
      var topLeft;
      if (data.viewport) {
        btmRight = [
          data.viewport.btmRightPoint.lng,
          data.viewport.btmRightPoint.lat,
        ];
        topLeft = [
          data.viewport.topLeftPoint.lng,
          data.viewport.topLeftPoint.lat,
        ];
      }
      return [btmRight, topLeft];
    }

    function handleResultClearing() {
      searchMarkersManager.clear();
      $("#continue").prop('disabled', true).removeClass("continue-active");
    }

    if (hiddenCoordinates.lon == 0 && hiddenCoordinates.lat == 0) {
      hiddenCoordinates.lon = -123.13857;
      hiddenCoordinates.lat = 49.26357;
    }

    var map = tt.map({
      key: tomtomApiKey,
      container: "map",
      center: [hiddenCoordinates.lon, hiddenCoordinates.lat],
      zoom: 12,
    });

    var ttSearchBox = new tt.plugins.SearchBox(tt.services, options);
    var searchBoxHTML = ttSearchBox.getSearchBoxHTML();
    $("#autoSearchBox").append(searchBoxHTML); // To have seperate control for search


    var searchMarkersManager = new SearchMarkersManager(map);
    ttSearchBox.on("tomtom.searchbox.resultsfound", handleResultsFound);
    ttSearchBox.on("tomtom.searchbox.resultselected", handleResultSelection);
    ttSearchBox.on("tomtom.searchbox.resultfocused", handleResultSelection);
    ttSearchBox.on("tomtom.searchbox.resultscleared", handleResultClearing);
    // map.addControl(ttSearchBox, "top-right"); // To have inbuilt control of search on map;

    ttSearchBox.updateOptions({
      minNumberOfCharacters: 3,
      showSearchButton: false,
      labels: {
        placeholder: "e.g. Vancouver",
      },
    });
    ttSearchBox.query();
  }

}); //Document Ready Closed

