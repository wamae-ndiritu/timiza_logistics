import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {useDispatch, useSelector} from "react-redux";
import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import { Link } from "expo-router";
import FormField from "../../../components/FormField";
import { createDelivery, extractFileText } from "../../../lib/redux/actions/deliveryActions";
import { uploadImageToCloudinary } from "../../../lib/cloudinary";
import { resetDeliveryState } from "../../../lib/redux/slices/deliverySlices";

const NewDelivery = () => {
  const dispatch = useDispatch();
  const {loading, success, error} = useSelector((state) => state.delivery);
  const [form, setForm] = useState({
    vehicleRegistrationNumber: "",
    date: "",
    transporterName: "",
    driverName: "",
    loadersName: [],
    transporterSequenceRoute: "",
    deliveryNotesNumber: [],
    numberOfDeliveryNotes: 0,
    total: "",
  });
  const [deliveryNotesNumber, setDeliveryNotesNumber] = useState("");
  const [loadersName, setLoadersName] = useState("");
  const [readingFile, setReadingFile] = useState(false);
  const [fileErr, setFileErr] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
      setReadingFile(true);
      setFileErr(null);
      try {
        const data = await extractFileText(result.assets[0]);
        setForm(data);
      } catch (error) {
        setFileErr(error.message);
      } finally {
        setReadingFile(false);
      }
    }
  };

  const readArrayString = (attr) => {
    if (Array.isArray(form[attr])) {
      return form[attr].join(", ");
    }
    return "";
  };

  const convertStringToArray = (str, type = "str") => {
    let res = str
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== ""); // Remove empty strings from split result
    // Trim spaces and split the string by commas,
    if (type === "number") {
      res = res.map(Number);
    }
    return res;
  };

  // Update formatted strings
  useEffect(() => {
    setDeliveryNotesNumber(readArrayString("deliveryNotesNumber"));
    setLoadersName(readArrayString("loadersName"));
  }, [form.deliveryNotesNumber, form.loadersName]);

  // Update form state based on local state
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      deliveryNotesNumber: convertStringToArray(deliveryNotesNumber, "number"),
      loadersName: convertStringToArray(loadersName, "str"),
    }));
  }, [deliveryNotesNumber, loadersName]);

  const submit = async () => {
    setFileErr(null);
    setUploading(true);
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      const data = await uploadImageToCloudinary(file);
      setFile({uri: data.secure_url})
      dispatch(createDelivery({ ...form, fileRef: data.secure_url }));
    } catch (error) {
      setFileErr(error.message)
    }finally{
      setUploading(false);
    }
  };

  useEffect(() => {
    if (success || error){
      setForm({
        vehicleRegistrationNumber: "",
        date: "",
        transporterName: "",
        driverName: "",
        loadersName: [],
        transporterSequenceRoute: "",
        deliveryNotesNumber: [],
        numberOfDeliveryNotes: 0,
        total: "",
      });
      setLoadersName("");
      setDeliveryNotesNumber("");
      setFile(null);

      const interval = setInterval(() => {
        dispatch(resetDeliveryState());
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [dispatch, success, error])
  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='px-4 z-[99] bg-secondary w-full h-16 flex-row justify-between items-center'>
        <Text className='text-white text-2xl font-psemibold'>Add Delivery</Text>
        <Link
          href='/list'
          className='bg-primary px-2 py-1 text-gray-600 rounded shadow'
        >
          View Deliveries
        </Link>
      </View>
      <ScrollView className='px-4'>
        <View className='mt-7 space-y-2'>
          {error && (
            <Text className='px-2 text-base text-red-500 font-pregular bg-red-100 py-1 rounded'>
              {error}
            </Text>
          )}
          <Text className='text-base text-gray-600 font-pregular'>
            Scan Delivery Note (Below fields will autofill)
          </Text>
          <TouchableOpacity
            className='bg-white border-[1px] border-gray-300 p-1 h-48 rounded-lg'
            onPress={() => openPicker("front")}
          >
            {file ? (
              <Image
                source={{
                  uri: file.uri,
                }}
                resizeMode='cover'
                className='w-full h-full rounded-xl border-[1px]'
              />
            ) : (
              <View className='bg-primary h-full w-full rounded items-center justify-center'>
                <View className='border-[1px] border-gray-300 border-dotted p-3 rounded-full'>
                  <Image
                    source={icons.camera}
                    className='h-8 w-8'
                    resizeMode='contain'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
          {readingFile ? (
            <Text className='px-2 py-0.5 text-base text-green-500 font-pregular'>
              Extracting delivery note details...
            </Text>
          ) : (
            fileErr && (
              <Text className='px-2 py-0.5 text-base text-red-500 font-pregular'>
                {fileErr}
              </Text>
            )
          )}
          <FormField
            title='Delivery Date'
            placeholder='Enter date e.g 20-07-2024'
            value={form.date}
            handleChangeText={(e) => setForm({ ...form, date: e })}
            otherStyles='mt-4 mb-3 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Transporter Name'
            placeholder='Enter transporter company name'
            value={form.transporterName}
            handleChangeText={(e) => setForm({ ...form, transporterName: e })}
            otherStyles='mt-4 mb-3 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Vehicle Registration No'
            placeholder='Enter vehicle registration'
            value={form.vehicleRegistrationNumber}
            handleChangeText={(e) =>
              setForm({ ...form, vehicleRegistrationNumber: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Driver Name'
            placeholder='Enter name'
            value={form.driverName}
            handleChangeText={(e) => setForm({ ...form, driverName: e })}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Loaders Name'
            placeholder='Enter names separated by comma'
            value={loadersName}
            handleChangeText={(e) => setLoadersName(e)}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Transporter Sequence Route'
            placeholder='Enter sequence route'
            value={form.transporterSequenceRoute}
            handleChangeText={(e) =>
              setForm({ ...form, transporterSequenceRoute: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Number of  Delivery Notes'
            placeholder='1, 2 etc'
            value={form.numberOfDeliveryNotes.toString()}
            handleChangeText={(e) =>
              setForm({ ...form, numberOfDeliveryNotes: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Delivery Notes Number'
            placeholder='Enter numbers separated by commas'
            value={deliveryNotesNumber}
            handleChangeText={(e) => setDeliveryNotesNumber(e)}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Total Charges'
            placeholder='Enter charges'
            value={form.total}
            handleChangeText={(e) => setForm({ ...form, total: e })}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
        </View>
        {/* <PdfUploader /> */}
        <CustomButton
          title={uploading || loading ? "Saving..." : "Save Delivery"}
          handlePress={submit}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-psemibold text-xl'
          isLoading={uploading || loading}
        />
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default NewDelivery;
