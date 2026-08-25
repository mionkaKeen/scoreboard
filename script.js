javascript
// =========================
// Firebase
// =========================

import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// =========================
// Login Functions
// =========================

async function login() {

    console.log("LOGIN BUTTON CLICKED");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter a username and password.");
        return;
    }

    try {

        // Firebase Authentication uses email/password.
        // If your username is actually an email address,
        // this will work directly.

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                username,
                password
            );

        const user = userCredential.user;

        console.log("Firebase Login:", user);


        // =========================
        // Get User Information
        // =========================

        const userRef = doc(
            db,
            "USERS",
            user.uid
        );

        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {

            console.error("User profile not found.");

            await signOut(auth);

            alert("Login Denied");
            return;
        }

        const userData = userSnapshot.data();

        console.log("User Data:", userData);


        // =========================
        // Check Admin
        // =========================

        if (userData.role !== "admin") {

            await signOut(auth);

            alert("Admin access required.");
            return;
        }


        // =========================
        // Save Session Information
        // =========================

        sessionStorage.setItem(
            "userId",
            user.uid
        );

        sessionStorage.setItem(
            "username",
            userData.username || username
        );

        sessionStorage.setItem(
            "name",
            userData.Name || ""
        );

        sessionStorage.setItem(
            "role",
            userData.role || ""
        );


        // =========================
        // Login Successful
        // =========================

        alert("Login OK");

        window.location.href = "scorer.html";

    } catch (error) {

        console.error("Login Error:", error);

        alert("Login Denied");
    }
}


// =========================
// Logout
// =========================

async function logout() {

    try {

        await signOut(auth);

        sessionStorage.clear();

        window.location.href = "index.html";

    } catch (error) {

        console.error("Logout Error:", error);
    }
}


// =========================
// Guest Mode
// =========================

function continueAsGuest() {

    sessionStorage.setItem(
        "guestMode",
        "true"
    );

    window.location.href = "scoreboard.html";
}


function logoutGuest() {

    sessionStorage.clear();

    window.location.href = "index.html";
}


// =========================
// Volleyball Scoring
// =========================

let scoreA = 0;
let scoreB = 0;


// =========================
// Update Display
// =========================

function updateDisplay() {

    const scoreAElement =
        document.getElementById("scoreA");

    const scoreBElement =
        document.getElementById("scoreB");


    if (!scoreAElement || !scoreBElement) {
        return;
    }


    scoreAElement.textContent = scoreA;
    scoreBElement.textContent = scoreB;
}


// =========================
// Change Score
// =========================

async function changeScore(team, amount) {

    if (team === "A") {
        scoreA += amount;
    }

    if (team === "B") {
        scoreB += amount;
    }


    // Prevent negative scores

    if (scoreA < 0) {
        scoreA = 0;
    }

    if (scoreB < 0) {
        scoreB = 0;
    }


    updateDisplay();

    await saveScore();
}


// =========================
// Reset Scores
// =========================

async function resetScores() {

    scoreA = 0;
    scoreB = 0;

    updateDisplay();

    await saveScore();
}


// =========================
// Firebase Score Storage
// =========================

// Instead of:
// const currentMatchId = 1;

const currentMatchId = "match_1";


// =========================
// Load Score
// =========================

async function loadScore() {

    try {

        const scoreRef = doc(
            db,
            "scores",
            currentMatchId
        );

        const scoreSnapshot =
            await getDoc(scoreRef);


        if (!scoreSnapshot.exists()) {

            console.log(
                "No score found."
            );

            scoreA = 0;
            scoreB = 0;

            updateDisplay();

            return;
        }


        const data =
            scoreSnapshot.data();


        console.log(
            "Score Loaded:",
            data
        );


        scoreA =
            data.team_a_score || 0;

        scoreB =
            data.team_b_score || 0;


        updateDisplay();

    } catch (error) {

        console.error(
            "Error loading score:",
            error
        );
    }
}


// =========================
// Save Score
// =========================

async function saveScore() {

    try {

        const scoreRef = doc(
            db,
            "scores",
            currentMatchId
        );


        await updateDoc(
            scoreRef,
            {
                team_a_score: scoreA,
                team_b_score: scoreB
            }
        );


        console.log(
            "Score Saved"
        );

    } catch (error) {

        console.error(
            "Error saving score:",
            error
        );
    }
}


// =========================
// Make Functions Global
// =========================
//
// Because script.js is now a module,
// HTML onclick="..." cannot automatically
// see these functions.
//
// Therefore we attach them to window.

window.login = login;

window.logout = logout;

window.continueAsGuest =
    continueAsGuest;

window.logoutGuest =
    logoutGuest;

window.changeScore =
    changeScore;

window.resetScores =
    resetScores;


// =========================
// Load Score Only On Scorer Page
// =========================

if (
    document.getElementById("scoreA") &&
    document.getElementById("scoreB")
) {

    loadScore();

    setInterval(
        loadScore,
        3000
    );
}
```
