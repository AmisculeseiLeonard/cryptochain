var firebase = require('firebase')

var firebaseConfig = {
    apiKey: "AIzaSyByXvHE29ng51qKi6GyF-xpa5J3UrJjFRc",
    authDomain: "cryptochain-8c4ec.firebaseapp.com",
    projectId: "cryptochain-8c4ec",
    storageBucket: "cryptochain-8c4ec.appspot.com",
    messagingSenderId: "776852831068",
    appId: "1:776852831068:web:8203598880d025f32c5f99",
    measurementId: "G-KETGLLNZNM"
};

firebase.initializeApp(firebaseConfig)

let database = firebase.database()

module.exports = { database };