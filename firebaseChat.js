 // Create a new Firebase reference, and a new instance of the Login client
    var ref = new Firebase('https://scorching-inferno-8276.firebaseio.com/');

    //Hide forms until button click
    $("#regWarning, #loginWarning").hide();
  
    // New users: Creating a user account 
    $("#registerAction").click(function(e) {
      event.preventDefault();
      ref.createUser({
        email    : $("#registerUsername").val(),  
        password : $("#registerPassword").val(),
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          $("#regWarning").fadeIn(500).fadeOut(2400);//Need to: improve error message
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          //Need to: change inner text of modal with info on registration status
        }
      });
    })

    // User Login: triggering the chat to initialize
    $("#loginAction").click(function(e) {
      event.preventDefault();
      ref.authWithPassword({
        email    : $("#loginEmail").val(), 
        password : $("#loginPassword").val()
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $("#loginWarning").fadeIn(500).fadeOut(2400);//need to: improve error message
        } else {
          console.log("Authenticated successfully with payload:", authData);
          //Need to: change inner text of modal with info on login status
          initChat(authData);
        }
      });
    })

    // Initialize the chat 
    function initChat(authData) {
      var chat = new FirechatUI(ref, document.getElementById('firechat-wrapper'));
      chat.setUser(authData.uid, authData.password.email.substr(0, authData.password.email.indexOf('@')));  
    }
