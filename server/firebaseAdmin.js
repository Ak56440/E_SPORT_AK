import admin from "firebase-admin";

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

console.log("Firebase Project ID:", serviceAccount.project_id);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db };
