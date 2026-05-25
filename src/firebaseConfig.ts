import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl-ZGDPl1vqT-eD7nnKbQPSbGXUKdwWpA",
  authDomain: "dailyfit-474bc.firebaseapp.com",
  projectId: "dailyfit-474bc",
  storageBucket: "dailyfit-474bc.firebasestorage.app",
  messagingSenderId: "609675830451",
  appId: "1:609675830451:web:2f30b6e8fc2194c3763cc6",
  measurementId: "G-RVP11QXHS9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
