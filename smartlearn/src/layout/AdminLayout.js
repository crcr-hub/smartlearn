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
          <Route path="adminhome" element={<PrivateRoute redurectTo="/"><Dashboard/></PrivateRoute> } />
          <Route path="addstudent" element= {<PrivateRoute redurectTo="/"><AddStudent/></PrivateRoute>} />
          <Route path = "viewstudent" element = {<PrivateRoute redurectTo="/"><ViewStudent/></PrivateRoute> }/>
          <Route path = "student/:id" element = {<PrivateRoute redurectTo="/"><UpdateStudent/></PrivateRoute> }/>
          <Route path = "addteacher" element = {<PrivateRoute redurectTo="/"><AddTeacher/></PrivateRoute> }/>
          <Route path = "viewteacher" element = {<PrivateRoute redurectTo="/"><ViewTeacher/></PrivateRoute> }/>
          <Route path = "teacher/:id" element = {<PrivateRoute redurectTo="/"><UpdateTeacher/></PrivateRoute> }/>
          <Route path = "addcategory" element = {<PrivateRoute redurectTo="/"><AddCategory/></PrivateRoute> }/>
          <Route path = "viewcategory" element = {<PrivateRoute redurectTo="/"><ViewCategory/></PrivateRoute> }/>
          <Route path = "category/:id" element = {<PrivateRoute redurectTo="/"><UpdatedCat/></PrivateRoute> }/>
          <Route path = "addcourse" element = {<PrivateRoute redurectTo="/"><AddCourse/></PrivateRoute> }/>
          <Route path = "addcourses" element = {<PrivateRoute redurectTo="/"><AddaCourse/></PrivateRoute> }/>
          <Route path = "viewcourses" element = {<PrivateRoute redurectTo="/"><ViewCourses/></PrivateRoute> }/>
          <Route path = "courses/:id" element = {<PrivateRoute redurectTo="/"><UpdateCourse/></PrivateRoute> }/>
          <Route path = "course/:id" element = {<PrivateRoute redurectTo="/"><UpdateaCourse/></PrivateRoute> }/>
          <Route path="/selectcourse" element={<PrivateRoute redurectTo="/"><SelectACourse/> </PrivateRoute> }/>
          <Route path="/viewmodule/:id" element={<PrivateRoute redurectTo="/"><ViewModules/> </PrivateRoute> }/>
          <Route path="/pendingcourses" element = {<PrivateRoute redurectTo="/"><PendingCourses/></PrivateRoute>}/>
          <Route path="/reports" element={<PrivateRoute redurectTo ="/"><ReportPage/></PrivateRoute>} />
          
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
