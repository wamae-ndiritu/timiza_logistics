import axios from "axios";
import { END_POINT } from "../../baseUrl";
import { createBranchSuccess, createLocationSuccess, deleteLocationBranchSuccess, getBranchesSuccess, getLocationDetailsSuccess, getLocationsSuccess, locationActionFail, locationActionStart } from "../slices/locationSlices";


export const createLocation = (locationData) => async (dispatch, getState) => {
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
    dispatch(locationActionStart());
    await axios.post(`${END_POINT}/locations/create`, locationData, config);
    dispatch(createLocationSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};

export const addLocationBranch = (locationId, branches) => async (dispatch, getState) => {
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
    dispatch(locationActionStart());
    await axios.put(`${END_POINT}/locations/${locationId}/add-branch`, branches, config);
    dispatch(createBranchSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};

export const listLocations = () => async (dispatch, getState) => {
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
    const { data } = await axios.get(`${END_POINT}/locations/`, config);
    dispatch(getLocationsSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};

export const listLocationBranches = (locationId) => async (dispatch, getState) => {
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
    const { data } = await axios.get(`${END_POINT}/locations/${locationId}`, config);
    dispatch(getBranchesSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};

export const getLocation = (locationId) => async (dispatch, getState) => {
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
    dispatch(locationActionStart())
    const { data } = await axios.get(`${END_POINT}/locations/${locationId}`, config);
    dispatch(getLocationDetailsSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};


export const deleteLocation = (locationId) => async (dispatch, getState) => {
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
    dispatch(locationActionStart());
    await axios.delete(`${END_POINT}/locations/${locationId}`, config);
    dispatch(deleteLocationBranchSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};

export const deleteLocationBranch = (locationId, branchId) => async (dispatch, getState) => {
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
    dispatch(locationActionStart());
    await axios.delete(`${END_POINT}/locations/${locationId}/branches/${branchId}`, config);
    dispatch(deleteLocationBranchSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(locationActionFail(message));
  }
};
