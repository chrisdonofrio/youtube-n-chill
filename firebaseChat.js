 // Create a new Firebase reference, and a new instance of the Login client
    var ref = new Firebase('https://scorching-inferno-8276.firebaseio.com/');

    //Start: Two buttons. New user triggering the registration & login triggering email/password field
    $("#regWarning, #loginWarning").hide();
    $(".login, .register").hide();
    $("#logUser").click(function (){
      $(".login").fadeIn(500);
    })

    $("#registerUser").click(function(){
      $(".register").fadeIn(500);
    })

    // Initialize the chat 
    function initChat(authData) {
      var chat = new FirechatUI(ref, document.getElementById('firechat-wrapper'));
      chat.setUser(authData.uid, authData.password.email.substr(0, authData.password.email.indexOf('@')));  
    }

    // Creating a user account 
    $("#registerAction").click(function(e) {
      event.preventDefault();
      ref.createUser({
        email    : $("#registerUsername").val(),  
        password : $("#registerPassword").val(),
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          $("#regWarning").fadeIn(1200).fadeOut(800);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          //hide registration panel and show login panel
          $(".registration").hide();
          $(".login").show();
        }
      });
    })

    // Login user 
    $("#loginAction").click(function(e) {
      event.preventDefault();
      ref.authWithPassword({
        email    : $("#loginEmail").val(), 
        password : $("#loginPassword").val()
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          $("#loginWarning").fadeIn(1200).fadeOut(800);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          initChat(authData);
          $(".login, #logUser, #registerUser").hide();
          //grab div with login panel and hide it
        }
      });
    })
