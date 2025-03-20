import React from 'react'
import Footer from '../../indexpages/Footer'
import TeacherNavbar from '../TeacherNavbar'
import StudentList from '../pages/StudentList'

function StudentListPage() {
  return (
    <div>
        <TeacherNavbar/>
        <StudentList/>
            <div style={{marginTop:"50px"}}>
            <Footer/></div>
    </div>
  )
}

export default StudentListPage
