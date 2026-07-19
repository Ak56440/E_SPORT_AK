import express from "express";
import crypto from "crypto";
import razorpay from "../razorpay.js";
import { db } from "../firebaseAdmin.js";
import {
  collection,
  getDocs
} from "firebase-admin/firestore";

const router = express.Router();

// Create Razorpay Order
router.post("/create-order", async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100, // ₹ to paise
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Unable to create order"
        });

    }

});

export default router;
