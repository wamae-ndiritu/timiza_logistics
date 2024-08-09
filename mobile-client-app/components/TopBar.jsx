import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Feather } from "react-native-vector-icons";
import { router } from 'expo-router';

const TopBar = ({title}) => {
  return (
    <View className='px-4 bg-secondary w-full h-16 flex-row justify-between items-center z-[99]'>
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name='arrow-left' size={24} color='white' />
      </TouchableOpacity>
      <Text className='text-white text-2xl font-semibold'>
        {title}
      </Text>
      <View />
    </View>
  );
}

export default TopBar