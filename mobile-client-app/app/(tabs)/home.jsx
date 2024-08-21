import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons, images } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../components/DashboardCard";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import AdminRoute from "../../components/AdminRoute";
import { getStats } from "../../lib/redux/actions/globalActions";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userData } = useSelector((state) => state.user);
  const {stats} = useSelector((state) => state.global);

  const [refreshing, setRefreshing] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th"; // Handles 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDateTime = (date) => {
    const day = date.getDate();
    const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
    const time = date.toLocaleTimeString();

    return `${dayWithSuffix} ${dayOfWeek} ${month}, ${year}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getStats());
    setRefreshing(false);
  };

   useFocusEffect(
     useCallback(() => {
       dispatch(getStats());
     }, [dispatch])
   );


  const data = [
    { id: 0, title: "Trips", stats: stats?.tripCount || 0, icon: icons.tripTruck, color: "bg-slate-200" },
    { id: 1, title: "Drivers", stats: stats?.driverCount || 0, icon: icons.driver, color: "bg-lime-200" },
    { id: 2, title: "Loaders", stats: stats?.loaderCount || 0, icon: icons.loader, color: "bg-lime-300" },
    { id: 3, title: "Vehicles", stats: stats?.vehicleCount || 0, icon: icons.deliveryTruck, color: "bg-slate-300" },
  ];

  return (
    <AdminRoute>
      <SafeAreaView className='bg-white flex-1'>
        <View className='bg-secondary h-4'></View>
        <View className='bg-white pt-4'>
          <View className='flex-row justify-between items-center px-4'>
            <Image
              source={images.logoHorizontal}
              className='w-44 h-10'
              resizeMode='contain'
            />
            <TouchableOpacity
              className='flex-row space-x-2 items-center'
              onPress={() => router.push("/profile")}
            >
              <Text className='text- font-semibold text-orange capitalize'>
                Hi, {userData?.fullName || userData?.user?.role}
              </Text>
              <Icon name='user' size={20} color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <View className='mx-4 mt-6'>
          <View className='bg-secondary p-4 rounded-lg flex-row items-center space-x-4'>
            <View className='bg-primary p-2 rounded-full'>
              <Icon name='calendar' size={24} color='#000' />
            </View>
            <View>
              <Text className='text-white text-lg'>
                {formatDateTime(dateTime)}
              </Text>
              <Text className='text-orange'>
                {dateTime.toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
        <View className='my-6 mx-4'>
          <Text className='text-xl font-semibold text-gray-700 mb-4'>
            Dashboard
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            key={(item) => `${item.id}`}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <DashboardCard
                title={item.title}
                stats={item.stats}
                icon={item.icon}
                color={item.color}
                containerStyles='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-1 mx-1'
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <Text className='text-xl font-semibold text-gray-700 mb-4'>
            More Actions
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/new-vehicle")}
            className='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4'
          >
            <Icon name='plus' size={24} color='#000' />
            <Text className='text-lg font-semibold text-gray-700'>
              Add Vehicle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/vehicles")}
            className='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4'
          >
            <Icon name='truck' size={24} color='#000' />
            <Text className='text-lg font-semibold text-gray-700'>
              Vehicles
            </Text>
          </TouchableOpacity>
        </View>
        <StatusBar backgroundColor='#2A7353' style='light' />
      </SafeAreaView>
    </AdminRoute>
  );
};

export default Home;
