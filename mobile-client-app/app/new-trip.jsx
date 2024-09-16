import React, { useState, useEffect } from "react";
import { ScrollView, Alert, View, Text, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../components/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { startTrip } from "../lib/redux/actions/tripActions";
import { Link, router } from "expo-router";
import { resetTripState } from "../lib/redux/slices/tripSlices";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../components/Loading";
import Error from "../components/Error";

const NewTrip = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.trip);
  const [startLocation, setStartLocation] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [invoiceInputs, setInvoiceInputs] = useState({}); // State to store invoice inputs for each destination
  const [destinationInvoices, setDestinationInvoices] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch user's location
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
    })();
  }, []);

  // Add destination
  const handleAddDestination = () => {
    if (!destinationInput) {
      Alert.alert("Error", "Please enter a destination!");
      return;
    }
    setDestinations([
      ...destinations,
      { location: destinationInput, invoices: [] },
    ]);
    setDestinationInput("");
  };

  // Remove destination
  const handleRemoveDestination = (index) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);

    const destinationToRemove = destinations[index].location;
    const updatedInvoices = { ...destinationInvoices };
    delete updatedInvoices[destinationToRemove];
    setDestinationInvoices(updatedInvoices);

    const updatedInvoiceInputs = { ...invoiceInputs };
    delete updatedInvoiceInputs[destinationToRemove];
    setInvoiceInputs(updatedInvoiceInputs);
  };

  // Add invoice to specific destination
  const handleAddInvoice = (destination) => {
    const { location } = destination;
    const invoiceNumber = invoiceInputs[location];

    if (!invoiceNumber) {
      Alert.alert("Error", "Please enter an invoice number!");
      return;
    }

    const updatedDestinations = destinations.map((dest) => {
      if (dest.location === location) {
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
      [location]: "", // Clear the input for the specific destination
    }));
  };

  // Remove invoice from specific destination
  const handleRemoveInvoice = (destination, index) => {
    const { location } = destination;

    const updatedDestinations = destinations.map((dest) => {
      if (dest.location === location) {
        return {
          ...dest,
          invoices: dest.invoices.filter((_, i) => i !== index),
        };
      }
      return dest;
    });

    setDestinations(updatedDestinations);
  };

  // Handle trip submission
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

  // Handle trip success
  useEffect(() => {
    if (success) {
      router.push("/trip");
    }
  }, [success, router]);

  // Handle trip errors
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(resetTripState());
    }
  }, [dispatch, error]);

  return (
    <SafeAreaView className='flex-1'>
      <TopBar title='New Trip'>
        <Link href='/trip'>
          <Icon name='map-pin' size={24} color='#FFF' />
        </Link>
      </TopBar>

      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView className='px-4 py-4'>
          {error && <Error>{error}</Error>}

          {/* Start Location */}
          <FormField
            title='Start Location'
            placeholder='Kagundo etc.'
            value={startLocation}
            handleChangeText={(e) => setStartLocation(e)}
            otherStyles='mb-4'
            inputStyles='bg-slate-50'
          />

          {/* Destination Input */}
          <View className='flex-row items-end mb-3'>
            <FormField
              title='Destination'
              placeholder='Kiamathaga etc.'
              value={destinationInput}
              handleChangeText={(e) => setDestinationInput(e)}
              otherStyles='flex-1'
              inputStyles='bg-slate-50'
            />
            <TouchableOpacity onPress={handleAddDestination}>
              <Icon
                name='check-circle'
                size={28}
                color='green'
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>

          {/* Display Added Destinations and Invoices */}
          {destinations.length > 0 && (
            <View className='mb-4'>
              <Text className='text-base text-gray-600 text-lg font-pmedium py-2'>
                Added Destinations
              </Text>
              {destinations.map((destination, index) => (
                <View key={index} className='mb-3 bg-white p-4 rounded-lg'>
                  <View className='flex-row justify-between'>
                    <Text className='text-base text-gray-600 text-lg'>
                      {destination.location}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDestination(index)}
                    >
                      <Icon name='trash-2' size={24} color='red' />
                    </TouchableOpacity>
                  </View>

                  {/* Invoice Input for Each Destination */}
                  <View className='flex-row items-end mb-3 mt-1'>
                    <FormField
                      title='Invoice Number'
                      placeholder='484395 etc.'
                      value={invoiceInputs[destination.location] || ""}
                      handleChangeText={(e) =>
                        setInvoiceInputs((prevInputs) => ({
                          ...prevInputs,
                          [destination.location]: e,
                        }))
                      }
                      otherStyles='flex-1'
                      inputStyles='bg-slate-50'
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

                  {/* Display Invoices for This Destination */}
                  {destination.invoices &&
                    destination.invoices.map((invoice, invIndex) => (
                      <View
                        key={invIndex}
                        className='flex-row items-center justify-between mb-2'
                      >
                        <Text className='text-gray-600'>{invoice}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveInvoice(destination, invIndex)
                          }
                        >
                          <Icon name='x-circle' size={24} color='red' />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          )}

          {/* Submit Button */}
          <CustomButton
            title='Start Trip'
            handlePress={submitForm}
            containerStyles='my-7 bg-orange rounded min-h-[45px]'
            textStyles='text-white font-semibold text-xl'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NewTrip;
