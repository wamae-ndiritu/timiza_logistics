import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {
//   API_KEY,
//   AUTH_DOMAIN,
//   PROJECT_ID,
//   STORAGE_BUCKET,
//   MESSAGING_SENDER_ID,
//   APP_ID,
//   MEASUREMENT_ID,
//   BUCKET_URL
// } from "@env";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// const firebaseConfig = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDER_ID,
//   appId: APP_ID,
//   measurementId: MEASUREMENT_ID,
// };

const firebaseConfig = {
    API_KEY: "AIzaSyCkEyLFjPvidwDFjVUnMmg7DbxRzyyM8dM",
    AUTH_DOMAIN:"timiza-logistics.firebaseapp.com",
    PROJECT_ID:"timiza-logistics",
    STORAGE_BUCKET:"timiza-logistics.appspot.com",
    MESSAGING_SENDER_ID:"925572313297",
    APP_ID:"1:925572313297:web:46bceab4894348732255f0",
    MEASUREMENT_ID:"G-132TG4FKWV",
}

const BUCKET_URL = "gs://timiza-logistics.appspot.com";


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


const createUploadPromise = (storageRef, file, key, urls) => {
  return new Promise((resolve, reject) => {
    const metadata = {
      contentType: file.mimeType || "application/octet-stream", // Use the provided MIME type or default to 'application/octet-stream'
    };

    // Fetch the file content using the URI
    fetch(file.uri)
      .then((response) => response.blob())
      .then((blob) => {
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(`Uploaded ${key}: ${progress}%`);
          },
          (error) => {
            console.error(`Error uploading ${key}: ${error.message}`);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              urls[key] = downloadURL;
              resolve();
            } catch (error) {
              console.error(
                `Error getting download URL for ${key}: ${error.message}`
              );
              reject(error);
            }
          }
        );
      })
      .catch((error) => {
        console.error(`Error fetching file for ${key}: ${error.message}`);
        reject(error);
      });
  });
};

export const uploadFiles = async (files) => {
  const promises = [];
  const urls = {};

  const storage = getStorage(app, BUCKET_URL);

  for (const key in files) {
    if (files.hasOwnProperty(key)) {
      const file = files[key];

      // Enhanced logging to check the file object structure
      console.log(`File object for key ${key}:`, file);

      if (!file.fileName) {
        console.error(
          `File object for key ${key} is missing fileName property.`
        );
        continue; // Skip this file and log the error
      }

      const fileName = `${new Date().getTime()}_${file.fileName}`; // Ensure fileName exists
      const storageRef = ref(storage, fileName);

      console.log(
        `Uploading file: ${fileName} with MIME type: ${
          file.mimeType || "application/octet-stream"
        }`
      );

      const uploadPromise = createUploadPromise(storageRef, file, key, urls);
      promises.push(uploadPromise);
    }
  }

  try {
    await Promise.all(promises);
    return urls;
  } catch (error) {
    console.error("Error uploading files:", error.message);
    throw new Error("Error uploading files");
  }
};