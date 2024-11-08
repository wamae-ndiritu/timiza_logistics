import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "../constants";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Feather";

const HomeHeader = () => {
  const { userData } = useSelector((state) => state.user);
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
  return (
    <>
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
            <Text className='text-orange'>{dateTime.toLocaleTimeString()}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeHeader;
