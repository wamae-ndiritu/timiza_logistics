import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  completeTrip,
  getTripById,
  markDestinationReached,
  rejectInvoiceAtDestination,
} from "../../../lib/redux/actions/tripActions"; // new actions
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import * as Location from "expo-location";
import { resetTripState } from "../../../lib/redux/slices/tripSlices";
import { Picker } from "@react-native-picker/picker";

const TripViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { currentTrip, loading, error, successUpdate, completed } = useSelector(
    (state) => state.trip
  );

  const [endLocation, setEndLocation] = useState("");
  const [rejectionReason, setRejectionReason] = useState({});
  const [flaggedReject, setFlaggedReject] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getTripById(id));
    }
  }, [dispatch, id, successUpdate, completed]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Cannot access location. Please enable location services."
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setEndLocation(
        `${location.coords.longitude},${location.coords.latitude}`
      );
    })();
  }, []);

  const handleFinishTrip = () => {
    dispatch(
      completeTrip(id, {
        endLocation: { coordinates: endLocation.split(",").map(Number) },
      })
    );
  };

  const handleMarkDestinationReached = (destinationId) => {
    dispatch(markDestinationReached(id, destinationId));
  };

  // Define your predetermined rejection reasons
  const rejectionReasonsList = [
    { label: "Invoice amount incorrect", value: "Invoice amount incorrect" },
    { label: "Product not received", value: "Product not received" },
    { label: "Product damaged", value: "Product damaged" },
    { label: "Other", value: "Other" },
  ];

  const handleRejectInvoice = (destinationId, destinationIndex, invoiceNumber) => {
    if (!rejectionReason) {
      Alert.alert(
        "Rejection Reason Required",
        "Please provide a reason for rejecting the invoice."
      );
      return;
    }
    // dispatch(
    //   rejectInvoiceAtDestination(
    //     id,
    //     destinationId,
    //     invoiceNumber,
    //     rejectionReason
    //   )
    // );
    setRejectionReason("");
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title='View Trip' />
      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {completed && (
            <Text className='p-4 bg-green-200 mb-3 text-green-700'>
              Your trip has been marked as completed!
            </Text>
          )}

          {/* Trip Information */}
          <View className='mb-4 p-4 bg-slate-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Trip Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Start Location: {currentTrip?.startLocation || "Unknown"}
            </Text>
            <Text className='text-sm text-gray-600'>
              Time Spent: {currentTrip?.timeSpent || "Ongoing"}
            </Text>
          </View>

          {/* Vehicle and Driver Information */}
          <View className='mb-4 p-4 bg-slate-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Vehicle and Driver Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Vehicle: {currentTrip?.vehicle?.name || "N/A"} (Plate:{" "}
              {currentTrip?.vehicle?.plateNumber || "N/A"})
            </Text>
            <Text className='text-sm text-gray-600'>
              Driver: {currentTrip?.driver?.name || "N/A"} (Phone:{" "}
              {currentTrip?.driver?.phone || "N/A"})
            </Text>
          </View>

          {/* Destinations Information */}
          {currentTrip?.destinations?.map((destination, index) => (
            <View key={index} className='mb-4 p-1 bg-slate-200 rounded-lg'>
              <Text className='text-xl font-semibold text-gray-700'>
                Destination {index + 1}: {destination.location}
              </Text>
              {!destination.reached ? (
                <TouchableOpacity
                  onPress={() => handleMarkDestinationReached(destination._id)}
                  className='p-2 border border-gray-300 bg-white rounded-lg flex-row items-center'
                >
                  <Icon name='check-square' size={28} color='green' />
                  <Text className='ml-2 text-gray-600 text-lg font-semibold'>
                    Mark as Reached
                  </Text>
                </TouchableOpacity>
              ) : (
                destination.reachedAt && (
                  <Text className='text-md text-gray-600 mt-1'>
                    Reached At:{" "}
                    {new Date(destination.reachedAt).toLocaleString()}
                  </Text>
                )
              )}

              {/* Invoices */}
              <Text className='text-lg font-semibold text-gray-700 mt-2'>
                Invoices
              </Text>
              {destination.invoices.map((invoice) => (
                <View
                  key={invoice.invoiceNumber}
                  className='mb-2 bg-white rounded p-1 my-1 '
                >
                  <Text className='text-lg pb-1 text-gray-600'>
                    {invoice.invoiceNumber}
                  </Text>
                  <View className='flex-row space-x-2 items-center'>
                    {invoice?.accepted ? (
                      <TouchableOpacity className='flex-row space-x-1 p-1 rounded-lg items-center bg-green-500'>
                        <Icon name='check-circle' size={28} color='white' />
                        <Text className='text-white'>Accepted</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity className='flex-row space-x-1 py-1 px-2 rounded-lg border border-gray-300 items-center'>
                        <Icon name='check-circle' size={20} color='green' />
                        <Text className='text-xs text-gray-600'>
                          Mark Accepted
                        </Text>
                      </TouchableOpacity>
                    )}
                    {!invoice.rejected && (
                      <TouchableOpacity
                        className='flex-row space-x-1 p-1 rounded-lg items-center border border-gray-300'
                        onPress={() =>
                          setFlaggedReject((prevState) => ({
                            ...prevState,
                            [invoice.invoiceNumber]:
                              !prevState[invoice.invoiceNumber],
                          }))
                        }
                      >
                        <Icon
                          name={`${
                            flaggedReject[invoice.invoiceNumber]
                              ? "x"
                              : "alert-circle"
                          }`}
                          size={20}
                          color={`${
                            flaggedReject[invoice.invoiceNumber]
                              ? "gray"
                              : "orange"
                          }`}
                        />
                        <Text className='text-xs text-gray-600'>
                          {flaggedReject[invoice.invoiceNumber]
                            ? "Cancel"
                            : "Mark Rejected"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {flaggedReject[invoice.invoiceNumber] &&
                    !invoice.rejected && (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            handleRejectInvoice(
                              destination._id,
                              index,
                              invoice.invoiceNumber
                            )
                          }
                          className='mt-2 p-2 bg-red-500 rounded-lg flex-row items-center'
                        >
                          <Icon name='x-square' size={20} color='white' />
                          <Text className='ml-2 text-white text-lg font-semibold'>
                            Reject Invoice
                          </Text>
                        </TouchableOpacity>

                        {/* Rejection Reason Picker */}
                        <Picker
                          selectedValue={
                            rejectionReason[invoice.invoiceNumber] || ""
                          }
                          onValueChange={(itemValue) =>
                            setRejectionReason((prevInputs) => ({
                              ...prevInputs,
                              [invoice.invoiceNumber]: itemValue,
                            }))
                          }
                          className='mt-2 p-2 border rounded-lg bg-white'
                        >
                          <Picker.Item
                            label='Select rejection reason'
                            value=''
                          />
                          {rejectionReasonsList.map((reason, index) => (
                            <Picker.Item
                              key={index}
                              label={reason.label}
                              value={reason.value}
                            />
                          ))}
                        </Picker>
                      </>
                    )}
                </View>
              ))}
            </View>
          ))}

          {/* Finish Trip Button */}
          {userData?.user?.role !== "admin" &&
            currentTrip?.endLocation?.coordinates.length < 1 && (
              <TouchableOpacity
                onPress={handleFinishTrip}
                className='mt-4 p-4 bg-green-500 rounded-lg flex-row items-center px-8'
              >
                <Icon name='clock' size={24} color='white' />
                <Text className='ml-2 text-white text-lg font-semibold'>
                  Finish Trip
                </Text>
              </TouchableOpacity>
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default TripViewScreen;
