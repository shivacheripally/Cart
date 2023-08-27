// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTyRuUfjOjO51mwBuYEz3FIIQHg7J4tkU",
  authDomain: "srimahatishwariikkathsarees.firebaseapp.com",
  projectId: "srimahatishwariikkathsarees",
  storageBucket: "srimahatishwariikkathsarees.appspot.com",
  messagingSenderId: "84496369812",
  appId: "1:84496369812:web:9dd4a6a3bf424760538c81",
  measurementId: "G-9V2XV4YCZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default  app;