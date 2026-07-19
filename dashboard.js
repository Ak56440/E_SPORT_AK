import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "player-login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));

if (userDoc.exists()) {

    const userData = userDoc.data();

    document.getElementById("playerName").textContent =
        userData.name;

    document.getElementById("playerEmail").textContent =
        userData.email;

    document.getElementById("walletBalance").textContent =
        userData.diamonds || 0;

    document.getElementById("walletRupees").textContent =
        userData.diamonds || 0;

}

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
// Wallet Top Up
const topupBtn = document.getElementById("topupBtn");

if (topupBtn) {

    topupBtn.addEventListener("click", async () => {

        const amount = Number(prompt("Enter Top-Up Amount (₹)"));

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        try {

            const response = await fetch(
                "https://esports-legacy-api.onrender.com/api/payment/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        amount: amount
                    })
                }
            );

            const order = await response.json();

            console.log(order);

            // Razorpay Checkout will be added next
            const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
    amount: order.amount,
    currency: order.currency,
    name: "eSports Legacy",
    description: "Wallet Top-Up",
    order_id: order.id,

    handler: async function (response) {

        const verify = await fetch(
            "https://esports-legacy-api.onrender.com/api/payment/verify-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    uid: user.uid,
                    amount: amount
                })
            }
        );

        const result = await verify.json();

        if (result.success) {
            alert("✅ Wallet Top-Up Successful!");
            location.reload();
        } else {
            alert("❌ Payment Verification Failed");
        }
    },

    prefill: {
        name: document.getElementById("playerName").textContent,
        email: user.email
    },

    theme: {
        color: "#0096ff"
    }
};

const rzp = new Razorpay(options);
rzp.open();

        } catch (err) {

            console.error(err);
            alert("Unable to create payment order.");

        }

    });

}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "player-login.html";

    });
}
