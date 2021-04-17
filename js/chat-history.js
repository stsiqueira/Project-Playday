////////////////////////////////////////////
//  Variables
//////////////////////////////////////////// 

// const db =firebase.firestore(); 
let userApp = get_appUser(); //common.js
let friendProfile = {};
let lastMsg = "";
let counterMsg = 0
//check whether user is loggedIn.
isLoggedIn();

// print all the chats that user is part of.
const printChats = () => {

    let html = `            
    <li class="chat-item">
        <a href="chat-window.html?userAppId=${userAppProfile.userID}&friendId=${friendProfile.userID}"">
        <div class="chat-history-player-image">
            <img src="${friendProfile.profilePic}" alt="${friendProfile.name}'s picture">
        </div>
        <div class="chat-history-message">
            <p class="chat-history-name">${friendProfile.name}</p>
            <p class="chat-history-message">${lastMsg}</p>
        </div>`
    if (counterMsg != 0) {
        html += `
            <div class="chat-history-number-msgs">
                <p class="chat-history-msg"> ${counterMsg} </p>
            </div>`
    }
    html += `
        </a>
    </li>`
    $(".chat-history").append(html);
}

// get messages from DB and count the number of unread messages, if that is the case.
const getMessages = (chatId) => {
    db.collection("chats").doc("chat").collection(chatId).get()
        .then((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                lastMsg = change.doc.data().message;
                // console.log(lastMsg);
                if (change.doc.data().senderId != userAppProfile.name) {
                    // console.log(change.doc.data().date.toDate());
                    let lastCheck = userAppProfile.lastCheck[chatId].date.toDate();
                    // console.log(chatId);
                    // console.log("========================================");
                    // console.log(change.doc.data().date.toDate());
                    // console.log(lastCheck);
                    // console.log("=========");
                    if (change.doc.data().date.toDate() > lastCheck) {
                        // console.log(change.doc.data().date.toDate());
                        counterMsg++;
                        // console.log("contador = " + counterMsg);
                    } else {
                        // console.log(lastCheck);
                    }

                }
            });
            // console.log(lastMsg);
            printChats();
            lastMsg = "";
            counterMsg = 0;
        });
}
// bring all the chats that user is part of.
const getChats = (friendid, chat) => {
    db.collection("user").where("chatId", "==", friendid).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                // console.log(friendProfile.name); 
            });
        })
    getMessages(chat);
}

// the chatID is a concatenation of chatID of both users. here we create this field to search for chats.
db.collection("user").where("userID", "==", userApp.auid).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            userAppProfile = doc.data();
            lastCheck = userAppProfile
            // console.log(lastCheck);

            // console.log(userAppProfile.chatId);
        });
        // console.log(userAppProfile.chats)

        if (userAppProfile.chats.length > 0) {
            $(".message-container").addClass("hidden");
            userAppProfile.chats.forEach((chat) => {
                let id1 = parseInt(chat.slice(-13));
                // console.log(id1);
                let id2 = parseInt(chat.slice(6, -13));
                // console.log(id2);
                let friendId = 0;
                // console.log(friendId);
                if (id1 == userAppProfile.chatId) {
                    // console.log(userAppProfile.chatId,id1);
                    friendId = id2;
                } else {
                    friendId = id1;
                }
                // console.log(friendId); 
                getChats(friendId, chat);

            });
        }
        else{
            $(".message-container").removeClass("hidden");
        }
    })
