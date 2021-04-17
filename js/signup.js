const signUp = document.getElementById('signUp');
const mailField = document.getElementById('mail');
const username = document.getElementById('username');
const passwordField = document.getElementById('password');
const confirmPasswordField = document.getElementById('confirm-password');
const gsignup = document.getElementById('gsignup');
const facebookSignin = document.getElementById("fsignup");
const twitterSignin = document.getElementById("tsignup");


// var db = firebase.firestore();
let appUserobject = get_appUser();
firebase.auth().onAuthStateChanged(function(user) {
    if (user && appUserobject) {
        window.location.href = "home.html";
    }
});

// function for checking the validation and creates the user account with email
const signUpWithEmailFunction = (e) => {
	e.preventDefault();
	const email = mailField.value;
	const password = passwordField.value;
	if(!email || !password || !confirmPasswordField.value || !passwordField.value) {
        showToast("Please provide input to all fields")
        return false;
    }
	if (validateEmail(email)) {
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				var user = userCredential.user;
				checkIfUserExist(user, 1, 0);
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				if(errorCode == "auth/email-already-in-use") {
					showToast(errorMessage);
				}
				else {
					showToast(errorMessage);
				}
		});
	}
}

// signUp.addEventListener('click', signUpWithEmailFunction);

// Getting the click events for social logins
gsignup.addEventListener('click',function(){
    googleSignOn(0, 2);
});

facebookSignin.addEventListener('click',function(){
    fbSignOn(0, 2);
});

twitterSignin.addEventListener('click',function(){
    tSignon(0, 2);
});

