import { View, Text, ScrollView, FlatList, RefreshControl, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useDispatch, useSelector} from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { listDeliveries } from '../../../lib/redux/actions/deliveryActions';
import moment from "moment"

const DeliveryList = () => {
  const dispatch = useDispatch();
  const {loading, deliveries, error} = useSelector((state) => state.delivery);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listDeliveries());
    setRefreshing(false);
  };

   useFocusEffect(
     useCallback(() => {
       dispatch(listDeliveries());
     }, [dispatch])
   );

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
      <View className="mx-2 my-1">
        {loading ? (
          <Text className='px-2 text-base text-green-500 font-pregular py-0.5'>
            Fetching deliveries...
          </Text>
        ) : (
          error && (
            <Text className='px-2 text-base text-red-500 font-pregular bg-red-100 py-1 rounded'>
              {error}
            </Text>
          )
        )}
      </View>
      <FlatList
        className=''
        data={deliveries}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className='p-2 my-2 border border-gray-300 rounded mx-2 flex-row space-x-2'>
            <Image
              source={{ uri: item.fileRef }}
              className='h-[100px] w-1/2'
              resizeMode='cover'
            />
            <View className='flex-1 relative'>
              <Text className='bg-green-500 text-white px-1 py-0.1 rounded text-md absolute top-0 right-0'>
                {moment(item.createdAt).format("MMMM Do YYYY")}
              </Text>
              <View className='mt-6'>
                <View className='w-full flex-row justify-between items-center'>
                  <Text className='font-psemibold'>Driver:</Text>
                  <Text className='capitalize text-gray-600 text-base'>
                    {item.driverName}
                  </Text>
                </View>
                <View className='w-full flex-row justify-between items-center'>
                  <Text className='font-psemibold'>Loaders:</Text>
                  <Text className='capitalize text-gray-600 text-base'>
                    {item.loadersName.join(", ")}
                  </Text>
                </View>
                <View className='w-full flex-row justify-between items-center'>
                  <Text className='font-psemibold'>#ID:</Text>
                  <Text className='capitalize text-gray-600 text-base'>
                    {item.deliveryNotesNumber.join(" ")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Deliveries'
            subtitle='All deliveries made will be listed here.'
          />
        )}
      />
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
}

export default DeliveryList