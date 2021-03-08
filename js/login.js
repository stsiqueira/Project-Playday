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
const mailField = document.getElementById('mail');
const passwordField = document.getElementById('password');
const signInWithMail = document.getElementById('signInWithMail');
const signUp = document.getElementById('signUp');
const googlesignin = document.getElementById("googlesignup")

var db = firebase.firestore();

//Sign in function
const signInWithEmailFunction = () => {
	const email = mailField.value;
	const password = passwordField.value;
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
            // Signed in 
			var user = userCredential.user;
	        window.location.assign('../html/loggedin.html');
			console.log(user);
			
		})
		.catch(error => {
			console.error(error);
		})
}

signInWithMail.addEventListener('click', signInWithEmailFunction);

signUp.addEventListener('click', () => {
	window.location.assign('../html/signup.html');
});

var provider = new firebase.auth.GoogleAuthProvider();

// ui.start('#firebaseui-auth-container', uiConfig);

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