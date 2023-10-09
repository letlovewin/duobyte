import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
      import { getDatabase,ref,set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
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
      const analytics = getAnalytics(app);
      const database = getDatabase();
      function ValidateEmail(text) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (text.match(validRegex)) {
          return true;
        } else {
          return false;
        }
      }
      function writeUserData(){
        console.log();
          const db = getDatabase();
          if (ValidateEmail($("#email").val())==true){
            
          }
          const reference = ref(db, 'users/' + $("#username").val());
          set(reference,{
              uesrname:$("#username").val(),
              email:$("#email").val(),
              password:$("#password").val()
          })
      }

      $("#signup-btn").on("click",function(e){
        writeUserData();
      })