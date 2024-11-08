import { useSelector } from "react-redux";
import { router } from "expo-router";

const AdminRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  if (userData?.user?.role !== "admin") {
    router.replace("/not-authorized");
    return null;
  }

  return children;
};

export default AdminRoute;
