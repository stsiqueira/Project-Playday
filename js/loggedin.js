firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        var div = document.getElementById('firebaseui-auth-container');
        var db = firebase.firestore();
        db.collection("user").where("userID", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data());
                console.log(doc.data().name);
                var username = doc.data().name;
                div.innerHTML = `<h2> Congrats ${username} logged in with ${user.email}</h2>`;
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }
    else {
        window.location = "../index.html";
    }
});

function signout(){
    firebase.auth().signOut();
    window.location='../index.html';
}


