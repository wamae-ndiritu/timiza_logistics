import axios from 'axios';
import { END_POINT } from "../../baseUrl";
import * as FileSystem from "expo-file-system";

export const extractFileText = async (file) => {
  // Read file content as Base64
  const fileContent = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Construct JSON body
  const payload = {
    document: {
      name: file.name,
      type: file.mimeType,
      content: fileContent,
    },
  };

  try {
    // Send the file to your backend
    const response = await axios.post(
      `${END_POINT}/deliveries/upload`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming backend response includes jobId for processing
    const { jobId } = response.data;

    const statusResponse = await axios.get(
      `${END_POINT}/deliveries/status/${jobId}`
    );
    console.log(statusResponse.data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}