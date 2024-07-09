import dotenv from "dotenv";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

dotenv.config();

const app = initializeApp({
  credential: applicationDefault(),
});

export const db = getFirestore(app);
export const auth = getAuth(app);
