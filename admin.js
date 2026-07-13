import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const tournamentForm = document.getElementById("tournamentForm");
const tableBody = document.getElementById("tableBody");

// Create Tournament
tournamentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const date = document.getElementById("date").value;
  const entryFee = document.getElementById("entryFee").value;
  const prizePool = document.getElementById("prizePool").value;

  await addDoc(collection(db, "tournaments"), {
    title,
    date,
    entryFee,
    prizePool
  });

  alert("Tournament Created Successfully!");
  tournamentForm.reset();

  loadTournaments();
});

// Load Tournaments
async function loadTournaments() {
  tableBody.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "tournaments"));

  querySnapshot.forEach((document) => {
    const t = document.data();

    tableBody.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td>${t.date}</td>
        <td>₹${t.entryFee}</td>
        <td>₹${t.prizePool}</td>
        <td>
          <button onclick="deleteTournament('${document.id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// Delete Tournament
window.deleteTournament = async function(id) {
  if (confirm("Delete this tournament?")) {
    await deleteDoc(doc(db, "tournaments", id));
    alert("Tournament Deleted!");
    loadTournaments();
  }
};

loadTournaments();
