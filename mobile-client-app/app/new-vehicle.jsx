import React from "react";
import VehicleForm from "../components/VehicleForm";
import {useDispatch} from "react-redux";
import { registerVehicle } from "../lib/redux/actions/vehicleActions";

const NewVehicle = () => {
  const dispatch = useDispatch();
  const handleAddVehicle = (vehicleData) => {
    dispatch(registerVehicle(vehicleData));
  };

  return (
    <VehicleForm
      initialValues={{
        vehicleMake: "",
        vehicleModel: "",
        chassisNumber: "",
        tonnageCategory: "",
        vehicleNumberPlate: "",
        notes: "",
        ownerName: "",
        ownerIdNumber: "",
      }}
      onSubmit={handleAddVehicle}
      isEdit={false}
    />
  );
};

export default NewVehicle;
