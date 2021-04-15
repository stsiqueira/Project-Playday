const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const update = document.getElementById('update');
// user data
const locationInfo = document.getElementsByClassName("location-info");
const imageUser = document.getElementById('user-image');
const editIcon = document.getElementById('edit-icon');
var modal = document.getElementById("myModal");
const imageContainer = document.getElementById('image-container');

var span = document.getElementsByClassName("close")[0];
const aboutApply = document.getElementById('about-save');
const aboutInput = document.getElementById('about-input');
const locationInput = document.getElementById('location-input');
const imgUpload = document.getElementById("imgupload");
const userName = document.getElementsByClassName("user-name");
const userAbout = document.getElementsByClassName("about-player");
const selectedSport = document.getElementById("change-sport");
const userLevelInput = document.getElementById("user-level");
const submitButton = document.getElementById("apply-changes");

// const db = firebase.firestore();
const storageRef = firebase.storage().ref();

let appUserobject = get_appUser();

isLoggedIn();

// Modal Code ***********************************

editIcon.onclick = function () {
    modal.style.display = "block";
    aboutInput.select(); aboutInput.focus();
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

span.onclick = function () {
    modal.style.display = "none";
}

// ***********************************************

//update page details ****************************

const updateInnerHtml = (element, value) => {
    element.innerHTML = value;
}

updateInnerHtml(userName[0], `${appUserobject.firstName} ${appUserobject.lastName}`);
updateInnerHtml(userAbout[0], appUserobject.about);
document.getElementById('location-input').value = appUserobject.userLocationCity ? appUserobject.userLocationCity : "Not Selected";

// $.getJSON(`https://api.tomtom.com/search/2/reverseGeocode/${appUserobject.userLocation.latitude},${appUserobject.userLocation.longitude}.json?key=${tomtomApiKey}`, function (json) {

//     addressString = json.addresses[0].address.municipality;
//     document.getElementById('location-input').value = addressString ? addressString : "Not Selected";

// });

$("#location-info-wrapper").click(function () {
    window.location.href = "location-selection.html";
});


aboutApply.addEventListener('click', function () {
    updateDbDetails('user', appUserobject.auid, 'about', aboutInput.value);
    updateInnerHtml(userAbout[0], aboutInput.value);
    modal.style.display = "none";
});

// ***************************************************


// invoking file API *********************************


/*Code reference: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos */
// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 400;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

video = document.getElementById('video');
canvas = document.getElementById('canvas');
photo = document.getElementById('photo');
startbutton = document.getElementById('startbutton');

function startCamera() {

    playVideo();

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
                height = width / (4 / 3);
            }

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);

    startbutton.addEventListener('click', function (ev) {
        takepicture();
        $("#save").removeClass("disabled");
        ev.preventDefault();
    }, false);

    clearphoto();
}

function playVideo() {
    $("#camera").show();

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.log("An error occurred: " + err);
        });
}

// Fill the photo with an indication that none has been
// captured.

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    } else {
        clearphoto();
    }

    stopCamera();
    $("#retake, #output").show();
    $("#camera, #gallery").hide();

}


function stopCamera() {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
}

function resetWidgetControls() {
    $("#retake, #output").hide();
    $("#camera, #gallery").show();
    $("#save").addClass("disabled");
}

imageUser.addEventListener('click', function () {
    $(".camera-widget-wrapper").fadeIn(750);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        if (streaming) {
            playVideo(); resetWidgetControls();
        }
        else startCamera();
    }
});

$("#cancel").click(() => {
    $(".camera-widget-wrapper").fadeOut(750);
    stopCamera();
    resetWidgetControls();
});

$("#gallery").click(() => {
    imgUpload.addEventListener("change", handleFiles, false);
    imgUpload.click();
});

$("#retake").click(() => {
    playVideo();
    resetWidgetControls();
});

$("#save").click(() => {

    let capturedImg = $("#photo").attr('src');

    fetch(capturedImg)
        .then(res => res.blob())
        .then(blob => uploadImage(blob))
        .then(() => {
            $(".camera-widget-wrapper").fadeOut(750);
            resetWidgetControls();
        })
        .catch(error => {
            console.log(error);
        });

    resetWidgetControls();
});

const setImage = (url) => {
    var img = document.getElementById('user-image');
    img.setAttribute('src', url);
}

const getDownloadUrl = (path = "/", user, flag = 0) => {
    const userImageRef = storageRef.child('user_images/' + path);
    userImageRef.getDownloadURL()
        .then((url) => {
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
            let socialUserImage = user.providerData[0].photoURL;
            if (appUserobject.profilePhoto) {
                setImage(appUserobject.profilePhoto);
            }
            else if (socialUserImage && !appUserobject.profilePhoto) {
                updateDbDetails('user', user.uid, 'profilePic', socialUserImage);
                setImage(socialUserImage);
            }
            else if (!socialUserImage && !appUserobject.profilePhoto) {
                getDownloadUrl('user-default.png', user, 1);
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
            const renamedFile = new File([file], user.uid, { type: file.type });
            //uploading the image to storage
            const userImageRef = storageRef.child('user_images/' + user.uid);
            userImageRef.put(renamedFile).then((snapshot) => {
                updateImage();
            });
        }
    });
}

//function for checking the image extension
function handleFiles() {
    const fileList = this.files;
    if (fileList && fileList[0].type.startsWith("image")) {
        uploadImage(fileList[0]);
        $(".camera-widget-wrapper").fadeOut(750);
        stopCamera();
    }
    else {
        alert("please upload an image file");
    }
}

// ***************************************************

