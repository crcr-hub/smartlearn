import { useDispatch } from "react-redux";
import "./App.scss";
import IndexLayout from "./layout/IndexLayout";
import { loginSuccess, logout } from "./redux/authSlices";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


function App() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();

 
   useEffect(() => {
     const syncAuth = () => {
       const user = localStorage.getItem("user");
       const access = localStorage.getItem("access");
       const refresh = localStorage.getItem("refresh");
 
       if (user && access && refresh) {
         const parsedUser = JSON.parse(user);
         dispatch(loginSuccess({ user: parsedUser, access, refresh }));
 
         // Avoid navigating if already at destination
         if (location.pathname === "/loginpage" || location.pathname === "/") {
           if (parsedUser.is_superuser) {
             navigate("/admin/adminhome");
           } else if (parsedUser.role === "student") {
             navigate("/home");
           } else if (parsedUser.role === "teacher") {
             navigate("/tutorhome");
           }
         }
       }
     };
 
     syncAuth();
   }, [dispatch, navigate, location.pathname]);
 
   //  Cross-tab logout sync
   useEffect(() => {
    const handleStorageChange = (e) => {
      // If user is removed
      if (e.key === "user" && e.newValue === null) {
        dispatch(logout());
        navigate("/loginpage");
      }
  
      //  If logout broadcast received from another tab
      if (e.key === "logout") {
        dispatch(logout());
        navigate("/loginpage");
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch, navigate]);
  
  return (
    <>
    <IndexLayout />
    </>
   
  );
}

export default App;
