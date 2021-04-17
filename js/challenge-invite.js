
////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
//check whether user is loggedIn.
isLoggedIn();

// let db =firebase.firestore();
let friendProfile = {}; 
let userAppProfile = {}; 
let verifyChallenge = false;
const urlParams = new URLSearchParams(window.location.search);
const friendId = urlParams.get('friendId');
const userAppId = urlParams.get('userAppId');


////////////////////////////////////////////
//  DB connection - get Profiles
//////////////////////////////////////////// 
// the chatID is a concatenation of chatID of both users. here we create this field to search for chats.
// we also use the verifyChallenge to check if user has challenged before or not.
db.collection("user").where("userID", "==", userAppId).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
        })
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                if(userAppProfile.chatId < friendProfile.chatId){
                    chatId = "chatID" + userAppProfile.chatId + friendProfile.chatId;
                }else{
                    chatId = "chatID" + friendProfile.chatId + userAppProfile.chatId;
                }
                // console.log(friendProfile.chats);
                friendProfile.chats.forEach(chatid => {
                    // console.log(chatid);
                    // console.log(chatId);
                    if (chatId === chatid) {
                        verifyChallenge = true;
                        // console.log(verifyChallenge);
                    }
                    // console.log(verifyChallenge);
                });

                printDefaultMessage();
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 

// send the default message challenging the player.
const printDefaultMessage = ()=>{
    
    let html =` <div class="player-image">
                    <img class="" src="${friendProfile.profilePic}" alt="${friendProfile.name}'s picture">
                    <h3>${friendProfile.name}</h3>
                </div>            
                <div class="invite-msg-wrapper">
                    <textarea name="invite-msg" id="invite-msg" cols="30" rows="10">Hi ${friendProfile.name},\n\nI am looking for a partner to play ${userAppProfile ?userAppProfile.currentPage.toUpperCase() : ""}, let's connect! ${userAppProfile ? "I consider myself at " + userAppProfile.sports[userAppProfile.currentPage].userLevel + " level.": ""}
                    </textarea>
                </div>
                <div class="buttons">
                    <a href="javascript:history.go(-1)">
                    <button class="cancel-button grey-button">Cancel</button>
                    </a>
                    <button class="send-button green-button" onClick="checkMsg()">Send</button>
                </div>
    `;
    $(".challenge-invite-wrapper").append(html);
}
// generate an Id for the document based on precisely time.
const generateDocumentId = ()=>{
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = pad(date.getMonth() + 1);
    let day = pad(date.getDate());
    let hour = pad(date.getHours());
    let min = pad(date.getMinutes());
    let sec = pad(date.getSeconds());
    let millisec = pad(date.getMilliseconds(),3);
    return year+month+day+hour+min+sec+millisec;
}
// just to transform 1 digit in 2 from date parameters.
function pad(n, numberofDigits = 2) {

    if(numberofDigits == 2){
        return  ((n < 10) ? ("0" + n) : n);
    }
    else if(numberofDigits == 3){

        if(n<10){
            return "00" + n;
        }
        else if(n<100){
            return "0" + n;
        }
        else return n;
    }
    
}
// here we chack if the challenge was done before. PLayers can challenge only one time. Once the ranking features is on,
// then we change this function. because it only sends a default message, we dont want to spam players.
const checkMsg = () => {

    if(verifyChallenge == false){
        if($("#invite-msg").val() == ""){
            // console.log("invalid")
        }else{
            // console.log($("#invite-msg").val());
            // console.log(chatId);               
            db.collection("chats").doc("chat").collection(chatId).doc(generateDocumentId()).set({
                senderId: userAppProfile.name,
                receiverId: friendProfile.name, 
                message: $("#invite-msg").val(),
                date: new Date()
            }).then(()=>{
                window.location.assign(`chat-window.html?userAppId=${userAppId}&friendId=${friendId}`);
            }).catch((error) => {
                console.log("Error in check Message: ", error);
            });
            
        }
    }else{
        window.location.assign(`chat-window.html?userAppId=${userAppId}&friendId=${friendId}`);
    }
}
