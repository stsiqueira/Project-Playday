////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
var firebaseConfig = {
    apiKey: "AIzaSyCVfkLdpaLZUwFN8eMVMSptFoZfOpp1pZ8",
    authDomain: "playday-f43e6.firebaseapp.com",
    databaseURL: "https://playday-f43e6-default-rtdb.firebaseio.com",
    storageBucket: "https://console.firebase.google.com/project/playday-f43e6/storage/playday-f43e6.appspot.com/files",
    projectId: "playday-f43e6",
    storageBucket: "playday-f43e6.appspot.com",
    messagingSenderId: "732773100147",
    appId: "1:732773100147:web:13f7a6804851ac8486d806",
    measurementId: "G-TZB3NY5S6W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 

const db =firebase.firestore();
let friendProfile = {}; 
let userAppProfile = {}; 
const urlParams = new URLSearchParams(window.location.search);
const friendId = urlParams.get('friendId');
const userAppId = urlParams.get('userAppId');

////////////////////////////////////////////
//  DB connection - get Profiles
//////////////////////////////////////////// 

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

const printDefaultMessage = ()=>{
    
    let html =` <div class="player-img-wrapper">
                    <img class="" src="${friendProfile.profilePic}" alt="${friendProfile.name}'s picture">
                    <h3>${friendProfile.name}</h3>
                </div>            
                <div class="invite-msg-wrapper">
                    <textarea name="invite-msg" id="invite-msg" cols="30" rows="10">Hi ${friendProfile.name},\n\nI am looking for a partner to play tennis with, let's connect! My level is ${friendProfile.sports.tennis.userLevel}.
                    </textarea>
                </div>
                <div class="buttons">
                    <a href="javascript:history.go(-1)">
                    <button class="cancel-button grey-button">Cancel</button>
                    </a>
                    <button class="send-button green-button" onClick="checkMessages()">Send</button>
                </div>
    `;
    $(".challenge-invite-wrapper").append(html);
}

const generateDocumentId = ()=>{
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return year+month+day+hour+min+sec;
}
const checkMessages = () => {
    console.log($("#invite-msg").val());
    
    console.log(chatId);
    if($("#chat-message").val() == ""){
        console.log("invalid")
    }else{
       
        db.collection(chatId).doc(generateDocumentId()).set({
            senderId: userAppProfile.name,
            receiverId: friendProfile.name, 
            message: $("#invite-msg").val(),
            date: new Date()
        });
        window.location.assign(`chat-window.html?userAppId=${userAppId}&friendId=${friendId}`);
    }
}





////////////
////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
const db =firebase.firestore(); 

let friendProfile = {}; 
let userAppProfile = {}; 
const urlParams = new URLSearchParams(window.location.search);
const friendId = urlParams.get('friendId');
const userAppId = urlParams.get('myId');

console.log(urlParams.get('myId'));



////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 

const getChat = ()=>{
    db.collection(chatId).onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change)=>{
            if(change.type === "added"){
                   if(change.doc.data().senderId != userAppProfile.name){
                       let newLine = `                    
                           <li> 
                               <div class="chat-image">
                                   <img src="${friendProfile.profilePic}" alt="'s picture">
                               </div>
                               <div class="chat-message">
                                   <p class="text-message"> ${change.doc.data().message}</p>
                               </div>
                           </li>`;
                           $("#chat-messages").append(newLine);
                   }else{
                       let newLine = `  
                           <li class="sender">
                               <div class="chat-image">
                                   <img src="${userAppProfile.profilePic}" alt="${userAppProfile.name}'s picture">
                               </div>
                               <div class="chat-message sender">
                                   <p class="text-message">${change.doc.data().message}</p>
                               </div>
                           </li>`;
                           $("#chat-messages").append(newLine);
                   }
            }
        });
    });
}


const generateDocumentId = ()=>{
    let date = new Date();
    let year = date.getFullYear().toString();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return year+month+day+hour+min+sec;
}

const checkMessages = () => {
    if($("#chat-message").val() == ""){
        console.log("invalid")
    }else{

        db.collection(chatId).doc(generateDocumentId()).set({
            senderId: userAppProfile.name,
            receiverId: friendProfile.name, 
            message: $("#chat-message-input").val(),
            date: new Date()
        });
        $("#chat-message-input").val("");
    }
}

////////////////////////////////////////////
//  DB connection - get Profiles
//////////////////////////////////////////// 
db.collection("user").where("userID", "==", userAppId).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
            console.log(userAppProfile.name);
        })
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                console.log(friendProfile.name);
                $(".chat-title").text(`${friendProfile.name}`);
                if(userAppProfile.chatId < friendProfile.chatId){
                    chatId = "chatID" + userAppProfile.chatId + friendProfile.chatId;
                }else{
                    chatId = "chatID" + friendProfile.chatId + userAppProfile.chatId;
                }
            });
        })
        .then(()=>{
            getChat();
        })

    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


////////////////////////////////////////////
//  Event Listener
//////////////////////////////////////////// 
$("#sendButton").click(()=>{
    checkMessages();
});
////////////////////////////////////////////
//  Keyboard Listener
//////////////////////////////////////////// 
document.addEventListener('keydown', (e) => { 
    if(e.keyCode == 13){
        checkMessages();
    }
})

 
