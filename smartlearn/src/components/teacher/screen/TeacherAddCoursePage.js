import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import TeacherAddCourse from '../pages/TeacherAddCourse'
import Footer from '../../indexpages/Footer'

function TeacherAddCoursePage() {
  return (
    <div>
        <TeacherNavbar/>
        <TeacherAddCourse/>
        <div style={{marginTop:"50px"}}>
      <Footer/></div>

      
    </div>
  )
}

export default TeacherAddCoursePage
