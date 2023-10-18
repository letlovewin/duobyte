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

import { signOut, signInWithEmailAndPassword, connectAuthEmulator, getAuth, AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getStorage, connectStorageEmulator, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

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

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);
const auth = getAuth(firebaseApp);
//connectAuthEmulator(auth, "http://localhost:9099");
//connectStorageEmulator(storage, "127.0.0.1:9199");

let currentError = "";


const loginEmailPassword = async () => {
  const loginEmail = document.getElementById("email").value;
  const loginPassword = document.getElementById("password").value;

  if (validateEmail(loginEmail) == true) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
    }
    catch (error) {
      console.log(error.code)
      if (error.code == "auth/invalid-login-credentials") {
        currentError = "Invalid email or password.";
        document.getElementById('current-error-label').innerHTML = currentError;
      } else if (error.code == "auth/user-not-found") {
        currentError = `This email doesn't exist. <a href="signUp.html">Create a new account</a>?`;
        document.getElementById('current-error-label').innerHTML = currentError;
      }
    }
  } else {
    currentError = "Please enter a valid email.";
    document.getElementById('current-error-label').innerHTML = currentError;
  }
}

const createAccount = async () => {

  const loginEmail = document.getElementById("email").value;
  const loginPassword = document.getElementById("password").value;
  const loginUserName = document.getElementById("username").value;

  if (validateEmail(loginEmail) == true) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log(userCredential.user);
      onAuthStateChanged(auth, (user) => {
        updateProfile(user, { displayName: `${loginUserName}` });
      })
    }
    catch (error) {
      console.log(error.code)
      if (error.code == "auth/email-already-in-use") {
        currentError = "This email already exists.";
        document.getElementById('current-error-label').innerHTML = currentError;
      } else if (error.code == "auth/uid-already-exists") {
        // do nothing so far
      }
    }
  } else {
    currentError = "Please enter a valid email.";
  }
}

function forgotPassword(e) {
  e.preventDefault();
  if (validateEmail(document.getElementById("email").value) == true) {
    sendPasswordResetEmail((auth, document.getElementById("email").value))
      .then(() => {
        //Password reset email sent.
      })
      .catch((error) => {
        console.log(error.code);
      })

  } else if (document.getElementById("email").value == "") {
    currentError = "Please enter a valid email.";
    document.getElementById("current-error-label").innerHTML = currentError;
  }
}
function signUp(e) {
  e.preventDefault();
  createAccount()
    .then(monitorAuthStateAndRedirect());
}

onAuthStateChanged(auth, user => {
  if (user) {
    const data = JSON.stringify({
      uid:user.uid
    })
    fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/checkIfUserOnboarded", {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json;charset=UTF-8"
      }
    })
      .then(res => res.text())
      .then(tr => {
        if (tr.state == "user-doesnt-exist") {
          window.location.replace("onboarding.html");
        } else {
          window.location.replace("account.html");
        }
      })
  } else {
  }
})

document.getElementById("btn-signin").addEventListener("click", function (e) {
  e.preventDefault();
  loginEmailPassword()

})