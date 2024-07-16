import { View, Text, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../../components/HeaderComponent';
import FormField from '../../../components/FormField';
import CustomButton from '../../../components/CustomButton';
import CustomRadioButton from '../../../components/CustomRadioButton';

const RegisterStaff = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    nationalId: "",
  })
  const [role, setRole] = useState("")
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    console.log({...form, role})
  }
  return (
    <SafeAreaView className=''>
      <ScrollView>
        <HeaderComponent
          title='Create Staff'
          inputPlaceHolder='Search staff'
          containerStyles='py-6'
          links={[
            { id: 0, title: "Staff", route: "/staff" },
            { id: 1, title: "Add Staff", route: "/register-staff" },
          ]}
        />
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
            title="Select Role"
          />
          <CustomButton
            title='Save User'
            handlePress={handleSubmit}
            isLoading={submitting}
            textStyles='text-lg'
            containerStyles="bg-orange py-1"

          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterStaff