import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "player-login.html";
        return;
    }

    document.getElementById("playerName").textContent =
        user.displayName || "Player";

    document.getElementById("playerEmail").textContent =
        user.email;

    const snapshot = await getDocs(collection(db, "registrations"));

    snapshot
