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

      apiKey: "AIzaSyA84cFZU4zoLh4pNdLCf8Gacqp5BtkljAA",
      authDomain: "login-chat-test-7bab7.firebaseapp.com",
      projectId: "login-chat-test-7bab7",
      storageBucket: "login-chat-test-7bab7.appspot.com",
      messagingSenderId: "1083715500488",
      appId: "1:1083715500488:web:ee431e1bce7ff29c18e8fd"
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