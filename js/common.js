const redirectBasedOnLogin = (googleLogin) => {
    if (!googleLogin) {
        window.location.assign('../index.html');
    }
    else if(googleLogin == 2) {
        window.location.assign('loggedin.html');
    }
    else {
        window.location.assign('html/loggedin.html');
    }
}

// Updating the User Database while Signing Up
const updateDB = (user, flag=0, googleLogin=0) => {
    if(flag) {
    	var displayName = username.value;
	}
	else {
		var displayName = user.displayName;
	}
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
        redirectBasedOnLogin(googleLogin);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// Check if the User Already exist in DB
const checkIfUserExist = (user,flag=0,googleLogin=0) => {
    db.collection("user").doc(user.uid)
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.exists) {
            redirectBasedOnLogin(googleLogin);
        } 
        else {
            updateDB(user, flag, googleLogin);
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}

// Invoking Sign Up function for Sign UP
const googleSignOn = (flag, googlelogin) => {
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var user = result.user;
		checkIfUserExist(user, flag, googlelogin);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        alert(errorMessage);
        // ...
    });
}