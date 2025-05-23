import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTutorsStudent } from '../../../redux/authSlices'
import TeacherSideBar from '../TeacherSideBar'
import { useNavigate, useParams } from 'react-router-dom'

function StudentList() {
    const {sid} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {studentlist} = useSelector((state)=>state.auth)


    useEffect(()=>{
        dispatch(fetchTutorsStudent(sid))
    },[dispatch,sid])



    const handleSendButton =(id,studentName) => {
        // Navigate to the chat page with the tutor's ID and name as route parameters
        navigate(`/teacherchat/${id}`, { state: { studentName } });
    }

  return (
    
            <div className='container mt-4'>
    <div className='row'>
<TeacherSideBar/>

          <section className='col-md-9'>
          <div style={{}}>
          {studentlist?.length > 0 ? (studentlist?.map((item,index)=>(
                    <div style={{display:"flex"}}>
                           <div key={index} style={{ borderBottom:"1px solid",padding:"10px",width:"60%" }}>
                           <h6>
                               <span style={{ marginRight: "10px" }}>{item.first_name}</span>
                              
                           </h6>
                           
                       </div>
                       <div style={{marginTop:"10px"}}>
                        <button onClick={() => handleSendButton(item.student_id,item.first_name)}   type="button" className="btn btn-info">Send Message</button>
                       </div>
                    </div>

                        ))):("No Students are Registered")}
                    </div>
      </section>
    </div>
    </div>
  )
}

export default StudentList
