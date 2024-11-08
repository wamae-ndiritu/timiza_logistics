import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { createLocation } from "../../lib/redux/actions/locationActions";
import Loading from "../../components/Loading";
import TopBar from "../../components/TopBar";
import { router } from "expo-router";

const CreateLocation = ({ navigation }) => {
  const dispatch = useDispatch();

  const [locationType, setLocationType] = useState("");
  const [locationName, setLocationName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [branches, setBranches] = useState([]); // To store branches
  const [loading, setLoading] = useState(false);

  const handleAddBranch = () => {
    if (!branchName || !branchAddress) {
      Alert.alert("Error", "Please fill in all fields for the branch.");
      return;
    }

    // Create a new branch object
    const newBranch = {
      name: branchName,
      address: branchAddress,
      coordinates: { lat: 0, lng: 0 },
    };

    // Update the branches state
    setBranches((prevBranches) => [...prevBranches, newBranch]);

    // Clear the branch form
    setBranchName("");
    setBranchAddress("");
  };

  const handleCreateLocation = () => {
    if (!locationType || !locationName || branches.length === 0) {
      Alert.alert("Error", "Please fill in all fields for the location.");
      return;
    }

    const newLocation = {
      type: locationType,
      name: locationName,
      branches: branches,
    };

    setLoading(true);
    dispatch(createLocation(newLocation))
      .then(() => {
        setLoading(false);
        Alert.alert("Success", "Location created successfully!");
        router.navigate('/locations')
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Error", "Failed to create location. Please try again.");
        console.error(error);
      });
  };

  return (
    <SafeAreaView className='flex-1 pt-4 bg-white'>
      <TopBar title='Create Location' />
      <View className='mt-2 mx-4'>
        <Text className='font-semibold text-lg text-gray-700'>
          Create a New Location
        </Text>
      </View>
      {loading ? (
        <Loading />
      ) : (
        <View className='p-4 bg-white rounded-lg'>
          {/* Location Type Picker */}
          <Text className='font-semibold mb-2'>Location Type</Text>
          <View className="border border-gray-100 rounded mb-2 py-0">
            <Picker
              selectedValue={locationType}
              onValueChange={(itemValue) => setLocationType(itemValue)}
              className='border p-2 rounded mb-4 border-gray-100'
            >
              <Picker.Item label='Select Type' value='' />
              <Picker.Item label='Supermarket' value='Supermarket' />
              <Picker.Item label='Hypermarket' value='Hypermarket' />
              <Picker.Item label='Mall' value='Mall' />
            </Picker>
          </View>

          {/* Location Name Input */}
          <Text className='font-semibold mb-2'>Location Name</Text>
          <TextInput
            value={locationName}
            onChangeText={setLocationName}
            className='border p-2 rounded mb-2 border-gray-100'
          />

          {/* Branch Section */}
          <Text className='font-semibold mb-2 text-lg text-gray-600'>
            Branches
          </Text>
          <Text className='font-semibold mb-2'>Branch Name</Text>
          <TextInput
            value={branchName}
            onChangeText={setBranchName}
            className='border p-2 rounded mb-2 border-gray-100'
          />
          <Text className='font-semibold mb-2'>Branch Address</Text>
          <TextInput
            value={branchAddress}
            onChangeText={setBranchAddress}
            className='border p-2 rounded mb-2 border-gray-100'
          />
          <TouchableOpacity
            className='bg-orange rounded p-2 mb-4'
            onPress={handleAddBranch}
          >
            <Text className='text-center text-white'>Add Branch</Text>
          </TouchableOpacity>

          {branches.map((branch, index) => (
            <View key={index} className='p-2 bg-slate-100 rounded mb-2'>
              <Text className='text-lg font-semibold'>{branch.name}</Text>
              <Text className='text-gray-600'>Address: {branch.address}</Text>
            </View>
          ))}

          {/* Create Location Button */}
          <TouchableOpacity
            className='bg-green-500 rounded p-2 mt-4'
            onPress={handleCreateLocation}
          >
            <Text className='text-center text-white uppercase'>Create Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateLocation;
