import React, { useState } from "react";
import { View, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const InvoiceUpload = () => {
  const [imageUri, setImageUri] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "invoice.jpg",
    });

    axios
      .post("http://192.168.88.203:3000/api/v1/invoices/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response)
        setInvoiceData(response.data);
      })
      .catch((error) => {
        console.log("Image upload failed:", error);
      });
  };

  return (
    <View>
      <Button title='Select Image' onPress={selectImage} />
      {imageUri && (
        <>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 100, height: 100 }}
          />
          <Button title='Upload Image' onPress={uploadImage} />
        </>
      )}
      {invoiceData && (
        <View>
          <Text>Invoice Number: {invoiceData.invoiceNumber}</Text>
          <Text>Amount: {invoiceData.amount}</Text>
          <Text>Date: {invoiceData.date}</Text>
        </View>
      )}
    </View>
  );
};

export default InvoiceUpload;
