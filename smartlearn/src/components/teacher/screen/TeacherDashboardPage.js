import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import TeacherDashboard from '../pages/TeacherDashboard'
import Footer from '../../indexpages/Footer'

function TeacherDashboardPage() {
  return (
    <div>
      <TeacherNavbar/>

      <TeacherDashboard/>
      <div style={{marginTop:"50px"}}>
      <Footer/></div>
    </div>
  )
}

export default TeacherDashboardPage
