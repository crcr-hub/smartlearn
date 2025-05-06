import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const user = useSelector(state => state.auth.user) || JSON.parse(localStorage.getItem("user"));

  // If no user or role is not admin, redirect to login
  if (!user || user.role !== "admin") {
    return <Navigate to="/loginpage" replace />;
  }

  return children || <Outlet />;
};

export default AdminPrivateRoute;
