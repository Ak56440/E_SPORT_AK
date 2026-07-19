import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

await setDoc(doc(db, "users", userCredential.user.uid), {

    uid: userCredential.user.uid,

    name: name,

    email: email,

    diamonds: 0,

    totalTopup: 0,

    totalSpent: 0,

    createdAt: serverTimestamp()

});

        alert("✅ Account Created Successfully!");

        window.location.href = "player-login.html";

    } catch (error) {
        alert(error.message);
    }

});
