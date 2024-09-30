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
  updateInvoiceAtDestination
} from "../../../lib/redux/actions/tripActions";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import * as Location from "expo-location";
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
  const [loadingAccept, setLoadingAccept] = useState({});
  const [loadingReject, setLoadingReject] = useState({})

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
      completeTrip(id)
    );
  };

    // const handleAttachDeliveryNote = () => {
    //   if (currentTrip?.deliveryNote) {
    //     router.push(`/view-delivery/${currentTrip?.deliveryNote?._id}`);
    //   } else {
    //     router.push(`/trips/${id}/attach-delivery-note`);
    //   }
    // };

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

  const handleRejectInvoice = (destinationIndex, invoiceNumber) => {
    if (!rejectionReason[invoiceNumber]) {
      Alert.alert(
        "Rejection Reason Required",
        "Please provide a reason for rejecting the invoice."
      );
      return;
    }
    setLoadingReject((prevState) => ({
      ...prevState,
      [invoiceNumber]: true,
    }));
    const reason = rejectionReason[invoiceNumber];
    dispatch(
      updateInvoiceAtDestination(
        id,
        destinationIndex,
        invoiceNumber,
        "reject",
        reason
      )
    );
    setRejectionReason("");
     setLoadingReject((prevState) => ({
       ...prevState,
       [invoiceNumber]: false,
     }));
  };

  const handleAcceptInvoice = (
    destinationIndex,
    invoiceNumber
  ) => {
    setLoadingAccept((prevState) => ({
      ...prevState,
      [invoiceNumber]: true,
    }));
    dispatch(
      updateInvoiceAtDestination(
        id,
        destinationIndex,
        invoiceNumber,
        "accept",
      )
    );
    setLoadingAccept((prevState) => ({
      ...prevState,
      [invoiceNumber]: false,
    }));
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

          {/* Vehicle Information */}
          <View className='mb-4 p-4 bg-slate-200 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Vehicle Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Number Plate: {currentTrip?.vehicle?.vehicleNumberPlate}
            </Text>
            <Text className='text-sm text-gray-600'>
              Model: {currentTrip?.vehicle?.vehicleModel}
            </Text>
            <Text className='text-sm text-gray-600'>
              Capacity: {currentTrip?.vehicle?.tonnageCategory}
            </Text>
          </View>

          {/* Driver Information */}
          <View className='mb-4 p-4 bg-slate-100 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Driver Information
            </Text>
            <Text className='text-sm text-gray-600'>
              Name: {currentTrip?.driver?.fullName}
            </Text>
            <Text className='text-sm text-gray-600'>
              License Number: {currentTrip?.driver?.licenseNumber}
            </Text>
            <Text className='text-sm text-gray-600'>
              Contact: {currentTrip?.driver?.phoneNumber}
            </Text>
          </View>

          {/* Loaders Information */}
          <View className='mb-4 p-4 bg-slate-200 rounded-lg'>
            <Text className='text-xl font-semibold text-gray-700 mb-2'>
              Loaders Information
            </Text>
            {currentTrip?.loaders?.length > 0 ? (
              currentTrip.loaders.map((loader) => (
                <View key={loader._id} className='mb-2'>
                  <Text className='text-sm text-gray-600'>
                    Name: {loader.fullName}
                  </Text>
                  <Text className='text-sm text-gray-600'>
                    Contact: {loader.phoneNumber}
                  </Text>
                </View>
              ))
            ) : (
              <Text className='text-sm text-gray-600'>No Loaders Assigned</Text>
            )}
          </View>

          {/* Destinations Information */}
          {currentTrip?.destinations?.map((destination, index) => (
            <View
              key={index}
              className='mb-4 py-1 px-2 bg-slate-200 rounded-lg'
            >
              <Text className='text-xl font-semibold text-gray-700'>
                Destination {index + 1}: {destination.location}
              </Text>
              {!destination.reached ? (
                <TouchableOpacity
                  onPress={() => handleMarkDestinationReached(destination._id)}
                  className='p-2 border border-gray-300 bg-white rounded-lg flex-row items-center my-2'
                >
                  <Icon name='check-square' size={28} color='green' />
                  <Text className='ml-2 text-gray-600 text-lg font-semibold'>
                    Mark as Reached
                  </Text>
                </TouchableOpacity>
              ) : (
                destination.reachedAt && (
                  <Text className='text-md text-gray-600 my-2'>
                    Arrived at{" "}
                    {new Date(destination.reachedAt).toLocaleString()}
                  </Text>
                )
              )}

              {/* Invoices */}
              <Text className='text-lg text-gray-600'>Attached Invoices</Text>
              {destination.invoices.map((invoice) => (
                <View
                  key={invoice.invoiceNumber}
                  className='mb-2 bg-white rounded p-1 pb-2 my-1 '
                >
                  <View className='flex-row items-center justify-between'>
                    <Text className='text-lg text-gray-600'>
                      {invoice.invoiceNumber}
                    </Text>
                    {invoice.accepted && invoice.delivered && (
                      <TouchableOpacity className='flex-row space-x-1 p-1 rounded-lg items-center justify-center bg-green-500'>
                        <Icon name='check-square' size={24} color='white' />
                      </TouchableOpacity>
                    )}
                  </View>
                  {userData?.user?.role !== "admin" && (
                    <View className='flex-row justify-between items-center'>
                      {!invoice?.accepted &&
                        !invoice.delivered &&
                        !invoice.rejected && (
                          <TouchableOpacity
                            className='flex-row space-x-1 py-1 px-2 rounded-lg border border-gray-300 items-center'
                            onPress={() =>
                              handleAcceptInvoice(index, invoice.invoiceNumber)
                            }
                            disabled={loadingAccept[invoice.invoiceNumber]}
                          >
                            {loadingAccept[invoice.invoiceNumber] ? (
                              <Loading />
                            ) : (
                              <>
                                <Icon
                                  name='check-circle'
                                  size={20}
                                  color='green'
                                />
                                <Text className='text-xs text-gray-600'>
                                  Mark Accepted
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        )}
                      {!invoice.rejected && !invoice.delivered && (
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
                  )}
                  {flaggedReject[invoice.invoiceNumber] &&
                    !invoice.rejected && (
                      <View className='flex-row space-x-2'>
                        {/* Rejection Reason Picker */}
                        <View className='flex-1 mt-2 border border-gray-300  rounded-lg bg-white'>
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
                            className=''
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
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            handleRejectInvoice(index, invoice.invoiceNumber)
                          }
                          className={` ${
                            loadingReject[invoice.invoiceNumber]
                              ? "bg-red-200"
                              : "bg-red-500"
                          } w-14 mt-2 p-2 rounded-lg flex-row items-center justify-center`}
                          disabled={loadingReject[invoice.invoiceNumber]}
                        >
                          {loadingReject[invoice.invoiceNumber] ? (
                            <Loading color='white' />
                          ) : (
                            <Icon name='send' size={28} color='white' />
                          )}
                        </TouchableOpacity>
                      </View>
                    )}
                  {invoice.rejected && invoice.rejectionReason && (
                    <View className='flex-row items-center'>
                      {invoice?.rejected && (
                        <TouchableOpacity className='flex-row space-x-1 p-1 rounded-lg items-center justify-center'>
                          <Icon name='alert-circle' size={18} color='orange' />
                        </TouchableOpacity>
                      )}
                      <Text className='text-xs text-red-500 p-0'>
                        {invoice.rejectionReason}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* {userData?.user?.role !== "admin" && (
            <TouchableOpacity
              onPress={handleAttachDeliveryNote}
              className='mt-4 p-4 bg-orange-500 rounded-lg flex-row items-center px-8'
            >
              {currentTrip?.deliveryNote ? (
                <>
                  <Icon name='check-square' size={20} color='white' />
                  <Text className='ml-2 text-white text-lg font-semibold'>
                    View Delivery Note
                  </Text>
                </>
              ) : (
                <>
                  <Icon name='file-plus' size={20} color='white' />
                  <Text className='ml-2 text-white text-xl font-semibold'>
                    Attach Delivery Note
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )} */}

          {/* Finish Trip Button */}
          {userData?.user?.role !== "admin" && !currentTrip?.endTime && (
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
