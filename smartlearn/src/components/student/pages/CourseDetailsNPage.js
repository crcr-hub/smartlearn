import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { averageRating, fetchCourse, fetchLearningCourse, fetchModules, fetchTeacherProfile, getAllFeedback } from '../../../redux/authSlices';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function CourseDetailsNPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
   const {learnings} = useSelector((state)=>state.auth)
  const { course } = useSelector((state) => state.auth); // Assuming course details are in state
  const { teacherprofile } = useSelector((state) => state.auth);
  const { modules } = useSelector((state) => state.auth);
  const {average_rating} = useSelector((state)=>state.auth)
  const {allfeedback} =useSelector((state)=>state.auth)
  const sortedModules = [...modules].sort((a, b) => a.number - b.number);
  const courseRating = average_rating?.average_rating ?? 0;
    

         useEffect(()=>{
           
              dispatch(fetchLearningCourse());
              dispatch(fetchCourse(id));
            },[dispatch, id])

             const StarRating = ({ rating }) => {
              
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
