import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";
import { Card, IconButton } from "react-native-paper";

const PdfUploader = () => {
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker");
      } else {
        console.log("Unknown error: ", err);
      }
    }
  };

  const openFile = async () => {
    if (file) {
      await FileViewer.open(file.uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickFile} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload PDF</Text>
      </TouchableOpacity>

      {file && (
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Image source={{ uri: "pdf_icon_uri" }} style={styles.pdfIcon} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{file.name}</Text>
              <Text style={styles.fileSize}>
                {(file.size / 1024).toFixed(2)} kB
              </Text>
            </View>
            <IconButton icon='eye' size={20} onPress={openFile} />
          </View>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  uploadButton: {
    backgroundColor: "#2A7353",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    marginTop: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  pdfIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
  },
  fileSize: {
    color: "#999",
  },
});

export default PdfUploader;
