var db = firebase.firestore();
const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const passUpdate = document.getElementById('updatePassword');
const update = document.getElementById('update');
const image = document.getElementById('player-image');
const changePassword = document.getElementsByClassName("change-password");

window.FontAwesomeConfig = {
    searchPseudoElements: true
  }

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
    var dbRef = db.collection(collection).doc(user.uid);
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
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            updateDetails(collection, user, key, description);
        } else {
          // No user is signed in.
        }
    });
}

update.addEventListener('click', function() {
    getDbUserDetails('user', 'about');
});

const updatePassword = () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.updatePassword(pass.value).then(function() {
                console.log("password updated successful");
            }).catch(function(error) {
            // An error happened.
            });
        } else {
          // No user is signed in.
        }
    });
}

passUpdate.addEventListener('click', function() {
    updatePassword();
});

