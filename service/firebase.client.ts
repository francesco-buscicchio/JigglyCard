import { initializeApp, type FirebaseApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

class FirebaseSingleton {
  private static instance: FirebaseSingleton;
  private firebaseApp: FirebaseApp;
  private firestore: Firestore;
  private auth: Auth;

  private constructor(config: any) {
    this.firebaseApp = initializeApp(config);
    this.firestore = getFirestore(this.firebaseApp);
    this.auth = getAuth(this.firebaseApp);
  }

  public static getInstance(config?: any): FirebaseSingleton {
    if (!this.instance) {
      if (!config) {
        throw new Error(
          "Firebase configuration is required on first initialization"
        );
      }
      this.instance = new FirebaseSingleton(config);
    }
    return this.instance;
  }

  public getFirestore(): Firestore {
    return this.firestore;
  }

  public getAuth(): Auth {
    return this.auth;
  }
}

export default FirebaseSingleton;