// Changing User Password ***********************************

const updateUserPassword = (currentPassword, confirmPass) => {
    var user = firebase.auth().currentUser;
    var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword.value
    );
    user.reauthenticateWithCredential(credential).then(function () {
        user.updatePassword(confirmPass.value).then(function () {
            showToast("Password Updated");
        }).catch(function (error) {
            alert(error);
        });
    }).catch(function (error) {
        showToast("Password Updation Failed");
    });
}

// ***********************************************************

// Changing details according to the Sports

const savedAndChallengeCourtsHtml = (count, courtName, selectedSport, key, destinationHtml, typeOfCourts) => {
    let html = `<div class="courts courts-${count}">
                    <div class="court-details">
                        <div class="court-location">${courtName}</div>
                        <div class="sports-court">
                            ${selectedSport}
                        </div>
                    </div>
                    <div class="delete-court-wrapper">
                        <button id="${key}-${typeOfCourts}" class="delete-button red-button delete-button-${count}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>`;
    $(`.${destinationHtml}`).append(html);
}

function changeSport(typeOfCourts, destinationHtml, currentPageFlag) {
    count = 0;
    const sportSelected = currentPageFlag ? appUserobject.currentPage : selectedSport.value.toLowerCase();

    if (currentPageFlag) {
        selectedSport.value = capitalize(appUserobject.currentPage);
    }

    let courts = appUserobject.sports[sportSelected][typeOfCourts];
    var userLevel = appUserobject.sports[sportSelected]['userLevel'];
    userLevelInput.value = userLevel || 'NoSelect';

    if ($(`.${destinationHtml}`).find('.courts')) {
        $(`.${destinationHtml} .courts`).remove();
    }

    hasCourts = false;

    for (var key in courts) {
        count += 1;
        if (courts.hasOwnProperty(key)) {
            savedAndChallengeCourtsHtml(count, courts[key]['courtName'], selectedSport.value, key, destinationHtml, typeOfCourts);
            hasCourts = true;
        }
    }

    if (!hasCourts) {
        let output = `<div class="courts">
                            No courts saved under this category.
                        </div>`
        $(`.${destinationHtml}`).append(output);
    }

    $("button").unbind().click(function () {
        let id = `#${this.id}`;
        let courtId = this.id.split('-');
        let className = $(id).attr('class');
        $(id).closest(".courts");
        if (className.startsWith('delete')) {
            $(id).closest(".courts").remove();
            let deleteCourt = `sports.${selectedSport.value.toLowerCase()}.${courtId[1]}.${courtId[0]}`;
            updateDbDetails('user', appUserobject.auid, deleteCourt, firebase.firestore.FieldValue.delete());
            set_appUser();
        }
    });
}

const removeSelectOption = (classname) => {
    $(`.${classname} option[value='NoSelect']`).remove();
}

function updateSport(currentPageFlag) {
    changeSport('challengeCourts', 'challenge-courts', currentPageFlag);
    changeSport('savedCourts', 'saved-courts', currentPageFlag);
    removeSelectOption("sport-change");
}

submitButton.addEventListener('click', function (event) {
    // updating user level from select
    if (selectedSport.value != "NoSelect" && userLevelInput.value != "NoSelect") {
        let userLevelKey = `sports.${selectedSport.value.toLowerCase()}.userLevel`;
        updateDbDetails('user', appUserobject.auid, userLevelKey, userLevelInput.value);
        showToast("Data Updated");
        event.preventDefault();
    } else {
        showToast("Please update the select values");
    }
});

// ************************************************

const courtAccordion = (id, classnames, headingClassName) => {
    var acc = document.getElementById(id);
    heading = document.getElementsByClassName(headingClassName)[0];
    heading.classList.toggle("activeHeading");
    acc.classList.toggle("active");
    panel = acc.getElementsByClassName(classnames);
    if (panel[0].style.maxHeight) {
        panel[0].style.maxHeight = null;
    } else {
        panel[0].style.maxHeight = panel[0].scrollHeight + "px";
    }
}

const getSignInMethod = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let currentSignIn = user.providerData[0].providerId;
            if (currentSignIn == "password") {
                let changePasswordHtml = `          
                <form action="/" class="change-password-form">
                        <input type="password" id="current-password" placeholder="Current Password" class="current-password">
                        <input type="password" id="confirm-password"  placeholder="New Password" class="confirm-password">
                        <input type="button" id="pass-update" value="Change Password" class="green-button">
                </form>`;
                $(".change-password-accordion .change-password").append(changePasswordHtml);
                $(".change-password-accordion").css("display", "block");
                const passUpdate = document.getElementById('pass-update');
                const currentPass = document.getElementById('current-password');
                const confirmPass = document.getElementById('confirm-password');
                $(".change-text-heading").click(function () {
                    let id = $(".change-text-heading").parent().attr('id');
                    courtAccordion(id, 'change-password', 'change-text-heading');
                });
                passUpdate.addEventListener('click', function () {
                    updateUserPassword(currentPass, confirmPass);
                });
            }
        }
    });
}

getSignInMethod();

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function getCurrentPage() {
    if (appUserobject.currentPage) {
        updateSport(1);
    }
}

getCurrentPage();

$(".saved-courts-heading").click(function () {
    let id = $(".saved-courts-heading").parent().attr('id');
    courtAccordion(id, 'saved-courts', 'saved-courts-heading');
});

$(".challenge-courts-heading").click(function () {
    let id = $(".challenge-courts-heading").parent().attr('id');
    courtAccordion(id, 'challenge-courts', 'challenge-courts-heading');
});