import axios from "axios";
import { END_POINT } from "../../baseUrl";
import { getStatsSuccess } from "../slices/globalSlices";

export const getStats =
  () => async (dispatch, getState) => {
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
      const {data} = await axios.get(
        `${END_POINT}/stats/`,
        config
      );
      dispatch(getStatsSuccess(data));
    } catch (error) {
      const message = error?.response
        ? error.response?.data.message || error.response?.data.error
        : error.message;
      console.log(message)
    }
  };
