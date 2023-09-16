import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMewiw5MOMYjrHZwUt9LzKm4J9dGIKMbU",
  authDomain: "controle-chamados.firebaseapp.com",
  projectId: "controle-chamados",
  storageBucket: "controle-chamados.appspot.com",
  messagingSenderId: "468878996352",
  appId: "1:468878996352:web:69140ff0b5f98bab9dc765",
  measurementId: "G-M7CCVVHPW6",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };
