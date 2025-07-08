import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const firebaseConfig = {
  apiKey: "AIzaSyC9TyGwZ4__vmvYvMBhAh6O27kL1zEteAI",
  authDomain: "elite-supps-787d6.firebaseapp.com",
  projectId: "elite-supps-787d6",
  storageBucket: "elite-supps-787d6.appspot.com",
  messagingSenderId: "155781426569",
  appId: "1:155781426569:web:998e36b93e93daa9d5c558",
  measurementId: "G-NDLV77J22H"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
