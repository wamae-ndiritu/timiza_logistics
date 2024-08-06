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
import { router, useRouter } from "expo-router";
import ErrorModal from "../../../components/ErrorModal";

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
  });
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.phoneNumber ||
      !form.nationalId ||
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
    });
    if (success) {
      router.push("/staff");
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
    <SafeAreaView className='h-full'>
      <HeaderComponent
        title='Create Staff'
        inputPlaceHolder='Search staff'
        containerStyles='py-2 pt-4'
        links={links}
      />
      <ScrollView class=''>
        <View className='px-4 mt-8 mb-3'>
          <FormField
            title='Full Name'
            placeholder='Enter full Name...'
            value={form.fullName}
            handleChangeText={(e) => setForm({ ...form, fullName: e })}
            otherStyles='mb-2'
          />
          <FormField
            title='Email'
            placeholder='Enter email...'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mb-2'
          />
          <FormField
            title='Contact'
            placeholder='Enter telephone no...'
            value={form.phoneNumber}
            handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
            otherStyles='mb-2'
          />
          <FormField
            title='National ID'
            placeholder='Enter ID no...'
            value={form.nationalId}
            handleChangeText={(e) => setForm({ ...form, nationalId: e })}
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
            containerStyles='bg-orange min-h-[45px] mt-1'
          />
        </View>
        <ErrorModal
          visible={error ? true : false}
          onClose={() => {
            dispatch(resetUserState());
            router.push('/register-staff')
          }}
          description={error}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterStaff;
