import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tableBody = document.getElementById("tableBody");

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
