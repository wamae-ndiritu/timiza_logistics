import { Text } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleById, updateVehicle } from "../../../lib/redux/actions/vehicleActions";
import VehicleForm from "../../../components/VehicleForm";

const EditVehicleScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentVehicle, successUpdate } = useSelector(
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

      <VehicleForm
          mode='edit'
          title="Edit Vehicle"
          initialData={currentVehicle}
          onSubmit={handleUpdateDelivery}
        />
        </>
  );
};

export default EditVehicleScreen;
