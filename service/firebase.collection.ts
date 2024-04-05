import { collection, getDocs, query } from "firebase/firestore";
import FirebaseSingleton from "./firebase.client";

class FirebaseCollection {
  private client = FirebaseSingleton.getInstance({
    apiKey: useRuntimeConfig().public.FB_API_KEY,
    authDomain: useRuntimeConfig().public.FB_AUTH_DOMAIN,
    projectId: useRuntimeConfig().public.FB_PROJECT_ID,
    storageBucket: useRuntimeConfig().public.FB_STORAGE_BUCKET,
    messagingSenderId: useRuntimeConfig().public.FB_MESSAGING_SENDER_ID,
    appId: useRuntimeConfig().public.FB_APP_ID,
    measurementId: useRuntimeConfig().public.FB_MEASUREMENT_ID,
  });

  public async readCollection<T>(collectionName: string) {
    const q = query(collection(this.client.getFirestore(), collectionName));
    const querySnapshot = await getDocs(q);
    let result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return result;
  }
}

export default FirebaseCollection;
