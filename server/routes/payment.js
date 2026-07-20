import express from "express";
import crypto from "crypto";
import razorpay from "../razorpay.js";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

// Create Order
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        });

        res.json(order);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Unable to create order"
        });
    }
});

// Verify Payment
router.post("/verify-payment", async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            uid,
            amount
        } = req.body;

        const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

console.log("Order ID:", razorpay_order_id);
console.log("Payment ID:", razorpay_payment_id);
console.log("Received Signature:", razorpay_signature);
console.log("Expected Signature:", expectedSignature);
console.log("UID:", uid);
console.log("Amount:", amount);

if (expectedSignature !== razorpay_signature) {
    console.log("❌ Invalid Signature");

    return res.status(400).json({
        success: false,
        message: "Invalid Signature"
    });
}
           
        // Update Wallet
        const userRef = db.collection("users").doc(uid);

        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userData = userDoc.data();

        const diamonds = userData.diamonds || 0;
        const totalTopup = userData.totalTopup || 0;

        await userRef.update({
            diamonds: diamonds + Number(amount),
            totalTopup: totalTopup + Number(amount)
        });

        // Save Transaction
        await db.collection("transactions").add({

            uid,

            amount,

            diamonds: amount,

            paymentId: razorpay_payment_id,

            orderId: razorpay_order_id,

            status: "Success",

            createdAt: new Date()

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Payment routes are working"
    });
});
export default router;
