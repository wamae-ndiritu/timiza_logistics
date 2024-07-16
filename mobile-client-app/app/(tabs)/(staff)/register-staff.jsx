import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../../../components/HeaderComponent';

const RegisterStaff = () => {
  return (
    <SafeAreaView className=''>
      <HeaderComponent
        title='Create Staff'
        inputPlaceHolder='Search staff'
        containerStyles='py-6'
        links={[
          { id: 0, title: "Staff", route: "/staff" },
          { id: 1, title: "Add Staff", route: "/register-staff" },
        ]}
      />
    </SafeAreaView>
  );
}

export default RegisterStaff