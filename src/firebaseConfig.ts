import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAn4PsMWQzsIbkXaYAIpshhsKBHrAQ--qk",
  authDomain: "prueba-ad028.firebaseapp.com",
  projectId: "prueba-ad028",
  storageBucket: "prueba-ad028.firebasestorage.app",
  messagingSenderId: "920275026212",
  appId: "1:920275026212:web:16ca39c430deb30b4d73b1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);