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
                    if (tr == "user-doesnt-exist" && window.location.pathname != pathname_onboarding) {
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
                    } else if (tr == "user-doesnt-exist" && window.location.pathname == pathname_onboarding) {
                        fetch("http://127.0.0.1:5001/duobyte-471b8/us-central1/returnCourseInformation", {
                            method: "POST",
                            body: data,
                            headers: {
                                "Content-type": "application/json;charset=UTF-8"
                            }
                        })
                            .then(res => res.text())
                            .then(tr => {
                                let tr_parsed = JSON.parse(tr);
                                for (let i = 0; i < tr_parsed.length; i++) {
                                    let btn_select = document.createElement("button", { class: "btn btn-primary" });
                                    btn_select.innerHTML = tr_parsed[i]
                                    btn_select.addEventListener("click", function (e) {
                                        fetch("http://127.0.0.1:5001/duobyte-471b8/us-central1/onboardUser", {
                                            method: "POST",
                                            body: JSON.stringify({
                                                uid: `${user.uid}`,
                                                first_course: `${tr_parsed[i]}`
                                            }),
                                            headers: {
                                                "Content-type": "application/json;charset=UTF-8"
                                            }
                                        })
                                            .then(res => res.text())
                                            .then(tr => {
                                                if (tr == "onboarding-successful") {
                                                    monitorAuthStateAndOnboard();
                                                }
                                            })
                                    })
                                    document.getElementById("course-selection").appendChild(btn_select);
                                }
                            });
                    } else {
                        window.location.replace("dashboard.html")
                    }
                });
        } else {
            //Kick user back to signin
            window.location.replace("signin.html")
        }
    })
}

document.getElementById("btn-signup-redirect").addEventListener("click", function (e) {
    e.preventDefault();
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
                .then(res => res.text())
                .then(tr => {
                    if(tr=="N"){
                        window.location.replace("onboarding.html");
                    } else {
                        window.location.replace("dashboard.html");
                    }
                })
        } else {
            window.location.replace("signup.html");
        }
    })
})

document.getElementById("btn-signin-redirect").addEventListener("click", function (e) {
    e.preventDefault();
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
                .then(res => res.text())
                .then(tr => {
                    if(tr=="N"){
                        window.location.replace("onboarding.html");
                    } else {
                        window.location.replace("dashboard.html");
                    }
                })
        } else {
            window.location.replace("signin.html");
        }
    })
})