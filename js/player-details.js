const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const update = document.getElementById('update');
// user data
const locationInfo = document.getElementsByClassName("location-info");
const imageUser = document.getElementById('user-image');
const imageContainer = document.getElementById('image-container');

const locationInput = document.getElementById('location-input'); 
const imgUpload = document.getElementById("imgupload")
const userName = document.getElementsByClassName("user-name");
const userAbout = document.getElementsByClassName("about-player");
const selectedSport = document.getElementById("change-sport");
const userLevelInput = document.getElementById("user-level");
const submitButton = document.getElementById("apply-changes");

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

$( "#location-info-wrapper" ).click(function() {
    window.location.href = "location-selection.html";
});

// ***************************************************

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

// invoking file API *********************************
imageUser.addEventListener('click', function (event) {
    imgUpload.addEventListener("change", handleFiles, false);
    imgUpload.click();
});

const setImage = (url) => {
    var img = document.getElementById('user-image');
    img.setAttribute('src', url);
}

const getDownloadUrl = (path="/", user, flag=0, googleSignInFlag = 0) => {
    if (googleSignInFlag) {
        var docRef = db.collection("user").doc(user.uid);
        docRef.get().then((doc) => {
            if (!doc.exists) {
                // pass
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
    const userImageRef = storageRef.child('user_images/' + path);
    userImageRef.getDownloadURL()
    .then((url) => {
        // inserted into an <img> element
        setImage(url);
        if (flag) {
            updateDbDetails('user', user.uid, 'profilePic', url);
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

//updating image in html
const checkImageExist = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let googleUserImage = user.photoURL;
            if (appUserobject.profilePhoto) {
                getDownloadUrl(user.uid, user);
            }
            else if(googleUserImage && !appUserobject.profilePhoto) {
                updateDbDetails('user', user.uid, 'profilePic', googleUserImage);
                setImage(googleUserImage);
            }
            else if(!googleUserImage && !appUserobject.profilePhoto) {
                getDownloadUrl('user-default.png', user, 1);
                // updateDbDetails('user', user.uid, 'profilePic', imageUrl);
            }
        }
    });
}

const updateImage = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        getDownloadUrl(user.uid, user, 1, 1);
    });
}

checkImageExist();

const uploadImage = (file) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //creating the object with new filename
            const renamedFile = new File([file], user.uid, {type: file.type});
            //uploading the image to storage
            const userImageRef = storageRef.child('user_images/'+user.uid);
            userImageRef.put(renamedFile).then((snapshot) => {
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

// Changing User Password ***********************************

reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
}

const updateUserPassword = (currentPassword, confirmPass) => {
    var user = firebase.auth().currentUser;
    var credential =  firebase.auth.EmailAuthProvider.credential(
        user.email, 
        currentPassword.value
    );
    user.reauthenticateWithCredential(credential).then(function() {
        user.updatePassword(confirmPass.value).then(function () {
        }).catch(function (error) {
            alert(error);
        });
      }).catch(function(error) {
        // An error happened.
      });
}

// passUpdate.addEventListener('click', function () {
//     updatePassword();
// });

// ***********************************************************

// Signout ***************************************************
function signout() {
    firebase.auth().signOut();
    window.location = '../index.html';
}
// ***********************************************************

// Changing details according to the Sports


const savedAndChallengeCourtsHtml = (count, courtName, selectedSport, key,destinationHtml, typeOfCourts) => {
    let html = `<div class="courts courts-${count}">
                    <div class="court-details">
                        <div class="court-location">${courtName}</div>
                        <div class="sports-court">
                            ${selectedSport}
                        </div>
                    </div>
                    <div class="delete-court-wrapper">
                        <button id="${key}-${typeOfCourts}" class="delete-button red-button delete-button-${count}">Delete</button>
                    </div>
                </div>`
    $(`.${destinationHtml}`).append(html);
}

function changeSport(typeOfCourts, destinationHtml) {
    count = 0;
    let courts = appUserobject.sports[selectedSport.value.toLowerCase()]['challengeCourts'];
    var userLevel = appUserobject.sports[selectedSport.value.toLowerCase()]['userLevel'];
    if (userLevel == "") {
        userLevelInput.value = "NoSelect";
    }
    else {
        userLevelInput.value = userLevel;
    }
    if ($('.saved-courts').find('.courts')){
        $(".courts").remove();
    }
    for (var key in courts) {
        count += 1
        if (courts.hasOwnProperty(key)) {
            savedAndChallengeCourtsHtml(count, courts[key]['courtName'], selectedSport.value, key, destinationHtml, typeOfCourts);
        }
    }   

    $("button").click(function() {
        let id = `#${this.id}`;
        let courtId = this.id.split('-');
        let className = $(id).attr('class');
        if(className.startsWith('delete')) {
            $(id).closest(".courts").remove();
            let deleteCourt = `sports.${selectedSport.value.toLowerCase()}.challengeCourts.${courtId[0]}`;
            updateDbDetails('user', appUserobject.auid, deleteCourt, firebase.firestore.FieldValue.delete())  
            set_appUser();
        }
    });
}

const removeSelectOption = (classname) => {
    $(`.${classname} option[value='NoSelect']`).remove();
}

function updateSport() {
    changeSport('savedCourts', 'saved-courts');
    changeSport('challengeCourts', 'challenge-courts');
    removeSelectOption("sport-change");
}

// updateSport();

submitButton.addEventListener('click', function (event) {
    // updating user level from select
    let userLevelKey = `sports.${selectedSport.value.toLowerCase()}.userLevel`;
    updateDbDetails('user', appUserobject.auid, userLevelKey, userLevelInput.value);
    showToast();
    event.preventDefault();
});

const getSignInMethod = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let currentSignIn = user.providerData[0].providerId;
            if(currentSignIn == "password") {
                let changePasswordHtml = `
                <div class="change-password">
                <form action="/" class="change-password-form">
                        <input type="password" id="current-password" placeholder="Current Password" class="current-password">
                        <input type="password" id="confirm-password"  placeholder="New Password" class="confirm-password">
                        <input type="button" id="pass-update" value="Change Password" class="green-button">
                </form>
            </div>` 
            $(".accordion-wrapper").css("display", "block");
            $( ".accordion-wrapper" ).append(changePasswordHtml);
            const passUpdate = document.getElementById('pass-update');
            const currentPass = document.getElementById('current-password');
            const confirmPass = document.getElementById('confirm-password');
            changePasswordAccordion();
            passUpdate.addEventListener('click', function () {
                updateUserPassword(currentPass, confirmPass);
                });
            }
        }
    });
}

function showToast() {
    // Get the snackbar DIV
    var x = document.getElementById("toast");
    // Add the "show" class to DIV
    x.innerHTML = "Data Updated"

    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

getSignInMethod();

function changePasswordAccordion() {
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
              } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
              }
        });
    }
}

set_appUser();