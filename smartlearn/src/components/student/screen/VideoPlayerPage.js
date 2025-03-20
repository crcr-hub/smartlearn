import React, { useEffect, useState } from 'react'
import StudentCourseNavbar from '../StudentCourseNavbar'
import VideoPlayer from '../pages/VideoPlayer'
import StudentFooter from '../StudentFooter'
import StudentHome from '../pages/StudentHome'
import MiddlePortion from '../pages/MiddlePortion'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/axiosInstances'
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
