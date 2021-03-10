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

const db =firebase.firestore();

let friend = "Diana"; // to be changed to ??????????;
let chatId = 0; // to be changed to a mix of userName and friend;
let myName = "";

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

 db.collection("chat001002").onSnapshot((snapshot)=>{
     snapshot.docChanges().forEach((change)=>{
         if(change.type === "added"){
                if(change.doc.data().senderId != myName){
                    let newLine = `                    
                        <li>
                            <div class="chat-image">
                                <img src="../img/bg-404-sinatra.jpg" alt="Thiago">
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
////////////////////////////////////////////
//  Event Listener
//////////////////////////////////////////// 
$("#sendButton").click(()=>{
    if($("#chat-message").val() == ""){
    }else{
        db.collection("chat001002").doc(generateDocumentId()).set({
            senderId: myName, 
            receiverId: "Diana", 
            message: $("#chat-message-input").val()
        });
        $("#chat-message-input").val("");
    }
    
});
setTimeout(() => {
    $(".user-test h3").text(myName);
}, 2000);

