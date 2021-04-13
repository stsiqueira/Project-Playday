$(document).ready(function () {

    const mailField = document.getElementById('mail');
    const passwordField = document.getElementById('password');
    const signInWithMail = document.getElementById('signInWithMail');
    const forgotPassword = document.getElementById('forgot-pass');
    const gsignup = document.getElementById('gsignup');
    const facebookSignin = document.getElementById("fsignup");
    const twitterSignin = document.getElementById("tsignup");
    // var db = firebase.firestore();
    mailField.focus(); mailField.select();

    checkUserEmail = urlParam("useremail");

    if (checkUserEmail) {
        mailField.value = checkUserEmail;
        passwordField.focus(); passwordField.select();
    }

    let appUserobject = get_appUser();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const queryString = window.location.search;
            var searchParams = new URLSearchParams(queryString);
            const result = searchParams.get("signup") ?? null;
            if (!result && appUserobject) {
                window.location.href = "home.html";
            }
        }
    });

    //Sign in function with email
    const signInWithEmailFunction = (e) => {
        e.preventDefault();
        const email = mailField.value;
        const password = passwordField.value;
        if (!email || !password) {
            showToast("Please enter email and password");
            return false;
        }
        if (email == password) {
            showToast("Email and password cannot be same");
            return false;
        }
        // if (!checkPassword(password)) return false;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;

                if (user) {
                    var db = firebase.firestore();
                    db.collection("user").where("userID", "==", user.uid)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                if (appUserLocal == null || appUserLocal == "undefined") {

                                    let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports, doc.data().chatId, doc.data().currentPage, doc.data().userLocationCity);
                                    appUserLocal = au;
                                    sessionStorage.setItem("appUser", JSON.stringify(au));
                                }
                            });
                        }).then(() => {
                            if (appUserLocal.userLocation.latitude == "0" && appUserLocal.userLocation.longitude == "0") {
                                window.location.assign('location-selection.html?isSkip=1')
                            }
                            else window.location.assign('home.html');
                        })
                        .catch((error) => {
                            console.log("Authentication service error: ", error);
                        });

                }
                else {
                    window.location = "../index.html";
                }
            })
            .catch(error => {
                if (error.code == "auth/wrong-password") {
                    showToast("Please enter correct password");
                }
                else if (error.code == "auth/user-not-found") {
                    showToast("User not found");
                }
                else if (error.code == "auth/too-many-requests") {
                    showToast("Too many failed attempts, please try after some time");
                }
                else {
                    console.log(error)
                    showToast(error.message);
                }
            })
    }

    signInWithMail.addEventListener('click', signInWithEmailFunction);


    var provider = new firebase.auth.GoogleAuthProvider();
    var fbProvider = new firebase.auth.FacebookAuthProvider();
    var tprovider = new firebase.auth.TwitterAuthProvider();

    gsignup.addEventListener('click', function () {
        googleSignOn(0, 2);
    });

    facebookSignin.addEventListener('click', function () {
        fbSignOn(0, 2);
    });

    twitterSignin.addEventListener('click', function () {
        tSignon(0, 2);
    });
    // signUp.addEventListener('click', () => {
    // 	window.location.assign('sign-up.html');
    // });

    document.getElementById("login-page")
        .addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                signInWithEmailFunction();
            }
        });

});
