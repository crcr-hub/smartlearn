import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearStatusData, fetchCourse, fetchTeacherProfile, getCourseStatus, updateApprove, updateCourseStatus } from '../../../redux/authSlices'
import { Link, useNavigate, useParams } from 'react-router-dom'

function ViewaCourse() {
    const {cid} = useParams()
    const {teacherprofile} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const [courseData,setCourseData] = useState({
            name:"",
            description:"",
            category:"",
            teacher:"",
            courses:"",
            images:"",
            category_title:"",
            cover_text:"",
            status : "",
    
        })
    
    
    const {course} = useSelector((state)=>state.auth);
    useEffect(()=>{
        dispatch(fetchCourse(cid))
    },[dispatch,cid])
  

    useEffect(() => {
      if (course && course.course && course.course.teacher) {
          dispatch(fetchTeacherProfile(course.course.teacher));
      }
  }, [dispatch, course]);

        useEffect(() => {
            let teacher = "";
            if(teacherprofile && teacherprofile.teacher){
                teacher = teacherprofile.teacher.first_name + ' ' +teacherprofile.teacher.last_name
            }
            if (course && course.course) {
                const { name, description,cover_text,category,images,visible_status,requirements,category_title } = course.course;
                
                setCourseData({
                    name: name || "",
                    description: description || "",
                    category   : category || "",
                    teacher : teacher || "",
                    images : images || "",
                    requirements : requirements || "",
                    category_title : category_title || "",
                    cover_text : cover_text || "",
                    status : visible_status || "",
                });
            }
            }, [course]);
        
    

            
                const handleApprove = (cid) =>{
                    dispatch(updateApprove(cid))
                .unwrap()
                .then((response) => {
                  dispatch(fetchCourse(cid));
                })
                .catch((error) => {
                  console.error("Error approving course:", error);
                });
                }
            
            
            
                const [holdData, setHoldData] = useState({
                  reason: "",
                  required: "",
                  course_status:"Hold"
                  
                });
            
                const [rejectData, setRejectData] = useState({
                  reason: "",
                  required: "",
                  course_status:"Rejected"
                  
                });
            
            
                const handleHold = () =>{
                  const holdPayload = {
                    reason: holdData.reason,
                    required: holdData.required,
                    course_status: "Hold",
                  };
                    dispatch(updateCourseStatus({ cid, holdData:holdPayload }))
                    .unwrap()
                    .then((response) => {
                      dispatch(fetchCourse(cid));
                    })
                    .catch((error) => {
                      console.error("Error approving course:", error);
                    });  
                    clearData(); 
                    closeDrawer2();
              }
            
            
            
             
            
              const handleUnHold = () =>{
                const unholdPayload = {
                  reason: "",
                  required: "",
                  course_status: "Waiting"
                };
                dispatch(updateCourseStatus({ cid, holdData:unholdPayload }))
                .unwrap()
                .then((response) => {
                  dispatch(fetchCourse(cid));
                })
                .catch((error) => {
                  console.error("Error approving course:", error);
                });
            }
            
              const handleReject = () =>{
                const rejectPayload = {
                  reason: rejectData.reason,
                  required: rejectData.required,
                  course_status: "Rejected",
                };
                dispatch(updateCourseStatus({ cid, holdData:rejectPayload }))
                  .unwrap()
                  .then((response) => {
                    dispatch(fetchCourse(cid));
                  })
                  .catch((error) => {
                    console.error("Error approving course:", error);
                  });
                  clearData(); 
                  closeDrawer3();
            }
            
            
            const handleCancelReject = () =>{
              const unholdPayload = {
                reason: "",
                required: "",
                course_status: "Waiting"
              };
              dispatch(updateCourseStatus({ cid, holdData:unholdPayload }))
              .unwrap()
              .then((response) => {
                dispatch(fetchCourse(cid));
              })
              .catch((error) => {
                console.error("Error approving course:", error);
              });
            }
 



            
    const navigate = useNavigate();
    const viewModule = () =>{
     
      if (cid){
        navigate(`/admin/viewmodule/${cid}`);
      }
      
    }


      const [selectedCourse, setSelectedCourse] = useState(null);
      const [showDrawer, setShowDrawer] = useState(false);
      const {status_data} = useSelector((state)=>state.auth)
      
         
      const handleStatusClick = (course) => {
        setSelectedCourse(course);
        setShowDrawer(true);  // Open drawer immediately
        dispatch(getCourseStatus(cid)); // Then fetch status
      };
      
          const closeDrawer = () => {
          setShowDrawer(false);
          setSelectedCourse(null);
          dispatch(clearStatusData())
      };
      
  
  const clearData =()=>{
    setHoldData({
      reason: "",
      required: "",
      course_status:"Hold"
    } )
    setRejectData({
      reason: "",
      required: "",
      course_status:"Rejected"
    })
  }


      const [selectedCourse2, setSelectedCourse2] = useState(null);
      const [showDrawer2, setShowDrawer2] = useState(false);
      const [selectedCourse3, setSelectedCourse3] = useState(null);
      const [showDrawer3, setShowDrawer3] = useState(false);
   
      
         
      const handleHoldClick = () => {
        setSelectedCourse2(course);
        setShowDrawer2(true);  
      };
      
          const closeDrawer2 = () => {
          setShowDrawer2(false);
          setSelectedCourse2(null);
      };


      const handleRejectClick = () => {
        setSelectedCourse3(course);
        setShowDrawer3(true);  
      };
      
          const closeDrawer3 = () => {
          setShowDrawer3(false);
          setSelectedCourse3(null);
      };
  return (
    <div style={{  maxWidth: '900px' }}>
<h4 style={{ marginBottom: '20px', fontSize: '24px' }}>
  {courseData.name}

  {course && course.course && course.course.images ? (
    <img
      src={`https://mysmartlearn.com/${course.course.images}`} // Corrected path
      alt={`Course ${course.course.name}`} // Use course.course.name if needed
      style={{ width: '100px', height: '90px', marginLeft: '10px' }}
    />
  ) : (
    " No Image"
  )}
</h4>

  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
        <tr>
            <th style={{ textAlign: 'left', verticalAlign: 'top', padding: '10px', width: '20%' }}>Status of the Course</th>
            
            <td style={{ color: courseData.status === 'Public' ? 'green' :
         courseData.status === 'Rejected'? 'red' : 'orange'  }}>
                                

                <Link onClick={() => handleStatusClick(course)}> 
                {(courseData.status === "Waiting" || courseData.status === "waiting")
                              ? " Waiting For approval ": courseData.status}
                </Link> 
                            
                                  
                                 </td>
            
           
        </tr>
      <tr>
        <th style={{ textAlign: 'left', verticalAlign: 'top', padding: '10px', width: '20%' }}>Description</th>
        <td style={{ padding: '10px', textAlign: 'justify' }}>{courseData.description}</td>
      </tr>
      <tr>
        <th style={{ textAlign: 'left', verticalAlign: 'top', padding: '10px', width: '20%' }}>Cover Text</th>
        <td style={{ padding: '10px', textAlign: 'justify' }}>{courseData.cover_text}</td>
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '10px' }}>Category</th>
        <td style={{ padding: '10px' }}>{courseData.category_title}</td>
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '10px' }}>Requirements</th>
        <td style={{ padding: '10px' }}>{courseData.requirements}</td>
      </tr>
      <tr>
        <th style={{ textAlign: 'left', padding: '10px' }}>Tutor</th>
        <td style={{ padding: '10px' }}>{courseData.teacher}</td>
      </tr>
      <tr></tr>
      <tr>
        <td></td>
      <td>
  {(courseData.status === "Waiting" || courseData.status === "waiting")  && (
    <>
      <button
        style={{ marginRight: "5px", marginTop: "5px" }}
        onClick={() => handleApprove(course.id)}
        className="btn btn-success btn-sm"
      >
        Approve
      </button>
      <button
        style={{ marginRight: "5px", marginTop: "5px" }}
        onClick={() => handleHoldClick(course)}
        className="btn btn-warning btn-sm"
      >
        Hold
      </button>
      <button
        style={{ marginRight: "5px", marginTop: "5px" }}
        onClick={() => handleRejectClick(course)}
        className="btn btn-danger btn-sm"
      >
        Reject
      </button>
    </>
  )}

  {courseData.status === "Hold" && (
    <>
    <button
      style={{ marginRight: "5px", marginTop: "5px" }}
      onClick={() => handleRejectClick(course)}
      className="btn btn-danger btn-sm"
    >
      Reject
    </button>
    <button
      style={{ marginRight: "5px", marginTop: "5px" }}
      onClick={() => handleUnHold()}
      className="btn btn-warning btn-sm"
    >
      Un Hold
    </button>

    </>
    
  )}

  {courseData.status === "Rejected" && (
    <button
      style={{ marginRight: "5px", marginTop: "5px" }}
      onClick={() => handleCancelReject()}
      className="btn btn-warning btn-sm"
    >
      Cancel Reject
    </button>
  )}
