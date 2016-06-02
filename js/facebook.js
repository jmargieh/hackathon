function fb_login(){
  FB.login(function(response) {

      if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
          uid = response.authResponse.userID; //get FB UID
          //change_UIview(1);
          window.location="http://www.youAreLoggedIn.com";

      } else {
          //user hit cancel button
          console.log('User cancelled login or did not fully authorize.');

      }
  }, {
      scope: 'publish_actions,user_photos,user_events,user_friends,email'
  });
}

function check_login_status(){
                FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token
    // and signed request each expire
    //change_UIview(0);
    window.location="http://www.youAreLoggedIn.com";
    uid = response.authResponse.userID;
    console.log(uid);

  } else if (response.status === 'not_authorized') {
        //change_panelTitle();
    // the user is logged in to Facebook,
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
}

function fb_logout(){
    FB.logout(function(response) {
      window.location="http://www.youAreLoggedOut.com";
    //change_UIview(1); // change to loggedout view

});
}
