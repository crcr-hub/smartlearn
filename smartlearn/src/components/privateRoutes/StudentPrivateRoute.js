

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const StudentPrivateRoute = ({ children }) => {
  const user = useSelector(state => state.auth.user) || JSON.parse(localStorage.getItem("user"));;
  
  if (!user || user.role !== "student") {
    return <Navigate to="/loginpage" replace />;
  }

  return children || <Outlet />;
};

export default StudentPrivateRoute;
