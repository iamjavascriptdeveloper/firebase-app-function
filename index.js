const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require('express');
const app = express();
require('dotenv').config()

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cors')())

app.use('/api', require('./api'));

app.get('/', (req, res) => {
    res.send('running!')
})

app.listen( PORT, () => {
    console.log( `listen to port ${PORT}`)
})

exports.app = functions.https.onRequest(app);