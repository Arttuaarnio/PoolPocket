import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_API_KEY } from "react-native-dotenv";

// Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "poolpocket-6a01b.firebaseapp.com",
  databaseURL:
    "https://poolpocket-6a01b-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "poolpocket-6a01b",
  storageBucket: "poolpocket-6a01b.firebasestorage.app",
  messagingSenderId: "387516267557",
  appId: "1:387516267557:web:c8769cb374bc3d99b213cc",
  measurementId: "G-P4KHBSPZTN",
};

// Initialize
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const database = getDatabase(app);
export default app;
