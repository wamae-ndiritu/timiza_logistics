import { View, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const {user} = useSelector((state) => state.user);

  if (user?.token && user?.user?.role === "admin")
    return <Redirect href='/home' />;
  return (
    <>
      <Stack>
        <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor='#E0DEDB' style='light' />
    </>
  );
};

export default AuthLayout;
