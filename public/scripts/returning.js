import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyAXzjL21HzpSMWhTuHUrjKV-NcY8qjbnuU",
  authDomain: "duobyte-471b8.firebaseapp.com",
  databaseURL: "https://duobyte-471b8-default-rtdb.firebaseio.com",
  projectId: "duobyte-471b8",
  storageBucket: "duobyte-471b8.appspot.com",
  messagingSenderId: "739411745813",
  appId: "1:739411745813:web:274708422593bfc8dd421c",
  measurementId: "G-WV6LTNLTRB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
function validateEmail(text) {
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (text.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}
function validateUserName(text) {
  var validRegex = /^[a-zA-z0-9]+$/;
  if (text.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}
function writeUserData() {
  const db = getDatabase();
  if (validateEmail($("#email").val())==true){
    let parsed_email = $("#email").val().replace(/[^a-zA-Z0-9]/g,'');
    const emailRef = ref(db,'users/'+parsed_email+'/email');
    onValue(emailRef, (snapshot)=>{
      const pwRef = ref(db,'users/'+parsed_email+'/password');
      onValue(pwRef,(snapshot2)=>{
        if((snapshot.val()==null||snapshot2.val()==null)||(snapshot2.val()!=$("#password").val())) {
          if($("#email-error-dne").length==0){
            $("#main").append(`<p id="email-error-dne" class="error">Invalid email or password.</p>`);
          }
        } else if(snapshot2.val()==$("#password").val()) {
          console.log("Valid combination.");
        }
      })
    })
    /*
    
    */
  } else {
    if($("#email-error").length==0){
      $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
    }
  }
  
  
}

$("#signin-btn").on("click", function (e) {
  writeUserData();
})