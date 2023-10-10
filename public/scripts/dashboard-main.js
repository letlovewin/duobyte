const {createApp,ref}=Vue;

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

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    signOut,
    AuthErrorCodes,
    createUserWithEmailAndPassword,
    onAuthStateChanged
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

const monitorAuthState = async () =>  {
    onAuthStateChanged(auth, user => {
        if (user) {
            //console.log(user);
            if(user.displayName==null){
                const onloadingApp = createApp({
                    template:`<div class="container"><p>hello</p></div>`
                })
                onloadingApp.mount("#main")
            } else {
                $("#welcome-message").text(`Hi, ${user.displayName}!`)
            }
        } else {
            window.location.replace("index.html")
        }
    })
}

$("#footer").load("templates/footer.html");

$("#signout-btn").on("click", function (e) {
    signOut(auth).then(() => {
        window.location.replace("index.html")
    })
        .catch((error) => {
            console.log(error.code);
        })
})



monitorAuthState();

