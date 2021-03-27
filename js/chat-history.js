const db =firebase.firestore(); 
let userApp = get_appUser(); //common.js
let friendProfile = {}; 
let lastMsg = "";

const printChats = () =>{
    let html = `            
    <li class="chat-item">
        <a href="chat-window.html?userAppId=${userAppProfile.userID}&friendId=${friendProfile.userID}"">
        <div class="chat-history-player-image">
            <img src="${friendProfile.profilePic}" alt="${friendProfile.name}'s picture">
        </div>
        <div class="chat-history-message">
            <p class="chat-history-name">${friendProfile.name}</p>
            <p class="chat-history-message">${lastMsg}</p>
        </div>
        <div class="chat-history-number-msgs">
            <p class="chat-history-msg"> 2 </p>
        </div>
        </a>
    </li>`
    $(".output-chats").append(html);
}

const getMessages = (chat) =>{
    db.collection(chat).get()
    .then((snapshot)=>{
        snapshot.docChanges().forEach((change)=>{ 
            if(change.doc.data().senderId != userAppProfile.name){
                lastMsg = change.doc.data().message;
                console.log(lastMsg);
            }
        });
        // console.log(lastMsg);
        printChats(); 
    });
}

const getChats = (friendid, chat)=>{
    db.collection("user").where("chatId", "==", friendid).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                console.log(friendProfile.name); 
            });
        })   
    getMessages(chat);  
}

db.collection("user").where("userID", "==", userApp.auid).get()
    .then((querySnapshot)=>{
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
            // console.log(userAppProfile.chatId);
        });
        console.log(userAppProfile.chats)
        userAppProfile.chats.forEach( (chat)=>{
            let id1 = parseInt(chat.slice(-13));
            // console.log(id1);
            let id2 = parseInt(chat.slice(6,-13));
            // console.log(id2);
            let friendId = 0;
            // console.log(friendId);
            if(id1 == userAppProfile.chatId){
                // console.log(userAppProfile.chatId,id1);
                friendId = id2; 
            }else{
                friendId =id1;
            }
            console.log(friendId); 
            getChats(friendId, chat);
            
        })
    })
