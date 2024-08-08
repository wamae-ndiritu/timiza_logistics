import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity } from 'react-native'
import React, { useCallback,  useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {useDispatch, useSelector} from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { listDeliveries } from '../../../lib/redux/actions/deliveryActions';
import moment from "moment"
import EmptyState from '../../../components/EmptyState';

const DeliveryList = () => {
  const dispatch = useDispatch();
  const {loading, deliveries, error, successDelete} = useSelector((state) => state.delivery);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listDeliveries());
    setRefreshing(false);
  };

   useFocusEffect(
     useCallback(() => {
       dispatch(listDeliveries());
     }, [dispatch, successDelete])
   );

   const renderItem = ({ item }) => (
     <TouchableOpacity
       className='p-2 my-2 border border-gray-300 rounded mx-2 flex-col space-x-2'
       onPress={() => router.push(`/view-delivery/${item._id}`)}
     >
       <Image
         source={{ uri: item.fileRef }}
         className='h-[150px] w-full'
         resizeMode='cover'
       />
       <View className='flex-1 relative mt-1'>
         <Text className='bg-orange text-white px-2 py-1 text-md absolute top-0 right-0'>
           {moment(item.createdAt).format("MMMM Do YYYY")}
         </Text>
         <View className='mt-3'>
           <Text className='text-gray-600 text-base text-lg'>
             Driver{" "}
             <Text className='capitalize text-green-500'>
               {item.driverName}
             </Text>
           </Text>
           <Text className='text-gray-600 text-base text-lg'>
             Loaded by{" "}
             <Text className='capitalize text-green-500'>
               {item.loadersName.join(", ")}
             </Text>
           </Text>
           <Text className='text-gray-600 text-base text-lg'>
             Delivery Notes No:{" "}
             <Text className='capitalize text-orange'>
               {item.deliveryNotesNumber.join(", ")}
             </Text>
           </Text>
         </View>
       </View>
     </TouchableOpacity>
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
      <View className='mx-2 my-1'>
        
      </View>
      <FlatList
        className=''
        data={deliveries}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
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