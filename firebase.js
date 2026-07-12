import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ffturnaments-890b3.firebaseapp.com",
  projectId: "ffturnaments-890b3",
  storageBucket: "ffturnaments-890b3.firebasestorage.app",
  messagingSenderId: "863052947262",
  appId: "1:863052947262:web:4ac0a1999f61361c16566f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
