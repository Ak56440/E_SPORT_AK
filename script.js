import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamName = document.getElementById("teamName").value;
    const captainName = document.getElementById("captainName").value;
    const captainUID = document.getElementById("captainUID").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const tournamentTitle = document.getElementById("tournamentTitle").value;
    const transactionId = document.getElementById("transactionId").value;
    const paymentLink = document.getElementById("paymentLink").value;

    try {

        await addDoc(collection(db, "registrations"), {

            teamName,
            captainName,
            captainUID,
            mobile,
            email,
            tournamentTitle,

            transactionId,
            paymentLink,

            status: "Pending",

            createdAt: serverTimestamp()

        });

        alert("✅ Registration Successful!");

        form.reset();

    } catch (error) {

        alert("❌ Error: " + error.message);

    }
});
