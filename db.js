const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');
const { initializeApp } = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyDlar35lAq55_2bqSN368h47Pw_qReNHA0",
    authDomain: "nshades-2a9e6.firebaseapp.com",
    projectId: "nshades-2a9e6",
    storageBucket: "nshades-2a9e6.appspot.com",
    messagingSenderId: "1192564836",
    appId: "1:1192564836:web:30843e6ff3192689b62771",
    measurementId: "G-6KGBK7D7SK"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
module.exports = {
  db: db,
  storage: storage
};
