import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFMz0XrrK5kNKV59Plh0vgXeG-3QguXzk",
  authDomain: "jobboard-app-929fe.firebaseapp.com",
  projectId: "jobboard-app-929fe",
  storageBucket: "jobboard-app-929fe.appspot.com",
  messagingSenderId: "973504927647",
  appId: "1:973504927647:web:d36c66da72784b09274faa",
  measurementId: "G-ZXVC169HS1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const analytics = getAnalytics(app);