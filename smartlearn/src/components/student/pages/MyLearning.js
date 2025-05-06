import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLearningCourse, viewCourses } from '../../../redux/authSlices'
import { Link } from 'react-router-dom'

function MyLearning() {
    const {learnings} = useSelector((state)=>state.auth)
    const {courses} = useSelector((state)=>state.auth)
    const {teachers} = useSelector((state) =>state.auth)
    const teacherArray = Array.isArray(teachers) ? teachers : [];
    const dispatch = useDispatch()

    
  
    useEffect(() => {
        //Ensure user is available and fetch courses only when user_id exists
          dispatch(fetchLearningCourse());
          dispatch(viewCourses());
      }, []);
      



  return (
    <div style={{ width: "87%", marginLeft: "95px" }}>
  <div className="tab-content" id="nav-tabContent" >

            <h2 style={{fontWeight:"bold"}}>My Learning</h2>
           
            {learnings && learnings.length > 0 ? (
                    learnings.map((items, index) => {
                      const course = courses?.find((course) => course.id === items.course);
                      const teacher = teachers?.find((teacher) => teacher.id === course?.teacher);

                      return (
                        <div
                          key={index}
                          style={{
                            height: "120px",
                            marginBottom: "10px",
                            display: "flex",
                          }}
                        >
                          <div
                            style={{
                              width: "25%",
                              margin: "10px",
                              borderRight: "5px solid black",
                              display: "flex", // Enable flexbox
                              justifyContent: "center", // Center horizontally
                              alignItems: "center",
                            }}
                          >
                            <Link
                              style={{ textDecoration: "none", color: "inherit" }}
                              to={`/learning/${course?.id}`}
                            >
                              <img
                                src={
                                  course?.images
                                    ? `https://mysmartlearn.com/${course.images}`
                                    : null
                                }
                                className="card-img-top"
                                style={{
                                  width: "100%", // Make the image take the full width of the div
                                  height: "100px",
                                  width: "150px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                          </div>
                          <div
                            style={{
                              width: "40%",
                              margin: "10px",
                              borderRight: "5px solid black",
                            }}
                          >
                            <Link
                              style={{ textDecoration: "none", color: "inherit" }}
                              to={`/learning/${course?.id}`}
                            >
                              <h5 style={{ fontWeight: "bold" }}>
                                {course?.name ? course.name : ""}
                              </h5>
                              <h6>
                                by :{teacher?.first_name ? teacher.first_name : ""}
                              </h6>
                              <h6>Rating</h6>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p> You are Not purchased any Courses</p>
                  )}

  </div>
</div>

  )
}

export default MyLearning
