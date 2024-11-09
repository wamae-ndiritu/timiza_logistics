import { View, Text, ScrollView, Alert, Image, ToastAndroid } from "react-native";
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
import { icons } from "../constants";
import { revokeUserAccess } from "../lib/redux/actions/userActions";

const UserForm = ({
  mode = "new",
  title = "View Staff",
  initialData = {},
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const { userData, loading, error, success, updateSuccess, deleteSuccess } = useSelector(
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

  useEffect(() => {
    if (initialData?.role || initialData?.user?.role) {
      setRole(initialData.role || initialData.user.role);
    }
  }, []);

  useEffect(() => {
    if (initialData){
      setForm(initialData)
    }
  }, [initialData]);

  useEffect(() => {
    if (updateSuccess) {
      ToastAndroid.show(
        "Staff details updated!",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } else if (deleteSuccess) {
      ToastAndroid.show(
        "Staff access has been revoked!",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
      router.replace("/staff")
    }
  }, [updateSuccess, deleteSuccess]);

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
      "You're about to remove the Staff. This action cannot be undone.",
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
            if (initialData?.user?._id) {
              dispatch(revokeUserAccess(initialData?.user?._id, initialData?.role || initialData?.user?.role));
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    router.push(`/users/edit/${initialData?.user?._id}`);
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
      <ScrollView className='px-4 py-4'>
        {loading && <Loading />}
        {initialData?.user?.isDefaultPassword && (
          <View className='bg-red-100 p-3 rounded mb-3'>
            <Text className='text-red-600 text-lg font-pmedium'>
              This user has never logged in to their account!
            </Text>
          </View>
        )}
        {mode === "view" && (
          <>
            <Text className='text-lg text-gray-600 font-pmedium mb-2'>
              National ID (Front)
            </Text>
            <View className='bg-white border-[1px] border-gray-300 p-1 h-48 rounded-lg'>
              {initialData?.nationalIdFront ? (
                <Image
                  source={{
                    uri: initialData.nationalIdFront,
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
            </View>
            <Text className='text-lg mt-3 text-gray-600 font-pmedium mb-2'>
              National ID (Back)
            </Text>
            <View className='bg-white border-[1px] border-gray-300 p-1 h-48 rounded-lg'>
              {initialData?.nationalIdBack ? (
                <Image
                  source={{
                    uri: initialData.nationalIdBack,
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
            </View>
          </>
        )}
        <FormField
          title='Full Name'
          placeholder='Enter fullname'
          value={form.fullName}
          handleChangeText={(e) => handleChange("fullName", e)}
          otherStyles='my-3'
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
          handlePress={mode === "view" ? () => {} : setRole}
          mode='view'
          title='Select Role'
          selectedValue={role}
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
          <>
            {initialData?.assignedVehicle && (
              <View
                className={`mb-4 p-4 border bg-white border-gray-300 rounded-lg`}
              >
                <Text className={`text-lg font-semibold text-secondary`}>
                  Vehicle Assigned
                </Text>
                <View className='flex-row flex-wrap items-center py-2'>
                  <Text className='text-xs text-gray-500'>
                    Currently assigned to{" "}
                  </Text>
                  <Text className='text-xs text-secondary truncate w-full'>
                    {initialData?.assignedVehicle?.vehicleMake}{" "}
                    {initialData?.assignedVehicle?.vehicleModel}{" "}
                    {initialData?.assignedVehicle?.vehicleNumberPlate}
                  </Text>
                </View>
              </View>
            )}
            <View className='flex-row justify-between my-4 space-x-2'>
              <ActionButton type='edit' handlePress={handleEdit} />
              <ActionButton type='delete' handlePress={handleDelete} />
            </View>
          </>
        )}
      </ScrollView>
      <StatusBar backgroundColor='#2A7353' style='light' />
    </SafeAreaView>
  );
};

export default UserForm;
