import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFMz0XrrK5kNKV59Plh0vgXeG-3QguXzk",
  authDomain: "jobboard-app-929fe.firebaseapp.com",
  projectId: "jobboard-app-929fe",
  storageBucket: "jobboard-app-929fe.firebasestorage.app", // ✅ Fixed
  messagingSenderId: "973504927647",
  appId: "1:973504927647:web:d36c66da72784b09274faa",
  measurementId: "G-ZXVC169HS1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = getFirestore(app);

// Enable Firestore offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  switch (err.code) {
    case "failed-precondition":
      console.warn("Firestore persistence failed: Multiple tabs are open.");
      break;
    case "unimplemented":
      console.warn("Firestore persistence is not supported by this browser.");
      break;
    default:
      console.error("Firestore persistence error:", err);
  }
});

// Analytics (only in production and supported browsers)
export let analytics = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported && import.meta.env.PROD) {
      analytics = getAnalytics(app);
    }
  });
}