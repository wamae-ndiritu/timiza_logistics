import axios from "axios";
import { END_POINT } from "../../baseUrl";
import { completeTripSuccess, createTripSuccess, getTripsSuccess, getTripSuccess, tripActionFail, tripActionStart } from "../slices/tripSlices";


export const startTrip = (tripData) => async (dispatch, getState) => {
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
    dispatch(tripActionStart());
    await axios.post(`${END_POINT}/trips/create`, tripData, config);
    dispatch(createTripSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(tripActionFail(message));
  }
};


export const completeTrip = (tripId, tripData) => async (dispatch, getState) => {
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
    dispatch(tripActionStart());
    await axios.post(`${END_POINT}/trips/complete/${tripId}`, tripData, config);
    dispatch(completeTripSuccess());
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(tripActionFail(message));
  }
};


export const listTrips = () => async (dispatch, getState) => {
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
    dispatch(tripActionStart());
    const {data} = await axios.get(`${END_POINT}/trips/`, config);
    dispatch(getTripsSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(tripActionFail(message));
  }
};


export const getTripById= (tripId) => async (dispatch, getState) => {
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
    dispatch(tripActionStart());
    const { data } = await axios.get(`${END_POINT}/trips/${tripId}`, config);
    dispatch(getTripSuccess(data));
  } catch (error) {
    const message = error?.response
      ? error.response?.data.message || error.response?.data.error
      : error.message;
    dispatch(tripActionFail(message));
  }
};