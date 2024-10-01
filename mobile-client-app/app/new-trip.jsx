import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import {
  getLocation,
  listLocationBranches,
  listLocations,
} from "../lib/redux/actions/locationActions";

const NewTrip = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.trip);
  const { locations, branches } = useSelector((state) => state.location);
  const { userData } = useSelector((state) => state.user);

  const [startLocation, setStartLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [invoiceInputs, setInvoiceInputs] = useState({});
  const [destinationInvoices, setDestinationInvoices] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [isLocationInputFocused, setIsLocationInputFocused] = useState(false);
  const [isBranchInputFocused, setIsBranchInputFocused] = useState(false);

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
      // Fetch initial locations (if needed)
      dispatch(listLocations(""));
    })();
  }, [dispatch]);

  // Fetch branches when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      dispatch(listLocationBranches(selectedLocation));
    }
  }, [selectedLocation, dispatch]);

  // Search locations as user types
  useEffect(() => {
    if (searchQuery) {
      dispatch(listLocations(searchQuery));
    }
  }, [searchQuery, dispatch]);

  // Filter branches based on search query
  useEffect(() => {
    if (branchSearchQuery) {
      const filtered = branches.filter((branch) =>
        branch.name.toLowerCase().startsWith(branchSearchQuery.toLowerCase())
      );
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches);
    }
  }, [branchSearchQuery, branches]);

  // Add destination with selected branch
  const handleAddDestination = () => {
    if (!selectedLocation || !selectedBranch) {
      Alert.alert("Error", "Please select a location and branch!");
      return;
    }

    // Check if the location and branch combination already exists
    const exists = destinations.some(
      (dest) =>
        dest.location === selectedLocation && dest.branch === selectedBranch
    );

    if (exists) {
      Alert.alert("Error", "This location and branch have already been added!");
      return;
    }

    setDestinations([
      ...destinations,
      { location: selectedLocation, branch: selectedBranch, invoices: [] },
    ]);
    setSelectedLocation(null);
    setSelectedBranch(null);
    setSearchQuery("");
    setBranchSearchQuery("");
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
      [`${location}-${branch}`]: "",
    }));
  };

  // Remove an invoice from a specific destination
  const handleRemoveDestinationInvoice = (destination, invoiceNumber) => {
    const updatedDestinations = destinations.map((dest) => {
      if (
        dest.location === destination.location &&
        dest.branch === destination.branch
      ) {
        return {
          ...dest,
          invoices: dest.invoices.filter(
            (invoice) => invoice !== invoiceNumber
          ),
        };
      }
      return dest;
    });
    setDestinations(updatedDestinations);
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

  const resetSearchQuery = () => {
    setSearchQuery("");
    setSelectedLocation(null);
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

          {/* Location Search Input */}
          <Text className='text-base text-gray-600 text-lg font-pmedium mb-2 mt-3'>
            Search and Select Your Destination
          </Text>
          <View className='flex-row items-center border border-gray-200 rounded px-2 py-2'>
            <TextInput
              placeholder='Search location'
              value={
                selectedLocation
                  ? locations.find((l) => l._id === selectedLocation)?.name
                  : searchQuery
              }
              onChangeText={(text) => setSearchQuery(text)}
              onFocus={() => setIsLocationInputFocused(true)}
              onBlur={() => setIsLocationInputFocused(false)}
              className='flex-1'
            />
            {selectedLocation || searchQuery ? (
              <TouchableOpacity onPress={resetSearchQuery}>
                <Icon name='x' size={20} color='gray' />
              </TouchableOpacity>
            ) : (
              <Icon name='search' size={20} color='gray' />
            )}
          </View>
          {isLocationInputFocused && locations.length > 0 && (
            <View className='border border-gray-300 mt-1'>
              {locations.map((location) => {
                return (
                  <TouchableOpacity
                    key={location._id}
                    onPress={() => {
                      setSelectedLocation(location._id);
                      setIsLocationInputFocused(false);
                    }}
                    className='px-2 py-4 border-b border-gray-200'
                  >
                    <Text>{location.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {selectedLocation && (
            <>
              {/* Branch Search Input */}
              <Text className='text-base text-gray-600 text-lg font-pmedium mb-2 mt-2'>
                Search and Select Branch
              </Text>
              <View className='flex-row items-center border border-gray-200 rounded px-2 py-2'>
                <TextInput
                  placeholder='Search branch'
                  value={
                    selectedBranch
                      ? branches.find((b) => b._id === selectedBranch)?.name
                      : branchSearchQuery
                  }
                  onChangeText={(text) => setBranchSearchQuery(text)}
                  onFocus={() => setIsBranchInputFocused(true)}
                  onBlur={() => setIsBranchInputFocused(false)}
                  className='flex-1'
                />
                {selectedBranch || branchSearchQuery ? (
                  <TouchableOpacity
                    onPress={() => {
                      setBranchSearchQuery("");
                      setSelectedBranch(null);
                    }}
                  >
                    <Icon name='x' size={20} color='gray' />
                  </TouchableOpacity>
                ) : (
                  <Icon name='search' size={20} color='gray' />
                )}
              </View>
              {isBranchInputFocused && filteredBranches.length > 0 && (
                <View className='border border-gray-300 mt-1'>
                  {filteredBranches.map((branch) => (
                    <TouchableOpacity
                      key={branch._id}
                      onPress={() => {
                        setSelectedBranch(branch._id);
                        setIsBranchInputFocused(false);
                      }}
                      className='p-2 border-b border-gray-200'
                    >
                      <Text>{branch.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
          <TouchableOpacity onPress={handleAddDestination} className='mt-4'>
            <Text className='text-blue-500 text-lg'>+ Add Destination</Text>
          </TouchableOpacity>
          {/* Destinations List */}
          <View>
            {destinations.map((destination, index) => (
              <View
                key={index}
                className='bg-white p-4 border border-gray-200 rounded-lg mt-2'
              >
                <View className='flex-row justify-between items-center'>
                  <Text className='text-lg text-gray-600'>
                    {
                      locations.find((l) => l._id === destination.location)
                        ?.name
                    }
                    , {branches.find((b) => b._id === destination.branch)?.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveDestination(index)}
                  >
                    <Icon name='trash' size={20} color='red' />
                  </TouchableOpacity>
                </View>
                <View className='w-full flex-row my-3'>
                  <FormField
                    placeholder='Enter invoice number'
                    otherStyles='flex-1'
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
                    className='border border-gray-100 rounded bg-orange flex-row items-center justify-center w-12 ml-1'
                  >
                    <Icon name='check-circle' size={28} color='white' />
                  </TouchableOpacity>
                </View>
                {destination.invoices.map((invoice) => (
                  <View
                    key={invoice}
                    className='border border-gray-100 p-2 rounded my-1 flex-row justify-between'
                  >
                    <Text className='text-gray-600 text-sm'>{invoice}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        handleRemoveDestinationInvoice(destination, invoice)
                      }
                    >
                      <Icon name='x-circle' size={20} color='red' />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
          {/* Submit Button */}
          <CustomButton
            onPress={submitForm}
            title='Submit Trip'
            containerStyles='mt-4 mb-8'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NewTrip;
