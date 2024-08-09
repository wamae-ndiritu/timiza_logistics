import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "react-native-vector-icons";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { StatusBar } from "expo-status-bar";
import { uploadPdfToCloudinary } from "../lib/cloudinary";
import { hasEmptyValue } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { resetVehicleState } from "../lib/redux/slices/vehicleSlices";
import ActionButton from "./ActionButton";
import { deleteVehicle } from "../lib/redux/actions/vehicleActions";
import Icon from "react-native-vector-icons/Feather";
import { getUserById } from "../lib/redux/actions/userActions";
import TopBar from "./TopBar";
import Loading from "./Loading";

const VehicleForm = ({ mode = "new", title="View Vehicle", initialData = {}, onSubmit }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.vehicle);
  const {userData} = useSelector((state) => state.user);
  const router = useRouter();
  const [form, setForm] = useState({
    vehicleMake: "",
    vehicleModel: "",
    chassisNumber: "",
    tonnageCategory: "",
    vehicleNumberPlate: "",
    notes: "",
    ownerName: "",
    ownerIdNumber: "",
    ownerLogBook: null,
    ...initialData,
  });
  const [uploading, setUploading] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loaders, setLoaders] = useState([]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.type !== "cancel") {
      handleChange("ownerLogBook", result.assets[0].uri);
      setUploading(true);
      try {
        const data = await uploadPdfToCloudinary(result.assets[0]);
        handleChange("ownerLogBook", data.secure_url);
      } catch (error) {
        Alert.alert("Error", error.message)
      } finally {
        setUploading(false);
      }
    }
  };

  const submitForm = () => {
    if (hasEmptyValue(form)) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    onSubmit(form);
  };

   const handleDelete = () => {
     // confirm action
     Alert.alert(
       "Warning!",
       "You're about to delete the Vehicle. This action cannot be undone.",
       [
         {
           text: "Cancel",
           onPress: () => {
             return;
           },
           style: "cancel",
         },
         {
           text: "OK",
           onPress: () => {
             if (initialData?._id) {
               dispatch(deleteVehicle(initialData?._id));
               router.push("/vehicles");
             }
           },
         },
       ]
     );
   };

   const handleEdit = () => {
     router.push(`/vehicles/edit/${initialData?._id}`);
   };

  useEffect(() => {
    if (success) {
      setForm({
        vehicleMake: "",
        vehicleModel: "",
        chassisNumber: "",
        tonnageCategory: "",
        vehicleNumberPlate: "",
        notes: "",
        ownerName: "",
        ownerIdNumber: "",
        ownerLogBook: null,
      });
      const timeout = setTimeout(() => {
        dispatch(resetVehicleState());
        router.push("/vehicles");
      }, 3000);

      return () => clearTimeout(timeout);
    }

    if (error){
      setForm({
        vehicleMake: "",
        vehicleModel: "",
        chassisNumber: "",
        tonnageCategory: "",
        vehicleNumberPlate: "",
        notes: "",
        ownerName: "",
        ownerIdNumber: "",
        ownerLogBook: null,
      });
      Alert.alert("Error", error.message);
    }
  }, [success]);


  useEffect(() => {
    const fetchVehicleStaff = async () => {
      try {
        // Fetch driver data
        if (initialData?.currentDriver) {
          const driverData = await getUserById(
            initialData?.currentDriver,
            userData?.token
          );
          setDriver(driverData);
        }

        // Fetch loaders data
        if (initialData?.currentLoaders?.length > 0) {
          const loaderDataArray = await Promise.all(
            initialData.currentLoaders.map((loaderId) =>
              getUserById(loaderId, userData?.token)
            )
          );
          setLoaders(loaderDataArray);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchVehicleStaff();
  }, [
    initialData?.currentDriver,
    initialData?.currentLoaders,
    userData?.token,
  ]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title={title} />
      {loading ? (
        <Loading />
      ) : (
        <ScrollView className='px-4 py-4'>
          <FormField
            title='Vehicle Make'
            placeholder='Enter vehicle make'
            value={form.vehicleMake}
            handleChangeText={(e) => handleChange("vehicleMake", e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
            editable={mode !== "view"}
          />
          <FormField
            title='Vehicle Model'
            placeholder='Enter vehicle model'
            value={form.vehicleModel}
            handleChangeText={(e) => handleChange("vehicleModel", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Chassis Number'
            placeholder='Enter chassis number'
            value={form.chassisNumber}
            handleChangeText={(e) => handleChange("chassisNumber", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Tonnage Category'
            placeholder='Enter tonnage category'
            value={form.tonnageCategory}
            handleChangeText={(e) => handleChange("tonnageCategory", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Vehicle Number Plate'
            placeholder='Enter number plate'
            value={form.vehicleNumberPlate}
            handleChangeText={(e) => handleChange("vehicleNumberPlate", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Notes'
            placeholder='Enter additional notes'
            value={form.notes}
            handleChangeText={(e) => handleChange("notes", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Owner Name'
            placeholder='Enter owner name'
            value={form.ownerName}
            handleChangeText={(e) => handleChange("ownerName", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Owner ID Number'
            placeholder='Enter owner ID number'
            value={form.ownerIdNumber}
            handleChangeText={(e) => handleChange("ownerIdNumber", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <Text className='text-gray-600 text-md mb-1'>Owner Log Book</Text>
          <TouchableOpacity
            className='bg-gray-200 p-4 rounded-md mb-4'
            onPress={openPicker}
            disabled={mode === "view"}
          >
            {form.ownerLogBook ? (
              <Text className='text-blue-500 underline'>
                {form.ownerLogBook.split("/").pop()}
              </Text>
            ) : (
              // <Image
              //   source={{
              //     uri: generatePdfThumbnailUrl(form.ownerLogBook),
              //   }}
              //   style={{ width: 150, height: 200 }}
              // />
              <Text className='text-gray-600'>Upload Log Book (PDF)</Text>
            )}
            {uploading && <Text className='text-green-500'>uploading...</Text>}
          </TouchableOpacity>
          {mode !== "view" && (
            <CustomButton
              title={mode === "new" ? "Add Vehicle" : "Update Vehicle"}
              handlePress={submitForm}
              containerStyles='my-7 bg-orange rounded min-h-[45px]'
              textStyles='text-white font-semibold text-xl'
              isLoading={uploading || loading}
            />
          )}
          {mode === "view" && userData?.user?.role === "admin" && (
            <>
              <Text className='text-xl text-gray-800 mb-2'>
                Assigned Driver
              </Text>
              <TouchableOpacity
                // onPress={() => setSelectedDriver()}
                className={`mb-4 p-4 border bg-slate-200 border-gray-300 rounded-lg flex-row items-center space-x-4`}
              >
                <Feather name='user' size={24} color='#000' />
                {driver ? (
                  <Text className={`text-lg font-semibold text-secondary`}>
                    {driver.fullName}
                  </Text>
                ) : (
                  <Text className={`text-lg font-semibold text-red-500`}>
                    No Assigned Driver
                  </Text>
                )}
              </TouchableOpacity>
              <Text className='text-xl text-gray-800 mb-2'>
                Assigned Loaders
              </Text>
              <TouchableOpacity
                // onPress={() => setSelectedDriver()}
                className={`mb-4 p-4 border bg-slate-200 border-gray-300 rounded-lg flex-row items-center space-x-4`}
              >
                <Feather name='users' size={24} color='#000' />
                {loaders.length > 0 ? (
                  <View className='flex-row space-x-4 items-start'>
                    {loaders.map((loader) => (
                      <Text
                        className={`text-lg font-semibold text-secondary`}
                        key={loader._id}
                      >
                        {loader.fullName}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text className={`text-lg font-semibold text-red-500`}>
                    No Assigned Loaders
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/vehicles/staff/${initialData?._id}`)
                }
                className='mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4'
              >
                <Icon name='user-check' size={24} color='#000' />
                <Text className='text-lg font-semibold text-gray-700'>
                  Assign Staff to Vehicle
                </Text>
              </TouchableOpacity>
              <View className='flex-row justify-between mb-4 space-x-2'>
                <ActionButton type='edit' handlePress={handleEdit} />
                <ActionButton type='delete' handlePress={handleDelete} />
              </View>
            </>
          )}
        </ScrollView>
      )}
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default VehicleForm;
