var firebaseConfig = {
    apiKey: "AIzaSyATN0KrGH8WPsgEiozxcev0W3Fgq3F41i4",
    authDomain: "test-1-5be12.firebaseapp.com",
    projectId: "test-1-5be12",
    storageBucket: "test-1-5be12.appspot.com",
    messagingSenderId: "419371280336",
    appId: "1:419371280336:web:e6a5055469d95d9d777bd5",
    measurementId: "G-DP5FXPH4WE"
};
    // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    signInSuccessUrl: 'loggedin.html',
    signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    {
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    scopes: [
        'https://www.googleapis.com/auth/contacts.readonly'
    ],
    customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
    }
    },
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
    window.location.assign('<your-privacy-policy-url>');
    }
};

ui.start('#firebaseui-auth-container', uiConfig);

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