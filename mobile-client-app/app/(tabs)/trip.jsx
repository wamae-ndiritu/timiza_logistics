import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { listTrips } from "../../lib/redux/actions/tripActions";
import { useFocusEffect } from "@react-navigation/native";
import TopBar from "../../components/TopBar";
import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "@env";
import Loading from "../../components/Loading";

// Initialize Geocoder with your API key
Geocoder.init(GOOGLE_API_KEY);

const Trips = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { trips, success, loading } = useSelector((state) => state.trip);

  const [refreshing, setRefreshing] = useState(false);
  const [locations, setLocations] = useState({});

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

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsData = {};

      for (const trip of trips) {
        if (trip.startLocation?.coordinates) {
          const [lng, lat] = trip.startLocation.coordinates;

          try {
            const response = await Geocoder.from(lat, lng);
            const address = response.results[0]?.formatted_address;
            locationsData[trip._id] = address || "Unknown Location";
          } catch (error) {
            // console.error("Error fetching location:", error);
            locationsData[trip._id] = "Unknown Location";
          }
        }
      }

      setLocations(locationsData);
    };

    if (trips.length > 0) {
      fetchLocations();
    }
  }, [trips]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trips/view/${item._id}`)}
      className='mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-2'
    >
      <View className='h-16 w-16 bg-slate-100 justify-center items-center rounded-full'>
        <Icon name='map-pin' size={28} color='#F8981D' />
      </View>
      <View>
        <View className="flex-row flex-wrap w-[95%]">
          <Text className='text-lg font-semibold text-gray-700'>
            {item.startLocation
              ? `${item.startLocation.coordinates[1]}, ${item.startLocation.coordinates[0]} - ${item.expectedDestination}`
              : "Unknown Location"}
          </Text>
        </View>
        <View className='w-full pr-5 flex-row space-x-4'>
          <Text className='text-sm text-gray-500'>
            {item.vehicle.vehicleNumberPlate}
          </Text>
          <Text className='text-sm text-gray-500'>
            {item.driver ? item.driver.fullName : "No Driver"}
          </Text>
        </View>
        <View className='w-[90%] flex-row justify-end'>
          {item.endLocation?.coordinates?.length > 0 ? (
            <Text className='text-sm text-gray-500'>
              {`${item.endLocation.coordinates[1]}, ${item.endLocation.coordinates[0]}`}
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
      <TopBar title='Trips' />
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
