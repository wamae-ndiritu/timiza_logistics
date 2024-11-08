import React, { useCallback} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../../../lib/redux/actions/userActions";
import UserForm from "../../../components/UserForm";

const UserViewScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { profile, updateSuccess } = useSelector((state) => state.user);

  useFocusEffect(
    useCallback(() => {
      dispatch(getUserById(id));
    }, [dispatch, id, updateSuccess])
  );

  return (
    <UserForm
      key={profile?._id}
      mode='view'
      title='View Staff'
      initialData={{...profile}}
      
    />
  );
};

export default UserViewScreen;
