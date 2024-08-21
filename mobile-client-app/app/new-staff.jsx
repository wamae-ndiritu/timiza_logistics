import React from "react";
import { useDispatch } from "react-redux";
import UserForm from "../components/UserForm";
import { registerUser } from "../lib/redux/actions/userActions";

const NewStaff = () => {
  const dispatch = useDispatch();
  const handleAddStaff = (userData) => {
    dispatch(registerUser(userData));
  };

  return (
    <UserForm
      initialValues={{
        fullName: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
      }}
      title='New Staff'
      onSubmit={handleAddStaff}
      isEdit={false}
    />
  );
};

export default NewStaff;
