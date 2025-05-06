import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { adminNotification, clearAdminNotification, clearStatusData, getCourseStatus, pendingCourses, updateApprove, updateCourseStatus,  viewCategory, viewTeachers } from '../../../redux/authSlices'
import './drawers.css'

function PendingCourses() {
    const dispatch = useDispatch()
    const aprovalcourses = useSelector((state) => state.auth.aprovalcourses) || { courses: [] };

    const { category} = useSelector((state) => state.auth);
    const {  userlist:fetchedTeachers } = useSelector((state) => state.auth);
    const teachers = Array.isArray(fetchedTeachers) ? fetchedTeachers : [];
    const courseArray = Array.isArray(aprovalcourses)?aprovalcourses:[];
    useEffect(()=>{
        dispatch(pendingCourses())
    },[dispatch])

    useEffect(() => {
         dispatch(viewCategory());
         dispatch (viewTeachers());
         dispatch(clearAdminNotification());
          dispatch(adminNotification());
    }, [dispatch]);

    const getCategoryTitle = (categoryId) => {
        const categoryItem = category.find((cat) => cat.id === categoryId);
        return categoryItem ? categoryItem.title : "Unknown Category";
        };
            
    const getTeacherName = (teacherId) => {
        const teacherName = teachers.find((teacher) => teacher.profile.id === teacherId);
        return teacherName ? `${teacherName.profile.first_name} ${teacherName.profile.last_name}`  : "Unknown Teacher";
        };

 
    const handleApprove = (cid) =>{
        dispatch(updateApprove(cid))
    .unwrap()
    .then((response) => {
      dispatch(pendingCourses());
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


    const handleHold = (cid) =>{
      const holdPayload = {
        reason: holdData.reason,
        required: holdData.required,
        course_status: "Hold",
      };
        dispatch(updateCourseStatus({ cid, holdData:holdPayload }))
        .unwrap()
        .then((response) => {
          dispatch(pendingCourses());
        })
        .catch((error) => {
          console.error("Error approving course:", error);
        });  
        clearData(); 
        closeDrawer2();
  }



 

  const handleUnHold = (cid) =>{
    const unholdPayload = {
      reason: "",
      required: "",
      course_status: "Waiting"
    };
    dispatch(updateCourseStatus({ cid, holdData:unholdPayload }))
    .unwrap()
    .then((response) => {
      dispatch(pendingCourses());
    })
    .catch((error) => {
      console.error("Error approving course:", error);
    });
}

  const handleReject = (cid) =>{
    const rejectPayload = {
      reason: rejectData.reason,
      required: rejectData.required,
      course_status: "Rejected",
    };
    dispatch(updateCourseStatus({ cid, holdData:rejectPayload }))
      .unwrap()
      .then((response) => {
        dispatch(pendingCourses());
      })
      .catch((error) => {
        console.error("Error approving course:", error);
      });
      clearData(); 
      closeDrawer3();
}


const handleCancelReject = (cid) =>{
  const unholdPayload = {
    reason: "",
    required: "",
    course_status: "Waiting"
  };
  dispatch(updateCourseStatus({ cid, holdData:unholdPayload }))
  .unwrap()
  .then((response) => {
    dispatch(pendingCourses());
  })
  .catch((error) => {
    console.error("Error approving course:", error);
  });
}


    const navigate = useNavigate();
    const viewModule = (courseId) =>{
     
      if (courseId){
        navigate(`/admin/viewmodule/${courseId}`);
      }
      
    }


      const [selectedCourse, setSelectedCourse] = useState(null);
      const [showDrawer, setShowDrawer] = useState(false);
      const {status_data} = useSelector((state)=>state.auth)
      
         
      const handleStatusClick = (course) => {
        setSelectedCourse(course);
        setShowDrawer(true);  // Open drawer immediately
        dispatch(getCourseStatus(course.id)); // Then fetch status
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
   
      
         
      const handleHoldClick = (course) => {
        setSelectedCourse2(course);
        setShowDrawer2(true);  
      };
      
          const closeDrawer2 = () => {
          setShowDrawer2(false);
          setSelectedCourse2(null);
      };


      const handleRejectClick = (course) => {
        setSelectedCourse3(course);
        setShowDrawer3(true);  
      };
      
          const closeDrawer3 = () => {
          setShowDrawer3(false);
          setSelectedCourse3(null);
      };
    

  return (
    <div>
   
    <h3>Courses for approval</h3>

    <table class="table">
      <thead class="table-dark">
        <tr>
         
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Teacher</th>
          <th scope="col">Category</th>
          <th scope='col'>Date Created</th>
          <th  scope='col'>Status</th>
          <th scope="col">Image</th>
          <th scope="col">View</th>
          <th scope="col">Action</th>
          
        </tr>
      </thead>
      <tbody class="table-group-divider">

      {aprovalcourses && aprovalcourses.courses.length > 0 ? (
    aprovalcourses.courses.map((course) => ( 
        <tr key={course.id}>
         
          <td>{course.name}</td>
          <td>{course.description.split(' ').length > 20 ? 
            course.description.split(' ').slice(0,20).join(' ') +' '+ '....':
              course.description}</td>
          <td>
            {Array.isArray(course.teacher)
              ? course.teacher.map((teacherId) => (
                  <span key={teacherId}>{getTeacherName(teacherId)}</span>
                ))
              : getTeacherName(course.teacher)}
          </td>
          <td>
            {Array.isArray(course.category)
              ? course.category.map((categoryId) => (
                  <span key={categoryId}>{getCategoryTitle(categoryId)}</span>
                ))
              : getCategoryTitle(course.category)}
          </td>
          <td>{course.date_created}</td>

           <td>
             <Link onClick={() => handleStatusClick(course)}> 
             {(course.visible_status === "Waiting" || course.visible_status === "waiting")
              ? " Waiting For approval ": course.visible_status}</Link> 
          </td>

          <td>
            {course.images ? (
              <img
                src={`https://mysmartlearn.com/${course.images}`} // Path to the image
                style={{ width: '50px', height: '50px' }} // Styling for the image
              />
            ) : (
              "No Image"
            )}
          </td>
          <td> <Link to={`/admin/viewacourse/${course.id}`}>Course</Link><br></br>
          <Link to={`/admin/viewmodule/${course.id}`}>Modules</Link>
          </td>
          <td>
  {(course.visible_status === "Waiting" || course.visible_status === "waiting")  && (
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

  {course.visible_status === "Hold" && (
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
      onClick={() => handleUnHold(course.id)}
      className="btn btn-danger btn-sm"
    >
      Un Hold
    </button>

    </>
    
  )}

  {course.visible_status === "Rejected" && (
    <button
      style={{ marginRight: "5px", marginTop: "5px" }}
      onClick={() => handleCancelReject(course.id)}
      className="btn btn-warning btn-sm"
    >
      Cancel Reject
    </button>
  )}
</td>

        </tr>
    ))
) : (
    <span>No Courses for approval</span>
)}

       
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

export default PendingCourses
