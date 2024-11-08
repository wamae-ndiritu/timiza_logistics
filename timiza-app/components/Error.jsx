import { View, Text } from 'react-native'
import React from 'react'

const Error = ({children}) => {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-red-600'>{children}</Text>
    </View>
  );
}

export default Error