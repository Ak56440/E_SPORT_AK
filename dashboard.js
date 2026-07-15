import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function loadDashboard() {

    const email = prompt("Enter your registered email");

    if (!email) {
        alert("Email is required.");
        return;
    }

    const snapshot = await getDocs(collection(db, "registrations"));

    let found = false;

    snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.email === email) {

            found = true;

            document.getElementById("playerName").textContent = data.captainName;
            document.getElementById("playerEmail").textContent = data.email;
            document.getElementById("tournamentName").textContent = data.tournamentTitle;
            document.getElementById("status").textContent = data.status;

            if (data.status === "Approved") {

                document.getElementById("roomId").textContent = data.roomId || "Not Assigned";
                document.getElementById("roomPassword").textContent = data.roomPassword || "Not Assigned";

            } else {

                document.getElementById("roomId").textContent = "Waiting for approval";
                document.getElementById("roomPassword").textContent = "Waiting for approval";

            }
        }

    });

    if (!found) {
        alert("No registration found for this email.");
    }

}

loadDashboard();

document.getElementById("logoutBtn").addEventListener("click", () => {
    location.href = "index.html";
});
