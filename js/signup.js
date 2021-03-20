const signUp = document.getElementById('signUp');
const mailField = document.getElementById('mail');
const username = document.getElementById('username');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirm-password');
const gsignup = document.getElementById('gsignup');
const facebookSignin = document.getElementById("fsignup");

function ValidateEmail(mail) {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
	  if(confirmPasswordField.value == passwordField.value) {
		return (true)
	  }
	  else {
			alert("password does not match");
			return false;
	  }
  }
  alert("You have entered an invalid email address!")
  return (false)
}

var db = firebase.firestore();

const signUpWithEmailFunction = () => {
  const email = mailField.value;
  const password = passwordField.value;
  if (ValidateEmail(email)) {
	firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
      checkIfUserExist(user, 1, 0);
      // window.location.assign('log-in.html');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
		if(errorCode == "auth/email-already-in-use") {
			alert(errorMessage);
		}
		else {
			alert(errorMessage);
		}
    });
  }
}

var provider = new firebase.auth.GoogleAuthProvider();

signUp.addEventListener('click', signUpWithEmailFunction);
gsignup.addEventListener('click',function(){
    googleSignOn(0, 2);
});


