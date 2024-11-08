import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import { StatusBar } from "expo-status-bar";
import { hasEmptyValue } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "./ActionButton";
import Icon from "react-native-vector-icons/Feather";
import TopBar from "./TopBar";
import Loading from "./Loading";
import { resetUserState } from "../lib/redux/slices/users";
import CustomRadioButton from "./CustomRadioButton";

const UserForm = ({
  mode = "new",
  title = "View Staff",
  initialData = {},
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const { userData, loading, error, success } = useSelector(
    (state) => state.user
  );
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
    ...initialData,
  });
  const [role, setRole] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitForm = () => {
    if (hasEmptyValue(form)) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    onSubmit({ ...form, role: role.toLowerCase() });
  };

  const handleDelete = () => {
    // confirm action
    Alert.alert(
      "Warning!",
      "You're about to delete the Staff. This action cannot be undone.",
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
              //  delete staff
              router.push("/staff");
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/users/edit/${initialData?._id}`);
  };

  useEffect(() => {
    if (success) {
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
      });
      setRole("");
      const timeout = setTimeout(() => {
        dispatch(resetUserState());
        router.push("/staff");
      }, 3000);

      return () => clearTimeout(timeout);
    }

    if (error) {
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
      });
      setRole("");
      Alert.alert("Error", error.message);
    }
  }, [success]);

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <TopBar title={title}>
        <Link href='/staff'>
          <Icon name='users' size={24} color='#FFF' />
        </Link>
      </TopBar>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView className='px-4 py-4'>
          <FormField
            title='Full Name'
            placeholder='Enter fullname'
            value={form.fullName}
            handleChangeText={(e) => handleChange("fullName", e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
            editable={mode !== "view"}
          />
          <FormField
            title='Email'
            placeholder='Enter email'
            value={form.email}
            handleChangeText={(e) => handleChange("email", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='Contact'
            placeholder='Enter phone number'
            value={form.phoneNumber}
            handleChangeText={(e) => handleChange("phoneNumber", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='National ID'
            placeholder='Enter ID no'
            value={form.nationalId}
            handleChangeText={(e) => handleChange("nationalId", e)}
            editable={mode !== "view"}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
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
          {mode !== "view" && (
            <CustomButton
              title={mode === "new" ? "Add Staff" : "Update Staff"}
              handlePress={submitForm}
              containerStyles='my-7 bg-orange rounded min-h-[45px]'
              textStyles='text-white font-semibold text-xl'
              isLoading={loading}
            />
          )}
          {mode === "view" && userData?.user?.role === "admin" && (
            <View className='flex-row justify-between mb-4 space-x-2'>
              <ActionButton type='edit' handlePress={handleEdit} />
              <ActionButton type='delete' handlePress={handleDelete} />
            </View>
          )}
        </ScrollView>
      )}
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default UserForm;
