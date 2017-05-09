$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyANnsQLYnlGGCm-q6Iv0F-61EHbVTBEN_M",
    authDomain: "fuckbb.firebaseapp.com",
    databaseURL: "https://fuckbb.firebaseio.com",
    projectId: "fuckbb",
    storageBucket: "fuckbb.appspot.com",
    messagingSenderId: "478202823871"
  };
  firebase.initializeApp(config);
  var dbRef= firebase.database().ref().child('object');
  const $email = $('#email');
    const $password = $('#password');
    const $btnSignIn = $('#btnSignIn');
    const $btnSignUp = $('#btnSignUp');
      const $btnSignOut = $('#btnSignOut');
      const $btnSubmit = $('#btnSubmit');
       const $messageField = $('#messageInput');
       const $messageList = $('#example-messages');
      const $btnProfile= $('#btnProfile');
      var dbChatRoom = firebase.database().ref().child('chatroom');
       var photoURL = "./image/default.jpg";
const $signInfo = $('#sign-info');
var dbUser = firebase.database().ref().child('User');
      $btnSignIn.click(function(e) {
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // SignIn
   const promise = auth.signInWithEmailAndPassword(email, pass);
   promise.catch(function(e) {
     console.log(e.message);
     $signInfo.html(e.message);
   });
   promise.then(function(e) {
     console.log("sign in suceesfully");
     $signInfo.html("sign in suceesfully");
     window.location.href = "./chatroom.html";
   });
 });

 //照片上傳

 var storageRef = firebase.storage().ref();
 function handleFileSelect(evt) {
   evt.stopPropagation();
   evt.preventDefault();
   var file = evt.target.files[0];

   var metadata = {
     'contentType': file.type
   };

   // Push to child path.
   // [START oncomplete]
   storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
     console.log('Uploaded', snapshot.totalBytes, 'bytes.');
     console.log(snapshot.metadata);
     photoURL = snapshot.metadata.downloadURLs[0];
     console.log('File available at', photoURL);
   }).catch(function(error) {
     // [START onfailure]
     console.error('Upload failed:', error);
     // [END onfailure]
   });
   // [END oncomplete]
 }
   window.onload = function () {
      $('#file').change(handleFileSelect);
    }
 // SignUp
 $btnSignUp.click(function(e) {
   const email = $email.val();
   const pass = $password.val();
   const auth = firebase.auth();
   const promise = auth.createUserWithEmailAndPassword(email, pass);
   promise.catch(function(e) {
     console.log(e.message);
     $signInfo.html(e.message);
   });
   promise.then(function(user) {
     console.log("SignUp user is" + user.uid);
     const dbUserid = dbUser.child(user.uid);
     dbUserid.set({
       email: email,
       username: "",
       occupation: "",
       age: "",
       description: "",
       photourl: photoURL,
       photoURL: ""

     });
     window.location.href = "./updateImfo.html";
   });
 });
 //profile
  function loadData(currentUser){
    var userId = firebase.auth().currentUser.uid;
    var dbUserInfo = firebase.database().ref('/User/' + userId);
    dbUserInfo.on("value", function(snapshot){
      var username = snapshot.val().username;
      var occupation = snapshot.val().occupation;
      var age = snapshot.val().age;
      var description = snapshot.val().description;
      var imageUrl = snapshot.val().photoURL;
      typeName = username;
      // console.log(username + "  " + occupation);
      $('#profile-name').html(username);
      $('#profile-email').html(currentUser.email);
      $('#profile-occupation').html(occupation);
      $('#profile-age').html(age);
      $('#profile-decription').html(description);
      $('img').attr("src", imageUrl);
    });
  };
  dbChatRoom.limitToLast(10).on('child_added', function (snapshot) {
      //GET DATA
      var data = snapshot.val();
      var username = data.username;
      var message = data.message;

      var uid = snapshot.val().uid;
      var user = firebase.auth().currentUser;
      // console.log(username + "<-");
      //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        var imageUrl = snapshot.val().photoURL;
      var $messageElement = $("<li>");
      const promise =user.updateProfile({
         photoURL:photoURL
       })
      var $image = $("<img>");
      $('img').attr("src", imageUrl);
      var loginUser;
        console.log(firebase.auth().currentUser.uid);
        console.log(firebase.database().ref('/users/' + user.uid));
      if (uid == firebase.auth().currentUser.uid){
             $messageElement.addClass('rightside');
             $messageElement.text(message);
           } else{
             var $senderImg = $("<img src='' class='chatroom-avatar'>");
             firebase.database().ref('/user/' + uid).once('value').then(function(snapshot) {
            //  $senderImg.attr('src', snapshot.val().photourl);
             });
             $messageElement.text(message).prepend($senderImg);
           }
      var $nameElement = $("<strong class='example-chat-username'></strong>");
      $nameElement.text(username + " : ");
      $messageElement.text(message).prepend($nameElement);
      $messageElement.prepend()
      //ADD MESSAGE
      $messageList.append($messageElement);

      //SCROLL TO BOTTOM OF MESSAGE LIST
      $messageList[0].scrollTop = $messageList[0].scrollHeight;
    });

    $messageField.keypress(function (e) {
      console.log("confirm click");
      if (e.keyCode == 13) {
        //FIELD VALUES
        var message = $messageField.val();
        console.log(typeName);
        console.log(message);
        //SAVE DATA TO FIREBASE AND EMPTY FIELD
        dbChatRoom.push({username: typeName, message: message});
        $messageField.val('');
      }
    });
 // Submit
 $btnSubmit.click(function() {
   var user = firebase.auth().currentUser;
   const dbUserid = dbUser.child(user.uid);
   const promise =user.updateProfile({
      photoURL:photoURL
    })

   dbUserid.update({
       username: $('#userName').val(),
       occupation: $('#occupation').val(),
       age: $('#age').val(),
       description: $('#decription').val(),
       photoURL: photoURL
   });
   typeName = $('#userName').val();
   window.location.href = "./profile.html";
 });

$btnProfile.click(function() {

  window.location.href="./chatroom.html";
});
$btnSignOut.click(function() {

  firebase.auth().signOut();
  window.location.href="./index.html";
});

 firebase.auth().onAuthStateChanged(function(user) {
    //需在這裏面做user 貌似是這裡會init
    if (user) {
      console.log(user);
      $signInfo.html(user.email + " is login...");

      var user = firebase.auth().currentUser;
      const dbUserid = dbUser.child(user.uid);
      loadData(user);
      // console.log(dbUser.child(user.uid) + "31231");
      // const dbUserid = dbUser.child(user.uid);
      user.providerData.forEach(function(profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
        console.log("  User.uid: " + user.uid);
      });
    } else {
      console.log("not logged in");
    }
  });
});
