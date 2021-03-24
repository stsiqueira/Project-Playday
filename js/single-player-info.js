////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
const db =firebase.firestore();
let friendProfile = {}; 
let userAppProfile = {}; 
let userApp = get_appUser(); //common.js
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const friendId = urlParams.get('courtPlayerId');
// const sport = urlParams.get('sport');
// const sport = "tennis";
// const playAtPath = `friendProfile.sports.${sport}.challengeCourts.courtName`;
// const levelPath = `friendProfile.sports.${sport}.userLevel`;



db.collection("user").where("userID", "==", userApp.auid).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
            console.log(userAppProfile.userID);
            console.log(userAppProfile.name);
        })
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                printProfile();
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


const printProfile = ()=>{
    
    let html =`                 
            <div class="player-image header-image">
                <img src="${friendProfile.profilePic}" alt="${friendProfile.name}-image">
            </div>
            <h2 class="player-name">${friendProfile.name}</h2>
            <div class="player-detail-wrapper">
                <div class="player-description">
                    <p class="player-description-location"> 
                        <strong>Location:</strong> 
                        <span>${friendProfile.userLocationCity}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>Level:</strong> 
                        <span>${friendProfile.sports.tennis.level}</span>
                    </p>

                    <p class="player-description-location"> 
                        <strong>About:</strong> 
                        <span>${friendProfile.about}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>I play at:</strong> 
                        <span>${friendProfile.sports.tennis.challengeCourts}</span>
                    </p>
                </div>
            </div>
                <div class="buttons">
                    <!-- Buttons for Chat and Challenge -->
                    <a href="chat-window.html?chat-window.html?myId=${userAppProfile.userID}&friendId=${friendProfile.userID}">
                    <button class="player-chat-button common-button">Chat</button>
                    </a>
                    <a href="challenge-invite.html?userAppId=${userAppProfile.userID}&friendId=${friendProfile.userID}">
                    <button class="player-challenge-button common-button">Challenge</button>
                    </a>
                </div>
    `;
    $(".player-detail-content-wrapper").append(html);
}

