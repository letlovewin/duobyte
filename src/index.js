// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
function writeUserData(userId,name,email,imageUrl){
    const db = getDatabase();
    const reference = ref(db, 'users/' + userId);
    
    set(reference,{
        uesrname:name,
        email:email,
        profile_picture:imageUrl
    })
}

writeUserData("letlovewin","gray","updatedportughalam@gmail.com","imageurlblahblah");