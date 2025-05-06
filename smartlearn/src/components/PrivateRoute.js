
import { useSelector } from "react-redux";

import React from 'react';

import { Navigate, Outlet} from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  
//     const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));
//     return user ? children || <Outlet /> : <Navigate to="/" />;
const user = useSelector(state => state.auth.user) || JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        return <Navigate to="/loginpage" replace />;
    }

    return children || <Outlet />;

};


export default PrivateRoute;

// import { useSelector } from "react-redux";
// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const users = useSelector((state) => state.auth.user); // This might not be an array
//     const storedUser = JSON.parse(localStorage.getItem("user")); // Fallback user

//     console.log("Users from Redux:", users);
//     console.log("Stored user from LocalStorage:", storedUser);

//     let finalUser = null;

//     if (Array.isArray(users)) {
//         // If users is an array, find the logged-in user
//         finalUser = users.find(u => u.user.id === storedUser.user_id);
//     } else if (users && users.user) {
//         // If users is a single user object, use it directly
//         finalUser = users;
//     }

//     // If Redux doesn't have user info, use localStorage as a fallback
//     if (!finalUser) {
//         finalUser = storedUser;
//     }

//     console.log("Extracted user:", finalUser);

//     if (!finalUser) {
//         console.log("User not found, redirecting...");
//         return <Navigate to="/" replace />;
//     }

//     if (finalUser.role !== "admin") {
//         console.log("User is not an admin, redirecting...");
//         return <Navigate to="/" replace />;
//     }

//     return children || <Outlet />;
// };

// export default PrivateRoute;


// import { useSelector } from "react-redux";
// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const users = useSelector((state) => state.auth.user); // Redux user data
//     const storedUser = JSON.parse(localStorage.getItem("user")); // Fallback from localStorage

//     console.log("Redux Users:", users);
//     console.log("Stored User from LocalStorage:", storedUser);

//     let finalUser = null;

//     if (Array.isArray(users)) {
//         finalUser = users.find(u => u.user.id === storedUser?.user_id);
//     } else if (users && users.user) {
//         finalUser = users;
//     }

//     if (!finalUser) {
//         finalUser = storedUser;
//     }

//     console.log("Extracted User:", finalUser);

//     if (!finalUser || !finalUser.role) {
//         console.log("User not found, redirecting to login...");
//         return <Navigate to="/loginpage" replace />;
//     }

//     console.log(`User Role: ${finalUser.role}`);

//     if (finalUser.role === "admin") {
//         return children || <Outlet />;
//     } else if (finalUser.role === "teacher") {
//         console.log("Redirecting teacher to tutor home...");
//         return <Navigate to="/tutorhome" replace />;
//     } else if (finalUser.role === "student") {
//         console.log("Redirecting student to home page...");
//         return <Navigate to="/home" replace />;
//     }

//     return <Navigate to="/loginpage" replace />;
// };

// export default PrivateRoute;


// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//     const { isAuthenticated, user, loading, initial } = useSelector(state => state.auth); // Redux state
//     const storedUser = JSON.parse(localStorage.getItem("user")); // Fallback from localStorage

//     console.log("Redux Users:", user);
//     console.log("Stored User from LocalStorage:", storedUser);

//     // Handle loading state
//     if (loading || initial) {
//         return <div>Loading...</div>;
//     }

//     // Determine the final user
//     let finalUser = user || storedUser;

//     if (!finalUser || !finalUser.role) {
//         console.log("User not found, redirecting to login...");
//         return <Navigate to="/loginpage" replace />;
//     }

//     console.log(`User Role: ${finalUser.role}`);

//     // Role-based redirection
//     switch (finalUser.role) {
//         case "admin":
//             return children || <Outlet />;
//         case "teacher":
//             console.log("Redirecting teacher to tutor home...");
//             return  <Outlet />;
//         case "student":
//             console.log("Redirecting student to home page...");
//             return  <Outlet />;
//         default:
//             return <Navigate to="/loginpage" replace />;
//     }
// };

// export default PrivateRoute;
