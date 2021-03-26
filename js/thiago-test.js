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
let chatID = "chatID16163727651441616605589173";
let chatsArray = [];
let verifyChallenge = false;

db.collection("user").where("userID", "==", "TrkGWqZSYqfkYrd3jQuThRqIPgp2").get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            chatsArray = doc.data().chats;

            chatsArray.forEach(chatid => {
                console.log(chatid);
                console.log(chatID);
                if (chatID == chatid) {
                    verifyChallenge = true;
                }
                console.log(verifyChallenge);
            });
        })
        
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });


////////////////////////////////////////////
//  Creating chats
////////////////////////////////////////////
// db.collection("chat").doc(generateDocumentId()).set({
//     senderId: userName, 
//     receiverId: friend, 
//     message: $("#chat-message").val()
// });

