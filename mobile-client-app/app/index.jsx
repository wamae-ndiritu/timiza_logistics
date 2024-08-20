import React from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

export default function IndexScreen() {
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full justify-center items-center min-h-[95vh] px-8'>
          <Image
            source={images.logoVertical}
            className='max-w-[320px] w-full h-[200px]'
            resizeMode='contain'
          />
          {/* <Text className='text-xl font-pregular text-black-300 text-center mt-5'>
            Where creativity meets innovation: embark on a journey of limitless
            with Aora
          </Text> */}
          <CustomButton
            title='Continue'
            handlePress={() => router.push("/sign-in")}
            containerStyles='w-full mt-7'
            textStyles="text-xl text-white-100"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#E0DEDB' style='light' />
    </SafeAreaView>
  );
}
