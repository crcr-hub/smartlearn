import React from 'react'
import StudentCourseNavbar from '../StudentCourseNavbar'
import StudentFooter from '../StudentFooter'
import Learning from '../pages/Learning'

function VideoPlayerPage() {
 
  return (
<div>
    
    <StudentCourseNavbar/>

      <div >
          <Learning/>
      </div>
  
      <StudentFooter/>
    </div>
  )
}

export default VideoPlayerPage
