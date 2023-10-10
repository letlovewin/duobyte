const { createApp, ref } = Vue;

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
    onAuthStateChanged,
    updateProfile
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

const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            //console.log(user);
            if (user.displayName == null) {
                const onboardingApp = createApp({
                    data() {
                        return {
                            pfp_url: '',
                        }
                    },
                    /*
<div id="image-input-group">
                        <img src="" class="pfp-thumb img-thumbnail " id="pfp-preview-img">
                        <button @click="photoSelect" type="button" class="btn btn-primary rounded-pill m-1"
                          id="profile-photo-select-btn">Select a profile photo</button>
                      </div>
                    */
                    template: `
                    <div class="card position-absolute top-50 start-50 translate-middle" style="width:14rem;height:15rem;">
                    <input type="file" accept="image/*" style="display:none" id="pfp-input-hidden">
                    <div class="card-body">
                      <h6 class="text-center">Welcome to duoByte.</h6>
                      <p class="text-center">We're just gonna need a few things from you.</p>
                      <div class="input-group position-absolute top-50 start-50 translate-middle p-2">
                        <input type="text" class="form-control" placeholder="Username" aria-label="Username"
                          aria-describedby="button-addon2" id="username-input">
                        <button @click="usernameOnBoard" class="btn btn-outline-primary" type="button" id="button-addon2"><svg
                            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                          </svg></button>
                      </div>
                    </div>
                  </div>
                  `,
                    methods: {
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
                        usernameOnBoard() {
                            updateProfile(auth.currentUser,{
                                displayName: `${document.getElementById("username-input").value}`
                            }).then(()=>{
                                console.log("Success")
                            }).catch((error)=>{
                                console.log(error.code);
                            })
                        }
                    }
                })
                onboardingApp.mount("#main")
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


