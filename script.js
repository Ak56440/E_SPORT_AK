import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// ================= LOAD TOURNAMENTS =================

async function loadTournaments() {

    const tournamentList = document.getElementById("tournamentList");
    tournamentList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "tournaments"));

    document.getElementById("totalTournament").textContent = snapshot.size;

    snapshot.forEach((doc) => {

        const data = doc.data();

        tournamentList.innerHTML += `
        <div class="tournament-card">

            <h3>${data.title}</h3>

            <p>📅 ${data.date}</p>

            <p>💰 Entry Fee: ₹${data.entryFee}</p>

            <p>🏆 Prize Pool: ₹${data.prizePool}</p>

            <a href="register.html">
                <button>Register</button>
            </a>

        </div>
        `;
    });
}

// ================= LOAD LEADERBOARD =================

async function loadLeaderboard() {

    const leaderboardTable = document.getElementById("leaderboardTable");
    leaderboardTable.innerHTML = "";

    const snapshot = await getDocs(collection(db, "leaderboard"));

    snapshot.forEach((doc) => {

        const data = doc.data();

        leaderboardTable.innerHTML += `
        <tr>

            <td>${data.rank}</td>

            <td>${data.teamName}</td>

            <td>${data.kills}</td>

            <td>${data.points}</td>

        </tr>
        `;
    });
}

// ================= LOAD TEAM COUNT =================

async function loadTeamCount() {

    const snapshot = await getDocs(collection(db, "registrations"));

    document.getElementById("totalTeams").textContent = snapshot.size;
}

// ================= START =================
async function loadAnnouncement() {

    const snap = await getDoc(doc(db, "website", "announcement"));

    if (snap.exists()) {

        document.getElementById("announcementText").textContent =
            snap.data().text;

    }

}
loadTournaments();
loadLeaderboard();
loadTeamCount();
