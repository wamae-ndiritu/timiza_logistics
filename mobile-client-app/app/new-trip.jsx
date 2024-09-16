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
  const [invoiceInput, setInvoiceInput] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // Preserve existing code for auto-fetching location
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
      // setStartLocation(
      //   `${location.coords.longitude},${location.coords.latitude}`
      // );
    })();
  }, []);

  const handleAddDestination = () => {
    if (!destinationInput) {
      Alert.alert("Error", "Please enter a destination!");
      return;
    }
    setDestinations([...destinations, destinationInput]);
    setDestinationInput(""); // Clear input after adding
  };

  const handleRemoveDestination = (index) => {
    const updatedDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(updatedDestinations);
  };

  const handleAddInvoice = () => {
    if (!invoiceInput) {
      Alert.alert("Error", "Please enter an invoice number!");
      return;
    }
    setInvoices([...invoices, invoiceInput]);
    setInvoiceInput(""); // Clear input after adding
  };

  const handleRemoveInvoice = (index) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
  };

  const submitForm = () => {
    if (!startLocation || !destinations.length) {
      Alert.alert(
        "Error",
        "Please enter start location and at least one destination!"
      );
      return;
    }

    dispatch(
      startTrip({
        startLocation, // String start location
        destinations, // Array of destinations
        invoices, // Array of invoice numbers
      })
    );
  };

  useEffect(() => {
    if (success) {
      router.push("/trip");
    }
  }, [success, router]);

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
          <View className='flex-row items-end mb-3'>
            <FormField
              title='Start Location'
              placeholder='Kagundo etc.'
              value={startLocation}
              handleChangeText={(e) => setStartLocation(e)}
              otherStyles='flex-1'
              inputStyles='bg-slate-50'
            />
            <TouchableOpacity className=''>
              <Icon
                name='check-circle'
                size={28}
                color='transparent'
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>

          <View className='flex-row items-end mb-3'>
            <FormField
              title='Destination'
              placeholder='Kiamathaga etc'
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

          {destinations.length > 0 && (
            <View className='mb-4'>
              <Text className='text-base text-gray-600'>
                Added Destinations
              </Text>
              {destinations.map((destination, index) => (
                <View
                  key={index}
                  className='flex-row items-center justify-between mb-2'
                >
                  <Text className='text-gray-600'>{destination}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveDestination(index)}
                  >
                    <Icon name='x-circle' size={24} color='red' />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View className='flex-row items-end mb-3'>
            <FormField
              title='Invoice Number'
              placeholder='484395 etc'
              value={invoiceInput}
              handleChangeText={(e) => setInvoiceInput(e)}
              otherStyles='flex-1'
              inputStyles='bg-slate-50'
            />
            <TouchableOpacity onPress={handleAddInvoice}>
              <Icon
                name='check-circle'
                size={28}
                color='green'
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>

          {invoices.length > 0 && (
            <View className='mb-4'>
              <Text className='text-base text-gray-600 text-lg py-1'>
                Added Invoices
              </Text>
              {invoices.map((invoice, index) => (
                <View
                  key={index}
                  className='flex-row items-center justify-between mb-2'
                >
                  <Text className='text-gray-600'>{invoice}</Text>
                  <TouchableOpacity onPress={() => handleRemoveInvoice(index)}>
                    <Icon name='x-circle' size={24} color='red' />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

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
