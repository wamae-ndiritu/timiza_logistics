import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLaoded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLaoded) SplashScreen.hideAsync();
  }, [fontsLaoded, error]);

  if (!fontsLaoded && !error) return null;

  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='not-authorized' options={{ headerShown: false }} />
        <Stack.Screen
          name='reset-password/[password]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='view-delivery/[id]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='edit-delivery/[id]'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='add-trip' options={{ headerShown: false }} />
        <Stack.Screen
          name='destination-search'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='new-trip' options={{ headerShown: false }} />
        <Stack.Screen name='new-vehicle' options={{ headerShown: false }} />
        <Stack.Screen name='new-staff' options={{ headerShown: false }} />
        <Stack.Screen name='vehicles' options={{ headerShown: false }} />
        <Stack.Screen
          name='vehicles/view/[id]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='vehicles/edit/[id]'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='vehicles/staff/[id]'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='trips/view/[id]' options={{ headerShown: false }} />
        <Stack.Screen
          name='trips/[id]/attach-delivery-note'
          options={{ headerShown: false }}
        />
        <Stack.Screen name='forgot-password' options={{ headerShown: false }} />
        <Stack.Screen name='verify-otp' options={{ headerShown: false }} />
        <Stack.Screen name='locations/index' options={{ headerShown: false }} />
        <Stack.Screen name='locations/new' options={{ headerShown: false }} />
        <Stack.Screen
          name='locations/view/[locationId]'
          options={{ headerShown: false }}
        />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
