import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { averageRating, fetchCourse, fetchLearningCourse, fetchModules, fetchTeacherProfile, getAllFeedback } from '../../../redux/authSlices';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function CourseDetailsNPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.auth); // Assuming course details are in state


    

         useEffect(()=>{
           
              dispatch(fetchLearningCourse());
              dispatch(fetchCourse(id));
            },[dispatch, id])

             
    
        
    useEffect(() => {
      if (course && course.course && course.course.id) {
        const courseId = course.course.id;
        dispatch(fetchModules(courseId));
        dispatch(averageRating(courseId));
        dispatch(getAllFeedback(courseId));
      }
    }, [dispatch, course]);


      useEffect(() => {
        if (course && course.course && course.course.teacher) {
          const id = course.course.teacher
           dispatch(fetchTeacherProfile(id));
        }
      }, [dispatch, course]);

       
  return (
    <div>
      Details pagessssssss
    </div>
  )
}

export default CourseDetailsNPage
