import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TeacherAddModul from '../pages/TeacherAddModul'

function TeacherAddModulPage() {
  return (
    <div>
      <TeacherNavbar/>
      <TeacherAddModul/>
      <div style={{marginTop:"50px"}}>
      <Footer/></div>
    </div>
  )
}

export default TeacherAddModulPage
