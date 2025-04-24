import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorCourse } from '../../../redux/authSlices'
import TeacherSideBar from '../TeacherSideBar'
import { useNavigate } from 'react-router-dom'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'

function StudentCourseList() {
    const {tutorCourse} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    console.log(tutorCourse)
    useEffect(()=>{
        dispatch(getTutorCourse());
    },[dispatch])


    const handleClick=(sid)=>{
        navigate(`/liststudent/${sid}`)
    }
  return (
    <div>
        <TeacherNavbar/>
    <div className='container mt-4'>
    <div className='row'>
    <TeacherSideBar/>
    <section className='col-md-9'>


        <div style={{}}>
                        {tutorCourse?.map((item,index)=>(
                    <div style={{display:"flex",margin:"10px"}}>
                           <div key={index} style={{ borderBottom:"1px solid",padding:"10px",width:"60%" }}>
                           <h6>
                               <span style={{ marginRight: "10px" }}>{item.name}</span>
                              
                           </h6>
                            
                       </div>
                       <div style={{marginTop:"10px"}}>
                        <button onClick={()=>handleClick(item.id)}   type="button" className="btn btn-info">View Students</button>
                       </div>
                    </div>

                        ))}
                    </div>
    </section>
    </div>
    </div>
    <div style={{marginTop:"50px"}}>
            <Footer/></div>
    </div>
  )
}

export default StudentCourseList
