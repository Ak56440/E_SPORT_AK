import admin from "firebase-admin";
import fs from "fs";

// Read Firebase service account JSON
const serviceAccount = JSON.parse(
    fs.readFileSync("./firebase-service-account.json", "utf8")
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db };
