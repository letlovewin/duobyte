/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
//const { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } = require("firebase/auth")
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase, ref, set, onValue } = require("firebase-admin/database");

const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();

//http://127.0.0.1:9000/?ns=duobyte-471b8
//https://duobyte-471b8-default-rtdb.firebaseio.com
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

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const db = getDatabase();

exports.checkIfUserOnboarded = functions.https.onRequest((req, res) => {
    cors(req,res,()=>{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        logger.info(req.body);
        const cur_data = req.body;
        const reference = db.ref('users/' + cur_data.uid);
        reference.on('value', (snapshot) => {
            if (snapshot.exists()) {
                res.status(201).send("user-exists");
            } else {
                res.status(201).send("user-doesnt-exist");
            }
        })
    })
})

exports.returnCourseInformation = functions.https.onRequest((req,res)=>{
    cors(req,res,()=>{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        //we have course data in courses/
        const reference = db.ref('courses');
        reference.on('value',(snapshot)=>{
            if(snapshot.exists()){
                res.status(201).json(snapshot.toJSON());
            } else {
                res.status(500).send("snapshot-doesnt-exist");
            }
        })
    })
})

exports.onboardUser = functions.https.onRequest((req,res)=>{
    cors(req,res,()=>{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        logger.info(req.body);
        const cur_data = req.body;
        const reference = db.ref('users/' + cur_data.uid);
        reference.on('value', (snapshot) => {
            if (snapshot.exists()) {
                res.status(201).send("user-already-onboarded");
            } else {
                let uid = cur_data.uid;
                let first_course = cur_data.first_course;
                try {
                    db.ref('users').set({
                        uid: {
                            courses: {first_course}
                        }
                    })
                    .then(()=>{
                        res.status(201).send("onboarding-successful")
                    })
                }
                catch(error) {
                    res.status(500).send(error.code);
                }
            }
        })
    })
    
    
})