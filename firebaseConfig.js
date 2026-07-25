// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx0PKX6TXpd2BPOZaNCtkRCqD8qw34gL0",
  authDomain: "marvel-chat-49f23.firebaseapp.com",
  projectId: "marvel-chat-49f23",
  storageBucket: "marvel-chat-49f23.firebasestorage.app",
  messagingSenderId: "93489441194",
  appId: "1:93489441194:web:761b0830d025633d5823d3",
  measurementId: "G-QDYWQ78M14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
