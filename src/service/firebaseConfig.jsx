// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB--lxoJWJqChRZTXpnAfkj8eBKLkOdfzA",
  authDomain: "tripgenie-a2f76.firebaseapp.com",
  projectId: "tripgenie-a2f76",
  storageBucket: "tripgenie-a2f76.firebasestorage.app",
  messagingSenderId: "925861919521",
  appId: "1:925861919521:web:68260f55be08e91a2e9c60",
  measurementId: "G-K1HSEFNT1R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);