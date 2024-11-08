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
  const { currentVehicle, success } = useSelector(
    (state) => state.vehicle
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(getVehicleById(id));
    }, [dispatch, id, success])
  );

  return (
    <>
        <VehicleForm
          key={currentVehicle?._id}
          mode='view'
          title="View Vehicle"
          initialData={currentVehicle}
        />
    </>
  );
};

export default VehicleViewScreen;
