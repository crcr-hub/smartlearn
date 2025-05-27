import React, { useEffect, useState } from "react";
import { clearStatusData, fetchTutorCourse, getCourseStatus } from "../../../redux/authSlices";
import { useDispatch, useSelector } from "react-redux";
import TeacherSideBar from "../TeacherSideBar";
import { Link } from "react-router-dom";
import './drawer.css'

function MyCourse() {
  const dispatch = useDispatch();
  const { tutorcourses } = useSelector((state) => state.auth);
  const { user: teacher } = useSelector((state) => state.auth);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const {status_data} = useSelector((state)=>state.auth)
  


  
    const handleStatusClick = (course) => {
        dispatch(getCourseStatus(course.id));
            setSelectedCourse(course);
            setShowDrawer(true);
    };

    const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedCourse(null);
     dispatch(clearStatusData());
};




  useEffect(() => {
    if (teacher?.profile_id) {
      dispatch(fetchTutorCourse(teacher.profile_id));
    } else {
      console.warn("Profile ID is missing");
    }
  }, [dispatch, teacher?.profile_id]);
  return (
    <div className="container mt-3">
      <div className="row">
        <TeacherSideBar />
        <section className="col-md-10">
          <div className="card" style={{ border: "none" }}>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Cover Text
                    </th>
                    <th>Created</th>
                    <th
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Requirements
                    </th>
                    <th>Price</th>
                    <th
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {" "}
                      Offer Price
                    </th>
                    <th>Image</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                  {tutorcourses && tutorcourses.length > 0 ?(
                  
                  
                  tutorcourses.map((courses, index) => (
                    <tr key={index}>
                      <td>{courses.name}</td>
                      <td>{courses.category_title}</td>
                      <td>
                        {courses.description.length > 20
                          ? courses.description.substring(0, 20) + "...."
                          : courses.description}
                      </td>
                      <td>
                        {courses.cover_text && courses.cover_text.length > 20
                          ? courses.cover_text.substring(0, 20) + "....."
                          : courses.cover_text}
                      </td>
                      <td
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {courses.date_created}
                      </td>
                      <td>{courses.requirements}</td>
                      <td>{courses.price}</td>
                      <td>{courses.offer_price}</td>
                      <td>
                        {courses.images ? (
                          <img
                            src={`https://mysmartlearn.com/${courses.images}`} // Path to the image
                            alt={`Course ${courses.name}`} // Alt text for the image
                            style={{ width: "50px", height: "50px" }} // Styling for the image
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/teacherupdatecourse/${courses.id}`}
                          className="btn btn-warning btn-sm"
                        >
                          Update
                        </Link>
                      </td>

                      <td>
                     <Link onClick={() => handleStatusClick(courses)}>  {courses.visible_status === "private"
                          ? "Private"
                          : courses.visible_status === "waiting"
                          ? " Waiting For approval " :courses.visible_status === "Waiting"? "Waiting For approval"
                          : courses.visible_status}</Link> 
                      </td>
                    </tr>
                  )
                
                )
              
              ):
              <p>No Courses Found</p>
              }
                </thead>
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

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MyCourse;
