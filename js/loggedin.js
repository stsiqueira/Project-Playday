firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        var div = document.getElementById('firebaseui-auth-container');
        div.innerHTML = `<h1> Congrats you logged in with ${user.email}</h1>`;
    }
    else {
        window.location = "../index.html";
    }
});

function signout(){
    firebase.auth().signOut();
    window.location='../index.html';
}

document.getElementById("find-me").addEventListener("click", function() {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    mapLink.href = '';
    mapLink.textContent = '';

    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;

        status.textContent = '';
        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
        }

        if(!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
        } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
});

