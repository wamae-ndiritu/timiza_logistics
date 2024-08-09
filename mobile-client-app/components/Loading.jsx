import { View, ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
     <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color='#F8981D' />
      </View>)
}

export default Loading