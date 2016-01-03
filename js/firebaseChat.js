 // Create a new Firebase reference, and a new instance of the Login client
    var ref = new Firebase('https://scorching-inferno-8276.firebaseio.com/');

    // New users: Creating a user account 
    $("#registerAction").click(function(e) {
      event.preventDefault();
      ref.createUser({
        email    : $("#registerUsername").val(),  
        password : $("#registerPassword").val(),
      }, function(error, userData) {
        if (error) {
          $("#regErrorMessage").html(error);
          console.log("Error creating user:", error);
          //Need to: improve error message
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          $("#registrationModalLabel").html("Welcome! Login, watch videos, start chatting!")
          $("#registrationForm").hide();
          //Need to: change inner text of modal with info on registration status
        }
      });
    })
  
    // User Login: triggering the chat to initialize
    $("#loginAction").click(function(e) {
      event.preventDefault();
      var loginEmail = $("#loginEmail").val();
      var loginPassword = $("#loginPassword").val();
      //Firechat function that kicks off authentication
      ref.authWithPassword({
        email    : loginEmail, 
        password : loginPassword
      }, function(error, authData) {
        if (error) {
          $("#loginErrorMessage").html(error);
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $("#loginModalLabel").html("Login successful! You're ready to chat");
          $("#loginForm").hide();
          initChat(authData);
        }
      });
    })

    // Initialize the chat 
    function initChat(authData) {
      var chat = new FirechatUI(ref, document.getElementById('firechat-wrapper'));
      chat.setUser(authData.uid, authData.password.email.substr(0, authData.password.email.indexOf('@')));  
    }
