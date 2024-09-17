import { View, ActivityIndicator } from 'react-native'
import React from 'react'

const Loading = ({color="#F8981D"}) => {
  return (
     <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size='large' color={color} />
      </View>)
}

export default Loading