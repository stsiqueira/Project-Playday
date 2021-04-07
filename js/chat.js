////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
// const db =firebase.firestore(); 

////////////////////////////////////////////
//grab variable from URL
//////////////////////////////////////////// 
let friendProfile = {}; 
let userAppProfile = {}; 
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let userAppId = urlParams.get("userAppId");
let friendId = urlParams.get('friendId');
let fieldData = new Date;
// console.log(userAppId,friendId);

//check whether user is loggedIn.
isLoggedIn();

////////////////////////////////////////////
//  DB connection - get Profiles
//////////////////////////////////////////// 
// console.log(userAppId);
db.collection("user").where("userID", "==", userAppId).get()
    .then((querySnapshot)=>{
        // Getting User Profile info
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
        });
        // console.log("1");
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
        // Getting Friend Profile info
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                $(".chat-title").text(`${friendProfile.name}`);
                let img = 
                    `<div class="chat-image">
                        <img src="${friendProfile.profilePic}" alt="'s picture">
                    </div>`;
                $(".title").append(img);

                // Generating chatID
                if(userAppProfile.chatId < friendProfile.chatId){
                    chatId = "chatID" + userAppProfile.chatId + friendProfile.chatId;
                }else{
                    chatId = "chatID" + friendProfile.chatId + userAppProfile.chatId;
                }
                // Pushing info to Chats field to create chat-window.html
                let pushChatId = true;
                // console.log(userAppProfile.chats);
                // console.log(friendProfile.chats);
                    // Pushing info to Friends Chats field to create chat-window.html
                friendProfile.chats.forEach(chatid => {
                    // console.log(chatid);
                    // console.log(chatId);
                    if (chatId === chatid) {
                        pushChatId = false;
                        console.log(pushChatId);
                        // console.log("=========");
                    }
                    // console.log(pushChatId);
                });

                if(pushChatId){
                    // console.log(friendProfile.userID);
                    // console.log(friendProfile.chats);
                    db.collection("user").doc(friendProfile.userID).update({
                        chats: firebase.firestore.FieldValue.arrayUnion(chatId)
                    });
                };
                        // Pushing info to User Chats field to create chat-window.html
                userAppProfile.chats.forEach(chatid => {
                    // console.log(chatid);
                    // console.log(chatId);
                    if (chatId === chatid) {
                        pushChatId = false;
                        // console.log(pushChatId);
                        // console.log("=========");
                    }
                    // console.log(pushChatId);
                });

                if(pushChatId){
                    // console.log(userAppProfile.userID);
                    // console.log(userAppProfile.chats);
                    db.collection("user").doc(userAppProfile.userID).update({
                        chats: firebase.firestore.FieldValue.arrayUnion(chatId)
                         

                    });
                    console.log(chatId);
                    let string = `lastCheck.${chatId}.date`;
                    console.log(string);
                    console.log(friendProfile.userID);
                    updateLastCheck(string, friendProfile.userID);
                };

            });
            // console.log("2");
        }).then(()=>{
            // console.log("3");
            lastCheck();
            getMessages(chatId);
        });
    })
    // .then(()=>{
    //     console.log("3");
    //     lastCheck();
    //     getMessages(chatId);
    // })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 
const lastCheck = () =>{
    db.collection("user").where("userID", "==", userAppId).get()
        .then((snapshot)=>{
            snapshot.forEach(doc => {
                let lastCheck = doc.data().lastCheck;
                // console.log(lastCheck);
                let string = `lastCheck.${chatId}.date`;
                updateLastCheck(string, userAppId);
            });
        });      
};
const updateLastCheck = (chatidtime,userid)=>{
    let field = chatidtime;
    if(userid == userAppProfile.userID){
        fieldData = new Date;
    }else{
        fieldData = new Date(20201204);
        console.log("lastcheck friend atualizado");
    }
    console.log(fieldData);
    db.collection("user").doc( userid).update({
        [field]: fieldData
    })
    .then(() => {
        console.log("updated");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });

}
// setTimeout(() => {
    // console.log(chatId);
    // getMessages(chatId); 
// }, 3000);

const getMessages = (chatIdentifier) => {
    db.collection(chatIdentifier).onSnapshot((snapshot)=>{
        snapshot.docChanges().forEach((change)=>{
           if(change.type === "added"){
                   if(change.doc.data().senderId != userAppProfile.name){
   
                       let newLine = `                    
                           <li class="receiver"> 
                               <div class="chat-message receiver">
                                   <p class="text-message"> ${change.doc.data().message}</p>
                               </div>
                           </li>`;
                           $("#chat-messages").append(newLine);
                   }else{
                       let newLine = `  
                           <li class="sender">
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
    let month = pad(date.getMonth() + 1);
    let day = pad(date.getDate());
    let hour = pad(date.getHours());
    let min = pad(date.getMinutes());
    let sec = pad(date.getSeconds());
    let millisec = pad(date.getMilliseconds(),3);
    return year+month+day+hour+min+sec+millisec;
}

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

const sendMessage = () => {
    if($("#chat-message").val() == " "){
        console.log("invalid")
    }else{
        // change the chatID 
        db.collection(chatId).doc(generateDocumentId()).set({
            senderId: userAppProfile.name,
            receiverId: friendProfile.name, 
            message: $("#chat-message-input").val(),
            date: new Date()
        });
        $("#chat-message-input").val("");
    }
    lastCheck();
}
////////////////////////////////////////////
//  Event Listener
//////////////////////////////////////////// 
$("#sendButton").click(()=>{
    sendMessage();
});
////////////////////////////////////////////
//  Keyboard Listener
//////////////////////////////////////////// 
document.addEventListener('keydown', (e) => { 
    if(e.keyCode == 13){
        sendMessage();
    }
});
$("#back-button").click(function () {

    if (userAppProfile.chatId < friendProfile.chatId) {
        chatId = "chatID" + userAppProfile.chatId + friendProfile.chatId;
    } else {
        chatId = "chatID" + friendProfile.chatId + userAppProfile.chatId;
    }
    let updatePath = `lastCheck.${chatId}.date`;

    updateLastCheck(updatePath, userAppProfile.userID);
    window.history.go(-1);
});


