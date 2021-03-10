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


////////////////////////////////////////////
//  Functions
////////////////////////////////////////////
const printData = (fname, lname, dtbirth, about)=>{
    $(".firstName").text(fname);  
    $(".lastName").text(lname); 
    $(".datebirth").text(dtbirth); 
    $(".about").text(about); 
}
////////////////////////////////////////////
//  Aman
//////////////////////////////////////////// 
$("#Amandeep").click(()=>{
    db.collection("user").doc("Amandeep").set({
        name: "Amandeep", 
        dateOfBirth: "1998/20/10", 
        lastName: "Singh",
        location: "Turkey",
        level: "Begginer",
        playAt: "School court",
        about: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    });
});
////////////////////////////////////////////
//  Diana
////////////////////////////////////////////
$("#Diana").click(()=>{
    db.collection("user").doc("Diana").set({
        name: "Diana", 
        dateOfBirth: "1998/10/10", 
        lastName: "Malynovska",
        location: "Congo",
        level: "Begginer",
        playAt: "College court",
        about: "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
    });
});

////////////////////////////////////////////
//  Glen
////////////////////////////////////////////
$("#Glen").click(()=>{
    db.collection("user").doc("Glen").set({
        name: "Glen", 
        dateOfBirth: "1998/10/10", 
        lastName: "Thomas",
        location: "Argentina",
        level: "Intermediate",
        playAt: "Street",
        about: "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
    });
});

////////////////////////////////////////////
//  Thiago
////////////////////////////////////////////
$("#Thiago").click(()=>{
    db.collection("user").doc("Thiago").set({
        name: "Thiago", 
        dateOfBirth: "1998/12/09", 
        lastName: "Siqueira",
        location: "Japan",
        level: "Begginer",
        playAt: "home",
        about: "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG"
    });
});

////////////////////////////////////////////
//  Creating chats
////////////////////////////////////////////
// db.collection("chat").doc(generateDocumentId()).set({
//     senderId: userName, 
//     receiverId: friend, 
//     message: $("#chat-message").val()
// });

