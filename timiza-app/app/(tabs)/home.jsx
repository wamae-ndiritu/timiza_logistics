import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../components/DashboardCard";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import AdminRoute from "../../components/AdminRoute";
import { getStats } from "../../lib/redux/actions/globalActions";
import HomeHeader from "../../components/HomeHeader";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {stats} = useSelector((state) => state.global);
  const {userData} = useSelector((state) => state.user);


  const [refreshing, setRefreshing] = useState(false);


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
    { id: 0, title: "Trips", stats: stats?.tripCount || 0, icon: icons.tripTruck, color: "bg-slate-200", href: "/trip" },
    { id: 1, title: "Drivers", stats: stats?.driverCount || 0, icon: icons.driver, color: "bg-lime-200" , href: "/staff"},
    { id: 2, title: "Loaders", stats: stats?.loaderCount || 0, icon: icons.loader, color: "bg-lime-300", href: "/staff" },
    { id: 3, title: "Vehicles", stats: stats?.vehicleCount || 0, icon: icons.deliveryTruck, color: "bg-slate-300", href: "/vehicles" },
  ];

  return (
    <AdminRoute>
      <SafeAreaView className='bg-white flex-1'>
       <HomeHeader />
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
                href={item.href}
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
            onPress={() => router.push("/locations/")}
            className='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4'
          >
            <Icon name='map-pin' size={24} color='#000' />
            <Text className='text-lg font-semibold text-gray-700'>
              Destinations
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
