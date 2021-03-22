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



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const friendId = urlParams.get('court-playerID');
// const sport = urlParams.get('sport');
const sport = "tennis";
const playAtPath = `userProfile.sports.${sport}.challengeCourts.courtName`;
const levelPath = `userProfile.sports.${sport}.userLevel`;

////////////////////////////////////////////
//  Functions for single-player-info
//////////////////////////////////////////// 

db.collection("user").where("userID", "==", friendId).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            // console.log(doc.data().name);
            userProfile = doc.data();
            printProfile();
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
});

const printProfile = ()=>{
    let html =`                 
            <div class="player-image header-image">
                <img src="" alt="${userProfile.profilePic}-image">
            </div>
            <h2 class="player-name">${userProfile.name}</h2>
            <div class="player-detail-wrapper">
                <div class="player-description">
                    <p class="player-description-location"> 
                        <strong>Location:</strong> 
                        <span>${userProfile.userLocationCity}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>Level:</strong> 
                        <span>${levelPath}</span>
                    </p>

                    <p class="player-description-location"> 
                        <strong>About:</strong> 
                        <span>${userProfile.about}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>I play at:</strong> 
                        <span>${userProfile.sports.tennis.challengeCourts}</span>
                    </p>
                </div>
            </div>
                <div class="buttons">
                    <!-- Buttons for Chat and Challenge -->
                    <a href="chat-window.html?userChatId=${userProfile.chatId}">
                    <button class="player-chat-button common-button">Chat</button>
                    </a>
                    <a href="player-invite.html">
                    <button class="player-challenge-button common-button">Challenge</button>
                    </a>
                </div>
    `;
    $(".player-detail-content-wrapper").append(html);
}






// "Hi I am Thiago. I like to PLay Tennis on Saturday and Sunday morninngs. text me and lets schedule our next game. Hope to see you soon."