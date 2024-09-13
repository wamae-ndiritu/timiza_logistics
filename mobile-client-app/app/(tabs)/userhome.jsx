import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import HomeHeader from "../../components/HomeHeader";
import { getUserAssignedTruck } from "../../lib/redux/actions/userActions";

const DriverHome = () => {
  const dispatch = useDispatch();
  const { currentTruck, userData } = useSelector((state) => state.user);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getUserAssignedTruck(userData?.user?.id));
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(getUserAssignedTruck(userData?.user?.id));
  }, [dispatch])

  const data = [
    // { id: 0, title: "Add Trip (Comming soon...)", icon: "plus", route: "/add-trip" },
    { id: 1, title: "New Trip", icon: "plus", route: "/new-trip" },
    { id: 2, title: "Trip History", icon: "clock", route: "/trip" },
  ];

  return (
    <SafeAreaView className='bg-white flex-1'>
      <HomeHeader />
      <View className='my-6 mx-4'>
        <Text className='text-xl font-semibold text-gray-700 mb-4'>
          Dashboard
        </Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(item.route)}
              className='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4'
            >
              <Icon name={item.icon} size={24} color='#000' />
              <Text className='text-lg font-semibold text-gray-700'>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        {currentTruck && (
          <>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Current Truck
            </Text>
            <View className='bg-secondary py-2 px-4 rounded flex-row items-center space-x-4'>
              <Icon name='truck' size={60} color='#FFFFFF' />
              <View>
                <Text className='uppercase text-xl text-white'>
                  {currentTruck?.vehicleNumberPlate}
                </Text>
                <Text className='text-white'>
                  {currentTruck?.vehicleMake} {currentTruck?.vehicleModel}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default DriverHome;
