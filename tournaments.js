import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentList = document.getElementById("tournamentList");

async function loadTournaments() {
  try {
    const querySnapshot = await getDocs(collection(db, "tournaments"));

    tournamentList.innerHTML = "";

    if (querySnapshot.empty) {
      tournamentList.innerHTML = "<h3>No tournaments found.</h3>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const t = doc.data();

      tournamentList.innerHTML += `
        <div class="card">
          <h3>${t.title}</h3>
          <p>📅 ${t.date}</p>
          <p>💰 Prize: ₹${t.prizePool}</p>
          <p>🎟 Entry: ₹${t.entryFee}</p>
         <button
    class="btn joinBtn"
    data-id="${doc.id}"
    data-title="${t.title}"
    data-entry="${t.entryFee}">
    Join Tournament
</button>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    tournamentList.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

loadTournaments();
document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("joinBtn")) return;

    const tournament = {
        id: e.target.dataset.id,
        title: e.target.dataset.title,
        entryFee: e.target.dataset.entry
    };

    localStorage.setItem(
        "selectedTournament",
        JSON.stringify(tournament)
    );

    window.location.href = "register.html";

});
