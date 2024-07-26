import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
  BUCKET_URL
} from "@env";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


export const uploadFiles = async (files) => {
  const promises = [];
  const urls = {};

  for (const key in files) {
    const fileName = new Date().getTime() + "_" + files[key].fileName;
    const storage = getStorage(app, BUCKET_URL);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, files[key]);

    // Wrap the upload task in a promise
    const uploadPromise = new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log("Uploaded: " + progress + "%");
        },
        (error) => {
          console.log("Error uploading: " + error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls[key] = downloadURL;
            resolve();
          } catch (error) {
            console.log("Error getting download URL: " + error);
            reject(error);
          }
        }
      );
    });

    promises.push(uploadPromise);
  }

  try {
    await Promise.all(promises);
    return urls;
  } catch (error) {
    console.log("Error uploading files:", error);
    throw new Error("Error uploading files");
  }
};