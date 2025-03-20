import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TeacherUpdateCourse from '../pages/TeacherUpdateCourse'

function TeacherUpdateCoursePage() {
  return (
    <div>
      <TeacherNavbar/>
      <TeacherUpdateCourse/>
      <div style={{marginTop:"50px"}}>
      <Footer/></div>
    </div>
  )
}

export default TeacherUpdateCoursePage
