import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import StudentCarosal from '../../student/StudentCarosal'
import StudentFooter from '../../student/StudentFooter'
import TeacherHome from '../pages/TeacherHome'
import Carosel from '../../indexpages/Carosel'

function TeacherHomePage() {
  return (
    <div>
      <TeacherNavbar/>
     
      <div className="container mt-2"> 
      <Carosel /></div>
      <TeacherHome/>
      <StudentFooter/>
    </div>
  )
}

export default TeacherHomePage
