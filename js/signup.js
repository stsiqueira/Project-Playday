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
        console.log(name);
        db.collection("user").doc(user.uid).set({
          CourtID: "",
          Ranking: "Beginner",
          name: name,
          userID: user.uid,
          profilepic: user.photoURL
        })
          .then((docRef) => {
            console.log("Document written with ID: ");
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

function test() {
  db.collection("user").where("name", "==", "Gle")
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

gsignup.addEventListener('click', test);

