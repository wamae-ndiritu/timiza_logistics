import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import moment from 'moment'
import AvatarWithInitials from "../../components/AvatarWithInitials";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../constants";
import { router } from "expo-router";
import { logoutUser } from "../../lib/redux/slices/users";
import CustomButton from "../../components/CustomButton";
import PdfUploader from "../../components/PdfUploader";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
  });
  // console.log(userData);

  const logout = () => {
    dispatch(logoutUser());
    router.replace('/sign-in');
  };

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
    <SafeAreaView className='bg-white h-full'>
      <View className='px-4 z-[99] bg-secondary w-full h-14 flex-row justify-between items-center'>
        <Text className='text-white text-2xl font-psemibold'>My Account</Text>
        <TouchableOpacity
          className='bg-orange h-10 w-10 flex-row items-center justify-center rounded-full'
          onPress={logout}
        >
          <Image
            source={icons.logout}
            resizeMode='contain'
            className='w-6 h-6'
          />
        </TouchableOpacity>
      </View>
      <ScrollView className='px-4'>
        <View className='w-full flex-row space-x-3 items-center mt-5'>
          <AvatarWithInitials
            name={userData?.fullName || userData?.user?.role}
          />
          <View className='w-[70%]'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-gray-500 capitalize text-xl font-pregular'>
                {userData?.fullName || userData?.user?.role}
              </Text>
              <Text
                className={`w-20 text-center py-0.5 rounded text-sm text-white capitalize ${
                  userData?.user?.role === "driver"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
              >
                {userData?.user?.role}
              </Text>
            </View>
            <Text className='text-gray-500 text-lg font-pregular'>
              {userData?.user?.email}
            </Text>
          </View>
        </View>
        <View className='bg-white p-2'>
          <View className='border-b-[1px] border-dotted border-secondary py-2 flex-row justify-end'>
            <Text className='capitalize text-gray-600 text-lg'>
              Joined{" "}
              <Text className='text-indigo-500 font-pregular'>
                {moment(userData?.user?.createdAt).format("MMMM Do YYYY")}
              </Text>
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-1'>
            <Text className='font-pmedium'>ID NO</Text>
            <Text className='text-gray-600'>{userData?.nationalId}</Text>
          </View>
          <View className='flex-row justify-between items-center py-1'>
            <Text className='font-pmedium'>Contact</Text>
            <Text className='text-gray-600'>{userData?.phoneNumber}</Text>
          </View>
        </View>
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
              <View className='bg-primary h-full w-full rounded items-center justify-center'>
                <View className='border-[1px] border-gray-300 border-dotted p-3 rounded-full'>
                  <Image
                    source={icons.camera}
                    className='h-8 w-8'
                    resizeMode='contain'
                  />
                </View>
              </View>
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
            ) : (
              <View className='bg-primary h-full w-full rounded items-center justify-center'>
                <View className='border-[1px] border-gray-300 border-dotted p-3 rounded-full'>
                  <Image
                    source={icons.camera}
                    className='h-8 w-8'
                    resizeMode='contain'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text className='text-base text-gray-600 font-pmedium'>
          Upload ID (Back-Side)
        </Text>
        <PdfUploader />
        <CustomButton
          title='Update Profile'
          handlePress={submit}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-psemibold text-xl'
        />
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default Profile;
