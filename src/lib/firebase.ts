// firebase.ts
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBGZeBCj40RFw4-rKGdaSNl-Ra5kLAdN1A",
  authDomain: "qode-119b4.firebaseapp.com",
  projectId: "qode-119b4",
  storageBucket: "qode-119b4.firebasestorage.app",
  messagingSenderId: "896760700950",
  appId: "1:896760700950:web:6e027a973619e1e001d537",
  measurementId: "G-JLZ4W1HD7Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

/**
 * Upload file to Firebase storage.
 * Returns a download URL.
 */
export function uploadFile(
  file: File,
  setProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (setProgress) setProgress(progress);
      },
      (error) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      },
      () => {
        // use then/catch so this callback returns void (no Promise)
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((err) => {
            reject(err instanceof Error ? err : new Error(String(err)));
          });
      }
    );
  });
}
