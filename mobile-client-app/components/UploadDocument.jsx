import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../constants";
import CustomButton from "./CustomButton";

const UploadDocument = () => {
  const [form, setForm] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
  });

  const openPicker = async (side) => {
    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!result.canceled) {
      if (side === "front") {
        setForm({ ...form, nationalIdFront: result.assets[0] });
      } else {
        setForm({ ...form, nationalIdBack: result.assets[0] });
      }
    } else {
      Alert.alert("No image selected");
    }
  };

  const submit = async () => {
    if (!form.nationalIdFront || !form.nationalIdBack) {
      Alert.alert("Please select both front and back images");
      return;
    }

    const data = new FormData();
    data.append("front", {
      uri: form.nationalIdFront.uri,
      name: `front-${Date.now()}.jpg`,
      type: "image/jpeg",
    });
    data.append("back", {
      uri: form.nationalIdBack.uri,
      name: `back-${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    try {
      const response = await fetch("http://your-server-url/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: data,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <View>
      <View className='mt-7 space-y-2'>
        <Text className='text-base text-gray-600 font-pregular'>
          Upload ID (Front-Side)
        </Text>
        <TouchableOpacity
          className='bg-white border-[1px] border-gray-300 p-1 h-48 rounded-lg'
          onPress={() => openPicker("front")}
        >
          {form.nationalIdFront ? (
            <Image
              source={{ uri: form.nationalIdFront.uri }}
              resizeMode='cover'
              className='w-full h-full rounded-xl border-[1px]'
            />
          ) : (
            <Text>Take Photo</Text>
          )}
        </TouchableOpacity>
      </View>
      <View className='mt-7 space-y-2'>
        <Text className='text-base text-gray-600 font-pmedium'>
          Upload ID (Back-Side)
        </Text>
        <TouchableOpacity
          className='bg-white border-[1px] border-gray-300 p-1 h-48 rounded-lg'
          onPress={() => openPicker("back")}
        >
          {form.nationalIdBack ? (
            <Image
              source={{ uri: form.nationalIdBack.uri }}
              resizeMode='cover'
              className='w-full h-full rounded-xl border-[1px]'
            />
          )
          : (<Text>Take Photo</Text>
          )}
        </TouchableOpacity>
      </View>
      <CustomButton
        title='Submit & Finish'
        handlePress={submit}
        containerStyles='mt-7'
      />
    </View>
  );
};

export default UploadDocument;
