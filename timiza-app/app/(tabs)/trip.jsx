import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { listTrips } from "../../lib/redux/actions/tripActions";
import { useFocusEffect } from "@react-navigation/native";
import TopBar from "../../components/TopBar";
import Loading from "../../components/Loading";


const Trips = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { trips, success, loading } = useSelector((state) => state.trip);

  const {userData} = useSelector((state) => state.user);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listTrips());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(listTrips());
    }, [dispatch, success])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trips/view/${item._id}`)}
      className='mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-2'
    >
      <View className='h-16 w-16 bg-slate-100 justify-center items-center rounded-full'>
        <Icon name='map-pin' size={28} color='#F8981D' />
      </View>
      <View>
        <View className='flex-row flex-wrap w-[95%]'>
          <Text className='text-lg font-semibold text-gray-700'>
            {item.startLocation} -{" "}
            {item.destinations[item.destinations.length - 1].location?.name +
              " " +
              item.destinations[item.destinations.length - 1].location?.type}
          </Text>
        </View>
        <View className='w-full pr-5 flex-row flex-wrap space-x-4'>
          <Text className='text-sm text-gray-500'>
            {item.vehicle?.vehicleNumberPlate}
          </Text>
          {userData?.user?.role === "admin" && (
            <Text className='text-sm text-gray-500'>
              {item.driver ? item.driver.fullName : "No Driver"}
            </Text>
          )}
        </View>
        <View className='w-[90%] flex-row justify-end'>
          {item.endTime ? (
            <Text className='text-sm text-center bg-slate-200 px-2 py-1 rounded-full text-secondary'>
              {item?.timeSpent.slice(0, 6)}... spent
            </Text>
          ) : (
            <Text className='w-20 text-sm text-center bg-slate-200 px-2 py-0.5 rounded-full text-green-600'>
              Ongoing
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title='Trips'>
        {userData?.user?.role !== "admin" && (
          <Link href='/new-trip'>
            <Icon name='plus' size={24} color='#FFF' />
          </Link>
        )}
      </TopBar>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={trips}
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

export default Trips;
