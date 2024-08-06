import axios from "axios";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";
import * as FileSystem from "expo-file-system";

// Function to convert image to base64
export const convertImageToBase64 = async (uri) => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
};

const cloudinaryUri = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name || file.fileName,
    type: file.mimeType,
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const {data} = await axios.post(cloudinaryUri, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    throw new Error(message);
  }
};
