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
const tomtomApiKey = "ctMg0rMDauN3jPf1SOHXHVJNpJnhmGaS";
// let tomtomApiKey = "XOeleMUFVN4TaGSAJwKm8y7IBfy7YeQA";
// let tomtomApiKey = "btLyAfWjgUeCnADorxtv6lVysyov8M0l";


const redirectBasedOnLogin = (user, socialLogin) => {

    if (user) {
        var db = firebase.firestore();
        db.collection("user").where("userID", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (appUserLocal == null || appUserLocal == "undefined") {

                        let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports, doc.data().chatId, doc.data().currentPage,doc.data().userLocationCity);
                        appUserLocal = au;
                        sessionStorage.setItem("appUser", JSON.stringify(au));
                    }
                });
            }).then(() => {
                if (!socialLogin) {
                    window.location.assign(`log-in.html?signup=true&useremail=${user.email}`);
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
const updateDB = (user, flag = 0, socialLogin = 0) => {

    const displayName = flag ? username.value : user.displayName;

    var docData = {
        about: "Hi, I am new to the PlayDay app!",
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
        chats:[],
        lastCheck:{},
        userID: user.uid,
        userLocation: new firebase.firestore.GeoPoint(0, 0),
        userLocationCity:"Location Not Set"
    }
    db.collection("user").doc(user.uid).set(docData).then((docRef) => {
        redirectBasedOnLogin(user, socialLogin);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// Check if the User Already exist in DB
const checkIfUserExist = (user, flag = 0, socialLogin = 0) => {
    db.collection("user").doc(user.uid).get()
        .then((querySnapshot) => {
            const answer = querySnapshot.exists ? redirectBasedOnLogin(user, socialLogin) : updateDB(user, flag, socialLogin);

        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

var provider = new firebase.auth.GoogleAuthProvider();
var fbProvider = new firebase.auth.FacebookAuthProvider();
var tprovider = new firebase.auth.TwitterAuthProvider();

// Invoking Sign Up function for Sign UP
const googleSignOn = (flag, socialLogin) => {
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        var user = result.user;
        checkIfUserExist(user, flag, socialLogin);
    }).catch((error) => {
        var errorCode = error.code;
        if(errorCode != "auth/popup-closed-by-user") {
            var errorMessage = error.message;
            var email = error.email;
            console.log(error.code);
            var credential = error.credential;
            showToast("Google Sign In Failed")
        }
    });
}

// Invoking Sign Up function for Sign UP
const fbSignOn = (flag, socialLogin) => {
    firebase.auth().signInWithPopup(fbProvider)
    .then((result) => {
        var user = result.user;
        checkIfUserExist(user, flag, socialLogin);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        showToast("Facebook Sign In Failed")

    });
}

// Twitter Login
const tSignon = (flag, socialLogin) => {
    firebase.auth().signInWithPopup(tprovider)
    .then((result) => {
        var user = result.user;
        console.log(user);
        checkIfUserExist(user, flag, socialLogin);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        showToast("Twitter Sign In Failed")

        // ...
    });
}

//Read parameter values from url
const urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}

//update user level, if redirect has any value, user will be moved to redirected page
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
            sessionStorage.removeItem("appUser");
        }
    });
}

//Local class to store user values, handy to serialize and desrialize data for later purposes
class AppUser {
    constructor(auid, firstName, lastName, dob, profilePhoto, about, userLocation, sports, chatId, currentPage, userLocationCity = "Location Not Set") {
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
        this.userLocationCity = userLocationCity;
    }
}

//Add, update court id, name and its type to the user profile
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
            sessionStorage.removeItem("appUser");
        }
    });
}

//Move from home screen to any sports court, if the user is selecting the sport for first time then route to user level, else route to select-court
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

//return session storage object of user
const get_appUser = () => {
    if (appUserLocal == undefined || appUserLocal == "") {
        if (sessionStorage.getItem("appUser") === undefined || sessionStorage.getItem("appUser") === null) {
            set_appUser();
        }
        else
            appUserLocal = JSON.parse(sessionStorage.getItem('appUser'));
    }
    return appUserLocal;
}


//set session storage object of user
async function set_appUser (redirect = "")  {

    let user = firebase.auth().currentUser;
    if (user) {
        let db = firebase.firestore();
        db.collection("user").where("userID", "==", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {

                    let au = new AppUser(doc.data().userID, doc.data().name.substring(0, doc.data().name.indexOf(" ")), doc.data().name.substring(doc.data().name.indexOf(" ") + 1, doc.data().name.length), doc.data().dateOfBirth, doc.data().profilePic, doc.data().about, doc.data().userLocation, doc.data().sports, doc.data().chatId, doc.data().currentPage,doc.data().userLocationCity);
                    appUserLocal = au;

                    sessionStorage.setItem("appUser", JSON.stringify(au));
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
    sessionStorage.removeItem("appUser");
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

function validateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        if(confirmPasswordField.value == passwordField.value) {
          return (true)
        }
        else {
              showToast("password does not match");
              return false;
        }
    }
    showToast("You have entered an invalid email address!")
    return (false)
}

function checkPassword(inputtxt) { 
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if(inputtxt.match(decimal)) { 
        return true;
    }
    else { 
        return false;
    }
} 

function showToast(text) {
    var x = document.getElementById("toast");
    x.innerHTML = text;

    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

updateCurrentPage();

function isLoggedIn()  {
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = "log-in.html";
        }
    });
}