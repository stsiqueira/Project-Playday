const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const passUpdate = document.getElementById('updatePassword');
const update = document.getElementById('update');
const imageUser = document.getElementById('user-image');
const changePassword = document.getElementsByClassName("change-password");
const imgUpload = document.getElementById("imgupload")

const db = firebase.firestore();
const storageRef = firebase.storage().ref();

// let appUserobject = get_appUser();
// console.log(appUserobject);

//
imageUser.addEventListener('click', function (event) {
    imgUpload.addEventListener("change", handleFiles, false);
    imgUpload.click();
});

const updateImage = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const userImageRef = storageRef.child('user_images/'+user.uid);
            userImageRef.getDownloadURL()
            .then((url) => {
              // inserted into an <img> element
              console.log(url);
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

// function changeImage() {
//     console.log("hiii"+imgUpload.value);
// }

changePassword[0].addEventListener('click', function (event) {
    changePassword[0].classList.toggle("active");
    var panel = changePassword[0].nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
});

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

// update.addEventListener('click', function () {
//     getDbUserDetails('user', 'about');
// });

const updatePassword = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            user.updatePassword(pass.value).then(function () {
                console.log("password updated successful");
            }).catch(function (error) {
                // An error happened.
            });
        } else {
            // No user is signed in.
        }
    });
}

// passUpdate.addEventListener('click', function () {
//     updatePassword();
// });
