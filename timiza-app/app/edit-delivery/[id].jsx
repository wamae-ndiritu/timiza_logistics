import { View, Text } from "react-native";
import React, { useEffect } from "react";
import DeliveryForm from "../../components/DeliveryForm";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryById, updateDelivery } from "../../lib/redux/actions/deliveryActions";

const EditDeliveryScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentDelivery, loading, error, success } = useSelector(
    (state) => state.delivery
  );

  useEffect(() => {
    if (id) {
      dispatch(getDeliveryById(id));
    }
  }, [dispatch, id, success]);

  const handleUpdateDelivery = (formData) => {
    dispatch(updateDelivery(id, formData));
  };

  return (
    <>
        <DeliveryForm
          // key={currentDelivery?._id}
          mode='edit'
          title="Edit Delivery"
          initialData={currentDelivery}
          onSubmit={handleUpdateDelivery}
        />
    </>
  );
};

export default EditDeliveryScreen;
