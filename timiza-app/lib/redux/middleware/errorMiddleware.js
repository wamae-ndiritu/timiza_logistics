import { logout } from "../actions/userActions";
import { resetUserState } from "../slices/users";

const errorMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.payload && typeof action.payload === "string") {
      const errorMessage = action.payload;

      if (
        errorMessage === "Token is not valid" ||
        errorMessage === "Token expired" || errorMessage === "No token, authorization denied"
      ) {
        dispatch(resetUserState())
        dispatch(logout());
      }
    }

    return next(action);
  };

export default errorMiddleware;
