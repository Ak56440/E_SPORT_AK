import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0D2V2ILEWeJ9wRSMYMVXlMjAxYsEYY6M",
  authDomain: "ffturnaments-890b3.firebaseapp.com",
  projectId: "ffturnaments-890b3",
  storageBucket: "ffturnaments-890b3.firebasestorage.app",
  messagingSenderId: "863052947262",
  appId: "1:863052947262:web:4ac0a1999f61361c16566f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
