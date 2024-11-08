import { View, Text } from "react-native";
import React, { useEffect } from "react";
import DeliveryForm from "../../components/DeliveryForm";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getDeliveryById } from "../../lib/redux/actions/deliveryActions";

const DeliveryViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { currentDelivery, loading, error } = useSelector(
    (state) => state.delivery
  );

  useEffect(() => {
    if (id) {
      dispatch(getDeliveryById(id));
    }
  }, [dispatch, id]);

  return (
    <>
        <DeliveryForm
          key={currentDelivery?._id}
          mode='view'
          title="View Delivery"
          initialData={currentDelivery}
        />
    </>
  );
};

export default DeliveryViewScreen;
