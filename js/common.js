var firebaseConfig = {
    apiKey: "AIzaSyCVfkLdpaLZUwFN8eMVMSptFoZfOpp1pZ8",
    authDomain: "playday-f43e6.firebaseapp.com",
    databaseURL: "https://playday-f43e6-default-rtdb.firebaseio.com",
    storageBucket: "https://console.firebase.google.com/project/playday-f43e6/storage/playday-f43e6.appspot.com/files",
    projectId: "playday-f43e6",
    storageBucket: "playday-f43e6.appspot.com",
    messagingSenderId: "732773100147",
    appId: "1:732773100147:web:13f7a6804851ac8486d806",
    measurementId: "G-TZB3NY5S6W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let appUserLocal;

// const tomtomApiKey = "lDNGOihuwicB9jy3du63gNr5gUGwCAZC";
let tomtomApiKey = "ctMg0rMDauN3jPf1SOHXHVJNpJnhmGaS";
// tomtomApiKey = "XOeleMUFVN4TaGSAJwKm8y7IBfy7YeQA";

const redirectBasedOnLogin = (user, googleLogin) => {

    if (user) {
        var db = firebase.firestore();
        db.collection("user").where("userID", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (appUserLocal == null || appUserLocal == "undefined") {

                        let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports);
                        appUserLocal = au;
                        localStorage.setItem("appUser", JSON.stringify(au));
                    }
                });
            }).then(() => {
                if (!googleLogin) {
                    window.location.assign('log-in.html');
                }
                else {
                    if (appUserLocal && appUserLocal.userLocation.latitude == "0" && appUserLocal.userLocation.longitude == "0") {
                        window.location.assign('location-selection.html?isSkip=1')
                    }
                    else window.location.assign('home.html');
                }
            })
            .catch((error) => {
                console.log("Authentication service error: ", error);
            });

    }
    else {
        window.location = "../index.html";
    }


}

// Updating the User Database while Signing Up
const updateDB = (user, flag = 0, googleLogin = 0) => {

    const displayName = flag ? username.value : user.displayName;

    var docData = {
        about: "",
        dateOfBirth: "01/31/1800",
        name: displayName,
        profilePic: null,
        currentPage: "",
        sports: {
            badminton: {
                userLevel: ""
            },
            tennis: {
                userLevel: ""
            },
            volleyball: {
                userLevel: ""
            }
        },
        chatId:Date.now(),
        userID: user.uid,
        userLocation: new firebase.firestore.GeoPoint(0, 0)
    }
    db.collection("user").doc(user.uid).set(docData).then((docRef) => {
        redirectBasedOnLogin(user, googleLogin);
        console.log("document added");
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// Check if the User Already exist in DB
const checkIfUserExist = (user, flag = 0, googleLogin = 0) => {
    db.collection("user").doc(user.uid).get()
        .then((querySnapshot) => {
            // if (querySnapshot.exists) {
            //     redirectBasedOnLogin(user, googleLogin);
            // }
            // else {
            //     updateDB(user, flag, googleLogin);
            // }
            const answer = querySnapshot.exists ? redirectBasedOnLogin(user, googleLogin) : updateDB(user, flag, googleLogin);
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// Invoking Sign Up function for Sign UP
const googleSignOn = (flag, googlelogin) => {
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        var user = result.user;
        checkIfUserExist(user, flag, googlelogin);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        alert(errorMessage);
        // ...
    });
}

// Invoking Sign Up function for Sign UP
const fbSignOn = (flag, googlelogin) => {
    firebase.auth().signInWithPopup(fbProvider)
    .then((result) => {
    var user = result.user;
    checkIfUserExist(user, flag, googlelogin);
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
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

            if (redirect != "") { set_appUser(redirect) }
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
    constructor(auid, firstName, lastName, dob, profilePhoto, about, userLocation, sports, chatId, currentPage) {
        this.auid = auid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.profilePhoto = profilePhoto;
        this.about = about;
        this.userLocation = userLocation;
        this.sports = sports;
        this.chatId = chatId;
        this.currentPage = currentPage;
    }
}


const setCourts = (sport, courtType, courtId, courtName) => {

    let db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let document = db.collection("user").doc(get_appUser().auid);

            var myUpdate = {};
            myUpdate[`sports.${sport}.${courtType}.${courtId}.courtName`] = courtName;
            document.update(myUpdate);

            set_appUser();
        } else {
            // No user is signed in.
            window.location.assign('../index.html');
            localStorage.removeItem("appUser");
        }
    });
}

const goToSportCourts = (sport) => {

    let routeToUserLevel = false;

    switch (sport) {
        case "badminton":
            routeToUserLevel = get_appUser().sports.badminton.userLevel == "" ? true : false;
            break;
        case "tennis":
            routeToUserLevel = get_appUser().sports.tennis.userLevel == "" ? true : false;
            break;
        case "volleyball":
            routeToUserLevel = get_appUser().sports.volleyball.userLevel == "" ? true : false;
            break;
    }

    if (get_appUser().userLocation.latitude == "0" && get_appUser().userLocation.longitude == "0") {
        window.location.href = `location-selection.html?routeTo=${sport}`;
    }
    else if (routeToUserLevel) {
        window.location.href = `user-level.html?sport=${sport}`;
    }
    else {
        window.location.href = `select-court.html?sport=${sport}`;
    }

}


const get_appUser = () => {
    if (appUserLocal == undefined || appUserLocal == "") {
        if (localStorage.getItem("appUser") === null || localStorage.getItem("appUser") === null) {
            set_appUser();
        }
        else
            appUserLocal = JSON.parse(localStorage.getItem('appUser'));
    }
    return appUserLocal;
}

async function set_appUser (redirect = "")  {

    let user = firebase.auth().currentUser;
    if (user) {
        let db = firebase.firestore();
        db.collection("user").where("userID", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports, doc.data().chatId, doc.data().currentPage);
                    appUserLocal = au;

                    localStorage.setItem("appUser", JSON.stringify(au));
                });
            }).then(() => {
                console.log('appUserLocal set!')
                if(redirect != "" && ~redirect.indexOf("goToSportCourts") ){
                    let routedSport = redirect.substring(redirect.indexOf("-") + 1 , redirect.length);
                    goToSportCourts(routedSport);
                }
                else if (redirect != "") {
                    window.location.href = redirect;
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    else {
        // window.location = "../index.html";
        console.log("User not Found ");
    }
}

function signout() {
    localStorage.removeItem("appUser");
    firebase.auth().signOut();
    window.location = '../index.html';
}

// function for updating db values
const updateDbDetails = (collection, user, key, value) => {

    let dbRef = db.collection(collection).doc(user);
    return dbRef.update({
        [key]: value
    })
    .then(() => {
        set_appUser();
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}

const db = firebase.firestore();

function updateCurrentPage() {
    // currentPage = window.location.pathname;
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const queryString = window.location.search;
            var searchParams = new URLSearchParams(queryString);
            const result = searchParams.get("sport") ?? null;
            if(result) {
                updateDbDetails('user', user.uid, 'currentPage', result);
            }
        }
    });
}

updateCurrentPage();
