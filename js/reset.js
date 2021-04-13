
const mailField = document.getElementById('mail');
const checkEmail = document.getElementById('check-email');


const forgotPass = () => {
    const email = mailField.value;

    if(!email){
        showToast("Please input email address");
            return;
    }

    firebase.auth().fetchSignInMethodsForEmail(email)
    .then((signInMethods) => {
        if (signInMethods.length && signInMethods.includes("password")) {
            firebase.auth().sendPasswordResetEmail(email).then(function() {
                console.log("email sent");
            }).catch(function(error) {
                console.log("not sent");
            });
        } else {
            showToast("User does not exist");
        }
    })
    .catch((error) => { 
        // Some error occurred.
        console.log("error occured");
    });
}

checkEmail.addEventListener('click', forgotPass);

