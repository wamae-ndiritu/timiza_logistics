import { Text } from "react-native";
import React, { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleById } from "../../../lib/redux/actions/vehicleActions";
import VehicleForm from "../../../components/VehicleForm";

const VehicleViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentVehicle, loading, error, success } = useSelector(
    (state) => state.vehicle
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getVehicleById(id));
    }, [dispatch, id, success])
  );

  return (
    <>
      {loading ? (
        <Text className='px-2 text-base text-green-500 font-pregular py-0.5'>
          Please wait...
        </Text>
      ) : error ? (
        <Text className='px-2 text-base text-red-500 font-pregular py-0.5'>
          {error}
        </Text>
      ) : (
        <VehicleForm
          key={currentVehicle?._id}
          mode='view'
          initialData={currentVehicle}
        />
      )}
    </>
  );
};

export default VehicleViewScreen;
