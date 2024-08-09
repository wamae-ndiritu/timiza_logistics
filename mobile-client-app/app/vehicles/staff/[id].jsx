import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  assignDriverAndLoadersToVehicle,
  getVehicleById,
} from "../../../lib/redux/actions/vehicleActions";
import { Feather } from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { listUsers } from "../../../lib/redux/actions/userActions";
import { resetVehicleState } from "../../../lib/redux/slices/vehicleSlices";
import CustomButton from "../../../components/CustomButton";

const AssignVehicleStaffScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentVehicle, loading, success } = useSelector(
    (state) => state.vehicle
  );
  const { usersList } = useSelector((state) => state.user);
  const [selectedDriver, setSelectedDriver] = useState(currentVehicle?.currentDriver || null);
  const [selectedLoaders, setSelectedLoaders] = useState(currentVehicle?.currentLoaders || []);

  useEffect(() => {
    if (id) {
      dispatch(getVehicleById(id));
    }
  }, [dispatch, id, success]);

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  const toggleLoaderSelection = (loaderId) => {
    setSelectedLoaders((prev) =>
      prev.includes(loaderId)
        ? prev.filter((id) => id !== loaderId)
        : [...prev, loaderId]
    );
  };

  const handleUpdateVehicle = () => {
    const formData = {
      driver: selectedDriver,
      loaders: selectedLoaders,
    };
    dispatch(assignDriverAndLoadersToVehicle(id, formData));
  };

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        dispatch(resetVehicleState());
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, success]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='px-4 bg-secondary w-full h-16 flex-row justify-between items-center z-[99]'>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name='arrow-left' size={24} color='white' />
        </TouchableOpacity>
        <Text className='text-white text-2xl font-semibold'>
          Assign Staff to {currentVehicle?.vehicleNumberPlate}
        </Text>
        <View />
      </View>
      <ScrollView className='px-4 py-4'>
        {success && (
          <Text className='bg-green-200 text-green-800 text-lg py-3 px-4 mb-3'>
            Staff assigned to vehicle successfully!
          </Text>
        )}
        <Text className='text-xl font-semibold text-gray-800 mb-2'>
          Select Driver
        </Text>
        {usersList
          .filter((user) => user.user?.role === "driver")
          .map((driver) => (
            <TouchableOpacity
              key={driver._id}
              onPress={() => setSelectedDriver(driver?.user?._id)}
              className={`mb-4 p-4 border ${
                selectedDriver === driver?.user?._id
                  ? "bg-slate-200"
                  : "bg-white"
              } border-gray-300 rounded-lg flex-row items-center space-x-4`}
            >
              <Feather name='user' size={24} color='#000' />
              <Text
                className={`text-lg font-semibold ${
                  selectedDriver === driver?.user?._id
                    ? "text-secondary"
                    : "text-gray-700"
                }`}
              >
                {driver.fullName}
              </Text>
            </TouchableOpacity>
          ))}

        <Text className='text-xl font-semibold text-gray-800 mt-6 mb-2'>
          Select Loaders
        </Text>
        {usersList
          .filter((user) => user.user?.role === "loader")
          .map((loader) => (
            <TouchableOpacity
              key={loader._id}
              onPress={() => toggleLoaderSelection(loader?.user?._id)}
              className={`mb-4 p-4 border ${
                selectedLoaders.includes(loader?.user?._id)
                  ? "bg-slate-200"
                  : "bg-white"
              } border-gray-300 rounded-lg flex-row items-center space-x-4`}
            >
              <Feather name='users' size={24} color='#000' />
              <Text
                className={`text-lg font-semibold ${
                  selectedLoaders.includes(loader?.user?._id)
                    ? "text-secondary"
                    : "text-gray-700"
                }`}
              >
                {loader.fullName}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <View className='p-4'>
        <CustomButton
          title='Save'
          handlePress={handleUpdateVehicle}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-semibold text-xl'
          isLoading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default AssignVehicleStaffScreen;
