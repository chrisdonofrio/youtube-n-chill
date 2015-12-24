// Logging a user in
  $("#logIn").click(function(){
  var ref = new Firebase("https://scorching-inferno-8276.firebaseio.com");
  ref.authWithOAuthPopup("google", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
})




