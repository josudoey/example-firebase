const functions = require('firebase-functions')
const app = require('./app')()
exports['i'] = functions.https.onRequest(app.callback())
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
