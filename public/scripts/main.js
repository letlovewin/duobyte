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

let pathname_onboarding = "/public/onboarding.html";
let pathname_dashboard = "/public/dashboard.html";
let pathname_signup = "/public/signUp.html";
let pathname_signin = "/public/signin.html";
let pathname_index = "/";



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

import { signOut, signInWithEmailAndPassword, connectAuthEmulator, getAuth, AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
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

function checkIfFileExists(filePath) {
  getDownloadURL(ref(storage, filePath))
    .then(url => {
      return Promise.resolve(true);
    })
    .catch(error => {
      if (error.code === 'storage/object-not-found') {
        return Promise.resolve(false);
      } else {
        return Promise.reject(error);
      }
    });
}

const monitorAuthStateAndRedirect = async () => { //Don't want to let a signed in user see the sign-in or create account page.
  onAuthStateChanged(auth, user => {
    if (user) {
      const data = JSON.stringify({
        uid: `${user.uid}`,
      });
      fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/checkIfUserOnboarded", {
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        }
      })
        .then(res => res.text())
        .then(tr => {
          if (tr == "N" && window.location.pathname != pathname_onboarding) {
            window.location.replace("onboarding.html")
          } else {
            window.location.replace("dashboard.html")
          }
        });


    } else {
      //Kick user back to signin
      if (window.location.hostname == pathname_dashboard || window.location.hostname == pathname_onboarding || window.location.hostname == "learn")
        window.location.replace("signin.html")
    }
  })
}

const monitorAuthStateAndOnboard = async () => {
  //console.log(`hello ${window.location.pathname}`);
  onAuthStateChanged(auth, user => {
    if (user) {
      const data = JSON.stringify({
        uid: `${user.uid}`,
      });
      fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/checkIfUserOnboarded", {
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json;charset=UTF-8"
        }
      })
        .then(res => res.text())
        .then(tr => {
          if (tr == "user-doesnt-exist" && window.location.pathname != pathname_onboarding) {
            window.location.replace("onboarding.html")
          } else {
            fetch("http://127.0.0.1:5001/duobyte-471b8/us-central1/returnCourseInformation", {
              method: "POST",
              body: data,
              headers: {
                "Content-type": "application/json;charset=UTF-8"
              }
            })
              .then(res => res.text())
              .then(tr=>console.log(tr));
          }
        });


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

function signUserOut(e) {
  e.preventDefault();
  signOut(auth).then(() => {
    window.location.replace("signin.html")
  })
    .catch((error) => {
      console.log(error.code);
    })
}

switch (window.location.pathname) {
  case pathname_signin:
    monitorAuthStateAndRedirect();
    document.getElementById("btn-signin").addEventListener("click", signIn);
    break;
  case pathname_signup:
    monitorAuthStateAndRedirect();
    document.getElementById("btn-signup").addEventListener("click", signUp);
    break;
  case pathname_onboarding:
    monitorAuthStateAndOnboard();
    break;
  case pathname_dashboard:
    monitorAuthStateAndOnboard();
    document.getElementById("btn-signout").addEventListener("click", signUserOut);
    break;
}

/*
const client = new XMLHttpRequest();
client.open('GET', './templates/footer.html');
client.onreadystatechange = function () {
  document.getElementById("footer").innerHTML = client.responseText;
}
client.send();
*/