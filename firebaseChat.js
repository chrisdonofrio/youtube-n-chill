// Create a new Firebase reference, and a new instance of the Login client
var chatRef = new Firebase('https://scorching-inferno-8276.firebaseio.com/');

//Create seperate divs for each form
//hide the divs right away
//use buttons to deploy the div needed
//then immediately hide button

// Creating a user account -->Currently logging registration, but throwing an error in console (uncaught typeError... Cannot read property 'uid' of undefined.)
function registerUser() {
  var username = $("#registerUsername").val();
  var password = $("#registerPassword").val();
  chatRef.createUser({
    email    : username, //a function being based an object with the two variables holding the information from the form
    password : password
  }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}

// Login user ---> This is currently working without issue
function loginUser() {
  var username = $("#loginUsername").val();
  var password = $("#loginPassword").val();
  chatRef.authWithPassword({
    email    : username,
    password : password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      initChat(authData);
    }
  });
}

//Gonna need this to initialize the chat (currently initializing on login, but not functioning)
function initChat(authData) {
  var chat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
  chat.setUser(authData.uid, authData[authData.provider].displayName);
}