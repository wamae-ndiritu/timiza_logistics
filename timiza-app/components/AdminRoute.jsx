import { useSelector } from "react-redux";
import { router } from "expo-router";
import { useEffect } from "react";

const AdminRoute = ({ children }) => {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?.user?.role !== "admin") {
      router.replace("/not-authorized");
    }
  }, [userData]);

  // Only render children if the user is an admin
  if (userData?.user?.role !== "admin") {
    return null;
  }

  return children;
};

export default AdminRoute;
