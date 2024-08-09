import React, { useState, useEffect } from "react";
import { ScrollView, Alert } from "react-native";
import * as Location from "expo-location";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { startTrip } from "../lib/redux/actions/tripActions";
import { router } from "expo-router";
import { resetTripState } from "../lib/redux/slices/tripSlices";

const NewTrip = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.trip);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Permission Denied",
          "Cannot access location. Please enable location services."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setStartLocation(
        `${location.coords.longitude},${location.coords.latitude}`
      );
    })();
  }, []);

  const handleChange = (name, value) => {
    if (name === "destination") {
      setDestination(value);
    }
  };

  const submitForm = () => {
    if (!destination) {
      Alert.alert("Error", "Please enter your destination!");
      return;
    }
    dispatch(
      startTrip({
        startLocation: { coordinates: startLocation.split(",").map(Number) },
        expectedDestination: destination,
      })
    );
  };

  useEffect(() => {
    if (success) {
      router.push("/userhome");
    }
  }, [success, router]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(resetTripState());
    }
  }, [dispatch, error]);

  return (
    <SafeAreaView>
      <TopBar title='New Trip' />
      <ScrollView className='px-4 py-4'>
        <FormField
          title='Start Location'
          placeholder='Enter start location coordinates (longitude, latitude)'
          value={startLocation}
          handleChangeText={(e) => handleChange("startLocation", e)}
          otherStyles='mb-3'
          inputStyles='bg-slate-50'
          editable={false} // Disabling editing since location is auto-filled
        />

        <FormField
          title='Destination'
          placeholder='Enter nearest town or centre'
          value={destination}
          handleChangeText={(e) => handleChange("destination", e)}
          otherStyles='mb-3'
          inputStyles='bg-slate-50'
        />

        <CustomButton
          title='Start Trip'
          handlePress={submitForm}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-semibold text-xl'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewTrip;
