// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
let myName = "";
let myChatId = 4;    


const db =firebase.firestore();
//grab variable from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const friendChatId = urlParams.get('userChatId');
// console.log(friendId);

if(myChatId < friendChatId){
    chatId = "chatId" + myChatId + friendId;
}else{
    chatId = "chatId" + friendId + myChatId;
}


////////////////////////////////////////////
//  Check if user is Logged in
//////////////////////////////////////////// 
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        myName = user.displayName;
    }
    else {
        window.location = "../index.html";
    }
});

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 
// change the chat ID, img SRC
 db.collection(chatId).onSnapshot((snapshot)=>{
     snapshot.docChanges().forEach((change)=>{
         if(change.type === "added"){
                if(change.doc.data().senderId != localStorage.getItem("username")){
                    let newLine = `                    
                        <li> 
                            <div class="chat-image">
                                <img src="../img/bg-404-sinatra.jpg" alt="${localStorage.getItem("username")}'s picture">
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
                                <img src="../img/bg-404-sinatra.jpg" alt="">
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
        db.collection("chat001002").doc(generateDocumentId()).set({
            senderId: localStorage.getItem("username"), 
            receiverId: "Diana", // change to name grabbed from LI in Aman's court Screen
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
})

$(".chat-title").text(localStorage.getItem("username")); // change to name grabbed from LI in Aman's court Screen
