const signUp = document.getElementById('signUp');
const mailField = document.getElementById('mail');
const username = document.getElementById('username');
const passwordField = document.getElementById('password');
const gsignup = document.getElementById('gsignup');
const facebookSignin = document.getElementById("fsignup");

function ValidateEmail(mail) {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
    return (true)
  }
  alert("You have entered an invalid email address!")
  return (false)
}

var db = firebase.firestore();

const updateDB = (user, flag) => {
	console.log(`flag inside db ${updateDB}`)
	if(flag) {
    	var displayName = username.value;
	}
	else {
		var displayName = user.displayName;
	}
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
		console.log("data added")
	})
	.catch((error) => {
		console.error("Error adding document: ", error);
	});
}

const checkIfUserExist = (user, flag) => {
	console.log(user);
	db.collection("user").doc(user.uid)
	.get()
	.then((querySnapshot) => {
		if (querySnapshot.exists) {
			console.log("user exist");
			window.location.assign('../index.html');
		} 
		else {
			console.log("user created");
			console.log(flag);
			updateDB(user, flag);
		}
	})
	.catch((error) => {
		console.log("Error getting documents: ", error);
	});
}

const signUpWithEmailFunction = () => {
  const email = mailField.value;
  const password = passwordField.value;
  if (ValidateEmail(email)) {
	firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
		checkIfUserExist(user, 1);
		window.location.assign('../index.html');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
		if(errorCode == "auth/email-already-in-use") {
			alert(errorMessage);
		}
      });
  }
}

signUp.addEventListener('click', signUpWithEmailFunction);

const googleSignOn = () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var user = result.user;
		checkIfUserExist(user, 0);
		window.location.assign('loggedin.html');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

var provider = new firebase.auth.GoogleAuthProvider();
gsignup.addEventListener('click', googleSignOn);

// gsignup.addEventListener('click', fetch);

function fetch() {
  db.collection("user").where("name", "==", "aman")
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
  })
  .catch((error) => {
      console.log("Error getting documents: ", error);
  });
}

