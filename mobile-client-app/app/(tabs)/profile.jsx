import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import AvatarWithInitials from "../../components/AvatarWithInitials";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "../../constants";
import { resetUserState } from "../../lib/redux/slices/users";
import CustomButton from "../../components/CustomButton";
import { getUserProfile, logout, updateProfile } from "../../lib/redux/actions/userActions";
import Loading from "../../components/Loading";
import { uploadImageToCloudinary } from "../../lib/cloudinary";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, profile, updateSuccess, loading,  error } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
  });
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadErrFront, setUploadErrFront] = useState(null);
  const [uploadErrBack, setUploadErrBack] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const openPicker = async (side) => {
    setUploadErrFront(null);
    setUploadErrBack(null);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      if (side === "front") {
        setForm({ ...form, nationalIdFront: result.assets[0] });
        setUploadingFront(true);
       try {
         const response = await uploadImageToCloudinary(result.assets[0]);
         setForm({ ...form, nationalIdFront: { uri: response.secure_url } });
       } catch (error) {
        setUploadErrFront(error.message);
       } finally{
        setUploadingFront(false);
       }
      } else {
        setForm({ ...form, nationalIdBack: result.assets[0] });
        setUploadingBack(true);
         try {
          const response = await uploadImageToCloudinary(result.assets[0]);
          setForm({ ...form, nationalIdBack: { uri: response.secure_url } });
         } catch (error) {
          setUploadErrBack(error.message);
         }finally{
          setUploadingBack(false);
         }
      }
    }
  };


  const submit = async () => {
    if (!form.nationalIdFront || !form.nationalIdBack) {
      Alert.alert("Please select both front and back images");
      return;
    }
    dispatch(updateProfile({nationalIdFront: form.nationalIdFront.uri, nationalIdBack: form.nationalIdBack.uri}));
  };


  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfile());
    }, [dispatch, userData?.user?.role])
  );

  useEffect(() => {
    if (updateSuccess){
      dispatch(getUserProfile());
      const interval = setInterval(() => {
        dispatch(resetUserState());
      }, 5000)

      return () => clearInterval(interval);
    }
  }, [updateSuccess])

  useEffect(() => {
    if (profile){
      setForm({nationalIdFront: profile.nationalIdFront, nationalIdBack: profile.nationalIdBack})
    }
  }, [profile])

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='px-4 z-[99] bg-secondary w-full h-14 flex-row justify-between items-center'>
        <Text className='text-white text-2xl font-psemibold'>My Account</Text>
        <TouchableOpacity
          className='bg-orange h-10 w-10 flex-row items-center justify-center rounded-full'
          onPress={handleLogout}
        >
          <Image
            source={icons.logout}
            resizeMode='contain'
            className='w-6 h-6'
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : (
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
                  source={{
                    uri: form.nationalIdFront.uri || form.nationalIdFront,
                  }}
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
            {uploadingFront ? (
              <View className='flex-row items-center space-x-2'>
                <Text className='px-2 text-base text-green-500 font-pregular py-0.5'>
                  Uploading...
                </Text>
                <Loading color='green' />
              </View>
            ) : (
              uploadErrFront && (
                <Text className='px-2 text-base text-red-500 font-pregular bg-red-100 py-1 rounded'>
                  {uploadErrFront}
                </Text>
              )
            )}
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
                  source={{
                    uri: form.nationalIdBack.uri || form.nationalIdBack,
                  }}
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
            {uploadingBack ? (
              <View className='flex-row items-center space-x-2'>
                <Text className='px-2 text-base text-green-500 font-pregular py-0.5'>
                  Uploading...
                </Text>
                <Loading color='green' />
              </View>
            ) : (
              uploadErrBack && (
                <Text className='px-2 text-base text-red-500 font-pregular bg-red-100 py-1 rounded'>
                  {uploadErrBack}
                </Text>
              )
            )}
          </View>
          {/* <PdfUploader /> */}
          <CustomButton
            title={
              uploadErrFront || uploadErrFront || loading
                ? "Please wait..."
                : "Update Profile"
            }
            handlePress={submit}
            containerStyles='my-7 bg-orange rounded min-h-[45px]'
            textStyles='text-white font-psemibold text-xl'
            isLoading={uploadErrFront || uploadErrFront || loading}
          />
        </ScrollView>
      )}
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default Profile;
