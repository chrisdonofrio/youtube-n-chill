// Create a new Firebase reference, and a new instance of the Login client
var isInitialized = false;
var chatRef = new Firebase('https://scorching-inferno-8276.firebaseio.com/');
chatRef.onAuth(function(authData) {
// Once authenticated, instantiate Firechat with the user id and user name
  if (authData && !isInitialized) {
    initChat(authData);
  }
});

// Create new user
function registerUser() {
  var username = document.getElementById("registerUsername").value;
  var password = document.getElementById("registerPassword").value;
  chatRef.createUser({
    email    : username,
    password : password
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
  var username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;
  chatRef.authWithPassword({
    email    : username,
    password : password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
    }
  });
  return false;
}

function initChat(authData) {
  var chat = new FirechatUI(chatRef, document.getElementById('firechat-wrapper'));
  chat.setUser(authData.uid, authData[authData.provider].displayName);
}