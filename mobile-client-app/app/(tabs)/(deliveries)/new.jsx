import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import { Link } from "expo-router";
import FormField from "../../../components/FormField";
import axios from 'axios'
import { extractFileText } from "../../../lib/redux/actions/deliveryActions";

const NewDelivery = () => {
  const [form, setForm] = useState({
    vehicleRegistrationNumber: '',
    date: '',
    transporterName: '',
    driverName: '',
    loadersName: '',
    transporterSequenceRoute: '',
    deliveryNotesNumber: '',
    numberOfDeliveryNotes: '',
    total: ''
  });
  const [file, setFile] = useState(null);

  const openPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/png", "image/jpg", "image/jpeg"],
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
      await extractFileText(result.assets[0]);
    }
  };

const submit = async () => {
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  try {
    await extractFileText(file);
  } catch (error) {
    console.log(error)
  }
 
};
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
          <Text className='text-base text-gray-600 font-pregular'>
            Scan Delivery Note (Below fields wil autofill)
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
          <FormField
            title='Delivery Date'
            placeholder='20-07-2024'
            value={form.date}
            handleChangeText={(e) => setForm({ ...form, date: e })}
            otherStyles='mt-4 mb-3 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Transporter Name'
            placeholder='TIMIZA'
            value={form.transporterName}
            handleChangeText={(e) => setForm({ ...form, transporterName: e })}
            otherStyles='mt-4 mb-3 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Vehicle Registration No'
            placeholder='KAD 344A'
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
            placeholder='Walter Mugo'
            value={form.driverName}
            handleChangeText={(e) => setForm({ ...form, driverName: e })}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Loaders Name'
            placeholder='Ken Opondo, Martin Shikuku'
            value={form.loadersName}
            handleChangeText={(e) => setForm({ ...form, loadersName: e })}
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Transporter Sequence Route'
            placeholder='KAMAKIS'
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
            value={form.numberOfDeliveryNotes}
            handleChangeText={(e) =>
              setForm({ ...form, numberOfDeliveryNotes: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Delivery Notes Number'
            placeholder='654896, 4598760'
            value={form.deliveryNotesNumber}
            handleChangeText={(e) =>
              setForm({ ...form, deliveryNotesNumber: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Total Charges'
            placeholder='5000 etc'
            value={form.deliveryNotesNumber}
            handleChangeText={(e) =>
              setForm({ ...form, deliveryNotesNumber: e })
            }
            otherStyles='mb-2 bg-slate'
            textStyles='font-pregular text-md'
            inputStyles='bg-slate-50'
          />
        </View>
        {/* <PdfUploader /> */}
        <CustomButton
          title='Update Profile'
          handlePress={submit}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-psemibold text-xl'
        />
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default NewDelivery;
