import React from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

export default function Explore() {
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full justify-center items-center min-h-[95vh] px-4'>
          <Image
            source={images.vehicle}
            className='max-w--[320px] w-full h-[200px]'
            resizeMode='contain'
          />
          <Text className='text-secondary font-pbold text-4xl mt-5'><Text className="uppercase text-orange">Welcome to</Text> Timiza Logistics</Text>
          <Text className='text-xl font-pregular text-black-300 text-center mt-5'>
            We specialize in last-mile freight transport in Kenya. Our
            experienced team provides safe and timely delivery, building
            long-term client relationships.
          </Text>
          <CustomButton
            title='Get Started'
            handlePress={() => router.push("/sign-in")}
            containerStyles='w-3/4 mt-7 rounded-full py-2'
            textStyles='text-xl text-white-100'
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#E0DEDB' style='light' />
    </SafeAreaView>
  );
}
