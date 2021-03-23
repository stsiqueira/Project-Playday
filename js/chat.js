////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 
const db =firebase.firestore(); 

////////////////////////////////////////////
//grab variable from URL
//////////////////////////////////////////// 
//grab variable from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const chatId = urlParams.get('chatId');
const friendId = urlParams.get('friendId');

let appUserobject = get_appUser();


////////////////////////////////////////////
//  Get Friends information
//////////////////////////////////////////// 
db.collection("user").where("userID", "==", friendId).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            // console.log(doc.data().name);
            friendProfile = doc.data();
            $(".chat-title").text(`${friendProfile.name}`);
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
});

////////////////////////////////////////////
//  Functions
//////////////////////////////////////////// 


 db.collection(chatId).onSnapshot((snapshot)=>{
     snapshot.docChanges().forEach((change)=>{
         if(change.type === "added"){
                if(change.doc.data().senderId != appUserobject.firstName){
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
        db.collection(chatId).doc(generateDocumentId()).set({
            senderId: get_appUser().firstName,
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
})

 
