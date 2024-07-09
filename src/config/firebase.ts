import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { credential } from "firebase-admin";

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const app = initializeApp({
  credential: credential.cert(firebaseConfig),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
