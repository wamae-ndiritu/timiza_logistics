import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const DeliveryLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name='list' options={{ headerShown: false }} />
        <Stack.Screen name='new' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </>
  );
};

export default DeliveryLayout;
