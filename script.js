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

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

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

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

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

// ================= LOAD ANNOUNCEMENT =================

async function loadAnnouncement() {

    const snap = await getDoc(doc(db, "website", "announcement"));

    if (snap.exists()) {

        document.getElementById("announcementText").textContent =
            snap.data().text;

    }

}

// ================= FEATURED TOURNAMENT =================

async function loadFeaturedTournament() {

    const snapshot = await getDocs(collection(db, "tournaments"));

    if (snapshot.empty) return;

    const data = snapshot.docs[0].data();

    document.getElementById("featuredTitle").textContent = data.title;
    document.getElementById("featuredDate").textContent = data.date;
    document.getElementById("featuredEntry").textContent = data.entryFee;
    document.getElementById("featuredPrize").textContent = data.prizePool;

   startCountdown(new Date(`${data.date}T${data.time}:00`).getTime());

}

// ================= COUNTDOWN =================

function startCountdown(targetDate) {

    const timer = setInterval(() => {

        const now = new Date().getTime();

        const distance = targetDate - now;

        if (distance <= 0) {

            clearInterval(timer);

            document.getElementById("days").textContent = "00";
            document.getElementById("hours").textContent = "00";
            document.getElementById("minutes").textContent = "00";
            document.getElementById("seconds").textContent = "00";

            return;

        }

        document.getElementById("days").textContent =
            Math.floor(distance / (1000 * 60 * 60 * 24));

        document.getElementById("hours").textContent =
            Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        document.getElementById("minutes").textContent =
            Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById("seconds").textContent =
            Math.floor((distance % (1000 * 60)) / 1000);

    }, 1000);

}

// ================= START =================

loadTournaments();
loadLeaderboard();
loadTeamCount();
loadAnnouncement();
loadFeaturedTournament();
// ===== Mobile Menu =====

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        if (navMenu.classList.contains("active")) {
            menuToggle.innerHTML = "✖";
        } else {
            menuToggle.innerHTML = "☰";
        }

    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");
            menuToggle.innerHTML = "☰";

        });

    });

}
