 // Create a new Firebase reference, and a new instance of the Login client
    var ref = new Firebase('https://scorching-inferno-8276.firebaseio.com/');

    //hide forms until button click
    $("#regWarning, #loginWarning, .login, .register").hide();
    //on click show the right form
    $("#signupButton").click(function (){
      $(".login").fadeIn(500);
      $(".register").hide();
    })
    $("#registerButton").click(function(){
      $(".register").fadeIn(500);
      $(".login").hide();
    })

    // New users: Creating a user account 
    $("#registerAction").click(function(e) {
      event.preventDefault();
      ref.createUser({
        email    : $("#registerUsername").val(),  
        password : $("#registerPassword").val(),
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          $("#regWarning").fadeIn(500).fadeOut(2400);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          //hide registration panel and show login panel
          $(".register").hide();
          $(".login").show();
        }
      });
    })

    // Access input from form and respond to click by initializing chat
    $("#loginAction").click(function(e) {
      event.preventDefault();
      ref.authWithPassword({
        email    : $("#loginEmail").val(), 
        password : $("#loginPassword").val()
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $("#loginWarning").fadeIn(500).fadeOut(2400);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          initChat(authData);
          $(".login, #logUser, .register, #registerButton, #signupButton").hide();
        }
      });
    })

    // Initialize the chat 
    function initChat(authData) {
      var chat = new FirechatUI(ref, document.getElementById('firechat-wrapper'));
      chat.setUser(authData.uid, authData.password.email.substr(0, authData.password.email.indexOf('@')));  
    }
