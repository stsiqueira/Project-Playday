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
let chatID = "chatID16163727651441616605589179";
let MychatID = "chatID16163727651441616605589175";
let date = new Date;
let atualizadata = "";


array = { chatID, date}
// console.log(array)
const envia = () =>{
        db.collection("user-data-thiago").doc( "RM2slEdpN6mhrmUTwzlE").update({
        lastCheck: firebase.firestore.FieldValue.arrayUnion(array)
        });
        console.log("enviado");
}
const updateLastChecka = () =>{
    date = new Date;
    console.log(date)
    // console.log(lastCheck);
    let test = `lastCheck[5].date`;
    db.collection("user-data-thiago").doc( "RM2slEdpN6mhrmUTwzlE").update({
        [test]: date
    });
    console.log("data atualizada");
}

const verifcaMaior = ()=>{
             let newDate = teste.toDate();
                
                console.log(newDate);

                if(date < newDate) {
                    console.log(date);
                    console.log(newDate);
                    console.log("date is bigger");

                }else{
                    console.log("newDate is Bigger");
                }

}
const busca = () =>{
    db.collection("user-data-thiago").where( "chatId", "==", 2).get()
        .then((snapshot)=>{
            snapshot.forEach(doc => {
                let documento = doc.data();
                let lastCheckArray = documento.lastCheck;
                console.log(lastCheckArray);
                let counter = 0;
                lastCheckArray.forEach(chatid => {
                    counter ++;
                    if(MychatID == chatid.chatID){
                        console.log(counter);
                        console.log("final 5");
                        console.log(chatid)
                        atualizadata = chatid.date;
                        console.log(atualizadata.toDate())
                        updateLastCheck();
                        console.log(chatid.date.toDate())
                    }
                    
                    
                });
            });
            
        });
};
// envia();
// busca();

/////////////////
const updateLastCheck = (chatidtime)=>{
    date = new Date;
    // let test = "lastCheckGlen.chatID16163727651441616605589175.date";
    let test = chatidtime;
    db.collection("user-data-thiago").doc( "RM2slEdpN6mhrmUTwzlE").update({
        [test]: new Date
    })
    .then(() => {
        console.log("updated");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });

}

// async function checkMsg (){
//  await db.collection("chatid100")
//     .onSnapshot((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         console.log("Docs data: ", doc.data());
//       })
//     });
// }
/////////////////////
const lastCheck = () =>{
    db.collection("user-data-thiago").where( "chatId", "==", 2).get()
        .then((snapshot)=>{
            snapshot.forEach(doc => {
                let documento = doc.data();
                let lastCheckGlen = documento.lastCheckGlen;
                console.log(lastCheckGlen);

                let lastCheckGlen2 = `lastCheckGlen.${MychatID}.date`;
                console.log(lastCheckGlen2);
                updateLastCheck(lastCheckGlen2);
                // console.log(chatID16163727651441616605589175.date.toDate())
            });
        });
            
};
lastCheck()

       
        // let obj = { chatID, timestamp:firebase.firestore.FieldValue.serverTimestamp() };
        // console.log(obj);
    // db.collection("user-data-thiago").where("chatId", "==" , 2 ).get()
    //     // .then(()=>{
    //     //     
    //     // })
    //     .then((doc)=>{
    //         console.log(doc.data());
    //         // doc.data().timestamp; 
    //         let date = time.toDate(); 
    //         let shortDate = date.toDateString(); 
    //         let shortTime = date.toLocaleTimeString();
    //       // Print date to console 
    //         console.log(shortDate)
            // querySnapshot.forEach((doc) => {
            //    console.log(doc.data());
            // //    doc.data().lastCheck.forEach((chatTime)=>{
            // //         console.log(chatTime.chatID);
            // //         console.log(chatTime.objDate);
            // //    })
            // })
        // })

    // db.collection("user-data-thiago").doc( "RM2slEdpN6mhrmUTwzlE").update({
    //     lastCheck: firebase.firestore.FieldValue.arrayUnion(obj)

    // });



////////////////////////////////////////////
//  Creating chats
////////////////////////////////////////////
// db.collection("chat").doc(generateDocumentId()).set({
//     senderId: userName, 
//     receiverId: friend, 
//     message: $("#chat-message").val()
// });

