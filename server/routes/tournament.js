import express from "express";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.post("/join", async (req, res) => {

    try {

        const {
            uid,
            tournamentId,
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

        if ((user.diamonds || 0) < entryFee) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        await userRef.update({
            diamonds: user.diamonds - entryFee
        });

        await db.collection("registrations").add({
            uid,
            tournamentId,
            teamName,
            captainName,
            email,
            status: "Pending",
            createdAt: new Date()
        });

        await db.collection("transactions").add({
            uid,
            amount: entryFee,
            type: "Tournament Entry",
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
