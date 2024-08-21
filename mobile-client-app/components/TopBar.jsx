import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from "react-native-vector-icons";
import { router } from 'expo-router';

const TopBar = ({title, children}) => {
  return (
    <View className='px-4 bg-secondary w-full h-16 flex-row items-center z-[99]'>
      <TouchableOpacity className='flex-1' onPress={() => router.back()}>
        <Feather name='arrow-left' size={24} color='white' />
      </TouchableOpacity>
      <View className='flex-2 flex-row justify-center'>
        <Text className='text-white text-2xl font-semibold'>{title}</Text>
      </View>
      <View className="flex-1 flex-row justify-end">{children}</View>
      <View />
    </View>
  );
}

export default TopBar