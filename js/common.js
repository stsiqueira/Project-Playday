let appUserLocal;
// const tomtomApiKey = "lDNGOihuwicB9jy3du63gNr5gUGwCAZC";
let tomtomApiKey = "ctMg0rMDauN3jPf1SOHXHVJNpJnhmGaS";
// tomtomApiKey = "XOeleMUFVN4TaGSAJwKm8y7IBfy7YeQA";

const redirectBasedOnLogin = (googleLogin) => {
    if (!googleLogin) {
        window.location.assign('log-in.html');
    }
    else {
        window.location.assign('loggedin.html');
    }
}

// Updating the User Database while Signing Up
const updateDB = (user, flag = 0, googleLogin = 0) => {
    if (flag) {
        var displayName = username.value;
    }
    else {
        var displayName = user.displayName;
    }
    var displayName = user.displayName;
    var docData = {
        about: "",
        dateOfBirth: "01/31/1800",
        name: displayName,
        profilePic: null,
        sports: {
            badminton: {
                challengeCourts: [],
                savedCourts: [],
                userLevel: ""
            },
            tennis: {
                challengeCourts: [],
                savedCourts: [],
                userLevel: ""
            },
            volleyball: {
                challengeCourts: [],
                savedCourts: [],
                userLevel: ""
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
const checkIfUserExist = (user, flag = 0, googleLogin = 0) => {
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

const urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

const updateLevel = (sport = "Unknown", level, redirect = "") => {
    let db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let document = db.collection("user").doc(get_appUser().auid);

            var myUpdate = {};
            myUpdate[`sports.${sport}.userLevel`] = level;
            document.update(myUpdate);

            if(redirect != ""){set_appUser(redirect)}
            else set_appUser();
            //update local storage variable too LATER
        } else {
            // No user is signed in.
            window.location.assign('../index.html');
            localStorage.removeItem("appUser");
        }
    });
}

class AppUser {
    constructor(auid, firstName, lastName, dob, profilePhoto, about, userLocation, sports) {
        this.auid = auid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.profilePhoto = profilePhoto;
        this.about = about;
        this.userLocation = userLocation;
        this.sports = sports;
    }
}

const get_appUser = () => {
    if (appUserLocal == undefined || appUserLocal == "") {
        appUserLocal = JSON.parse(localStorage.getItem('appUser'));
    }
    return appUserLocal;
}

const set_appUser = (redirect="") => {
    
    let user = firebase.auth().currentUser;
        if (user) {
            let db = firebase.firestore();
            db.collection("user").where("userID", "==", user.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.data());

                        let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports);
                        appUserLocal = au;
                        localStorage.setItem("appUser", JSON.stringify(au));
                    });
                }).then(() => {
                    console.log('appUserLocal set!')
                    if(redirect !=""){
                        window.location.href =  redirect;
                    }
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
        }
        else {
            window.location = "../index.html";
        }
}
// const updateDB = (collection, user, key, value) => {
//     var dbRef = db.collection(collection).doc(user.uid);

//     // Set the "capital" field of the city 'DC'
//     return dbRef.update({
//         key: value
//     })
//     .then(() => {
//         console.log("Document successfully updated!");
//     })
//     .catch((error) => {
//         // The document probably doesn't exist.
//         console.error("Error updating document: ", error);
//     });
// }
