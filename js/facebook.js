function fb_login(){
  FB.login(function(response) {

      if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
      
      getLoggedInUserFriends(function(){
          getLoggedInUserInfo(function(){
          window.location="myEvents.html";
        });
    });
          //window.location="http://www.youAreLoggedIn.com";

      } else {
          //user hit cancel button
          console.log('User cancelled login or did not fully authorize.');

      }
  }, {
      scope: 'publish_actions,user_photos,user_events,user_friends,email'
  });
}


// calculate points of users who were tagged on one or more photo of logged user.
function getLoggedInUserFriends(callback){  
        FB.api('me/friends?fields=name,picture',function(response) {

            if(response && !response.error){
              console.log(response.data);
              localStorage.setItem("friendList",JSON.stringify(response.data));
              callback();
            }
        });
}

function getLoggedInUserInfo(callback){
          FB.api('me?fields=first_name,last_name',function(response) {

            if(response && !response.error){
              localStorage.setItem("loggedUser",JSON.stringify(response));
              callback();
            }
        });
}


function check_login_status(){
                FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {

    getLoggedInUserFriends(function(){

        getLoggedInUserInfo(function(){

        window.location="myEvents.html";
        //window.location="user-signup.html";

        })
    });

  } else if (response.status === 'not_authorized') {

  } else {
    // the user isn't logged in to Facebook.
  }
 });
}

function fb_logout(){
    FB.logout(function(response) {
      window.location="user-signup.html";
    //change_UIview(1); // change to loggedout view

});
}
