import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyANBRRXQ48oNmtEThnX8CUBpiMl-otzWdQ",
  authDomain: "my-chat-app-b5ddb.firebaseapp.com",
  projectId: "my-chat-app-b5ddb",
  storageBucket: "my-chat-app-b5ddb.appspot.com",
  messagingSenderId: "321827307500",
  appId: "1:321827307500:web:cb553ec98a993b7b434ac9",
  measurementId: "G-7G7YX3RST8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
