import React from 'react'
import StudentNavbar from '../StudentNavbar'
import MyLearning from '../pages/MyLearning'
import StudentFooter from '../StudentFooter'

function MyLearningPage() {
  return (
<div>
       <StudentNavbar />
       <div className="container mt-2">  <MyLearning /> </div>
       <StudentFooter/>
    </div>
  )
}

export default MyLearningPage
