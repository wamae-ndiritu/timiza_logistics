import axios from "axios";
import { END_POINT } from "../../baseUrl";
import * as FileSystem from "expo-file-system";
import {
  createDeliverySuccess,
  deleteDeliverySuccess,
  deliveryActionFail,
  deliveryActionStart,
  getDeliveriesStart,
  getDeliveriesSuccess,
  getDeliverySuccess,
  updateDeliverySuccess,
} from "../slices/deliverySlices";

export const extractFileText = async (file) => {
  // Read file content as Base64
  const fileContent = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Construct JSON body
  const payload = {
    document: {
      name: file.name,
      type: file.mimeType,
      content: fileContent,
    },
  };

  try {
    // Send the file to your backend
    const response = await axios.post(
      `${END_POINT}/deliveries/upload`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Assuming backend response includes jobId for processing
    const { jobId } = response.data;

    const { data } = await axios.get(`${END_POINT}/deliveries/status/${jobId}`);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createDelivery = (deliveryData) => async (dispatch, getState) => {
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
    dispatch(deliveryActionStart());
    await axios.post(`${END_POINT}/deliveries/create`, deliveryData, config);
    dispatch(createDeliverySuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(deliveryActionFail(message));
  }
};

export const listDeliveries = () => async (dispatch, getState) => {
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
    dispatch(deliveryActionStart());
    dispatch(getDeliveriesStart());
    const { data } = await axios.get(`${END_POINT}/deliveries/`, config);
    dispatch(getDeliveriesSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(deliveryActionFail(message));
  }
};

export const getDeliveryById = (deliveryId) => async (dispatch, getState) => {
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
    dispatch(deliveryActionStart());
    const { data } = await axios.get(`${END_POINT}/deliveries/${deliveryId}`, config);
    dispatch(getDeliverySuccess(data));
  } catch (error) {
    console.log(error)
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(deliveryActionFail(message));
  }
};

// Update delivery 
export const updateDelivery = (deliveryId, deliveryData) => async (dispatch, getState) => {
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
    dispatch(deliveryActionStart());
    const { data } = await axios.put(
      `${END_POINT}/deliveries/${deliveryId}`,
      deliveryData,
      config
    );
    dispatch(updateDeliverySuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(deliveryActionFail(message));
  }
};

// delete delivery note
export const deleteDelivery =
  (deliveryId, deliveryData) => async (dispatch, getState) => {
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
      dispatch(deliveryActionStart());
      await axios.delete(
        `${END_POINT}/deliveries/${deliveryId}`,
        config
      );
      dispatch(deleteDeliverySuccess());
    } catch (error) {
      const message = error?.response
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      dispatch(deliveryActionFail(message));
    }
  };