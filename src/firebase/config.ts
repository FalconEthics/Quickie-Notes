// Firebase Configuration
// Import the needed Firebase services
import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import type { FirebaseConfig } from '../types'

// Your web app's Firebase configuration
// For security, these should be in .env file in a real production environment
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase services
const auth: Auth = getAuth(app)
const db: Firestore = getFirestore(app)

// Setup auth providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export {
  auth,
  db,
  googleProvider,
  githubProvider
}
