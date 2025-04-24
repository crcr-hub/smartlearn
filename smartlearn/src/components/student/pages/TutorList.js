import React, { useEffect } from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentSideBar from '../StudentSideBar'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserTutors } from '../../../redux/authSlices';
import { useNavigate } from 'react-router-dom';




function TutorList() {
    const {tutorlist} = useSelector((state) => state.auth);

    console.log("tutorslist",tutorlist)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(()=>{
        dispatch(fetchUserTutors())
    },[dispatch])



    const handleSendButton =(id,tutorName) => {
        // Navigate to the chat page with the tutor's ID and name as route parameters
        navigate(`/chat/${id}`, { state: { tutorName } });
    }



    const groupedTutors = tutorlist.reduce((acc, curr) => {
        const tutorId = curr.tutor.id;
      
        if (!acc[tutorId]) {
          acc[tutorId] = {
            tutor: curr.tutor,
            courses: [curr.course_name],
          };
        } else {
          acc[tutorId].courses.push(curr.course_name);
        }
      
        return acc;
      }, {});

      const uniqueTutors = Object.values(groupedTutors);

      
  return (
    <div>
      <StudentNavbar/>
                <div className='container mt-4'>
                <div className='row'>

                <StudentSideBar/>
                <section className='col-md-9'>
                    List of the tutors
                    <div style={{}}>



                        {tutorlist.map((tut,index)=>(
                            <div key={index} style={{ display: "flex" }}>
                            <div style={{ borderBottom: "1px solid", padding: "10px", width: "60%" }}>
                              <h6>
                                <span style={{ marginRight: "10px" }}>{tut.tutor.name}</span>
                                
                              </h6>
                              <p>Courses: {tut.courses.map((courses)=>courses +",   ")} </p>
                            </div>
                            <div style={{ marginTop: "10px" }}>


                            {tut.tutor.block_status === true ? (
        <span style={{ color: "red", fontWeight: "bold" }}>Tutor Unavailable</span>
      ) : (
        <button
          onClick={() => handleSendButton(tut.tutor.id, tut.tutor.name)}
          type="button"
          className="btn btn-info"
        >
          Send Message
        </button>
      )}
                           
                            </div>
                          </div>
                        ))}
                   

                    </div>
                </section>
            </div>
            </div>
    </div>
  )
}

export default TutorList
