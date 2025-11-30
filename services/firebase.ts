import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQftYraPMhIwiYT9aToXkiay-1admDq0I",
  authDomain: "gen-lang-client-0704793222.firebaseapp.com",
  projectId: "gen-lang-client-0704793222",
  storageBucket: "gen-lang-client-0704793222.firebasestorage.app",
  messagingSenderId: "386543848247",
  appId: "1:386543848247:web:bae6e66e74d87a9f0e68b2",
  measurementId: "G-8T75F8V7GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with settings to improve stability
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
});

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Firebase Authentication and get a reference to the service
import { getAuth } from "firebase/auth";
export const auth = getAuth(app);
