import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

const StaffLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name='staff' options={{ headerShown: false }} />
        <Stack.Screen name='register-staff' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </>
  );
};

export default StaffLayout;
