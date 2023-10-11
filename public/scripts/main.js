/*photoSelect() {
                          document.getElementById("pfp-input-hidden").click();
                          let file = document.getElementById("pfp-input-hidden").files[0];
                          const reader = new FileReader();
                          reader.onload = function(e) {
                              let image = document.getElementById("pfp-preview-img");
                              image.src = e.target.result;
                          }
                          console.log(reader.readAsDataURL(file))
                      }*/

/*
  This file interacts with our Firebase backend and makes everything run smoothly.
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

import { signInWithEmailAndPassword, connectAuthEmulator, getAuth, AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getStorage, connectStorageEmulator, ref } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

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
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);
const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");
connectStorageEmulator(storage, "127.0.0.1:9199");

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

const monitorAuthStateAndRedirect = async () => { //Don't want to let a signed in user see the sign-in or create account page.
  onAuthStateChanged(auth, user => {
    if (user) {

      window.location.replace("dashboard.html")
    }
  })
}

const monitorAuthStateAndOnboard = async () => {
  console.log(`hello ${window.location.pathname}`);
  onAuthStateChanged(auth, user => {
    if (user) {
      const userFolderRef = ref(storage,`users/${user.uid}`);
      
        
    } else {
      //Kick user back to signin
      window.location.replace("signin.html")
    }
  })
}



function signUp(e) {
  e.preventDefault();
  createAccount()
    .then(monitorAuthStateAndRedirect());
}

function signIn(e) {
  e.preventDefault();
  loginEmailPassword()
    .then(monitorAuthStateAndRedirect());
}

function signOut(e) {
  e.preventDefault();
  signOut(auth).then(() => {
    window.location.replace("signin.html")
  })
    .catch((error) => {
      console.log(error.code);
    })
}



switch (window.location.pathname) {
  case "/signin":
    monitorAuthStateAndRedirect();
    document.getElementById("btn-signin").addEventListener("click", signIn);
    break;
  case "/signup":
    monitorAuthStateAndRedirect();
    document.getElementById("btn-signup").addEventListener("click", signUp);
    break;
  case "/onboarding":
    monitorAuthStateAndOnboard();
    break;
  case "/dashboard":
    monitorAuthStateAndOnboard();
    document.getElementById("btn-signout").addEventListener("click",signOut);
    break;
}

const client = new XMLHttpRequest();
client.open('GET', './templates/footer.html');
client.onreadystatechange = function () {
  document.getElementById("footer").innerHTML = client.responseText;
}
client.send();