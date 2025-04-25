import React from 'react'
import { ThemeContext } from "../context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/ThemeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "../assets/icons/moon.svg" ;
import SunIcon from "../assets/icons/sun.svg";
import BaseLayout from "./BaseLayout";
import { Dashboard} from "../components/admin/screens";

import { useContext, useEffect } from "react";
import AddStudent from '../components/admin/student/AddStudent';
import PrivateRoute from '../components/PrivateRoute';
import ViewStudent from '../components/admin/student/ViewStudent';
import UpdateStudent from '../components/admin/student/UpdateStudent';
import AddTeacher from '../components/admin/teacher/AddTeacher';
import ViewTeacher from '../components/admin/teacher/ViewTeacher';
import UpdateTeacher from '../components/admin/teacher/UpdateTeacher';
import AddCategory from '../components/admin/courses/AddCategory';
import ViewCategory from '../components/admin/courses/ViewCategory';
import UpdatedCat from '../components/admin/courses/UpdatedCat';
import AddCourse from '../components/admin/courses/AddCourse';
import ViewCourses from '../components/admin/courses/ViewCourses';
import UpdateCourse from '../components/admin/courses/UpdateCourse';
import AddaCourse from '../components/admin/courses/AddaCourse';
import UpdateaCourse from '../components/admin/courses/UpdateaCourse';
import SelectACourse from '../components/admin/courses/SelectACourse';
import ViewModules from '../components/admin/courses/ViewModules';
import PendingCourses from '../components/admin/courses/PendingCourses';
import ReportPage from '../components/admin/ReportPage';
import AdminPrivateRoute from '../components/privateRoutes/AdminPrivateRoute';
import ViewTeacherTransactions from '../components/admin/teacher/ViewTeacherTransactions';
import Transactions from '../components/admin/Transactions';
import STransaction from '../components/admin/STransaction';



function AdminLayout() {
    const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);
  return (
    <>
     {/* Define your admin-specific nested routes */}
     <Routes>
        {/* This will render BaseLayout, and inside it, you can define your nested routes */}
        <Route path="/" element={<BaseLayout />}>
          <Route path="adminhome" element={<AdminPrivateRoute ><Dashboard/></AdminPrivateRoute> } />
          <Route path="addstudent" element= {<AdminPrivateRoute ><AddStudent/></AdminPrivateRoute>} />
          <Route path = "viewstudent" element = {<AdminPrivateRoute ><ViewStudent/></AdminPrivateRoute> }/>
          <Route path = "student/:id" element = {<AdminPrivateRoute ><UpdateStudent/></AdminPrivateRoute> }/>
          <Route path = "addteacher" element = {<AdminPrivateRoute ><AddTeacher/></AdminPrivateRoute> }/>
          <Route path = "viewteacher" element = {<AdminPrivateRoute ><ViewTeacher/></AdminPrivateRoute> }/>
          <Route path = "teacher/:id" element = {<AdminPrivateRoute ><UpdateTeacher/></AdminPrivateRoute> }/>
          <Route path = "teachertransactions/:id" element = {<AdminPrivateRoute ><ViewTeacherTransactions/></AdminPrivateRoute> }/>
         <Route path = "transactions" element={<AdminPrivateRoute><Transactions/></AdminPrivateRoute>} />

          <Route path = "addcategory" element = {<AdminPrivateRoute ><AddCategory/></AdminPrivateRoute> }/>
          <Route path = "viewcategory" element = {<AdminPrivateRoute ><ViewCategory/></AdminPrivateRoute> }/>
          <Route path = "category/:id" element = {<AdminPrivateRoute ><UpdatedCat/></AdminPrivateRoute> }/>
          <Route path = "addcourse" element = {<AdminPrivateRoute ><AddCourse/></AdminPrivateRoute> }/>
          <Route path = "addcourses" element = {<AdminPrivateRoute ><AddaCourse/></AdminPrivateRoute> }/>
          <Route path = "viewcourses" element = {<AdminPrivateRoute ><ViewCourses/></AdminPrivateRoute> }/>
          <Route path = "courses/:id" element = {<AdminPrivateRoute ><UpdateCourse/></AdminPrivateRoute> }/>
          <Route path = "course/:id" element = {<AdminPrivateRoute ><UpdateaCourse/></AdminPrivateRoute> }/>
          <Route path="/selectcourse" element={<AdminPrivateRoute ><SelectACourse/> </AdminPrivateRoute> }/>
          <Route path="/viewmodule/:id" element={<AdminPrivateRoute ><ViewModules/> </AdminPrivateRoute> }/>
          <Route path="/pendingcourses" element = {<AdminPrivateRoute ><PendingCourses/></AdminPrivateRoute>}/>
          <Route path="/reports" element={<AdminPrivateRoute ><ReportPage/></AdminPrivateRoute>} />
          <Route path="/stransaction/:sid" element={<AdminPrivateRoute><STransaction/></AdminPrivateRoute>} />
        </Route>
      </Routes>

    

      <button
        type="button"
        className="theme-toggle-btn"
        onClick={toggleTheme}
      >
        <img
          className="theme-icon"
          src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
        />
      </button>
   
  </>
  )
}

export default AdminLayout
