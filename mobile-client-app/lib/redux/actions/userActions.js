import axios from "axios";
import {
  userActionFail,
  userActionStart,
  userList,
  userLogin,
  userRegister,
  userUpdate,
} from "../slices/users";

const END_POINT = "http://192.168.88.203:3000/api/v1";

export const login = (userForm) => async (dispatch) => {
  try {
    dispatch(userActionStart());
    const { data } = await axios.post(`${END_POINT}/users/login`, userForm);
    dispatch(userLogin(data));
  } catch (error) {
    console.log(error);
    dispatch(userActionFail(error.message));
  }
};

export const registerUser = (userForm) => async (dispatch, getState) => {
  try {
    const {
      user: { userData },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.token}`,
        "Content-Type": "application/json",
      },
    };
    dispatch(userActionStart());
    const { data } = await axios.post(
      `${END_POINT}/users/register`,
      userForm,
      config
    );
    dispatch(userRegister());
  } catch (error) {
    const message = error?.response
      ? error.response?.data?.message
      : error.message;
    dispatch(userActionFail(message));
  }
};

export const listUsers =
  (type = "", search = "") =>
  async (dispatch, getState) => {
    try {
      const {
        user: { userData },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
      };
      dispatch(userActionStart());
      const { data } = await axios.get(
        `${END_POINT}/users/?type=${type}&search=${search}`,
        config
      );
      dispatch(userList(data));
    } catch (error) {
      const message = error?.response
        ? error.response?.data?.message
        : error.message;
      dispatch(userActionFail(message));
    }
  };

export const updateProfile =
  (userForm, type = "documents") =>
  async (dispatch, getState) => {
    try {
      const {
        user: { userData },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
      };
      console.log("Attempting upload")
      dispatch(userActionStart());
      if (type === 'documents'){
        await axios.put(`${END_POINT}/users/profile/documents`, userForm, config);
      }
      console.log("Profile update")
      dispatch(userUpdate());
    } catch (error) {
      console.log(error)
      const message = error?.response
        ? error.response?.data?.message
        : error.message;
      dispatch(userActionFail(message));
    }
  };
