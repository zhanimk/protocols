// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhdLEubiHy6qe0vbNFSu3o28gUcCptbIc",
  authDomain: "judo-manager-41009.firebaseapp.com",
  projectId: "judo-manager-41009",
  storageBucket: "judo-manager-41009.firebasestorage.app",
  messagingSenderId: "230481878800",
  appId: "1:230481878800:web:d3c1dcb804441c7b3ecf95",
  measurementId: "G-HN590SPPFW",
};

// 1. Инициализация
const app = initializeApp(firebaseConfig);

// 2. Firestore-ды экспорттау (const арқылы)
export const db = getFirestore(app);
