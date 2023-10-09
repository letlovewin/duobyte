/*
  if($("#email-error").length==0){
            $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
        }

    if($("#email-error-dne").length==0){
                $("#main").append(`<p id="email-error-dne" class="error">Invalid email or password.</p>`);
            }
*/

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

import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAXzjL21HzpSMWhTuHUrjKV-NcY8qjbnuU",
  authDomain: "duobyte-471b8.firebaseapp.com",
  databaseURL: "http://127.0.0.1:9000/?ns=duobyte-471b8",
  projectId: "duobyte-471b8",
  storageBucket: "duobyte-471b8.appspot.com",
  messagingSenderId: "739411745813",
  appId: "1:739411745813:web:274708422593bfc8dd421c",
  measurementId: "G-WV6LTNLTRB"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp)
//connectAuthEmulator(auth, "http://localhost:9099");



const loginEmailPassword = async () => {
  const loginEmail = $("#email").val();
  const loginPassword = $("#password").val();

  if (validateEmail(loginEmail) == true) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
    }
    catch (error) {
      console.log(error.code)
      if (error.code == AuthErrorCodes.INVALID_PASSWORD || error.code == AuthErrorCodes.INVALID_EMAIL) {
        if ($("#email-error-dne").length == 0) {
          $("#main").append(`<p id="email-error-dne" class="error">Invalid email or password.</p>`);
        }
      }
    }
  } else {
    if ($("#email-error").length == 0) {
      $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
    }
  }
}

const createAccount = async () => {
  const loginEmail = $("#email").val();
  const loginUserName = $("#username").val();
  const loginPassword = $("#password").val();
  if (validateEmail(loginEmail) == true) {
    if (validateUserName(loginUserName) == true) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log(userCredential.user);
        onAuthStateChanged(auth,(user)=>{
          user.updateProfile({
            displayName: `${loginUserName}`
          })
        })
      }
      catch (error) {
        console.log(error.code)
        if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
          if ($("#email-exist-error").length == 0) {
            $("#main").append(`<p id="email-exist-error" class="error">This email already exists. <a href="signin.html">Sign in</a>?</p>`);
          }
        }
      }
    } else {
      if ($("#user-error").length == 0) {
        $("#main").append(`<p id="user-error" class="error">Please enter a valid username. Alphanumeric characters only, no spaces.</p>`);
      }
    }

  } else {
    if ($("#email-error").length == 0) {
      $("#main").append(`<p id="email-error" class="error">Please enter a valid email.</p>`);
    }
  }
}

const monitorAuthState = async () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      //console.log(user);
      window.location.replace("dashboard.html")
    } else {
      console.log("User isn't logged in!")
    }
  })
}



$("#footer").load("templates/footer.html")

$("#signup-btn").on("click", function (e) {
  e.preventDefault();
  createAccount()
    .then(monitorAuthState());
})

$("#signin-btn").on("click", function (e) {
  e.preventDefault();
  loginEmailPassword()
    .then(monitorAuthState());
})

$("#signout-btn").on("click", function (e) {
  signOut(auth).then(()=>{
    window.location.replace("index.html")
  })
  .catch((error)=>{
    console.log(error.code);
  })
})