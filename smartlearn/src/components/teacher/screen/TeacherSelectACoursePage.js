import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TeacherSelectACourse from '../pages/TeacherSelectACourse'

function TeacherSelectACoursePage() {
  return (
    <div>
      <TeacherNavbar/>
      <TeacherSelectACourse/>
      <div style={{marginTop:"50px"}}>
        <Footer/>
      </div>
    </div>
  )
}

export default TeacherSelectACoursePage
