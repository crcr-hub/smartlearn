import React from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentCart from '../pages/StudentCart'
import StudentFooter from '../StudentFooter'

function StudentCartPage() {
 
  return (
    <div>
       <StudentNavbar />
       <div className="container mt-2">  <StudentCart /> </div>
       <StudentFooter/>
    </div>
  )
}

export default StudentCartPage
