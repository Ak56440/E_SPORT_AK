import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentList = document.getElementById("tournamentList");

async function loadTournaments() {

    tournamentList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "tournaments"));

    querySnapshot.forEach((doc) => {

        const tournament = doc.data();

        tournamentList.innerHTML += `
        <div class="card">
            <h3>${tournament.title}</h3>
            <p>📅 Date: ${tournament.date}</p>
            <p>💰 Prize Pool: ₹${tournament.prizePool}</p>
            <p>🎟 Entry Fee: ₹${tournament.entryFee}</p>
            <a href="register.html" class="btn">Join Tournament</a>
        </div>
        `;
    });

}

loadTournaments();
