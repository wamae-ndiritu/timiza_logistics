import React, { useEffect, useState } from "react";
import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";
import { router } from "expo-router";

export default function IndexScreen() {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    // Redirect to the sign-in page after 5 seconds
    const timer = setTimeout(() => {
      router.push("/sign-in");
    }, 5000);

    // Interval for dot animation
    const dotTimer = setInterval(() => {
      setDotIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 500);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(timer);
      clearInterval(dotTimer);
    };
  }, []);

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className='w-full justify-center items-center min-h-[95vh] px-8'>
          <Image
            source={images.logoVertical}
            className='max-w-[320px] w-full h-[200px]'
            resizeMode='contain'
          />

          {/* Three-Dot Loading Indicator */}
          <View className='flex-row mt-7 space-x-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <View
                key={index}
                className={`h-3 w-3 rounded-full ${
                  dotIndex === index ? "bg-secondary" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#E0DEDB' style='light' />
    </SafeAreaView>
  );
}
