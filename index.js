// require('chromedriver');
// var webdriver = require('selenium-webdriver');
var firebase = require("firebase/app");
var auth = require("firebase/auth");
const axios = require('axios');

// firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2FX8u7Q_rgx5gi32730BEyrAxfD53DJ8",
  authDomain: "botapp-bb4b0.firebaseapp.com",
  databaseURL: "https://botapp-bb4b0-default-rtdb.firebaseio.com",
  projectId: "botapp-bb4b0",
  storageBucket: "botapp-bb4b0.appspot.com",
  messagingSenderId: "245702413811",
  appId: "1:245702413811:web:5d370f49db6db0a6f41686",
  measurementId: "G-PL69VSBB8X"
};

firebase.initializeApp(firebaseConfig);
firebase.auth().signInWithEmailAndPassword("sergiofollean@gmail.com", "5478372DjF");

require("./tasker.js");
require("./server.js");

// Just Sleep function
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
