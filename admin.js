import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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

    try {

        if (window.editId) {

            await updateDoc(doc(db, "tournaments", window.editId), {
                title,
                date,
                entryFee,
                prizePool
            });

            alert("Tournament Updated!");

            window.editId = null;

        } else {

            await addDoc(collection(db, "tournaments"), {
                title,
                date,
                entryFee,
                prizePool
            });

            alert("Tournament Created Successfully!");
        }

        tournamentForm.reset();
        loadTournaments();

    } catch (error) {
        alert(error.message);
    }
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
  <button onclick="editTournament('${document.id}','${t.title}','${t.date}','${t.entryFee}','${t.prizePool}')">
    Edit
  </button>

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
window.editTournament = async function(id, title, date, entryFee, prizePool) {

    document.getElementById("title").value = title;
    document.getElementById("date").value = date;
    document.getElementById("entryFee").value = entryFee;
    document.getElementById("prizePool").value = prizePool;

    window.editId = id;
};

loadTournaments();
