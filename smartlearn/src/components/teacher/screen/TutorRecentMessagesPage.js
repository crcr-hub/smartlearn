import React, { useEffect } from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import TutotRecentMessage from '../pages/TutotRecentMessage'
import { recentMessages } from '../../../redux/authSlices';
import { useDispatch, useSelector } from 'react-redux';

function TutorRecentMessagesPage() {
  const { recentMessage} = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  useEffect (()=>{
    dispatch(recentMessages())
},[dispatch])
  return (
    <div>
    <TeacherNavbar/>
      <TutotRecentMessage/>
      <div style={{marginTop:"50px"}}>
      <Footer/></div>
    </div>
  )
}

export default TutorRecentMessagesPage
