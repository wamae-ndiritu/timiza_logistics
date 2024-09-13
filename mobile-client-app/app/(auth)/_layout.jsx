import { View, Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const {userData} = useSelector((state) => state.user);

  if (userData?.token && userData.user.role === "admin"){
      return <Redirect href='/home' />;
  }

  if (userData?.token && userData.user.role !== "admin" && !userData?.user?.isDefaultPassword){
      return <Redirect href='/userhome' />;
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
