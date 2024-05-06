// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyARkGo5hthvDC32BfvqDgaR_nQfgkj3XEc',
  authDomain: 'pmmbyvow.firebaseapp.com',
  projectId: 'pmmbyvow',
  storageBucket: 'pmmbyvow.appspot.com',
  messagingSenderId: '686275171216',
  appId: '1:686275171216:web:ead9d1e406726902385915',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const fbStorage = getStorage(app);
