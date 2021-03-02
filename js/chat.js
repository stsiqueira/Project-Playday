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

let userName = "Thiago"; // to be changed to user.displayName(authentication function);
let friend = "Siqueira"; // to be changed to ??????????;
let collection = "Chat"; // to be changed to a mix of userName and friend;

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 

 db.collection("chat").onSnapshot((snapshot)=>{
     snapshot.docChanges().forEach((change)=>{
         if(change.type === "added"){
                let newLine = document.createElement("li");
                newLine.innerHTML = change.doc.data().senderId + ": " + change.doc.data().message;
                $("#chat-messages").append(newLine);
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
        db.collection("chat").doc(generateDocumentId()).set({
            senderId: userName, 
            receiverId: friend, 
            message: $("#chat-message").val()
        });
        $("#chat-message").val("");
    }
    
});




// collection(chat).document(PlayerID).collection(concatenateUserIDPLayer1PLayer2).doc(date).fields



