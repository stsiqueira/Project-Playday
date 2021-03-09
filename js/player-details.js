var db = firebase.firestore();
const about = document.getElementById('about');
const update = document.getElementById('update');
const image = document.getElementById('player-image');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection("user").where("userID", "==", "7KhZCViEtaVUMFJfGap23nJJtL73")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                image.src = doc.get("profilePic");
                var arr = doc.get("sports.badminton.challengeCourts");
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    } else {
        window.location = "../index.html";
    }
});


const updateData = () => {
    description = about.value;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var document = db.collection("user").doc("7KhZCViEtaVUMFJfGap23nJJtL73")
            document.set({
                about: "heil"
        },{ merge: true });
        } else {
          // No user is signed in.
        }
      });
}

update.addEventListener('click', updateData);

