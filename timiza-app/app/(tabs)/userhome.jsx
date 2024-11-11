import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Easing,
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
  const [moveAnim] = useState(new Animated.Value(0)); // Animation value for truck movement
  const [flipAnim] = useState(new Animated.Value(1)); // Animation for truck flipping

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getUserAssignedTruck(userData?.user?.id));
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(getUserAssignedTruck(userData?.user?.id));
    startTruckAnimation();
  }, [dispatch]);

  // Animation function for truck moving back and forth with flipping
  const startTruckAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 200, // Move to the end of the road
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: -1, // Flip the truck horizontally
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0, // Move back to the start
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 1, // Flip back to the original orientation
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const data = [
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
            <Text className='text-xl text-center font-semibold text-gray-700 mb-4'>
              Current Assigned Truck
            </Text>

            {/* Road View */}
            <View className='relative h-20 mb-6 justify-center bg-white rounded-lg border border-gray-300'>
              <View
                className='absolute bottom-3 left-0 right-0 mx-4'
                style={{
                  height: 2,
                  backgroundColor: "#333", // Darker line for the road positioned lower
                }}
              />

              {/* Animated Truck Icon */}
              <Animated.View
                style={{
                  transform: [{ translateX: moveAnim }, { scaleX: flipAnim }],
                }}
                className='absolute top-1/4 left-0 flex-row items-center justify-center'
              >
                <Icon name='truck' size={40} color='#2A7353' />
              </Animated.View>
            </View>

            {/* Truck Details */}
            <View className='bg-slate-100 p-8 flex-col items-center rounded-lg'>
              <Text className='uppercase text-xl text-gray-700 font-semibold'>
                {currentTruck?.vehicleNumberPlate}
              </Text>
              <Text className='text-gray-600'>
                {currentTruck?.vehicleMake}
              </Text>
              <Text className='text-gray-600'>
               {currentTruck?.vehicleModel}
              </Text>
            </View>
          </>
        )}
      </View>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default DriverHome;
