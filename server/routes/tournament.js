import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.post("/join", async (req, res) => {

    try {

        const {
            uid,
            tournamentId,
            tournamentTitle,
            entryFee,
            teamName,
            captainName,
            email
        } = req.body;

        const userRef = db.collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = userDoc.data();

        // Check wallet balance
        if ((user.diamonds || 0) < Number(entryFee)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

       // Debug logs
console.log("UID:", uid);
console.log("Tournament ID:", tournamentId);

// Prevent duplicate registration
const existing = await db
    .collection("registrations")
    .where("uid", "==", uid)
    .where("tournamentId", "==", tournamentId)
    .get();

console.log("Duplicate documents found:", existing.size);

if (!existing.empty) {
    return res.status(400).json({
        success: false,
        message: "You have already joined this tournament."
    });
}
        // Deduct wallet
        await userRef.update({
            diamonds: (user.diamonds || 0) - Number(entryFee),
            totalSpent: (user.totalSpent || 0) + Number(entryFee)
        });

        // Save registration
        await db.collection("registrations").add({
            uid,
            tournamentId,
            tournamentTitle,
            teamName,
            captainName,
            email,
            entryFee: Number(entryFee),
            status: "Pending",
            createdAt: new Date()
        });

        // Save transaction
        await db.collection("transactions").add({
            uid,
            amount: Number(entryFee),
            type: "Tournament Entry",
            tournamentId,
            tournamentTitle,
            status: "Success",
            createdAt: new Date()
        });

        res.json({
            success: true,
            message: "Tournament Joined Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

export default router;
