import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const DeliveryList = () => {
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='px-4 z-[99] bg-secondary w-full h-16 flex-row justify-between items-center'>
        <Text className='text-white text-2xl font-psemibold'>Deliveries</Text>
        <Link
          href='/new'
          className='bg-primary px-2 py-1 text-gray-600 rounded shadow'
        >
          Add New
        </Link>
      </View>
      <ScrollView className='px-4'>
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
}

export default DeliveryList