 // Create a new Firebase reference, and a new instance of the Login client
    var ref = new Firebase('https://scorching-inferno-8276.firebaseio.com/');
 
    // initialize the chat 
    function initChat(authData) {
      var chat = new FirechatUI(ref, document.getElementById('firechat-wrapper'));
      chat.setUser(authData.uid, authData.password.email.substr(0, authData.password.email.indexOf('@')));  //want to setUser to password.email, but it's not showing in object.
    }

    // Creating a user account 
    function registerUser() {
      ref.createUser({
        email    : $("#registerUsername").val(),  //pulled from form
        password : $("#registerPassword").val(),
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });
    }

    // Login user 
    function loginUser() {
      ref.authWithPassword({
        email    : $("#username").val(), //pulled from form
        password : $("#loginPassword").val()
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          initChat(authData);
        }
      });
    }
