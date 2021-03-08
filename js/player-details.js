var db = firebase.firestore();
const about = document.getElementById('about');
const update = document.getElementById('update');
const image = document.getElementById('player-image');

var u = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        db.collection("user").where("userID", "==", user.uid)
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

        var document = db.collection("user").doc(user.uid)
        document.set({
            about: "hii",
            'sports.badminton.challengeCourts': arrayUnion("hii")
        },{ merge: true });
    } else {
        window.location = "../index.html";
    }
});


const updateData = () => {
    description = about.value;
    console.log(getUser());
    var document = db.collection("cities").doc(getUser());
}

update.addEventListener('click', updateData);

