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
const cors = require('cors')({origin:true});
const app = express();

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
initializeApp(firebaseConfig);
const db = getDatabase();

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

exports.validateUserData = functions.https.onRequest((req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    logger.info(req.body);
    const cur_data = req.body;
    if (validateEmail(cur_data.email) == true) {
        let parsed_email = cur_data.email.replace(/[^a-zA-Z0-9]/g, '');
        const emailRef = db.ref('users/' + parsed_email + '/email');
        emailRef.on('value', (snapshot) => {
            const pwRef = db.ref('users/' + parsed_email + '/password');
            pwRef.on('value', (snapshot2) => {
                if ((snapshot.val() == null || snapshot2.val() == null) || (snapshot2.val() != cur_data.password)) {
                    res.send("IEOP")
                } else if (snapshot2.val() == $("#password").val()) {
                    res.send("EPS");
                }
            })
        })
    } else {
        res.send("IVE")
    }
})

exports.writeUserData = functions.https.onRequest((req, res) => {
    cors(req,res,()=>{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST"
        });
        logger.info(req.body);
        const cur_data = req.body;
        if (validateEmail(cur_data.email) == true) { //checking if email is valid xxxx@xxx.xxx
            if (validateUserName(cur_data.username) == true) { //checking if username is valid (only alphanumeric characters)
                let parsed_email = cur_data.email.replace(/[^a-zA-Z0-9]/g, ''); //parsing email abcd@efg.hijk -> abcdefghijk because firebase doesn't allow the former as a key
                const reference = db.ref('users/' + parsed_email);
                reference.on('value', (snapshot) => {
                    if (snapshot.exists()) {
                        res.status(201).send("EAE");
                        logger.info("EAE");
                    } else {
                        reference.set({
                            username: cur_data.username,
                            email: cur_data.email,
                            password: cur_data.password //add hashing function later, this is very insecure
                        }) //adding to database 
                        logger.info("EDNE");
                        res.status(201).send("EDNE");
                         //and then return success
                    }
                })
            } else {
                res.status(201).send("IU");
            }
        } else {
            res.status(201).send("IE");
        }
    })
    
})
