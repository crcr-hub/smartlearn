import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = ({children}) => {
    const user = useSelector(state => state.auth.user) || JSON.parse(localStorage.getItem("user"));
    console.log(user)
    if (!user || user.role !== "admin") {
        return <Navigate to="/loginpage" replace />;
    }

    return children || <Outlet />;
};

export default AdminPrivateRoute
