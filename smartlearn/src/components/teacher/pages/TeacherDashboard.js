import React, { useEffect } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchTutorCourse } from '../../../redux/authSlices';
import TeacherDashboardScreen from '../screen/DashboardScreen';


function TeacherDashboard() {
  const dispatch = useDispatch();
  const { tutorcourses, loading, error } = useSelector((state) => state.auth);
  const {user:teacher} = useSelector((state)=>state.auth)
 
  useEffect(()=>{
   
    if (teacher?.profile_id) {
        dispatch(fetchTutorCourse(teacher.profile_id));
      } else {
        console.warn("Profile ID is missing");
      }
    
  },[dispatch, teacher?.profile_id])
  return (

    <div className='container mt-3'>
            <div className='row'>
        <TeacherSideBar/>
      <section className='col-md-12' style={{width:"75%"}}>
      <TeacherDashboardScreen/>

                    </section>
                    </div>
      
      </div>

  )
}

export default TeacherDashboard
