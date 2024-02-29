import { collection, getDocs, query } from "firebase/firestore";
import FirebaseSingleton from "./firebase.client";

class FirebaseCollection {
  private static client = FirebaseSingleton.getInstance();

  static async readCollection<T>(collectionName: string) {
    const q = query(collection(FirebaseCollection.client, collectionName));
    const querySnapshot = await getDocs(q);
    let result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return result;
  }
}

export default FirebaseCollection;
