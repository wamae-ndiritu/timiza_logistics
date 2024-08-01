import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../lib/redux/actions/userActions";
import ActivityIndicatorModal from "../../components/ActivityIndicatorModal";
import Message from "../../components/Message";
import { resetUserState } from "../../lib/redux/slices/users";

const SignIn = () => {
  const dispatch = useDispatch();
  const {userData, loading, error} = useSelector((state) => state.user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    dispatch(login(form));
  };

  useFocusEffect(
    useCallback(() => {
      if (userData && userData.user.role !== "admin" && userData.user.isDefaultPassword) {
        router.push(`/reset-password/${form.password}`);
      }
        setSubmitting(loading);

    }, [dispatch, userData, router, loading])
  );


  return (
    <SafeAreaView className='bg-secondary h-full flex-row justify-center items-center px-4'>
      <ScrollView>
        <View className='bg-white py-8 rounded-lg flex-col justify-center px-4'>
          <Image
            source={images.logoHorizontal}
            resizeMode='contain'
            className='w-[300px] h-[75px]'
          />
          {error && (
            <Message
              description={error}
              icon={icons.warning}
              descriptionStyles="text-lg text-red-400"
            />
          )}
          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-3'
            keyboardType='email-address'
            placeholder='johndoe@gmail.com'
          />
          <FormField
            title='Password'
            placeholder='........'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-3'
          />
          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-3 w-full rounded'
            textStyles='text-white-100 text-xl text-white'
            isLoading={loading}
          />
        </View>
      </ScrollView>
      <ActivityIndicatorModal
        visible={submitting}
        onClose={() => dispatch(resetUserState())}
      />
    </SafeAreaView>
  );
};

export default SignIn;
