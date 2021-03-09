const mailField = document.getElementById('mail');
const passwordField = document.getElementById('password');
const signInWithMail = document.getElementById('signInWithMail');
const signUp = document.getElementById('signUp');
const forgotPassword = document.getElementById('forgot-pass');
const googleSignin = document.getElementById("googleSignup")

var db = firebase.firestore();

//Sign in function
const signInWithEmailFunction = () => {
	const email = mailField.value;
	const password = passwordField.value;
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
            // Signed in 
			var user = userCredential.user;
	        window.location.assign('html/loggedin.html');
		})
		.catch(error => {
			console.error(error);
            console.log(error.code);
            if(error.code == "auth/wrong-password") {
                alert(error.message);
            }
            else if(error.code == "auth/user-not-found") {
                alert("user not found");
            }
		})
}

signInWithMail.addEventListener('click', signInWithEmailFunction);

signUp.addEventListener('click', () => {
	window.location.assign('html/signup.html');
});

var provider = new firebase.auth.GoogleAuthProvider();

const updateDB = (user) => {
    var displayName = user.displayName;
	var docData = {
		about: "",
		dateOfBirth: "Beginner",
		name: displayName,
		profilePic: null,
		sports: {
		  badminton: {
			challengeCourts: [],
			savedCourts: [],
			userLevel: "beginner"
		  },
		  tennis: {
			challengeCourts: [],
			savedCourts: [],
			userLevel: "beginner"
		  },
		  volleyball: {
			challengeCourts: [],
			savedCourts: [],
			userLevel: "beginner"
		  }
		},
		userID: user.uid,
		userLocation: new firebase.firestore.GeoPoint(0, 0)
	} 
    db.collection("user").doc(user.uid).set(docData).then((docRef) => {
        console.log("user created");
        window.location.assign('html/loggedin.html');
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const checkIfUserExist = (user) => {
    db.collection("user").doc(user.uid)
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.exists) {
            window.location.assign('html/loggedin.html');
        } 
        else {
            updateDB(user);
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

const googleSignOn = () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var user = result.user;
		checkIfUserExist(user);
    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

googleSignin.addEventListener('click', googleSignOn);

// ui.start('#firebaseui-auth-container', uiConfig);

// document.getElementById("find-me").addEventListener("click", function() {
//     const status = document.querySelector('#status');
//     const mapLink = document.querySelector('#map-link');

//     mapLink.href = '';
//     mapLink.textContent = '';

//     function success(position) {
//         const latitude  = position.coords.latitude;
//         const longitude = position.coords.longitude;

//         status.textContent = '';
//         mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
//         mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
//     }

//     function error() {
//         status.textContent = 'Unable to retrieve your location';
//         }

//         if(!navigator.geolocation) {
//         status.textContent = 'Geolocation is not supported by your browser';
//         } else {
//         status.textContent = 'Locating…';
//         navigator.geolocation.getCurrentPosition(success, error);
//     }
// });