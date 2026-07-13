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
          <a href="register.html" class="btn">Join Tournament</a>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    tournamentList.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

loadTournaments();
