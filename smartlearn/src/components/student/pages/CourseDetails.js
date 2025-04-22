import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { averageRating, fetchCourse, fetchLearningCourse, fetchModules, fetchTeacher, fetchTeacherProfile, getAllFeedback } from '../../../redux/authSlices';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";


function CourseDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
     const {learnings} = useSelector((state)=>state.auth)
    const { course, courseLoading, courseError } = useSelector((state) => state.auth); // Assuming course details are in state
    const { teacherprofile } = useSelector((state) => state.auth);
    const { modules } = useSelector((state) => state.auth);
    const {average_rating} = useSelector((state)=>state.auth)
    const {allfeedback} =useSelector((state)=>state.auth)
    const sortedModules = [...modules].sort((a, b) => a.number - b.number);


    const courseRating = average_rating?.average_rating ?? 0;
    

    const StarRating = ({ rating }) => {
      console.log("average rating",rating)
      const validRating = Number.isFinite(rating) ? rating : 0; // Ensure rating is a number
      
      const maxStars = 5;
      const fullStars = Math.floor(validRating); 
      const hasHalfStar = validRating % 1 !== 0; 
      const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); 
    
      return (
        <span style={{ color: "gold", fontSize: "20px" }}>
          {[...Array(fullStars)].map((_, i) => <FaStar key={i} />)}
          {hasHalfStar && <FaStarHalfAlt />}
          {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i} />)}
        </span>
      );
    };
    


    useEffect(()=>{
       dispatch(fetchLearningCourse());
         if (id) {
                  dispatch(fetchCourse(id)); // Fetch the course data to edit
                }
    },[dispatch, id]);

    useEffect(() => {
      const courseId = course?.course?.id;
      if (courseId) {
        dispatch(fetchModules(courseId));
        dispatch(averageRating(courseId));
        dispatch(getAllFeedback(courseId));
      }
    }, [dispatch, course]);
    

    useEffect(() => {
      if (course.course && course.course.teacher) {
        dispatch(fetchTeacherProfile(course.course.teacher)); // Fetch teacher profile when course is available
      }
    }, [dispatch, course]);
  return (



<div>
  <div className='main' style={{ backgroundColor: "darkblue", height: "300px", position: "relative" }}>
    <div className="container" style={{ paddingTop: "50px" }}>
      <h2 style={{ fontWeight: "20px", color: "white" }}>
        {course.course ? course.course.name : ""}
      </h2>
      <h5 style={{ fontWeight: "20px", color: "white", width: "800px" }}>
        {course.course ? course.course.cover_text : ""}
      </h5>
      <p style={{ fontWeight: "20px", color: "white" }}>
      <StarRating rating={courseRating} /> Rating
      </p>
      <p style={{ fontWeight: "20px", color: "white" }}>
        Created by {teacherprofile ? teacherprofile.first_name + " " + teacherprofile.last_name : ""}
      </p>
    </div>
  </div>

  <div className='container' style={{ width: "860px", marginLeft: "100px", paddingTop: "50px" }}>
    <nav style={{ marginLeft: "25%" }}>
      <div className="nav nav-tabs" id="nav-tab" role="tablist">
        <button className="nav-link active" style={{ fontWeight: "bold" }}
          id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home"
          type="button" role="tab" aria-controls="nav-home" aria-selected="true">
          Course Content
        </button>
        <button className="nav-link" style={{ fontWeight: "bold" }}
          id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile"
          type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
          Overview
        </button>
        <button className="nav-link" style={{ fontWeight: "bold" }}
          id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact"
          type="button" role="tab" aria-controls="nav-contact" aria-selected="false">
          Reviews
        </button>
      </div>
    </nav>

    <div className="tab-content" id="nav-tabContent">
      
      {/* Course Content Tab */}
      <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
        <div className="container" style={{ width: "860px", paddingTop: "50px", paddingBottom: "50px" }}>
          {sortedModules.map((module, index) => (
            <div className="accordion" key={index}>
              <div className="accordion-item">
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button className="accordion-button" type="button"
                    data-bs-toggle="collapse" data-bs-target={`#collapse-${index}`}
                    aria-expanded="false" aria-controls={`collapse-${index}`}>
                    {module.topic} {/* Module topic as heading */}
                  </button>
                </h2>
                <div id={`collapse-${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading-${index}`} data-bs-parent="#modulesAccordion">
                  <div className="accordion-body">
                    <ul>
                      {module.sub_topic && module.sub_topic.length > 0 ? (
                        <li key={module.id}>{module.sub_topic}</li> // Display subtopics as list items
                      ) : (
                        <p>No subtopics available</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex="0">
        <div className="container" style={{ width: "860px", paddingTop: "50px", paddingBottom: "50px" }}>
          <h5>Description</h5>
          <p>{course.course ? course.course.description : ""}</p>
        </div>
      </div>

      {/* Reviews Tab (Moved Inside Correct Tab Pane) */}
      <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabIndex="0">
        <div className="container" style={{ width: "860px", paddingTop: "50px", paddingBottom: "50px" }}>
          <h5>Reviews</h5>
          {allfeedback && allfeedback.length > 0 ? (
            allfeedback.map((feedback, index) => (
              <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
                <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {feedback.first_name} {feedback.last_name}
                  <span style={{ color: "#ffc107", marginLeft: "10px" }}>
                    {"⭐".repeat(feedback.star)}
                  </span>
                </p>
                <p>{feedback.feedback}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>

    </div>
  </div>
</div>

  
  )
}

export default CourseDetails
