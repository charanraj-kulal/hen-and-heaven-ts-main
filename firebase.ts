// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBry2FHRKoa2gkXqhodZPUpT9J9rQL_6iA",
  authDomain: "hen-and-heaven-ts-b12fe.firebaseapp.com",
  projectId: "hen-and-heaven-ts-b12fe",
  storageBucket: "hen-and-heaven-ts-b12fe.appspot.com",
  messagingSenderId: "1080668982551",
  appId: "1:1080668982551:web:71ba32075d0c9c87febb52",
  measurementId: "G-4NJCSVNZ3V",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
