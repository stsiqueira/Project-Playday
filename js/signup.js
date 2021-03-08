const signUp = document.getElementById('signUp');
const mailField = document.getElementById('mail');
const username = document.getElementById('username');
const passwordField = document.getElementById('password');
const gsignup = document.getElementById('gsignup');

function ValidateEmail(mail) {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
    return (true)
  }
  alert("You have entered an invalid email address!")
  return (false)
}

var db = firebase.firestore();

const signUpWithEmailFunction = () => {
  const email = mailField.value;
  const password = passwordField.value;
  const name = username.value;

  if (ValidateEmail(email)) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
		var docData = {
			about: "",
			dateOfBirth: "Beginner",
			name: name,
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
            window.location = "../index.html";
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }
}

signUp.addEventListener('click', signUpWithEmailFunction);

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

gsignup.addEventListener('click', fetch);

