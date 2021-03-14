var db = firebase.firestore();
const about = document.getElementById('playerAbout');
const pass = document.getElementById('playerPassword');
const passUpdate = document.getElementById('updatePassword');
const update = document.getElementById('update');
const image = document.getElementById('player-image');

const updateDetails = (collection, user, key, value) => {
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


const getUserDetails = (collection, key) => {
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
    getUserDetails('user', 'about');
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

