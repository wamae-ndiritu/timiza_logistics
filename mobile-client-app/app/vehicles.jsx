import { View, Text, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { listVehicles } from "../lib/redux/actions/vehicleActions";
import TopBar from "../components/TopBar";
import Loading from "../components/Loading";

const Vehicles = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {vehicles, successUpdate, successDelete, loading} = useSelector((state) => state.vehicle);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listVehicles());
    setRefreshing(false);
  };


  useFocusEffect(
    useCallback(() => {
      dispatch(listVehicles());
    }, [dispatch, successDelete, successUpdate])
  );


  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/vehicles/view/${item._id}`)}
      className='mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-2'
    >
      <View className='h-16 w-16 bg-slate-100 justify-center items-center rounded-full'>
        <Icon name='truck' size={28} color='#F8981D' />
      </View>
      <View>
        <Text className='text-lg font-semibold text-gray-700'>
          {item.vehicleMake} {item.vehicleModel}
        </Text>
        <View className='w-full pr-5 flex-row space-x-4 overflow-x-hidden'>
          <Text className='text-sm text-gray-500'>
            {item.vehicleNumberPlate}
          </Text>
          <Text className='text-sm text-gray-500 overflow-x-hidden'>
            {item.ownerName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title='Vehicles'>
        <Link href='/new-vehicle'>
          <Icon name='plus' size={24} color='#FFF' />
        </Link>
      </TopBar>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Vehicles;
