import React from 'react'

import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import MyCourse from '../pages/MyCourse'

function TeacherMyCourse() {
  return (
    <div>
       <TeacherNavbar/>

            <MyCourse/>
            <div style={{marginTop:"50px"}}>
            <Footer/></div>
    </div>
  )
}

export default TeacherMyCourse
