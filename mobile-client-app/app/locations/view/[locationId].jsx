import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLocation,
  deleteLocation,
  addLocationBranch,
  deleteLocationBranch,
} from "../../../lib/redux/actions/locationActions"; // Import actions
import TopBar from "../../../components/TopBar";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../../../components/Loading";

const LocationBranches = () => {
  const { locationId } = useLocalSearchParams();

  const dispatch = useDispatch();
  const {
    currentLocation: location,
    loading,
    error,
    successCreate,
    successDelete,
  } = useSelector((state) => state.location);

  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("");
  const [isAddingBranch, setIsAddingBranch] = useState(false); // State to handle the visibility of the add branch section

  useFocusEffect(
    useCallback(() => {
      dispatch(getLocation(locationId));
    }, [dispatch, locationId, successCreate, successDelete])
  );

  const handleDeleteBranch = (branchId) => {
    Alert.alert(
      "Delete Branch",
      "Are you sure you want to delete this branch?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteLocationBranch(locationId, branchId));
          },
        },
      ]
    );
  };

  const handleAddBranch = () => {
    if (!newBranchName || !newBranchAddress || !newBranchCity) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const newBranch = {
      name: newBranchName,
      address: newBranchAddress,
      city: newBranchCity,
    };

    dispatch(addLocationBranch(locationId, newBranch));
    // Clear the form after submission
    setNewBranchName("");
    setNewBranchAddress("");
    setNewBranchCity("");
  };

  const handleDeleteLocation = () => {
    Alert.alert(
      "Delete Location",
      "Are you sure you want to delete this location and all its branches?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(deleteLocation(locationId));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View className='p-4 m-2 bg-white rounded-lg relative'>
      <Text className='text-lg font-semibold'>{item.name}</Text>
      <Text className='text-gray-600'>Address: {item.address}</Text>
      <Text className='text-gray-600'>City: {item.city}</Text>
      <TouchableOpacity
        className='absolute border border-gray-100 p-2 rounded top-2 right-2'
        onPress={() => handleDeleteBranch(item._id)}
      >
        <Icon name='trash-2' size={24} color='red' />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 pt-4'>
      <TopBar title={location?.name + " " + location?.type || "Branches"} />
      <View className='mt-2 mx-4'>
        <Text className='text-xl font-semibold text-gray-700'>Branches</Text>
      </View>
      {loading ? (
        <Loading />
      ) : error ? (
        <Text className='text-center mt-8 text-red-500'>{error}</Text>
      ) : (
        <FlatList
          data={location?.branches}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text className='text-center mt-8 text-gray-500'>
              No branches found for this location.
            </Text>
          )}
        />
      )}

      {/* Delete Location Button */}
      <View className='bg-white flex-row justify-between pb-2 relative'>
        <TouchableOpacity
          className='bg-red-500 rounded p-2 mt-4 mx-4'
          onPress={handleDeleteLocation}
        >
          <Text className='text-center text-white font-semibold'>
            Delete Location & Branches
          </Text>
        </TouchableOpacity>

        {/* Toggle Add Branch Section */}
        <TouchableOpacity
          className='rounded bg-white rounded-full p-2 mt-4 mx-4 absolute right-0 top-[-45px]'
          onPress={() => setIsAddingBranch((prev) => !prev)} // Toggle visibility
        >
            {isAddingBranch ? (
              <Icon name='chevron-down' size={40} color='black' />
            ) : (
              <Icon name='chevron-up' size={40} color='black' />
            )}
        </TouchableOpacity>
      </View>

      {/* Add Branch Form */}
      {isAddingBranch && (
        <View className='p-4 bg-white rounded-lg'>
          <Text className='font-semibold mb-2 text-lg text-gray-600'>
            Add New Branch
          </Text>
          <TextInput
            placeholder='Branch Name'
            value={newBranchName}
            onChangeText={setNewBranchName}
            className='border p-2 rounded mb-2 border-gray-100'
          />
          <TextInput
            placeholder='Address'
            value={newBranchAddress}
            onChangeText={setNewBranchAddress}
            className='border p-2 rounded mb-2 border-gray-100'
          />
          <TextInput
            placeholder='City'
            value={newBranchCity}
            onChangeText={setNewBranchCity}
            className='border p-2 rounded mb-2 border-gray-100'
          />
          <TouchableOpacity
            title='Add Branch'
            className='bg-orange rounded'
            onPress={handleAddBranch}
          >
            <Text className='text-center uppercase text-white py-3'>
              Add Branch
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LocationBranches;
