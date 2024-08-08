import { Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleById, updateVehicle } from "../../../lib/redux/actions/vehicleActions";
import VehicleForm from "../../../components/VehicleForm";

const EditVehicleScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentVehicle, loading, error, successUpdate } = useSelector(
    (state) => state.vehicle
  );

  useEffect(() => {
    if (id) {
      dispatch(getVehicleById(id));
    }
  }, [dispatch, id, successUpdate]);

  const handleUpdateDelivery = (formData) => {
    dispatch(updateVehicle(id, formData));
  };

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
          mode='edit'
          initialData={currentVehicle}
          onSubmit={handleUpdateDelivery}
        />
      )}
    </>
  );
};

export default EditVehicleScreen;
