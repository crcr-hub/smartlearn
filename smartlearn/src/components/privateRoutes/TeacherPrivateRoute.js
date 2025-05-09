// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const TeacherPrivateRoute = ({children}) =>{
//    const reduxUser = useSelector(state => state.auth.user);
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const [user, setUser] = useState(reduxUser || storedUser);
//     console.log(user)
//     if (!user || user.role !== "teacher") {
//         return <Navigate to="/loginpage" replace />;
//     }

//     return children || <Outlet />;
// }
// export default TeacherPrivateRoute

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const TeacherPrivateRoute = ({ children }) => {
  const user = useSelector(state => state.auth.user)|| JSON.parse(localStorage.getItem("user")); ;

  if (!user || user.role !== "teacher") {
    return <Navigate to="/loginpage" replace />;
  }

  return children || <Outlet />;
};

export default TeacherPrivateRoute;
