import { auth } from "./firebase.js";
const tournament = JSON.parse(
    localStorage.getItem("selectedTournament")
);
if (!tournament) {
    alert("Please select a tournament first.");
    window.location.href = "index.html";
}
if (tournament) {
    document.getElementById("tournamentTitle").value = tournament.title;
}

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        const entryFee = Number(tournament.entryFee);
        const response = await fetch(
            "https://esports-legacy-api.onrender.com/api/tournament/join",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    uid: user.uid,
                   tournamentId: tournament.id,
tournamentTitle: tournament.title,
                    entryFee: entryFee,
                    teamName: document.getElementById("teamName").value,
                    captainName: document.getElementById("captainName").value,
                    email: document.getElementById("email").value
                })
            }
        );

        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        document.getElementById("successPopup").style.display = "flex";

        form.reset();

        document.getElementById("okBtn").onclick = () => {
            window.location.href = "index.html";
        };

    } catch (error) {

        alert("Registration failed: " + error.message);

    }

});
