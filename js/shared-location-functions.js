const showMap = (latitude, longitude, htmlElementId, markerHead) =>{

    var myCoordinates = [longitude, latitude];

    tt.setProductInfo("PlayDay", "Display Location");
    var map = tt.map({
        key: tomtomApiKey,
        container: htmlElementId,
        center: myCoordinates,
        zoom: 12,
    });

    var marker = new tt.Marker().setLngLat(myCoordinates).addTo(map);

    var popupOffsets = {
        top: [0, 0],
        bottom: [0, -70],
        "bottom-right": [0, -70],
        "bottom-left": [0, -70],
        left: [25, -35],
        right: [-25, -35],
    };

    let addressString = "";      

    $.getJSON(`https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${tomtomApiKey}`, function (json) {
        addressString = json.addresses[0].address.freeformAddress;

        var popup = new tt.Popup({ offset: popupOffsets }).setHTML(
            `<b>${markerHead}</b><br/>${addressString}`
        );
        marker.setPopup(popup).togglePopup();
    });
}




  