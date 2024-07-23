import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons, images } from "../../constants";
import DashboardCard from "../../components/DashboardCard";
import { useSelector } from "react-redux";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  // const { data: posts, refetch } = useAppwrite(getAllPosts);
  // const { data: latestPosts } = useAppwrite(getLatestPosts);

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
    { id: 3, title: "Trips", stats: 15, icon: icons.tripTruck },
    { id: 0, title: "Drivers", stats: 5, icon: icons.driver },
    { id: 1, title: "Loaders", stats: 3, icon: icons.loader },
    { id: 2, title: "Vehicles", stats: 10, icon: icons.deliveryTruck },
  ];

  const notifications = [
    {
      id: 1,
      message: "New trip has been recorded. Click to view details.",
    },
    {
      id: 2,
      message: "Truck details has been updated.",
    },
    {
      id: 3,
      message: "New trip has been recorded. Click to view details.",
    },
    {
      id: 4,
      message: "New trip has been recorded. Click to view details.",
    },
    {
      id: 5,
      message: "New trip has been recorded. Click to view details.",
    },
  ];

  return (
    <SafeAreaView className='bg-white h-full'>
      <View
        View
        className='bg-secondary py-0.5'
      ></View>
      <View className='flex-row justify-between items-center flex-row my-3 px-4 py-2 border-b border-green-500 border-dotted'>
        <Image
          source={images.logoHorizontal}
          className='w-[180px] h-[38px]'
          resizeMode='contain'
        />
        <View className="flex-row space-x-2">
          <Text className='font-psemibold text-xl text-gray-600'>Hi,</Text>
          <Text className='text-xl font-psemibold text-orange capitalize'>
            {userData?.fullName}
          </Text>
        </View>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              className='flex gap-4'
              renderItem={({ item }) => (
                <DashboardCard
                  title={item.title}
                  stats={item.stats}
                  icon={item.icon}
                  containerStyles='w-[150px] mx-1 h-[100px] bg-secondary'
                />
              )}
              horizontal
            />
            <View className='mx-2'>
              <View className='bg-orange p-8 rounded my-6 flex-row space-x-4 space-y-2 relative'>
                <View className='bg-primary justify-center rounded py-1'>
                  <Image
                    source={icons.schedule}
                    className='h-[60px] w-[80px]'
                    resizeMode='contain'
                  />
                </View>
                <View className='flex-col'>
                  <Text className='text-white font-pregular text-xl'>
                    {formatDateTime(dateTime)}
                  </Text>
                  <Text className='text-secondary font-pbold text-xl space-y-2'>
                    {dateTime.toLocaleTimeString()}
                  </Text>
                </View>
                <Image
                  source={icons.menu}
                  className='h-8 w-8 absolute top-0 right-0'
                  resizeMode='contain'
                />
              </View>
              <View className='bg-secondary rounded p-2'>
                <Text className='text-white'>Hey there</Text>
              </View>
              <View className='space-y-2 my-6'>
                <Text className='text-2xl font-psemibold text-secondary'>
                  Notifications
                </Text>
              </View>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <View className='bg-white rounded border-[1px] border-dotted border-black-300 p-2 flex-row items-start justify-between my-1 mx-2'>
            <View className='pr-4'>
              <Text className='text-black text-base pr-4'>{item.message}</Text>
            </View>
            <Image
              source={icons.eye}
              className='h-6 w-6'
              resizeMode='contain'
            />
          </View>
        )}
      />
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default Home;
