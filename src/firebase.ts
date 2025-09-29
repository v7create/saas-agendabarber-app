// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- HOW TO FIX: Firebase Error (auth/unauthorized-domain) ---
// This error means your application's web address (domain) has not been
// approved to use Firebase Authentication. For security, you must explicitly
// add it to an allowlist in your Firebase project settings.
//
// Follow these steps to authorize your domain:
//
// 1. Go to the Firebase Console:
//    https://console.firebase.google.com/
//
// 2. Select your project:
//    "saas-barbearia-8d49a"
//
// 3. Navigate to the "Authentication" section and click the "Settings" tab.
//
// 4. Select the "Authorized domains" sub-tab.
//
// 5. Click "Add domain" and enter the domain from your browser's address bar.
//    - For example: `your-id.aistudio.dev`
//    - If you are running locally, you may need to add `localhost`.
//
// --- STILL NOT WORKING? CHECK API KEY RESTRICTIONS ---
// If you have authorized the domain but it still fails, your API key might
// be restricted.
//
// 1. Go to Google Cloud Console -> APIs & Services -> Credentials:
//    https://console.cloud.google.com/apis/credentials
//
// 2. Select the correct project ("saas-barbearia-8d49a").
//
// 3. Find the API key named "Browser key (auto created by Firebase)" or similar.
//
// 4. Click on it. Under "Application restrictions", ensure that the "HTTP
//    referrers (web sites)" option is either set to "None" or that it
//    explicitly includes your AI Studio domain (`*.aistudio.dev/*`).
//
// Using `signInWithRedirect` instead of `signInWithPopup` is also recommended
// for environments like this to avoid browser popup-blocking issues.

// Your web app's Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyDkKVoLLlKtzdScoc40AhOlAAHlY5VeWGU",
  authDomain: "saas-barbearia-8d49a.firebaseapp.com",
  projectId: "saas-barbearia-8d49a",
  storageBucket: "saas-barbearia-8d49a.appspot.com",
  messagingSenderId: "1047858874193",
  appId: "1:1047858874193:web:16fa20bd6be382b3ee7570",
  measurementId: "G-M5889WNWQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you will use
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();