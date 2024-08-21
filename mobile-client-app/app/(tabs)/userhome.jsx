import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";
import { images } from "../../constants";
import { router } from "expo-router";
import HomeHeader from "../../components/HomeHeader";

const DriverHome = () => {
  const { userData } = useSelector((state) => state.user);

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
    // await refetch();
    setRefreshing(false);
  };

  const data = [
    { id: 0, title: "Add Trip (Comming soon...)", icon: "plus", route: "/add-trip" },
    { id: 1, title: "New Trip", icon: "plus", route: "/new-trip" },
    { id: 2, title: "Trip History", icon: "clock", route: "/userhome" },
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
              onPress={() =>
                router.push(item.route)
              }
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
      </View>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default DriverHome;
