import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AvatarWithInitials from "../../components/AvatarWithInitials";
import { useSelector } from "react-redux";
import { icons } from "../../constants";
import InvoiceUpload from "../../components/InvoiceUpload";
import UploadDocument from "../../components/UploadDocument";

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  // console.log(userData);

  const logout = () => {};
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='px-4 bg-secondary w-full h-14 flex-row justify-between items-center'>
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
      <ScrollView className="px-4">
        <View className='px-4 w-full flex-row space-x-3 items-center mt-5'>
          <AvatarWithInitials name='Wamae Ndiritu' />
          <View>
            <Text className='text-gray-500 capitalize text-xl font-pregular'>
              {userData?.fullName || userData?.user?.role}
            </Text>
            <Text className='text-gray-500 text-lg font-pregular'>
              {userData?.user?.email}
            </Text>
          </View>
        </View>
        <View className='bg-white p-2'>
          <View className='border-b-[1px] border-dotted border-secondary py-2 flex-row items-center justify-between'>
            <Text className='capitalize text-gray-600'>Role</Text>
            <Text
              className={`w-20 text-center px-2 py-0.5 rounded-full text-sm text-white capitalize ${
                userData?.user?.role === "driver"
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            >
              {userData?.user?.role}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-1'>
            <Text className='font-pmedium'>ID NO</Text>
            <Text className='text-gray-600'>{userData?.user?.nationalId}</Text>
          </View>
        </View>
        <UploadDocument />
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default Profile;
