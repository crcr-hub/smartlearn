import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TeacherProfile from '../pages/TeacherProfile'

function TeacherProfilePage() {
  return (
    <div>
        <TeacherNavbar/>
        <TeacherProfile/>
        <div style={{marginTop:"50px"}}>
        <Footer/></div>
      
    </div>
  )
}

export default TeacherProfilePage
