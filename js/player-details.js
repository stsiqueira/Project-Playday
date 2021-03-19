const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const update = document.getElementById('update');
// user data
const locationInfo = document.getElementsByClassName("location-info");
const imageUser = document.getElementById('user-image');
const locationInput = document.getElementById('location-input'); 
const imgUpload = document.getElementById("imgupload")
const userName = document.getElementsByClassName("user-name");
const userAbout = document.getElementsByClassName("about-player");
// change password
const passUpdate = document.getElementById('pass-update');
const changePassword = document.getElementsByClassName("change-password");
const newPass = document.getElementById('new-password');
const confirmPass = document.getElementById('confirm-password');

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

let appUserobject = get_appUser();

//update page details ****************************

const updateInnerHtml = (element, value) => {
    element.innerHTML = value;
}

updateInnerHtml(userName[0], appUserobject.lastName);
updateInnerHtml(userAbout[0], appUserobject.about);


$.getJSON(`https://api.tomtom.com/search/2/reverseGeocode/${appUserobject.userLocation.latitude},${appUserobject.userLocation.longitude}.json?key=${tomtomApiKey}`, function (json) {
    addressString = json.addresses[0].address.municipality;
    if (addressString) {
        document.getElementById('location-input').value = addressString;
    }
    else {
        document.getElementById('location-input').value = "default";

    }
});

// ***************************************************

// invoking file API *********************************
imageUser.addEventListener('click', function (event) {
    imgUpload.addEventListener("change", handleFiles, false);
    imgUpload.click();
});

//updating image in html
const updateImage = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userImageRef = storageRef.child('user_images/'+user.uid);
            userImageRef.getDownloadURL()
            .then((url) => {
              // inserted into an <img> element
              var img = document.getElementById('user-image');
              img.setAttribute('src', url);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    });
}

updateImage();

const uploadImage = (file) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //creating the object with new filename
            const renamedFile = new File([file], user.uid, {type: file.type});
            //uploading the image to storage
            const userImageRef = storageRef.child('user_images/'+user.uid);
            userImageRef.put(renamedFile).then((snapshot) => {
                console.log('Uploaded a blob or file!');
                updateImage();
            });
        }
    });
}

//function for checking the image extension
function handleFiles() {
    const fileList = this.files;
    if (fileList &&fileList[0].type.startsWith("image")) {
        uploadImage(fileList[0]);
    }
    else {
        alert("please upload an image file");
    }
}

// ***************************************************

const updateDbDetails = (collection, user, key, value) => {
    let dbRef = db.collection(collection).doc(user.uid);
    return dbRef.update({
        [key]: value
    })
    .then(() => {
        console.log("Document successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
}


const getDbUserDetails = (collection, key) => {
    description = about.value;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            updateDetails(collection, user, key, description);
        } else {
            // No user is signed in.
        }
    });
}

// Changing User Password ***********************************

const updateUserPassword = () => {
    if(newPass.value != confirmPass.value) {
        alert("password doesn't match");
        return false;
    }
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user.updatePassword(newPass.value).then(function () {
            }).catch(function (error) {
                alert(error);
            });
        }
    });
}

passUpdate.addEventListener('click', function () {
    updatePassword();
});

// ***********************************************************

// Signout ***************************************************
function signout() {
    firebase.auth().signOut();
    window.location = '../index.html';
}
// ***********************************************************

function changeSport() {
    const selectedSport = document.getElementById("change-sport").value;
    let courts = appUserobject.sports[selectedSport.toLowerCase()]['challengeCourts'];
    console.log(courts);
    for (var key in courts) {
        if (courts.hasOwnProperty(key)) {
            console.log(key + " -> " + courts[key]['courtName']);
        }
    }   
}

// function getUser(callback) {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             console.log(user.uid);
//             db.collection("user").doc(user.uid).get()
//             .then((querySnapshot) => {
//                 if (querySnapshot.exists) {
//                     console.log("hiii");
//                 }
//                 else {
//                     console.log("hoo");
//                 }
//             })
//             .catch((error) => {
//                 console.log("Error getting documents: ", error);
//             });
//         } else {
//             // No user is signed in.
//         }
//     });
// }

// function callback(user, data) {
//     console.log(user);
// }

// getUser(callback);
