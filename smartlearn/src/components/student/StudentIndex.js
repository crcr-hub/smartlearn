import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { viewAllTeachers, viewCategory, viewCourses } from '../../redux/authSlices'
import { Link } from 'react-router-dom';

function StudentIndex() {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {courses,loading:courserLoaading,error:courseError} = useSelector((state)=>state.auth)
    const {teachers, loading:teacherLoading, error:teacherError} = useSelector((state) =>state.auth)
    const {  category:categories, loading, error } = useSelector((state) => state.auth);
    
    useEffect (()=>{
         dispatch (viewCategory());
         dispatch(viewCourses());
          dispatch (viewAllTeachers());
        },[dispatch])
        const [blockStatus,setBlockstatus] = useState();
        console.log("categories", categories);
        console.log("courses", courses);
        console.log("teachers", teachers);

    const categoryArray = Array.isArray(categories) ? categories : [];
    
    const teacherArray = Array.isArray(teachers) ? teachers : [];

  
  return (
    <div style={{ width: "87%", marginLeft: "95px" }}>
    <nav>
      <div className="nav nav-tabs" id="nav-tab" role="tablist">
      {categoryArray.map((category, index) => {
    const safeTitle = typeof category.title === "string" 
      ? category.title.replace(/\s+/g, "-").toLowerCase() 
      : "unknown-category";

    return (
      <button
        key={category.id}
        className={`nav-link ${index === 0 ? "active" : ""}`}
        id={`nav-${safeTitle}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#nav-${safeTitle}`}
        type="button"
        role="tab"
        aria-controls={`nav-${safeTitle}`}
        aria-selected={index === 0 ? "true" : "false"}
      >
        {category.title}
      </button>
    );
  })}

      </div>
    </nav>

    <div className="tab-content" id="nav-tabContent">
            {categoryArray.map((category, index) => {
              const safeTitle = category.title.replace(/\s+/g, "-").toLowerCase();

              // Filter courses belonging to the current category
              const categoryCourses = Array.isArray(courses)
                ? courses.filter(course => course.category === category.id) // Adjust `categoryId` field as per your data structure
                : [];

              return (
                <div
                  key={category.id}
                  className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                  id={`nav-${safeTitle}`}
                  role="tabpanel"
                  aria-labelledby={`nav-${safeTitle}-tab`}
                  tabIndex="0"
                >
                  <div className="d-flex overflow-auto row-cols-md-4 g-4 mt-3">
                    {categoryCourses.length > 0 ? (
                      categoryCourses.map(course => (
                        <div className="col me-1" key={course.id}>
                          <div className="card h-100">
                          <Link to={`/coursedetails/${course.id}`} style={{ color: 'black', textDecoration: 'none' }}>  <img src={`https://mysmartlearn.com/${course.images}` || null} className="card-img-top" alt={course.title} />
                            <div className="card-body" style={{height:"100px"}}>
                              <h5 className="card-title" style={{fontWeight:"bold"}}>{course.name}</h5>
                              <p className="card-text" style={{fontSize:"12px"}}>

                              {teacherArray.map(teacher =>(
                                  teacher.id === course.teacher ?(
                                    <span key={teacher.id}>
                                        {teacher.first_name + " " + teacher.last_name + ", " + teacher.experience_in}
                                    </span>
                                ) : null
                             ))}


                              </p>
                            </div>
                            </Link>
                            <div className="card-footer">
                              <small className="text-body-secondary">
                              <p className="card-text" style={{fontWeight:"bolder"}}>
                              <span style={{ textDecoration: "line-through", display: "inline-flex", alignItems: "center",color:"red" }}> <svg style={{marginBottom:"1px",color:"red",textDecoration:"line-through"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
                                  {course.price}</span> 
                                  
                                  <span style={{alignItems: "center", display: "inline-flex", fontWeight:"bolder"}}>
                                    
                                  <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
                                    {course.offer_price}</span></p>
                          
                              </small>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No courses available for this category.</p>
                    )}
                  </div>
                </div>
              );
            })}
  </div>

  </div>

  )
}

export default StudentIndex
