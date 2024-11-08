import { View, Text, Image } from 'react-native'
import React from 'react'

const Message = ({
  icon,
  variantStyles = "bg-orange-100",
  descriptionStyles = "text-red-300",
  description
}) => {
  return (
    <View
      className={`mb-4 px-4 py-2 space-x-4 flex-row items-center justify-center ${variantStyles}`}
    >
      <Image source={icon} className='w-6 h-6' resizeMode='contain' />
      <View className='flex-col'>
        <Text className={`text-sm ${descriptionStyles}`}>{description}</Text>
      </View>
    </View>
  );
};

export default Message