import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import configs from "configs";

const firebaseConfig = {
  storageBucket: configs.FIREBASE_STORAGE_BUCKET
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
export default storage;
