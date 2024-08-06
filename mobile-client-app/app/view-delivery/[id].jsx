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
      {loading ? (
        <Text className='px-2 text-base text-green-500 font-pregular py-0.5'>
          Please wait...
        </Text>
      ) : error ? (
        <Text className='px-2 text-base text-red-500 font-pregular py-0.5'>
          {error}
        </Text>
      ) : (
        <DeliveryForm
          key={currentDelivery?._id}
          mode='view'
          initialData={currentDelivery}
        />
      )}
    </>
  );
};

export default DeliveryViewScreen;
