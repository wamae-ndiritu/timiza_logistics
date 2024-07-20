import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
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
    role: ""
  });

  const submit = async () => {
    if (!form.email || !form.password || !form.role) {
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
      Alert.alert("Error", error.message);
    }
  }, [userData, error])


  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full h-full justify-center px-4 my-6'>
          <Image
            source={images.logoHorizontal}
            resizeMode='contain'
            className='w-[300px] h-[85px]'
          />
          <Text className='text-3xl text-secondary font-semibold mt-10 font-psemibold'>
            Welcome Back to{" "}
            <Text className='text-orange uppercase'>Timiza Logistics</Text>
          </Text>
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
          <SelectInput
            title='Choose Role'
            data={[
              { title: "Admin" },
              { title: "Driver" },
              { title: "Loader" },
            ]}
            placeholder='........'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, role: e })}
            otherStyles='mt-7'
          />
          <CustomButton
            title='Sign In'
            handlePress={submit}
            containerStyles='mt-7'
            textStyles='text-white-100 text-xl'
            isLoading={loading}
          />

          {/* <View className='justify-center pt-5 flex-row items-center justify-center gap-2'>
            <Text className='text-lg text-black-300 font-pregular'>
              Don't have an account?
            </Text>
            <Link href='/sign-up' className='text-lg text-orange underline'>
              Sign Up
            </Link>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
