// const db =firebase.firestore(); 
let userApp = get_appUser(); //common.js
let friendProfile = {}; 
let lastMsg = "";
let chatsIdArray = [];
let friendIdArray = [];
let array = [];
let countera = 0;
let counterb = 0;
let counterc = 0;

const printChats = (friendprofile, lastmsg) =>{

    let html = `            
    <li class="chat-item">
        <a href="chat-window.html?userAppId=${userAppProfile.userID}&friendId=${friendprofile.userID}"">
        <div class="chat-history-player-image">
            <img src="${friendprofile.profilePic}" alt="${friendprofile.name}'s picture">
        </div>
        <div class="chat-history-message">
            <p class="chat-history-name">${friendprofile.name}</p>
            <p class="chat-history-message">${lastmsg}</p>
        </div>
        <div class="chat-history-number-msgs">
            <p class="chat-history-msg"> 2 </p>
        </div>
        </a>
    </li>`
    $(".chat-history").append(html);
}

const getMessages = (chat, friendprofile) =>{
    lastMsg = "";
    db.collection(chat).get()
    .then((snapshot)=>{
        counterc ++;
        console.log("c = " +counterc);
        // for (var i in snapshot.docs) {
        //     snapshot.docs[i].data().forEach(()=>{
                
        //     })
        //     const doc = snapshot.docs[i].data();
        //     console.log(snapshot.docs[i].data());
        //     // if (make_some_decision_here) {
        //     //     break
        //     // }
        // }
        snapshot.docs.map(doc => {
            countera ++
            console.log("a = " + countera)
            if(doc.data().senderId != userAppProfile.name){
                counterb ++
                console.log("b = " + counterb)
                lastMsg = doc.data().message;
                console.log("my last" + lastMsg)
            }
                // console.log(doc.data());
                // let testa = doc.data();
                // // console.log(testa);
                // array.push(testa);
                // // console.log(array);
                // array.forEach(element => {
                //     console.log(array);
                // });


                // testa.forEach(element => {
                //     console.log(element);
                // });

                // testa.forEach((element) => {
                    // if(element.senderId != userAppProfile.name){
                    //     console.log(doc.data().message);
                    // };
                // doc.data().forEach(()=>{//////Firestore.instance.collection("data").snapshots().last

                // })forEach((change)=>{ 
                
                // 
                // lastMsg = change.doc.data().message;
                // console.log(chat)
                // console.log("====")
                // console.log(lastMsg);
                
                // })
        });
        // console.log(lastMsg);
        //----It was here.
        printChats(friendprofile, lastMsg); 
    });
    // .then(()=>{
    //     console.log("AAAAAAAAAA" + chat);
    //     // printChats(friendprofile, lastMsg); 
    // })
}

const getChats = (friendid, chat)=>{

    db.collection("user").where("chatId", "==", friendid).get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                friendProfile = doc.data();
                console.log(friendProfile.name); 
            });
        })
        .then(()=>{
            getMessages(chat,friendProfile); 
            console.log("this is " + friendid);
        })   
     
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
            
            chatsIdArray.push(chat);
            friendIdArray.push(friendId);
            
        })
    })
    .then(()=>{
        console.log(chatsIdArray);
        console.log("======");
        console.log(friendIdArray);

        for (let i = 0; i < chatsIdArray.length; i++) {
            getChats(friendIdArray[i], chatsIdArray[i]);
            console.log(i);
        }
        
    })
