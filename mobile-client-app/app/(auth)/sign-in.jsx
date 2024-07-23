import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import SelectInput from "../../components/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../lib/redux/actions/userActions";
// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const dispatch = useDispatch();
  const {userData, loading, error} = useSelector((state) => state.user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }
    dispatch(login(form));
  };

  useEffect(() => {
    setForm({
      email: "",
      password: "",
      role: "",
    });
    if (userData){
      router.push('/home');
    }
    if (error){
      Alert.alert("Error", error);
    }
  }, [userData, error])


  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView>
        <View className='w-full min-h-[65vh] flex-col justify-center px-4'>
          <Image
            source={images.logoHorizontal}
            resizeMode='contain'
            className='w-[300px] h-[85px]'
          />
          <FormField
            title='Email'
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
            placeholder='johndoe@gmail.com'
          />
          <FormField
            title='Password'
            placeholder='........'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7'
          />
            <CustomButton
              title='Sign In'
              handlePress={submit}
              containerStyles='mt-7 w-full rounded'
              textStyles='text-white-100 text-xl text-white'
              isLoading={loading}
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
