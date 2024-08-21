import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import AdminRoute from "../../../components/AdminRoute";

const StaffLayout = () => {
  return (
    <AdminRoute>
      <Stack>
        <Stack.Screen name='staff' options={{ headerShown: false }} />
        <Stack.Screen name='register-staff' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </AdminRoute>
  );
};

export default StaffLayout;
