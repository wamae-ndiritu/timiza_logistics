import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTrip,
  getTripById,
} from "../../../lib/redux/actions/tripActions";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import * as Location from "expo-location";
import { resetTripState } from "../../../lib/redux/slices/tripSlices";

const TripViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentTrip, loading, error, successUpdate, completed } = useSelector(
    (state) => state.trip
  );

  const [endLocation, setEndLocation] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getTripById(id));
    }
  }, [dispatch, id, successUpdate, completed]);

  const handleAttachDeliveryNote = () => {
    if (currentTrip?.deliveryNote) {
      router.push(`/view-delivery/${currentTrip?.deliveryNote?._id}`);
    } else {
      router.push(`/trips/${id}/attach-delivery-note`);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Permission Denied",
          "Cannot access location. Please enable location services."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setEndLocation(
        `${location.coords.longitude},${location.coords.latitude}`
      );
    })();
  }, []);

  const handleFinishTrip = () => {
    dispatch(
      completeTrip(id, {
        endLocation: { coordinates: endLocation.split(",").map(Number) },
      })
    );
  };

  useEffect(() => {
    if (completed) {
      const timeout = setTimeout(() => {
        dispatch(resetTripState());
      }, 5000);

      return () => clearTimeout(timeout);
    }
  });

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title='View Trip' />
      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {completed && (
            <Text className='p-4 bg-green-200 mb-3 text-green-700'>
              Your trip has been marked as completed!
            </Text>
          )}
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
              {currentTrip?.timeSpent ? `${currentTrip.timeSpent}` : "Ongoing"}
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
                <Text className='ml-2 text-white text-xl font-semibold'>
                  Attach Delivery Note
                </Text>
              </>
            )}
          </TouchableOpacity>
          {currentTrip?.endLocation?.coordinates.length < 1 && (
            <TouchableOpacity
              onPress={handleFinishTrip}
              className='mt-4 p-4 bg-green-500 rounded-lg flex-row items-center px-8'
            >
              <Icon name='clock' size={28} color='white' />
              <Text className='ml-2 text-white text-xl font-semibold'>
                Finish Trip
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TripViewScreen;
