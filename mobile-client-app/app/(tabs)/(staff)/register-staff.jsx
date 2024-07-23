import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../../../components/HeaderComponent";
import FormField from "../../../components/FormField";
import CustomButton from "../../../components/CustomButton";
import CustomRadioButton from "../../../components/CustomRadioButton";
import { registerUser } from "../../../lib/redux/actions/userActions";
import { resetUserState } from "../../../lib/redux/slices/users";
import { router } from "expo-router";

const RegisterStaff = () => {
  const dispatch = useDispatch();
  const { userData, loading, error, success } = useSelector(
    (state) => state.user
  );
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    drivingLicense: "",
  });
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.phoneNumber ||
      !form.nationalId ||
      !form.drivingLicense ||
      !role
    ) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    dispatch(registerUser({ ...form, role: role.toLowerCase() }));
  };

  useEffect(() => {
    setForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      nationalId: "",
      drivingLicense: "",
    });
    setRole("");
    if (success) {
      router.push("/staff");
    }
    if (error) {
      Alert.alert("Error", error);
    }
  }, [success, error]);

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        dispatch(resetUserState());
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, []);

  const links = [
    { id: 0, title: "List Staff", route: "/staff" },
    { id: 1, title: "Add Staff", route: "/register-staff" },
  ];
  return (
    <SafeAreaView className=''>
      <HeaderComponent
        title='Create Staff'
        inputPlaceHolder='Search staff'
        containerStyles='py-2'
        links={links}
      />
      <ScrollView class="min-h-full">
        <View className='px-4 my-4'>
          <FormField
            title='Full Name'
            placeholder='Enter full name'
            value={form.fullName}
            handleChangeText={(e) => setForm({ ...form, fullName: e })}
            otherStyles='mb-4'
          />
          <FormField
            title='Email'
            placeholder='example@example.com'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mb-4'
          />
          <FormField
            title='Contact'
            placeholder='07 ** *** ***'
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles='mb-4'
          />
          <FormField
            title='National ID No'
            placeholder='** *** ***'
            value={form.nationalId}
            handleChangeText={(e) => setForm({ ...form, nationalId: e })}
            otherStyles='mb-4'
          />
          <FormField
            title='Driving Licence No'
            placeholder=''
            value={form.drivingLicense}
            handleChangeText={(e) => setForm({ ...form, drivingLicense: e })}
            otherStyles='mb-4'
          />
          <CustomRadioButton
            options={[
              {
                id: "1",
                label: "Driver",
                value: "driver",
              },
              {
                id: "2",
                label: "Loader",
                value: "loader",
              },
            ]}
            handlePress={setRole}
            title='Select Role'
          />
          <CustomButton
            title='Save User'
            handlePress={handleSubmit}
            isLoading={loading}
            textStyles='text-lg'
            containerStyles='bg-orange py-1 mt-5'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterStaff;
