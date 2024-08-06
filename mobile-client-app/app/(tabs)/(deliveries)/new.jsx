import React from "react";
import {useDispatch } from "react-redux";
import { createDelivery } from "../../../lib/redux/actions/deliveryActions";
import DeliveryForm from "../../../components/DeliveryForm";

const NewDelivery = () => {
  const dispatch = useDispatch();

  const handleCreateDelivery = (formData) => {
    dispatch(createDelivery(formData));
  };
  return (
    <>
      <DeliveryForm mode='new' onSubmit={handleCreateDelivery} />
    </>
  );
};

export default NewDelivery;
