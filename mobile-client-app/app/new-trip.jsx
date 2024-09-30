import React, { useState, useEffect } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { startTrip } from "../lib/redux/actions/tripActions";
import { resetTripState } from "../lib/redux/slices/tripSlices";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { Picker } from "@react-native-picker/picker"; // Picker for locations and branches
import {
  listLocationBranches,
  listLocations,
} from "../lib/redux/actions/locationActions";

const NewTrip = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.trip);
  const { locations, branches } = useSelector((state) => state.location);
  const [startLocation, setStartLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [invoiceInputs, setInvoiceInputs] = useState({});
  const [destinationInvoices, setDestinationInvoices] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch user's location and available locations
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
      // setStartLocation(`${location.coords.longitude},${location.coords.latitude}`);

      // Fetch available locations
      dispatch(listLocations());
    })();
  }, [dispatch]);

  // Fetch branches when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      dispatch(listLocationBranches(selectedLocation));
    }
  }, [selectedLocation, dispatch]);

  // Add destination with selected branch
  const handleAddDestination = () => {
    if (!selectedLocation || !selectedBranch) {
      Alert.alert("Error", "Please select a location and branch!");
      return;
    }
    setDestinations([
      ...destinations,
      { location: selectedLocation, branch: selectedBranch, invoices: [] },
    ]);
    setSelectedLocation(null);
    setSelectedBranch(null);
  };

  // Remove destination
  const handleRemoveDestination = (index) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);
  };

  // Add invoice to specific destination
  const handleAddInvoice = (destination) => {
    const { location, branch } = destination;
    const invoiceNumber = invoiceInputs[`${location}-${branch}`];

    if (!invoiceNumber) {
      Alert.alert("Error", "Please enter an invoice number!");
      return;
    }

    const updatedDestinations = destinations.map((dest) => {
      if (dest.location === location && dest.branch === branch) {
        return {
          ...dest,
          invoices: [...dest.invoices, invoiceNumber],
        };
      }
      return dest;
    });
    setDestinations(updatedDestinations);

    setInvoiceInputs((prevInputs) => ({
      ...prevInputs,
      [`${location}-${branch}`]: "", // Clear the input for the specific destination
    }));
  };

  // Submit trip form
  const submitForm = () => {
    if (!startLocation || !destinations.length) {
      Alert.alert(
        "Error",
        "Please enter a start location and at least one destination!"
      );
      return;
    }

    const tripData = {
      startLocation,
      destinations,
    };

    dispatch(startTrip(tripData));
  };

  return (
    <SafeAreaView className='flex-1'>
      <TopBar title='New Trip' />

      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView className='px-4 py-4'>
          <FormField
            title='Start Location'
            placeholder='Enter start location'
            value={startLocation}
            handleChangeText={(e) => setStartLocation(e)}
          />

          <Text className='text-base text-gray-600 text-lg font-pmedium mb-2 mt-3'>
            Select Your Destination
          </Text>
          <View className='border border-gray-100 rounded py-0 mb-2'>
            <Picker
              selectedValue={selectedLocation}
              onValueChange={(value) => setSelectedLocation(value)}
            >
              <Picker.Item label='Select a location' value={null} />
              {locations.map((location) => (
                <Picker.Item
                  key={location._id}
                  label={location.name}
                  value={location._id}
                />
              ))}
            </Picker>
          </View>

          {selectedLocation && (
            <>
              <Text className='text-base text-gray-600 text-lg font-pmedium mb-2 mt-2'>
                Select Branch
              </Text>
              <View className='border border-gray-100 mb-2'>
                <Picker
                  selectedValue={selectedBranch}
                  onValueChange={(value) => setSelectedBranch(value)}
                >
                  <Picker.Item label='Select a branch' value={null} />
                  {branches?.map((branch) => (
                    <Picker.Item
                      key={branch._id}
                      label={branch.name}
                      value={branch._id}
                    />
                  ))}
                </Picker>
              </View>
            </>
          )}

          <TouchableOpacity onPress={handleAddDestination}>
            <Text className='text-green-500 mt-2'>Add Destination</Text>
          </TouchableOpacity>

          {destinations.length > 0 && (
            <View className='mb-4'>
              <Text className='text-base text-gray-600 text-lg font-semibold py-2'>
                Added Destinations
              </Text>
              {destinations.map((destination, index) => (
                <View key={index} className='mb-3 bg-white p-4 rounded-lg'>
                  <View className='flex-row justify-between'>
                    <Text className='text-base text-gray-600'>
                      {destination.location} - {destination.branch}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDestination(index)}
                    >
                      <Icon name='trash-2' size={24} color='red' />
                    </TouchableOpacity>
                  </View>

                  <View className='flex-row items-end mb-3'>
                    <FormField
                      title='Invoice Number'
                      placeholder='Enter invoice number'
                      value={
                        invoiceInputs[
                          `${destination.location}-${destination.branch}`
                        ] || ""
                      }
                      handleChangeText={(e) =>
                        setInvoiceInputs((prevInputs) => ({
                          ...prevInputs,
                          [`${destination.location}-${destination.branch}`]: e,
                        }))
                      }
                    />
                    <TouchableOpacity
                      onPress={() => handleAddInvoice(destination)}
                    >
                      <Icon
                        name='check-circle'
                        size={28}
                        color='green'
                        style={{ marginLeft: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <CustomButton
            title='Start Trip'
            handlePress={submitForm}
            containerStyles='my-7 bg-orange rounded'
            textStyles='text-white font-semibold text-xl'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NewTrip;
