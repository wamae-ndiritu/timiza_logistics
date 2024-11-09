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
import Icon from "react-native-vector-icons/Feather";
import { resetUserState } from "../../lib/redux/slices/users";
import CustomButton from "../../components/CustomButton";
import {
  getUserProfile,
  logout,
  updateProfile,
} from "../../lib/redux/actions/userActions";
import Loading from "../../components/Loading";
import {
  uploadImageToCloudinary,
  uploadPdfToCloudinary,
} from "../../lib/cloudinary";
import * as DocumentPicker from "expo-document-picker";
import PDFPreview from "../../components/PDFPreview";
import TopBar from "../../components/TopBar";

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, profile, updateSuccess, loading, error } = useSelector(
    (state) => state.user
  );

  const [form, setForm] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
    drivingLicense: null,
  });
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadErrFront, setUploadErrFront] = useState(null);
  const [uploadErrBack, setUploadErrBack] = useState(null);
  const [uploadingDL, setUploadingDL] = useState(false);
  const [dl, setDL] = useState(null);

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
        } finally {
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
        } finally {
          setUploadingBack(false);
        }
      }
    }
  };

  const openDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.type !== "cancel") {
      setForm({ ...form, drivingLicense: result.assets[0].uri });
      setUploadingDL(true);
      try {
        const data = await uploadPdfToCloudinary(result.assets[0]);
        setForm({ ...form, drivingLicense: data.secure_url });
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setUploadingDL(false);
      }
    }
  };

  const submit = async () => {
    if (!form.nationalIdFront || !form.nationalIdBack || !form.drivingLicense) {
      Alert.alert("Error", "Please upload all documents!");
      return;
    }
    dispatch(
      updateProfile({
        ...form,
        nationalIdFront: form.nationalIdFront.uri,
        nationalIdBack: form.nationalIdBack.uri,
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserProfile());
    }, [dispatch])
  );

  useEffect(() => {
    if (updateSuccess) {
      dispatch(getUserProfile());
      const interval = setInterval(() => {
        dispatch(resetUserState());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (profile) {
      setForm({
        nationalIdFront: profile.nationalIdFront,
        nationalIdBack: profile.nationalIdBack,
      });
      setDL(profile.drivingLicense);
    }
  }, [profile]);

  return (
    <SafeAreaView className='bg-white h-full'>
      <TopBar title='My Account'>
        <TouchableOpacity
          onPress={handleLogout}
        >
          <Icon name='log-out' size={24} color='#fff' />
        </TouchableOpacity>
      </TopBar>
      <ScrollView className='px-4'>
        {loading && <Loading />}

        {/* User Info Section */}
        <View className='mt-6 flex-row items-center space-x-4 bg-slate-200 p-4 rounded-lg'>
          <AvatarWithInitials
            name={userData?.fullName || userData?.user?.role}
          />
          <View>
            <Text className='text-gray-800 text-xl font-psemibold'>
              {userData?.fullName || userData?.user?.role}
            </Text>
            <Text className='text-gray-600 text-lg'>
              {userData?.user?.email}
            </Text>
          </View>
        </View>

        {/* Profile Details Section */}
        <View className='bg-white p-4 mt-4 border border-gray-200 rounded-lg'>
          <Text className='text-indigo-500 text-lg mb-2'>Account Details</Text>
          <View className='flex-row justify-between py-1'>
            <Text className='font-pmedium'>Joined</Text>
            <Text className='text-gray-600'>
              {moment(userData?.user?.createdAt).format("MMMM Do YYYY")}
            </Text>
          </View>
          <View className='flex-row justify-between py-1'>
            <Text className='font-pmedium'>ID No.</Text>
            <Text className='text-gray-600'>{userData?.nationalId}</Text>
          </View>
          <View className='flex-row justify-between py-1'>
            <Text className='font-pmedium'>Contact</Text>
            <Text className='text-gray-600'>{userData?.phoneNumber}</Text>
          </View>
        </View>

        {/* Document Upload Section */}
        <View className='mt-8 space-y-4'>
          <Text className='text-lg text-gray-700 font-semibold'>Documents</Text>

          {/* ID Front */}
          <View>
            <Text className='text-base text-gray-600'>
              Upload ID (Front-Side)
            </Text>
            <TouchableOpacity
              className='bg-slate-100 border border-gray-100 p-2 rounded-lg mt-2'
              onPress={() => openPicker("front")}
            >
              {form.nationalIdFront ? (
                <Image
                  source={{
                    uri: form.nationalIdFront.uri || form.nationalIdFront,
                  }}
                  resizeMode='cover'
                  className='w-full h-48 rounded-lg'
                />
              ) : (
                <Text className='text-center text-gray-500'>
                  Tap to upload ID front
                </Text>
              )}
            </TouchableOpacity>
            {uploadingFront && <Loading color='green' />}
            {uploadErrFront && (
              <Text className='text-red-500'>{uploadErrFront}</Text>
            )}
          </View>

          {/* ID Back */}
          <View>
            <Text className='text-base text-gray-600'>
              Upload ID (Back-Side)
            </Text>
            <TouchableOpacity
              className='bg-slate-100 border border-gray-100 p-2 rounded-lg mt-2'
              onPress={() => openPicker("back")}
            >
              {form.nationalIdBack ? (
                <Image
                  source={{
                    uri: form.nationalIdBack.uri || form.nationalIdBack,
                  }}
                  resizeMode='cover'
                  className='w-full h-48 rounded-lg'
                />
              ) : (
                <Text className='text-center text-gray-500'>
                  Tap to upload ID back
                </Text>
              )}
            </TouchableOpacity>
            {uploadingBack && <Loading color='green' />}
            {uploadErrBack && (
              <Text className='text-red-500'>{uploadErrBack}</Text>
            )}
          </View>

          {/* Driving License PDF */}
          <View className='my-2'>
            <Text className='text-base text-gray-600 pb-2'>
              Driver License (PDF)
            </Text>
            <TouchableOpacity
              className='bg-gray-100 border border-gray-300 p-4 rounded-lg'
              onPress={openDocumentPicker}
            >
              {form.drivingLicense ? (
                <Text className='text-blue-500 underline'>
                  {form.drivingLicense.split("/").pop()}
                </Text>
              ) : (
                <Text className='text-center text-gray-500'>
                  Tap to upload your driving license
                </Text>
              )}
            </TouchableOpacity>
            {uploadingDL && <Loading color='blue' />}
            {dl && (
              <View className='mt-2 bg-gray-100 rounded-lg'>
                <PDFPreview
                  form={{ drivingLicense: dl }}
                  fileField='drivingLicense'
                />
              </View>
            )}
          </View>
        </View>

        {/* Submit Button */}
        <CustomButton
          title='Submit'
          onPress={submit}
          className='my-8'
          isLoading={uploadErrFront || uploadErrFront || loading || uploadingDL}
        />
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default Profile;
