javascript


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAxeuvh24T3ZJkV2x-QcNxh8QritKqWqZE",
  authDomain: "livescoreboard-5194b.firebaseapp.com",
  projectId: "livescoreboard-5194b",
  storageBucket: "livescoreboard-5194b.firebasestorage.app",
  messagingSenderId: "555090260425",
  appId: "1:555090260425:web:23563595fe0b7a94b5b818",
  measurementId: "G-ZW34VNG8LB"
};

const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };

console.log("Firebase connected");

