// Your Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  var auth = firebase.auth();
  
  $(document).ready(function() {
    // Elements
    var loginForm = $('#login-form');
    var chatContainer = $('#chat-container');
    var chatBox = $('#chat-box');
    var messageForm = $('#message-form');
    var emailInput = $('#email');
    var passwordInput = $('#password');
    var messageInput = $('#message');
    var loginBtn = $('#login-btn');
    var registerBtn = $('#register-btn');
    var logoutBtn = $('#logout-btn');
  
    // Email validation regex
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Login
    loginBtn.click(function(event) {
      event.preventDefault();
      var email = emailInput.val();
      var password = passwordInput.val();
      if (!emailPattern.test(email)) {
        alert('Invalid email format');
        return;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          loginForm.hide();
          chatContainer.show();
          loadMessages();
        })
        .catch(error => {
          alert(error.message);
        });
    });
  
    // Register
    registerBtn.click(function(event) {
      event.preventDefault();
      var email = emailInput.val();
      var password = passwordInput.val();
      if (!emailPattern.test(email)) {
        alert('Invalid email format');
        return;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      auth.createUserWithEmailAndPassword(email, password)
        .then(user => {
          alert('Registration successful!');
        })
        .catch(error => {
          alert(error.message);
        });
    });
  
    // Logout
    logoutBtn.click(function() {
      auth.signOut().then(() => {
        chatContainer.hide();
        loginForm.show();
      });
    });
  
    // Send message
    messageForm.submit(function(event) {
      event.preventDefault();
      var message = messageInput.val();
      var user = auth.currentUser;
      db.collection('messages').add({
        text: message,
        user: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        messageInput.val('');
      }).catch(error => {
        alert(error.message);
      });
    });
  
    // Load messages
    function loadMessages() {
      db.collection('messages').orderBy('timestamp')
        .onSnapshot(snapshot => {
          chatBox.html('');
          snapshot.forEach(doc => {
            var message = doc.data();
            chatBox.append(`<div><strong>${message.user}:</strong> ${message.text}</div>`);
          });
          chatBox.scrollTop(chatBox[0].scrollHeight);
        });
    }
  });
  
