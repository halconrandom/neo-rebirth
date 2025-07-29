// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbRkIpuMOrApbldttysvM1fxtDBr8ucnM",
  authDomain: "shinobi-legacy-51247.firebaseapp.com",
  projectId: "shinobi-legacy-51247",
  storageBucket: "shinobi-legacy-51247.firebasestorage.app",
  messagingSenderId: "925583388898",
  appId: "1:925583388898:web:5043f1e64875d56c1c6ebb",
  measurementId: "G-W8P6Z5ZLR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);