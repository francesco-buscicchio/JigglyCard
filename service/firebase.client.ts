import { initializeApp, type FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

class FirebaseSingleton {
  private static firebaseApp: FirebaseApp;
  private static firestore: Firestore;
  private static auth: Auth;
  private static firebaseConfig = {
    apiKey: "AIzaSyCFiPFwVBdO-8MdmbGdPmdzf1yDZUtR8jA",
    authDomain: "jigglycard.firebaseapp.com",
    projectId: "jigglycard",
    storageBucket: "jigglycard.appspot.com",
    messagingSenderId: "977236188890",
    appId: "1:977236188890:web:a54a287a543cb4fee30fe3",
    measurementId: "G-XN3L8FR9RP",
  };

  private constructor() {}

  public static getInstance() {
    if (!FirebaseSingleton.firebaseApp) {
      FirebaseSingleton.firebaseApp = initializeApp(
        FirebaseSingleton.firebaseConfig,
        "JigglyCardTest"
      );
      FirebaseSingleton.firestore = getFirestore(FirebaseSingleton.firebaseApp);
      FirebaseSingleton.auth = getAuth(FirebaseSingleton.firebaseApp);
    }

    return FirebaseSingleton.firestore;
  }
}

export default FirebaseSingleton;
