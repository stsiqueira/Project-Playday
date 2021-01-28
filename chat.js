////////////////////////////////////////////////////////////////////////////////// 
//  variables
//////////////////////////////////////////////////////////////////////////////////// 

let user = $("#userName").val();


////////////////////////////////////////////////////////////////////////////////// 
//  Functions
////////////////////////////////////////////////////////////////////////////////////  

// copied from firebase 
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBPYOCQydlvzqkGDnBTQGaTY_ykU089_Wk",
    authDomain: "thiagotestchat.firebaseapp.com",
    projectId: "thiagotestchat",
    storageBucket: "thiagotestchat.appspot.com",
    messagingSenderId: "930444899485",
    appId: "1:930444899485:web:bd17a3a9a8c17da1401074"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const createLi = () =>{
    //   alert("we are here!");
    let newLine = document.createElement("li");
    newLine.innerHTML = $("#message").val();
    $("#dialog").append(newLine);

  }
  const sendMessage = () =>{
    console.log("we are here!");
    // Save in Firebase database, copied from website doc.
    firebase.database().ref("messages").push().set({ 
        "sender":$("#userName").val(),
        "message": $("#message").val()
    });
    // prevent from reload
    return false;
  }
  firebase.database().ref("messages").on("child_added", function (snapshot) {
    let newLine = document.createElement("li");
    newLine.innerHTML = snapshot.val().sender + ": " + snapshot.val().message ;
    $("#dialog").append(newLine);
  });

////////////////////////////////////////////////////////////////////////////////// 
//  Event Listener
//////////////////////////////////////////////////////////////////////////////////// 
sendBtn.addEventListener("click", () =>{
        sendMessage();
});