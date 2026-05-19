import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "dailyfit.firebaseapp.com",
  projectId: "dailyfit",
  storageBucket: "dailyfit.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo",
};

const app = initializeApp(firebaseConfig);

export default app;