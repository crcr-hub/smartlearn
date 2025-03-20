import React from 'react'
import StudentHome from '../pages/StudentHome'
import StudentNavbar from '../StudentNavbar'
import StudentCarosal from '../StudentCarosal'
import StudentFooter from '../StudentFooter'
import IndexCourses from '../../indexpages/IndexCourses'
import StudentIndex from '../StudentIndex'

function HomePage() {
  return (
    <div>
    
    <StudentNavbar/>
    <div className="container mt-2">  <StudentCarosal/> </div>
    <div>
          
          <StudentIndex/>
      </div>
    <StudentHome/>
      <StudentFooter/>
    </div>
  )
}

export default HomePage
