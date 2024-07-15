import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import SelectInput from "../../components/SelectInput";
// import { getCurrentUser, signIn } from "../../lib/appwrite";
// import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  // const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  console.log(form)
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // const submit = async () => {
  //   if (!form.email || !form.password) {
  //     Alert.alert("Error", "Please fill in all the fields");
  //   }
  //   setIsSubmitting(true);
  //   try {
  //     await signIn(form.email, form.password);

  //     const result = await getCurrentUser();

  //     setUser(result);
  //     setIsLoggedIn(true);
  //     router.replace("/home");
  //   } catch (error) {
  //     Alert.alert("Error", error.message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const submit = () => {
    router.push('/home')
  }

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
            // isLoading={isSubmitting}
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
