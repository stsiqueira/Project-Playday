$(document).ready(function () {

    $('body.home').removeClass('hide-right');
    $('body.home').addClass('slide-in');
    
    let appUserobject = get_appUser();
    $("#user-name").html(appUserobject != null && appUserobject.firstName != "" ? appUserobject.firstName : "Guest");

    $('#badminton').click(function () {
            goToSportCourts("badminton");
        });
        $('#tennis').click(function () {
            goToSportCourts("tennis");
        });
        $('#volleyball').click(function () {
            goToSportCourts("volleyball");
        });

    const storageRef = firebase.storage().ref();
    
    const getDownloadUrl = (path="/", user, flag=0) => {
        const userImageRef = storageRef.child('user_images/' + path);
        userImageRef.getDownloadURL()
        .then((url) => {
            if (flag) {
                updateDbDetails('user', user.uid, 'profilePic', url);
                console.log("hiii");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
        
        
    //updating image in html
    const checkImageExist = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                let socialUserImage = user.providerData[0].photoURL;
                if(socialUserImage && !appUserobject.profilePhoto) {
                    updateDbDetails('user', user.uid, 'profilePic', socialUserImage);
                    setImage(socialUserImage);
                }
                else if(!socialUserImage && !appUserobject.profilePhoto) {
                    getDownloadUrl('user-default.png', user, 1);
                }
            }
        });
    }
        
    checkImageExist();
        

}); //Document Ready Closed