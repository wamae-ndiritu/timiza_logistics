import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Feather } from "react-native-vector-icons";
import CustomButton from "./CustomButton"; 
import FormField from "./FormField";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch } from "react-redux";
// import { createTrip, updateTrip } from "../lib/redux/actions/tripActions";

const TripForm = ({ mode, initialData, onSubmit }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    vehicleId: initialData?.vehicleId || "",
    driverId: initialData?.driverId || "",
    loaderIds: initialData?.loaderIds || [],
    startTime: initialData?.startTime || new Date(),
    startLocation: initialData?.startLocation?.coordinates || "",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const submitForm = async () => {
    setLoading(true);
    // try {
    //   if (mode === "new") {
    //     await dispatch(createTrip(form));
    //   } else {
    //     await dispatch(updateTrip(initialData._id, form));
    //   }
    //   onSubmit(); // Callback after form submission
    // } catch (error) {
    //   console.error("Error submitting form:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <ScrollView className='px-4 py-4'>
      <FormField
        title='Vehicle ID'
        placeholder='Enter vehicle ID'
        value={form.vehicleId}
        handleChangeText={(e) => handleChange("vehicleId", e)}
        otherStyles='mb-3'
        inputStyles='bg-slate-50'
        editable={mode !== "view"}
      />
      <FormField
        title='Driver ID'
        placeholder='Enter driver ID'
        value={form.driverId}
        handleChangeText={(e) => handleChange("driverId", e)}
        otherStyles='mb-3'
        inputStyles='bg-slate-50'
        editable={mode !== "view"}
      />
      <FormField
        title='Loader IDs (comma separated)'
        placeholder='Enter loader IDs'
        value={form.loaderIds.join(", ")}
        handleChangeText={(e) =>
          handleChange(
            "loaderIds",
            e.split(",").map((id) => id.trim())
          )
        }
        otherStyles='mb-3'
        inputStyles='bg-slate-50'
        editable={mode !== "view"}
      />
      <Text className='text-gray-600 text-md mb-1'>Start Time</Text>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(form.startTime)}
          mode='datetime'
          display='default'
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              handleChange("startTime", selectedDate);
            }
          }}
        />
      )}
      <TouchableOpacity
        className='bg-gray-200 p-4 rounded-md mb-4'
        onPress={() => setShowDatePicker(true)}
        disabled={mode === "view"}
      >
        <Text className='text-gray-600'>
          {new Date(form.startTime).toLocaleString()}
        </Text>
      </TouchableOpacity>
      <FormField
        title='Start Location'
        placeholder='Enter start location (longitude,latitude)'
        // value={form?.startLocation?.join(", ")}
        handleChangeText={(e) =>
          handleChange(
            "startLocation",
            e.split(",").map((coord) => parseFloat(coord.trim()))
          )
        }
        otherStyles='mb-3'
        inputStyles='bg-slate-50'
        editable={mode !== "view"}
      />
      {mode !== "view" && (
        <CustomButton
          title={mode === "new" ? "Create Trip" : "Update Trip"}
          handlePress={submitForm}
          containerStyles='my-7 bg-orange rounded min-h-[45px]'
          textStyles='text-white font-semibold text-xl'
          isLoading={loading}
        />
      )}
    </ScrollView>
  );
};

export default TripForm;
