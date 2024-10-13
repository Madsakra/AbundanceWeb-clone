// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMsXHjA_wd3lXGq1xkYOME2WtD9_0bGMo",
  authDomain: "abundance-3f9ab.firebaseapp.com",
  projectId: "abundance-3f9ab",
  storageBucket: "abundance-3f9ab.appspot.com",
  messagingSenderId: "162707020216",
  appId: "1:162707020216:web:455bc365a777da4615174d",
  measurementId: "G-8XMNGDZMPV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);