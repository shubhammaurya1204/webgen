// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {GoogleAuthProvider,getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-8c934.firebaseapp.com",
  projectId: "genwebai-8c934",
  storageBucket: "genwebai-8c934.firebasestorage.app",
  messagingSenderId: "353294150392",
  appId: "1:353294150392:web:063a67af49ed6b19cbe90d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth,provider};