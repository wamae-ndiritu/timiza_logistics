import axios from "axios";
import { END_POINT } from "../../baseUrl";
import {
  deleteVehicleSuccess,
  getVehiclesSuccess,
  getVehicleSuccess,
  registerVehicleSuccess,
  updateVehicleSuccess,
  vehicleActionFail,
  vehicleActionStart,
} from "../slices/vehicleSlices";

export const registerVehicle = (vehicleData) => async (dispatch, getState) => {
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
    dispatch(vehicleActionStart());
    await axios.post(`${END_POINT}/vehicles/create`, vehicleData, config);
    dispatch(registerVehicleSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(vehicleActionFail(message));
  }
};

export const listVehicles = () => async (dispatch, getState) => {
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
    dispatch(vehicleActionStart());
    const { data } = await axios.get(`${END_POINT}/vehicles/`, config);
    dispatch(getVehiclesSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(vehicleActionFail(message));
  }
};

export const getVehicleById = (vehicleId) => async (dispatch, getState) => {
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
    dispatch(vehicleActionStart());
    const { data } = await axios.get(
      `${END_POINT}/vehicles/${vehicleId}`,
      config
    );
    dispatch(getVehicleSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(vehicleActionFail(message));
  }
};

export const updateVehicle =
  (vehicleId, vehicleData) => async (dispatch, getState) => {
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
      dispatch(vehicleActionStart());
      const { data } = await axios.put(
        `${END_POINT}/vehicles/${vehicleId}`,
        vehicleData,
        config
      );
      dispatch(updateVehicleSuccess(data));
    } catch (error) {
      const message = error?.response
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      dispatch(vehicleActionFail(message));
    }
  };

export const deleteVehicle = (vehicleId) => async (dispatch, getState) => {
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
    dispatch(vehicleActionStart());
    await axios.delete(`${END_POINT}/vehicles/${vehicleId}`, config);
    dispatch(deleteVehicleSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(vehicleActionFail(message));
  }
};

export const assignDriverAndLoadersToVehicle =
  (vehicleId, formData) => async (dispatch, getState) => {
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
      dispatch(vehicleActionStart());
      console.log("Attempting to update...");
      console.log(formData);
      const { data } = await axios.post(
        `${END_POINT}/vehicles/${vehicleId}/assign-staff`,
        formData,
        config
      );
      dispatch(updateVehicleSuccess(data));
    } catch (error) {
      console.log("Error: " + error);
      const message = error?.response
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      dispatch(vehicleActionFail(message));
    }
  };
