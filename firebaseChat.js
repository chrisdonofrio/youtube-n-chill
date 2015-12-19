var chatRef = new Firebase("https://scorching-inferno-8276.firebaseio.com/");
      var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
      chatRef.onAuth(function(authData) {
        if (authData) {
          chat.setUser(authData.uid, "Anonymous" + authData.uid.substr(10, 8));
        } else {
          chatRef.authAnonymously(function(error, authData) {
            if (error) {
              console.log(error);
            }
          });
        }
      });