////////////////////////////////////////////
//  Firebase Initialize
//////////////////////////////////////////// 
const firebaseConfig = {
    apiKey: "AIzaSyCVfkLdpaLZUwFN8eMVMSptFoZfOpp1pZ8",
    authDomain: "playday-f43e6.firebaseapp.com",
    databaseURL: "https://playday-f43e6-default-rtdb.firebaseio.com",
    projectId: "playday-f43e6",
    storageBucket: "playday-f43e6.appspot.com",
    messagingSenderId: "732773100147",
    appId: "1:732773100147:web:13f7a6804851ac8486d806",
    measurementId: "G-TZB3NY5S6W"
  };
firebase.initializeApp(firebaseConfig);
  
////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 

const db =firebase.firestore();

const getProfile = ()=> {
    db.collection("user").where("name", "==", "Thiago")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // console.log(doc.data().name);
                userProfile = doc.data();
                printProfile();
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

getProfile();
const printProfile = ()=>{
    let html =`                 
            <div class="player-image header-image">
                <img src="../img/bg-404-sinatra.jpg" alt="${userProfile.name}-image">
            </div>
            <h2 class="player-name">${userProfile.name} ${userProfile.lastName}</h2>
            <div class="player-detail-wrapper">
                <div class="player-description">
                    <p class="player-description-location"> 
                        <strong>Location:</strong> 
                        <span>${userProfile.location}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>Level:</strong> 
                        <span>${userProfile.level}</span>
                    </p>

                    <p class="player-description-location"> 
                        <strong>About:</strong> 
                        <span>${userProfile.about}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>I play at:</strong> 
                        <span>${userProfile.playAt}</span>
                    </p>
                </div>
    `;
    $(".player-detail-content-wrapper").append(html);
}