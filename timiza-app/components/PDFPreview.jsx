import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

const PDFPreview = ({ form, fileField }) => {
  // Access the PDF URL from the form using the specified fileField
  const pdfUrl = form[fileField];
  
  const handleDownloadAndPreview = async () => {
    try {
      // Define the file path in the local file system
      const fileUri = FileSystem.documentDirectory + pdfUrl.split("/").pop();

      // Download the PDF to the local file system
      const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri);

      if (downloadResult.status === 200) {
        ToastAndroid.show("Document ready for viewing!", ToastAndroid.SHORT);

        // Trigger sharing (preview) immediately after download
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("Error", "Sharing is not available on this device.");
        }
      } else {
        Alert.alert("Download Failed", "Unable to download the file.");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "An error occurred while downloading the file.");
    }
  };

  return (
    <View style={{ padding: 10 }}>
      {/* Display the PDF filename */}
      <Text style={{ color: "blue", textDecorationLine: "underline" }}>
        {pdfUrl.split("/").pop()}
      </Text>

      {/* Download and Preview button */}
      <TouchableOpacity onPress={handleDownloadAndPreview}>
        <View
          style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name='download-outline' size={24} color='blue' />
          <Text style={{ color: "blue", marginLeft: 5 }}>
            Download and Preview PDF
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PDFPreview;
