
// import { useSelector } from "react-redux";

// import React from 'react';

// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
  
//     const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));
//     return user ? children || <Outlet /> : <Navigate to="/" />;
// };


// export default PrivateRoute;

import { useSelector } from "react-redux";
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" replace />; // Redirect if not logged in
    }

    // Restrict admin pages for non-admins
    if (location.pathname.startsWith("/admin") && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }
    
    
    return user ? children || <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
