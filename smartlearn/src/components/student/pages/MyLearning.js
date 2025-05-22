import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLearningCourse } from '../../../redux/authSlices'
import { Link } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function MyLearning() {
    const {learnings} = useSelector((state)=>state.auth)

    const dispatch = useDispatch()

    useEffect(() => {
        //Ensure user is available and fetch courses only when user_id exists
          dispatch(fetchLearningCourse());
  
      }, []);
      
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


  return (
    <div style={{ width: "87%", marginLeft: "95px" }}>
  <div className="tab-content" id="nav-tabContent" >

            <h2 style={{fontWeight:"bold"}}>My Learning</h2>
           
            {learnings && learnings.courses.length > 0 ? (
                    learnings.courses.map((items, index) => {
                     
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
                              to={`/learning/${items?.course_id}`}
                            >
                              <img
                                src={
                                  items?.image
                                    ? `https://mysmartlearn.com/${items.image}`
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
                              to={`/learning/${items?.id}`}
                            >
                              <h5 style={{ fontWeight: "bold" }}>
                                {items?.course_name? items.course_name: ""}
                              </h5>
                              <h6>
                                by :{items?.by ? items.by : ""}
                              </h6>
                              <p style={{ fontWeight: "20px", color: "white" }}>
      <StarRating rating={items.rating} /> Rating
      </p>
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
