import axios from "axios";
import {
  fetchLoaders,
  forgotPassReqSuccess,
  getProfile,
  getUserTruck,
  logoutUser,
  userActionFail,
  userActionStart,
  userList,
  userLogin,
  userRegister,
  userUpdate,
} from "../slices/users";
import { END_POINT } from "../../baseUrl";
import { router } from "expo-router";

export const login = (userForm) => async (dispatch) => {
  try {
    dispatch(userActionStart());
    const { data } = await axios.post(`${END_POINT}/users/login`, userForm);
    dispatch(userLogin(data));
  } catch (error) {
    console.log(JSON.stringify(error));
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(userActionFail(message));
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
      ? error.response?.data.message || error.response?.data.error
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
        ? error.response?.data.message || error.response?.data.error
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
      dispatch(userActionStart());
      if (type === "documents") {
        await axios.put(
          `${END_POINT}/users/profile/documents`,
          userForm,
          config
        );
      }
      if (type === "forgot_password") {
        await axios.put(`${END_POINT}/users/verify-otp`, userForm);
      }
      if (type === "password") {
        await axios.put(`${END_POINT}/users/profile`, userForm, config);
      }
      dispatch(userUpdate());
    } catch (error) {
      const message = error?.response
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      dispatch(userActionFail(message));
    }
  };

export const getUserProfile = () => async (dispatch, getState) => {
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
    const { data } = await axios.get(`${END_POINT}/users/profile`, config);
    dispatch(getProfile(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(userActionFail(message));
  }
};

// Get user by Id
export const getUserById = (userId) => async (dispatch, getState) => {
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
    dispatch(userActionStart())
    const { data } = await axios.get(`${END_POINT}/users/${userId}`, config);
    dispatch(getProfile(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
      dispatch(userActionFail(message))
  }
};

// Get Loaders
export const getLoadersByIds = (loaderIds) => async (dispatch, getState) => {
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

    // Fetch each loader's profile in parallel
    const loadersRequests = loaderIds.map((loaderId) =>
      axios.get(`${END_POINT}/users/${loaderId}`, config)
    );

    const loadersResponses = await Promise.all(loadersRequests);
    const loadersData = loadersResponses.map((res) => res.data);

    dispatch(fetchLoaders(loadersData)); 
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(userActionFail(message));
  }
};


// Reset password
export const forgotPasswordRequest = (userForm) => async (dispatch) => {
  try {
    dispatch(userActionStart());
    const { data } = await axios.post(
      `${END_POINT}/users/send-reset-password`,
      userForm
    );
    dispatch(forgotPassReqSuccess(data._id));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(userActionFail(message));
  }
};

export const getUserAssignedTruck = (userId) => async (dispatch, getState) => {
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
      `${END_POINT}/vehicles/users/${userId}`,
      config
    );
    dispatch(getUserTruck(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(userActionFail(message));
  }
};

export const logout = () => (dispatch) => {
  dispatch(logoutUser());
  router.replace('/sign-in');
}
