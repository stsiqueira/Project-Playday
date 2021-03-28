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
// console.log(userAppId,friendId);

////////////////////////////////////////////
//  DB connection - get Profiles
//////////////////////////////////////////// 
// console.log(userAppId);
db.collection("user").where("userID", "==", userAppId).get()
    .then((querySnapshot)=>{
        // Getting User Profile info
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
        })
    })
    .then(()=>{
        db.collection("user").where("userID", "==", friendId).get()
        .then((querySnapshot)=>{
        // Getting Friend Profile info
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                $(".chat-title").text(`${friendProfile.name}`);
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
                };

            });
        })
    })
    .then(()=>{
        lastCheck();
    })
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
    db.collection("user").doc( userid).update({
        [field]: new Date
    })
    .then(() => {
        console.log("updated");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });

}
setTimeout(() => {
    // console.log(chatId);

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
                            <div class="chat-message sender">
                                <p class="text-message">${change.doc.data().message}</p>
                            </div>
                        </li>`;
                        $("#chat-messages").append(newLine);
                }
        }
     });
 });
}, 2000);
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

const sendMessage = () => {
    if($("#chat-message").val() == ""){
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


