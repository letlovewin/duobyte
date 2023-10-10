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
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { ref, h } from 'https://unpkg.com/vue@3/dist/vue.global.js';


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

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");

const storage = getStorage(firebaseApp);

let currentError = ref("");
let welcomeMessage = ref("");

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
      if (error.code == AuthErrorCodes.INVALID_PASSWORD || error.code == AuthErrorCodes.INVALID_EMAIL) {
        currentError.value = "Invalid email or password.";
      } else if(error.code==AuthErrorCodes.USER_NOT_FOUND) {
        currentError.value = `This email doesn't exist. <a href="signUp.html">Create a new account</a>?`;
      }
    }
  } else {
    currentError.value = "Please enter a valid email.";
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
        onAuthStateChanged(auth,(user)=>{
          updateProfile(user,{displayName:`${loginUserName}`});
        })
      }
      catch (error) {
        console.log(error.code)
        if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
          currentError.value = "This email already exists.";
        } else if(error.code == AuthErrorCodes.UID_ALREADY_EXISTS) {
          // do nothing so far
        }
      }
  } else {
    currentError.value = "Please enter a valid email.";
  }
}

const monitorAuthStateAndRedirect = async () => { //Don't want to let a signed in user see the sign-in or create account page.
  onAuthStateChanged(auth, user => {
    if (user) {
      //console.log(user);
      window.location.replace("dashboard.html")
    } else {
      console.log("User isn't logged in!")
    }
  })
}

const monitorAuthStateAndOnboard = async () => {
  onAuthStateChanged(auth, user => {
      if (user) {
          const storage = getStorage(firebaseApp);
          const welcome_message = h('h6',`Welcome to duoByte, ${user.displayName}.`,{class:"text-center"});
          const info_caption = h('')
          const card_body = h('div',{class:"card-body"},[
            welcome_message,
            h('p',`We're just gonna need a few things from you.`,{class:"text-center"})
          ]);
          const card_node = h('div',{style:"width:14rem;height:15rem;",class:"card position-absolute top-50 start-50 translate-middle"},[card_body]);
          if (user.displayName == null) {
              const onboardingApp = createApp({
                  data() {
                      return {
                          pfp_url: '',
                      }
                  },
                  template: card_body,
              })
              //onboardingApp.mount("#main")
          } else {
              welcomeMessage.value = `Hi, ${user.displayName}!`;
          }
      } else {
          window.location.replace("index.html")
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
  signOut(auth).then(()=>{
    window.location.replace("signin.html")
  })
  .catch((error)=>{
    console.log(error.code);
  })
}

$("#footer").load("templates/footer.html")