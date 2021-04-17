
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
                showToast("email sent");
            }).catch(function(error) {
                showToast("not sent");
            });
        } else {
            showToast("User does not exist");
        }
    })
    .catch((error) => { 
        // Some error occurred.
        showToast("error occured");
    });
}

checkEmail.addEventListener('click', forgotPass);

