import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import TutorChatComponent from '../pages/TutorChatComponent'
import Footer from '../../indexpages/Footer'

function TeacherChatComponetPage() {
  return (
    <div>
    <TeacherNavbar/>
    <TutorChatComponent/>
    <div style={{marginTop:"50px"}}>
    <Footer/></div>
  </div>
  )
}

export default TeacherChatComponetPage
