import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Error from "../components/Error";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import TopBar from "../components/TopBar";
import { updateProfile } from "../lib/redux/actions/userActions";
import { router } from "expo-router";

const VerifyOTPScreen = () => {
const dispatch = useDispatch();
  const { loading, error, activeUser, updateSuccess } = useSelector((state) => state.user);

  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log(activeUser)

  const submitForm = () => {
    if (!otp || !newPassword || !confirmPassword){
        Alert.alert("Error", "Please fill in all the fields!");
        return;
    }
    dispatch(updateProfile({user: activeUser, otp, newPassword, confirmPassword}, "forgot_password"));
  };

  useEffect(() => {
    if (updateSuccess || error){
        setOTP("");
        setNewPassword("");
        setConfirmPassword("");
    }
    if (updateSuccess){
        const timeout = setTimeout(() => {
            router.replace('/sign-in');
        }, 5000);

        return () => clearTimeout(timeout);
    }
  }, [updateSuccess, error, router])

  return (
    <SafeAreaView className='flex-1'>
      <TopBar title='Verify OTP & Reset' />
      {loading ? (
        <Loading />
      ) : error ? (
        <Error>{error}</Error>
      ) : (
        <ScrollView className='mt-[20px] px-4 py-4'>
          {error && <Error>{error}</Error>}
          {updateSuccess && (
            <Text className='px-4 py-2 bg-green-200 mb-3 text-green-700'>
              Your password has been reset successfully! Please wait as you're being redirected to login...
            </Text>
          )}
          <FormField
            title='Enter OTP'
            placeholder='enter otp'
            value={otp}
            handleChangeText={(e) => setOTP(e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <FormField
            title='New Password'
            placeholder='********'
            value={newPassword}
            handleChangeText={(e) => setNewPassword(e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
            type="password"
          />
          <FormField
            title='Confirm New Password'
            placeholder='********'
            value={confirmPassword}
            handleChangeText={(e) => setConfirmPassword(e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
            type="password"
          />
          <CustomButton
            title='Change Password'
            handlePress={submitForm}
            containerStyles='my-7 bg-orange rounded min-h-[45px]'
            textStyles='text-white font-semibold text-xl'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default VerifyOTPScreen;
