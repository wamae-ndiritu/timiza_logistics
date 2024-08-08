import React from "react";
import VehicleForm from "../components/VehicleForm";

const NewVehicle = ({ navigation }) => {
  const handleAddVehicle = (vehicleData) => {
    // Implement add vehicle logic here (e.g., API call)
    console.log(vehicleData);
    navigation.goBack();
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
