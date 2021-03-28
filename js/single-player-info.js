////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 

let friendProfile = {}; 
let userAppProfile = {}; 
let userApp = get_appUser(); //common.js
let playAtPath = [];
let savedCourtsArray = {};
let result = [];
let level = "";
// const db =firebase.firestore();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const friendId = urlParams.get('courtPlayerId');
const sport = urlParams.get('sport');
console.log(userApp.auid);

db.collection("user").where("userID", "==", userApp.auid).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            console.log("userAppProfile");
            userAppProfile = doc.data();
            console.log(userAppProfile);
        })
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();

                switch (sport) {
                    case "badminton":
                        savedCourtsArray = friendProfile.sports.badminton.savedCourts;
                        break;
                    case "tennis":
                        savedCourtsArray = friendProfile.sports.tennis.savedCourts;
                        break;
                    case "volleyball":
                        savedCourtsArray = friendProfile.sports.volleyball.savedCourts;
                        break;
                }
                for(var i in savedCourtsArray)
                result.push([i, savedCourtsArray [i]]);
                result.forEach(i => { 
                    playAtPath.push(i[1].courtName);
                });
                switch (sport) {
                    case "badminton":
                        level = friendProfile.sports.badminton.userLevel;
                        break;
                    case "tennis":
                        level = friendProfile.sports.tennis.userLevel;
                        break;
                    case "volleyball":
                        level = friendProfile.sports.volleyball.userLevel;
                        break;
                }
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
                        <span>${level}</span>
                    </p>

                    <p class="player-description-location"> 
                        <strong>About:</strong> 
                        <span>${friendProfile.about}</span>
                    </p>
                    <p class="player-description-location"> 
                        <strong>I play at:</strong> 
                        <span>${playAtPath}</span>
                    </p>
                </div>
            </div>
                <div class="buttons">
                    <!-- Buttons for Chat and Challenge -->
                    <a href="chat-window.html?userAppId=${userAppProfile.userID}&friendId=${friendProfile.userID}">
                    <button class="player-chat-button common-button">Chat</button>
                    </a>
                    <a href="challenge-invite.html?userAppId=${userAppProfile.userID}&friendId=${friendProfile.userID}">
                    <button class="player-challenge-button common-button">Challenge</button>
                    </a>
                </div>
    `;
    $(".player-detail-content-wrapper").append(html);
}
