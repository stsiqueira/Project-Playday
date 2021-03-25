////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
const db =firebase.firestore(); 

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
                $(".chat-title").text(`${friendProfile.name}`);
                if(userAppProfile.chatId < friendProfile.chatId){
                    chatId = "chatID" + userAppProfile.chatId + friendProfile.chatId;
                }else{
                    chatId = "chatID" + friendProfile.chatId + userAppProfile.chatId;
                }
            });
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 

setTimeout(() => {
    console.log(chatId);

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

const checkMessages = () => {
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
}
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
});


