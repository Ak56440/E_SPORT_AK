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

    let found = false;

    snapshot.forEach((doc) => {

        const data = doc.data();

        if (data.email === user.email) {

            found = true;

            document.getElementById("tournamentName").textContent =
                data.tournamentTitle || "-";

            document.getElementById("status").textContent =
                data.status || "Pending";

            document.getElementById("roomId").textContent =
                data.roomId || "Waiting for approval";

            document.getElementById("roomPassword").textContent =
                data.roomPassword || "Waiting for approval";

            document.getElementById("kills").textContent =
                data.kills || 0;

            document.getElementById("rank").textContent =
                data.rank || "-";

            document.getElementById("points").textContent =
                data.points || 0;
        }

    });

    if (!found) {

        document.getElementById("tournamentName").textContent = "No Tournament Registered";
        document.getElementById("status").textContent = "-";
        document.getElementById("roomId").textContent = "-";
        document.getElementById("roomPassword").textContent = "-";

    }

});
// ---------------- LEADERBOARD ----------------

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
            <td>${data.points}</td>
        </tr>
        `;

    });

}

loadLeaderboard();

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "player-login.html";

    });
}
