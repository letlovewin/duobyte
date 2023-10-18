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
const auth = getAuth(firebaseApp);

let currentError = "";

onAuthStateChanged(auth, user => {
    if (user) {
        const data = JSON.stringify({
            uid: user.uid
        })
        fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/checkIfUserOnboarded", {
            method: "POST",
            body: data,
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(tr => {
                if (tr.state == "user-doesnt-exist") {
                    window.location.replace("onboarding.html");
                }
                document.getElementById("welcome-message-label").innerHTML=`Hi, ${user.displayName}.`;
            })
    } else {
        window.location.replace("signin.html");
    }
})


function signUserOut() {
    signOut(auth).then(() => {
        window.location.replace("signin.html")
    })
        .catch((error) => {
            console.log(error.code);
        })
}

document.getElementById("btn-signout").addEventListener("click",function(e){
    e.preventDefault();
    signUserOut();
})