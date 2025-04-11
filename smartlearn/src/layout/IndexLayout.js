import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from '../components/indexpages/Home';
import Login from '../components/indexpages/screen/Login';
import Register from '../components/indexpages/screen/Register';
import AdminLayout from './AdminLayout';
import TutorLayout from './TutorLayout';
import HomePage from '../components/student/screen/HomePage';
import TeacherHomePage from '../components/teacher/screen/TeacherHomePage';
import TeacherDashboardPage from '../components/teacher/screen/TeacherDashboardPage';

import TeacherRegister from '../components/indexpages/screen/TeacherRegister';

import TeacherAddCoursePage from '../components/teacher/screen/TeacherAddCoursePage';
import TeacherUpdateCoursePage from '../components/teacher/screen/TeacherUpdateCoursePage';
import TeacherProfilePage from '../components/teacher/screen/TeacherProfilePage';
import VideoPlayer from '../components/student/pages/VideoPlayer';
import VideoPlayerPage from '../components/student/screen/VideoPlayerPage';
import CourseDetailsPage from '../components/student/screen/CourseDetailsPage';
import TeacherAddModul from '../components/teacher/pages/TeacherAddModul';
import TeacherSelectACourse from '../components/teacher/pages/TeacherSelectACourse';
import TeacherSelectACoursePage from '../components/teacher/screen/TeacherSelectACoursePage';
import TeacherAddModulPage from '../components/teacher/screen/TeacherAddModulPage';
import CourseDetails from '../components/indexpages/screen/CourseDetails';
import StudentCartPage from '../components/student/screen/StudentCartPage';
import StudentWishlistPage from '../components/student/screen/StudentWishlistPage';
import BillingDetailsPage from '../components/student/screen/BillingDetailsPage';
import MyLearningPage from '../components/student/screen/MyLearningPage';
import Learning from '../components/student/pages/Learning';
import ChatComponent from '../components/student/pages/ChatComponent';
import ChatComponentPage from '../components/student/screen/ChatComponentPage';
import TutorList from '../components/student/pages/TutorList';
import TutorChatComponent from '../components/teacher/pages/TutorChatComponent';
import TecherMessage from '../components/teacher/pages/TecherMessage';
import StudentListPage from '../components/teacher/screen/StudentListPage';
import TeacherChatComponetPage from '../components/teacher/screen/TeacherChatComponetPage';
import RecentMessages from '../components/student/pages/RecentMessages';
import TutorRecentMessagesPage from '../components/teacher/screen/TutorRecentMessagesPage';
import PrivateRoute from '../components/PrivateRoute';
import TeacherMyCourse from '../components/teacher/screen/TeacherMyCourse';
import ProfilePage from '../components/student/screen/ProfilePage';
import StudentPrivateRoute from '../components/privateRoutes/StudentPrivateRoute';
import TeacherPrivateRoute from '../components/privateRoutes/TeacherPrivateRoute';
import TeacherTransaction from '../components/teacher/pages/TeacherTransaction';

function IndexLayout() {
  return (
<Router>
      <Routes>
       
          <Route path="/" element={<Home/>} />
          <Route path="loginpage" element={<Login/> } />
          <Route path = "register" element= {<Register/>} />
          <Route path= "tregister" element = {<TeacherRegister/>}/>
          <Route path='/teacherregister' element={<TeacherRegister/>}/>
          {/* <Route path = "/tutor/*" element = {<TutorLayout/>}/> */}
          <Route path = "/admin/*" element = {<AdminLayout/>}/>
          <Route path = '/home/' element={<StudentPrivateRoute><HomePage/></StudentPrivateRoute>} />

          <Route path = '/tutorhome' element={<TeacherPrivateRoute><TeacherHomePage/></TeacherPrivateRoute>} />
          <Route path='/tutordashboard' element={<TeacherPrivateRoute><TeacherDashboardPage/></TeacherPrivateRoute>}/>
          <Route path='/teacheraddcourse' element={<TeacherPrivateRoute><TeacherAddCoursePage/></TeacherPrivateRoute>}/>
          <Route path='/teacherupdatecourse/:id' element={<TeacherPrivateRoute><TeacherUpdateCoursePage/></TeacherPrivateRoute>}/>
          <Route path='/teacherprofile' element={<TeacherPrivateRoute><TeacherProfilePage/></TeacherPrivateRoute>}/>
          <Route path='/select' element={<TeacherPrivateRoute><TeacherSelectACoursePage/></TeacherPrivateRoute>} />
          <Route path='/add_module/:id' element={<TeacherPrivateRoute><TeacherAddModulPage/></TeacherPrivateRoute>} />
          <Route path='/teachermessage' element={<TeacherPrivateRoute><TecherMessage/></TeacherPrivateRoute>} />
          <Route path='/liststudent' element ={<TeacherPrivateRoute><StudentListPage/></TeacherPrivateRoute>} />
          <Route path='/mycourse' element={<TeacherPrivateRoute><TeacherMyCourse/></TeacherPrivateRoute>} />
          <Route path = '/tutorchat/:sid' element={<TeacherPrivateRoute><TutorChatComponent/></TeacherPrivateRoute>} />
          <Route path='/tutrecent_m' element ={<TeacherPrivateRoute><TutorRecentMessagesPage/></TeacherPrivateRoute>} />
          <Route path='/teacherchat/:sid' element={<TeacherPrivateRoute><TeacherChatComponetPage/></TeacherPrivateRoute>} />
          <Route path = '/teacherTransactions' element={<TeacherPrivateRoute><TeacherTransaction/></TeacherPrivateRoute>} />

          <Route path='/videoplayer/:courseId' element={<StudentPrivateRoute><VideoPlayerPage/></StudentPrivateRoute>} />
          <Route path='/coursedetails/:id' element={<StudentPrivateRoute><CourseDetailsPage/></StudentPrivateRoute>}/>
          <Route path='/cartpage' element={<StudentPrivateRoute><StudentCartPage/></StudentPrivateRoute>}/>
          <Route path='/wishlist' element={<StudentPrivateRoute><StudentWishlistPage/></StudentPrivateRoute>}/>
          <Route path='/billing' element={<StudentPrivateRoute><BillingDetailsPage/></StudentPrivateRoute>}/>
          <Route path='/mylearning' element={<StudentPrivateRoute><MyLearningPage/></StudentPrivateRoute>} />
          <Route path='/learning/:id' element ={<StudentPrivateRoute><Learning/></StudentPrivateRoute>} />
          <Route path='/chat/:tutorId' element = {<StudentPrivateRoute><ChatComponentPage/></StudentPrivateRoute>} />
          <Route path='/recent_m' element={<StudentPrivateRoute><RecentMessages/></StudentPrivateRoute>} />
          <Route path='/tutorlist' element = {<StudentPrivateRoute><TutorList/></StudentPrivateRoute>} />
          <Route path='/sprofile' element ={<StudentPrivateRoute><ProfilePage/></StudentPrivateRoute>} />
          
          {/* <Route path="/viewuser" element = {<ViewUser />} /> */}
       
          <Route path="*" element={<div>404 - Page Not Found</div>} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
       
      </Routes>
      </Router>
  )
}

export default IndexLayout
