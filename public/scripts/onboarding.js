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
const auth = getAuth(firebaseApp);

const updateOnboardingScreen = function (tr) {
    let tr_parsed = JSON.parse(tr);
    let tr_keys = Object.keys(tr_parsed);
    for (let i = 0; i < tr_keys.length; i++) {
        let btn_select = document.createElement("button");
        btn_select.className = "btn btn-primary";
        btn_select.innerHTML = tr_parsed[tr_keys[i]];
        btn_select.addEventListener("click", function (e) {
            e.preventDefault();
            fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/onboardUser", {
                method: "POST",
                body: JSON.stringify({
                    uid: `${user.uid}`,
                    first_course: `${tr_parsed[tr_keys[i]]}`
                }),
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                }
            })
                .then(res => res.text())
                .then(tr => {
                    if (tr == "onboarding-successful") {
                        window.location.reload();
                    }
                })
        })
        document.getElementById("course-selection").appendChild(btn_select);
    }
}

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
                    fetch("https://us-central1-duobyte-471b8.cloudfunctions.net/returnCourseInformation", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json;charset=UTF-8"
                        }
                    })
                        .then(res => res.text())
                        .then(tr => {
                            console.log(tr)
                            updateOnboardingScreen(tr);
                        });
                } else {
                    window.location.replace("account.html");
                }

            })
    } else {
        window.location.replace("signin.html");
    }
})


