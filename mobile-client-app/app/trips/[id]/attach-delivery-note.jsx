import React from "react";
import { useDispatch } from "react-redux";
import DeliveryForm from "../../../components/DeliveryForm";
import { createDelivery } from "../../../lib/redux/actions/deliveryActions";
import { useLocalSearchParams } from "expo-router";

const AttachTripDelivery = () => {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();

  const handleCreateDelivery = (formData) => {
    dispatch(createDelivery(id, formData));
  };
  return (
    <>
      <DeliveryForm mode='new' title="Add Delivery" onSubmit={handleCreateDelivery} />
    </>
  );
};

export default AttachTripDelivery;
