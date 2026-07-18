import express from "express";
import cors from "cors";

import paymentRoutes from "./routes/payment.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
    res.send("eSports Legacy API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
