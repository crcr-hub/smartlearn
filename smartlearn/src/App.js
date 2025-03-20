import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import HomeLayout from "./layout/HomeLayout";
import IndexLayout from "./layout/IndexLayout";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/authSlices";
import { useEffect } from "react";


function App() {
  console.log("from app.js")
  const role = "admin"; // Dynamic role (can be fetched from auth)
  const getLayoutByRole = (role) => {
    switch (role) {
      case "admin":
        return <AdminLayout />;
      case "user":
        return <HomeLayout />;
      // case "tutor":
      //   return <TutorLayout />;
      default:
        return <div>Role not recognized.</div>; // Fallback for invalid roles
    }
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);
  return (
    <>
    {/* {getLayoutByRole(role)} */}
 
    {/* <Home /> */}
    {/* <Login/> */}
    {/* <Register/> */}
    <IndexLayout />
    
    </>
   
  );
}

export default App;
