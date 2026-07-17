import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        await addDoc(collection(db, "registrations"), {

            teamName: document.getElementById("teamName").value,
            captainName: document.getElementById("captainName").value,
            captainUID: document.getElementById("captainUID").value,
            mobile: document.getElementById("mobile").value,
            email: document.getElementById("email").value,
            tournament: document.getElementById("tournamentTitle").value,
            transactionId: document.getElementById("transactionId").value,

            status: "Pending",
            createdAt: serverTimestamp()

        });

        document.getElementById("successPopup").style.display = "flex";

form.reset();

document.getElementById("okBtn").onclick = () => {

    window.location.href = "index.html";

};

    } catch (error) {

        alert("Registration failed: " + error.message);

    }

});
