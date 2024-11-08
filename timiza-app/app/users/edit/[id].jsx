import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import UserForm from "../../../components/UserForm";
import { getUserById, updateProfile } from "../../../lib/redux/actions/userActions";

const EditUserScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [dispatch, id]);

  const handleUpdateUser = (formData) => {
    dispatch(updateProfile(formData, "admin_update_user_profile", id));
  };

  return (
      <UserForm
        mode='edit'
        title='Edit Staff'
        initialData={{"fullName":profile?.fullName,"email":profile?.email,"phoneNumber":profile?.phoneNumber,"nationalId":profile?.nationalId, role: profile?.user?.role}}
        onSubmit={handleUpdateUser}
      />
  );
};

export default EditUserScreen;
