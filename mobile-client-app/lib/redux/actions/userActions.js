import axios from "axios";
import { userActionFail, userActionStart, userLogin } from "../slices/users";

const END_POINT = "http://192.168.88.203:3000/api/v1";

export const login = (userForm) => async(dispatch) => {
  try {
    console.log('login...')
    dispatch(userActionStart());
    const { data } = await axios.post(`${END_POINT}/users/login`, userForm);
    dispatch(userLogin(data));
  } catch (error) {
    console.log(error)
    dispatch(userActionFail(error.message))
  }
};
