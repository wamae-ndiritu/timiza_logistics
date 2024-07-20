import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";


const EmptyState = ({ title, subtitle }) => {
  return (
    <View className='border-[1px] border-gray-300 rounded-xl m-4 bg-white flex-col justify-center items-center px-4 py-12'>
      <Image
        source={icons.empty}
        className='w-20 h-16'
        resizeMode='contain'
      />
      <Text className='text-xl text-center font-psemibold text-orange mt-2'>
        {title}
      </Text>
      <Text className='text-secondary-500'>{subtitle}</Text>
    </View>
  );
};

export default EmptyState;
