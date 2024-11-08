import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import Error from "../components/Error";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { forgotPasswordRequest } from "../lib/redux/actions/userActions";
import { resetUserState } from "../lib/redux/slices/users";

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const { loading, error, resetPass } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");

  const submitForm = () => {
    if (!email) {
      Alert.alert("Error", "Please fill in the email field");
      return;
    }
    dispatch(forgotPasswordRequest({ email }));
    // router.push('/verify-otp')
  };

  useEffect(() => {
    setEmail("");
    if (resetPass || error) {
      const timeout = setTimeout(() => {
        dispatch(resetUserState());
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [dispatch, resetPass, error]);

  useEffect(() => {
    if (resetPass) {
      const timeout = setTimeout(() => {
        router.push("/verify-otp");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [router, resetPass]);

  return (
    <SafeAreaView className='flex-1'>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView className='mt-[20px] px-4 py-4'>
          {error && (
            <View className='mb-3 bg-red-200 p-2 rounded'>
              <Error>{error}</Error>
            </View>
          )}
          {resetPass && (
            <Text className='px-4 py-2 bg-green-200 mb-3 text-green-700'>
              A verification code has been sent to{" "}
              <Text className='text-lg font-semibold'>{email}</Text>. Please
              check to continue.
            </Text>
          )}
          <FormField
            title='Enter your email'
            placeholder='enter email address'
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles='mb-3'
            inputStyles='bg-slate-50'
          />
          <CustomButton
            title='Reset Password'
            handlePress={submitForm}
            containerStyles='my-7 bg-orange rounded min-h-[45px]'
            textStyles='text-white font-semibold text-xl'
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