</td>
<td> <button
      style={{ marginRight: "5px", marginTop: "5px" }}
      onClick={() => viewModule()}
      className="btn btn-primary btn-sm"
    >
      View Module
    </button></td>
      </tr>
    </tbody>
  </table>





   {showDrawer && (
                <div className="drawer-overlay" onClick={closeDrawer}>
                    <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                    <h4>Course Status Info</h4>
                    <p style={{fontWeight:"bold"}}>Name: {selectedCourse?.name}</p>

                    <table className="table table-bordered">
                        <thead style={{fontWeight:"bold"}}>
                        <tr>
                            <td> No. </td>
                            <td>Date</td>
                            <td>Status</td>
                            <td>Info</td>
                            <td>Required</td>
                           
                        </tr>
                        
                        </thead>
                        <tbody>
                            {status_data && status_data.length > 0 ? (
                              status_data.map((status, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{status.date}</td>
                                  <td style={{ color: status.course_status === 'Public' ? 'green' :
         status.course_status === 'Rejected'? 'red' : 'orange'  }}>
        

                                  {(status.course_status === "Waiting" || status.course_status === "waiting")
              ? " Waiting For approval ": status.course_status}
                                  </td>
                                  <td>{status.reason || '------'}</td>
                                  <td>{status.required || '------'}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6" className="text-center">No records found</td>
                              </tr>
                            )}

                        </tbody>
                    </table>
                    <button onClick={closeDrawer} className="btn btn-danger btn-sm">
                        Close
                    </button>
                    </div>
                </div>
                )}





            {showDrawer2 && (
                <div className="drawer-overlay" onClick={closeDrawer2}>
                    <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                    <h4>Put on Hold</h4>
                    <p style={{fontWeight:"bold"}}>Course Name: {selectedCourse2?.name}</p>

                    <div className="col-md-6">
                <label htmlFor="reason" className="form-label">Reason</label>
                <textarea className="form-control" id="requirements" rows="3" value={holdData.reason}
                    onChange={(e) => setHoldData({ ...holdData, reason: e.target.value })}></textarea>
                   
                </div>

                <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Requirements</label>
                <textarea className="form-control" id="requirements" rows="3" value={holdData.required}
                    onChange={(e) => setHoldData({ ...holdData, required: e.target.value })}></textarea>
                    
                </div>
                <div style={{marginTop:"10px",marginBottom:"10px"}}>
                <button  onClick={() => handleHold(selectedCourse2.id)} className="btn btn-primary btn-sm">
                        Submit
                    </button>
                    <button style={{marginLeft:"10px"}} onClick={clearData} className="btn btn-primary btn-sm">
                        Clear
                    </button>

                </div>
                    <button onClick={closeDrawer2} className="btn btn-danger btn-sm">
                        Close
                    </button>
                    </div>
                </div>
                )}






{showDrawer3 && (
                <div className="drawer-overlay" onClick={closeDrawer3}>
                    <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
                    <h4>Reject Course</h4>
                    <p style={{fontWeight:"bold"}}>Course Name: {selectedCourse3?.name}</p>

                    <div className="col-md-6">
                <label htmlFor="reason" className="form-label">Reason</label>
                <textarea className="form-control" id="requirements" rows="3" value={rejectData.reason}
                    onChange={(e) => setRejectData({ ...rejectData, reason: e.target.value })}></textarea>
                   
                </div>

                <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Requirements</label>
                <textarea className="form-control" id="requirements" rows="3" value={rejectData.required}
                    onChange={(e) => setRejectData({ ...rejectData, required: e.target.value })}></textarea>
                    
                </div>
                <div style={{marginTop:"10px",marginBottom:"10px"}}>
                <button  onClick={() => handleReject(selectedCourse3.id)} className="btn btn-primary btn-sm">
                        Reject
                    </button>
                    <button style={{marginLeft:"10px"}} onClick={clearData} className="btn btn-primary btn-sm">
                        Clear
                    </button>

                </div>
                    <button onClick={closeDrawer3} className="btn btn-danger btn-sm">
                        Close
                    </button>
                    </div>
                </div>
                )}
</div>

  )
}

export default ViewaCourse
