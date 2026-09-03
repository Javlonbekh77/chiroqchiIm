import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJkgZ2bk3bCpcjlYUcJScAJi0NpAtxg8g",
  authDomain: "chiroqchiim.firebaseapp.com",
  projectId: "chiroqchiim",
  storageBucket: "chiroqchiim.firebasestorage.app",
  messagingSenderId: "236117247608",
  appId: "1:236117247608:web:c8a6c312ee38c2bcb80f8d",
  measurementId: "G-7YPQ6KQZ7C"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
export const storage = getStorage(app);
export const auth = getAuth(app);
