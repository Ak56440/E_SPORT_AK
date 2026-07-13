import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentForm = document.getElementById("tournamentForm");
const tableBody = document.getElementById("tableBody");

// Save tournament
tournamentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const entryFee = document.getElementById("entryFee").value;
    const prizePool = document.getElementById("prizePool").value;

    try {
        await addDoc(collection(db, "tournaments"), {
            title,
            date,
            entryFee,
            prizePool
        });

        alert("Tournament Created Successfully!");

        tournamentForm.reset();

    } catch (error) {
        alert(error.message);
    }
});

// Load registered teams
async function loadTeams() {
    const querySnapshot = await getDocs(collection(db, "registrations"));

    tableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const team = doc.data();

        tableBody.innerHTML += `
        <tr>
            <td>${team.teamName}</td>
            <td>${team.captainName}</td>
            <td>${team.captainUID}</td>
            <td>${team.mobile}</td>
            <td>${team.email}</td>
        </tr>
        `;
    });
}

loadTeams();
