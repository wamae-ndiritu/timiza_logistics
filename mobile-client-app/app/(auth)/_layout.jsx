import { View, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const {userData} = useSelector((state) => state.user);

  if (userData?.token){
    return <Redirect href='/home' />;
  }
  return (
    <>
      <Stack>
        <Stack.Screen name='sign-in' options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </>
  );
};

export default AuthLayout;
