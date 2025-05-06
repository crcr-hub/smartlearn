import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TeacherChangePassword from '../pages/TeacherChangePassword'

function TeacherChangePwdPage() {
  return (
    <div>
      <TeacherNavbar/>
        <TeacherChangePassword/>
        <div style={{marginTop:"50px"}}>
        <Footer/></div>
    </div>
  )
}

export default TeacherChangePwdPage
