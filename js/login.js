const mailField = document.getElementById('mail');
const passwordField = document.getElementById('password');
const signInWithMail = document.getElementById('signInWithMail');
// const signUp = document.getElementById('signUp');
const forgotPassword = document.getElementById('forgot-pass');
const googleSignin = document.getElementById("googleSignup");
const facebookSignin = document.getElementById("facebookSignup")

var db = firebase.firestore();

//Sign in function with email
const signInWithEmailFunction = () => {
	const email = mailField.value;
	const password = passwordField.value;
	firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        window.location.assign('loggedin.html');
    })
    .catch(error => {
        if(error.code == "auth/wrong-password") {
            alert(error.message);
        }
        else if(error.code == "auth/user-not-found") {
            alert("user not found");
        }
        else {
            alert(error.message);
        }
    })
}

signInWithMail.addEventListener('click', signInWithEmailFunction);

// signUp.addEventListener('click', () => {
// 	window.location.assign('sign-up.html');
// });


// var provider = new firebase.auth.GoogleAuthProvider();

// googleSignin.addEventListener('click',function(){
//     googleSignOn(0, 1);
// });
