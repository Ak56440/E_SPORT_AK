import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { db } from "./firebase.js";

// 🔐 Replace with your Firebase admin email
const ADMIN_EMAIL = "omkardsupe143644@gmail.com";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "admin-login.html";
        return;
    }

    if (user.email !== ADMIN_EMAIL) {

        alert("❌ Access Denied!");

        await signOut(auth);

        window.location.href = "admin-login.html";
        return;
    }

});
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
const registrationTable = document.getElementById("registrationTable");

// ---------------- CREATE / UPDATE TOURNAMENT ----------------

tournamentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const entryFee = document.getElementById("entryFee").value;
    const prizePool = document.getElementById("prizePool").value;
    const roomId = document.getElementById("roomId").value;
    const roomPassword = document.getElementById("roomPassword").value;

    try {

        if (window.editId) {

            await updateDoc(doc(db, "tournaments", window.editId), {
                title,
                date,
                entryFee,
                prizePool,
                roomId,
                roomPassword
            });

            alert("Tournament Updated!");
            window.editId = null;

        } else {

            await addDoc(collection(db, "tournaments"), {
                title,
                date,
                entryFee,
                prizePool,
                roomId,
                roomPassword
            });

            alert("Tournament Created!");
        }

        tournamentForm.reset();
        loadTournaments();

    } catch (error) {
        alert(error.message);
    }
});

// ---------------- LOAD TOURNAMENTS ----------------

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

                <button style="background:green;color:white"
                onclick="editTournament(
                '${document.id}',
                '${t.title}',
                '${t.date}',
                '${t.entryFee}',
                '${t.prizePool}',
                '${t.roomId || ""}',
                '${t.roomPassword || ""}'
                )">
                ✏️ Edit
                </button>

                <button onclick="deleteTournament('${document.id}')">
                🗑 Delete
                </button>

            </td>

        </tr>
        `;

    });

}

// ---------------- DELETE ----------------

window.deleteTournament = async function(id){

    if(confirm("Delete Tournament?")){

        await deleteDoc(doc(db,"tournaments",id));

        loadTournaments();
    }

}

// ---------------- EDIT ----------------

window.editTournament = function(
id,
title,
date,
entryFee,
prizePool,
roomId="",
roomPassword=""
){

    document.getElementById("title").value = title;
    document.getElementById("date").value = date;
    document.getElementById("entryFee").value = entryFee;
    document.getElementById("prizePool").value = prizePool;
    document.getElementById("roomId").value = roomId;
    document.getElementById("roomPassword").value = roomPassword;

    window.editId = id;

}

// ---------------- LOAD REGISTRATIONS ----------------

async function loadRegistrations(){

    registrationTable.innerHTML="";

    const querySnapshot = await getDocs(collection(db,"registrations"));

    querySnapshot.forEach((document)=>{

        const team=document.data();

       registrationTable.innerHTML += `

<tr>

    <td>${team.teamName}</td>

    <td>${team.captainName}</td>

    <td>${team.tournamentTitle || "-"}</td>

    <td>${team.transactionId || "-"}</td>

    <td>
        ${
            team.paymentLink
            ? `<a href="${team.paymentLink}" target="_blank">📷 View Screenshot</a>`
            : "No Screenshot"
        }
    </td>

    <td>${team.status}</td>

    <td>

        <button onclick="approveTeam('${document.id}')">
            ✅ Approve
        </button>

        <button onclick="rejectTeam('${document.id}')">
            ❌ Reject
        </button>

    </td>

</tr>

`;
    });

}

// ---------------- APPROVE ----------------

window.approveTeam = async function(id){

    const roomId = prompt("Enter Room ID:");
    if (roomId === null) return;

    const roomPassword = prompt("Enter Room Password:");
    if (roomPassword === null) return;

    await updateDoc(doc(db,"registrations",id),{

        status: "Approved",
        roomId: roomId,
        roomPassword: roomPassword

    });

    alert("✅ Team Approved Successfully!");

    loadRegistrations();

}

// ---------------- REJECT ----------------

window.rejectTeam = async function(id){

    await updateDoc(doc(db,"registrations",id),{

        status:"Rejected"

    });

    loadRegistrations();

}

loadTournaments();
loadRegistrations();
// ---------------- LOGOUT ----------------

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            await signOut(auth);

            alert("✅ Logged out successfully!");

            window.location.href = "admin-login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}
