import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getTripById } from "../../../lib/redux/actions/tripActions";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";

const TripViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentTrip, loading, error, successUpdate } = useSelector(
    (state) => state.trip
  );

  useEffect(() => {
    if (id) {
      dispatch(getTripById(id));
    }
  }, [dispatch, id, successUpdate]);

  const handleAttachDeliveryNote = () => {
    if (currentTrip?.deliveryNote){
      router.push(`/view-delivery/${currentTrip?.deliveryNote?._id}`);
    } else {
      router.push(`/trips/${id}/attach-delivery-note`);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title='View Trip' />
      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Trip Information */}
          <View className='mb-4 p-4 bg-gray-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Trip Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Start Location:{" "}
              {currentTrip?.startLocation?.coordinates
                ? `${currentTrip.startLocation.coordinates[1]}, ${currentTrip.startLocation.coordinates[0]}`
                : "Unknown"}
            </Text>
            <Text className='text-sm text-gray-600'>
              End Location:{" "}
              {currentTrip?.endLocation?.coordinates.length > 0
                ? `${currentTrip.endLocation.coordinates[1]}, ${currentTrip.endLocation.coordinates[0]}`
                : "Ongoing"}
            </Text>
            <Text className='text-sm text-gray-600'>
              Start Time: {new Date(currentTrip?.startTime).toLocaleString()}
            </Text>
            <Text className='text-sm text-gray-600'>
              End Time:{" "}
              {currentTrip?.endTime
                ? new Date(currentTrip.endTime).toLocaleString()
                : "Ongoing"}
            </Text>
            <Text className='text-sm text-gray-600'>
              Time Spent:{" "}
              {currentTrip?.timeSpent
                ? `${currentTrip.timeSpent} hours`
                : "Ongoing"}
            </Text>
          </View>

          {/* Vehicle Information */}
          <View className='mb-4 p-4 bg-gray-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Vehicle Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Number Plate: {currentTrip?.vehicle?.vehicleNumberPlate}
            </Text>
            <Text className='text-sm text-gray-600'>
              Model: {currentTrip?.vehicle?.vehicleModel}
            </Text>
            <Text className='text-sm text-gray-600'>
              Capacity: {currentTrip?.vehicle?.tonnageCategory}
            </Text>
          </View>

          {/* Driver Information */}
          <View className='mb-4 p-4 bg-gray-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Driver Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Name: {currentTrip?.driver?.fullName}
            </Text>
            <Text className='text-sm text-gray-600'>
              License Number: {currentTrip?.driver?.licenseNumber}
            </Text>
            <Text className='text-sm text-gray-600'>
              Contact: {currentTrip?.driver?.contactNumber}
            </Text>
          </View>

          {/* Loaders Information */}
          <View className='mb-4 p-4 bg-gray-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Loaders Information
            </Text>
            {currentTrip?.loaders?.length > 0 ? (
              currentTrip.loaders.map((loader) => (
                <View key={loader._id} className='mb-2'>
                  <Text className='text-sm text-gray-600'>
                    Name: {loader.fullName}
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    Contact: {loader.contactNumber}
                  </Text>
                </View>
              ))
            ) : (
              <Text className='text-sm text-gray-600'>No Loaders Assigned</Text>
            )}
          </View>

          {/* Attach Delivery Note Button */}
          <TouchableOpacity
            onPress={handleAttachDeliveryNote}
            className='mt-4 p-4 bg-orange-500 rounded-lg flex-row items-center justify-center'
          >
            {currentTrip?.deliveryNote ? (
              <>
                <Icon name='check-square' size={20} color='white' />
                <Text className='ml-2 text-white text-lg font-semibold'>
                  View Delivery Note
                </Text>
              </>
            ) : (
              <>
                <Icon name='file-plus' size={20} color='white' />
                <Text className='ml-2 text-white text-lg font-semibold'>
                  Attach Delivery Note
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TripViewScreen;
