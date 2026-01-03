// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAn4PsMWQzsIbkXaYAIpshhsKBHrAQ--qk",
  authDomain: "prueba-ad028.firebaseapp.com",
  projectId: "prueba-ad028",
  storageBucket: "prueba-ad028.firebasestorage.app",
  messagingSenderId: "920275026212",
  appId: "1:920275026212:web:16ca39c430deb30b4d73b1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{persistence: getReactNativePersistence(ReactNativeAsyncStorage)});
export const db = getFirestore(app);
export const storage = getStorage(app);