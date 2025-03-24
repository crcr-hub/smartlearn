import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import videojs from "video.js";
import {
  averageRating,
  deleteComments,
  fetchMyCourse,
  fetchProgress,
  fetchStudentProfile,
  fetchTeacherProfile,
  getAllFeedback,
  getComments,
  getFeedback,
  getProgress,
  handleComments,
  postProgress,
  updateComment,
  updateFeedback,
} from "../../../redux/authSlices";
import StudentCourseNavbar from "../StudentCourseNavbar";
import StudentFooter from "../StudentFooter";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

  const Learning = () => {
  const { mycourse } = useSelector((state) => state.auth);
  const { mymodule } = useSelector((state) => state.auth);
  const { teacherprofile } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.auth);
  const {user} = useSelector((state)=> state.auth)
  const videoNode = useRef(null); // Ref for the video element
  const {average_rating} = useSelector((state)=>state.auth);
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


 
  const playerRef = useRef(null); // Ref for the video.js player instance
  const [replyingTo, setReplyingTo] = useState(null);
  const {profile}  = useSelector((state)=>state.auth)
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedCommentText, setUpdatedCommentText] = useState({
    comment_text:""
  });


const {progress} = useSelector((state)=>state.auth)

 
  const { id } = useParams();
  const dispatch = useDispatch();


  useEffect(() => {
    if (mycourse) {
      dispatch(fetchTeacherProfile(mycourse.teacher)); // Fetch teacher profile when course is available
      dispatch(getFeedback(mycourse.id))
      dispatch(getAllFeedback(mycourse.id))
       dispatch(averageRating(mycourse.id));
    }
  }, [dispatch, mycourse]);

  const sortedModules = Array.isArray(mymodule)
    ? [...mymodule].sort((a, b) => a.number - b.number)
    : [];


  // State for the currently selected video URL
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [moduleTopoic, setModuleTopic] = useState("");
  const [moduleId, setModuleId] = useState(null);
  const [commentData, setCommentData] = useState({
    comment_text: "",
    parent_id: null,
    moduleId: null,
  });



  useEffect(() => {
    if (moduleId) {
      dispatch(getComments({ moduleId })); // Dispatch action when moduleId changes
      dispatch(getProgress(moduleId));
    }
  }, [moduleId, dispatch]);

  useEffect(() => {
    dispatch(fetchMyCourse(id));
     dispatch(fetchStudentProfile());
  }, [dispatch, id]);


//........................feedback...........................
const {feedback} = useSelector((state)=>state.auth)
const {allfeedback} =useSelector((state)=>state.auth)
const [editingFeedbackId, setEditingFeedbackId] = useState(null);
const [editedFeedback, setEditedFeedback] = useState("");
const [editedStars, setEditedStars] = useState(0);
 

const updateFeedbackbutton = async(feedbackId,newFeedback,newStars)=>{
  const updatedData = {
    feedbackId : feedbackId,
    star : newStars,
    feedback : newFeedback
  };
  try{
    await dispatch(updateFeedback(updatedData)).unwrap();
    dispatch(getAllFeedback(mycourse.id));
  }catch(error){
    console.error("error submitting feedback",error)
  }
}

//......................Progress...........................................
const [watchedTime, setWatchedTime] = useState(0);
const [totalTime,setTotalTime] = useState(0);

const submitProgression = () => {
  if (!moduleId) return; // Ensure module ID exists

  const updatedData = {
    moduleId: moduleId,
    time_watched: watchedTime, // Send watched time
    total_time :totalTime,
    course_id : mycourse.id
  };

  dispatch(postProgress(updatedData)); // Dispatch Redux action to send data
};

useEffect(() => {
  return () => {
    submitProgression(); // Ensure watched time is sent before exit
  };
}, []);


// const hasSubmitted = useRef(false); // Track submission status

// useEffect(() => {
//   console.log("workingnnnnnnn", totalTime, "watched", watchedTime);

//   const checkAndSubmitProgress = async () => {
//     if (!sortedModules || sortedModules.length === 0 || !moduleId) return;

//     const lastModuleId = sortedModules[sortedModules.length - 1]?.id;
//     const isLastModule = moduleId === lastModuleId;

//     if (isLastModule && watchedTime >= totalTime && totalTime > 0 && !hasSubmitted.current) {
//       console.log("Last module fully watched! Saving progress...");
//       hasSubmitted.current = true; // Mark as submitted
//       try {
//         await submitProgression(); 
//         await dispatch(fetchProgress(mycourse.id)); 
//       } catch (error) {
//         console.error("Error submitting progress:", error);
//         hasSubmitted.current = false; // Reset in case of failure
//       }
//     }
//   };

//   // Run the function
//   checkAndSubmitProgress();

//   return () => {
//     // Cleanup to prevent multiple submissions
//     hasSubmitted.current = false;
//   };

// }, [watchedTime, totalTime, moduleId, sortedModules]);



const hasSubmitted = useRef(false); // Track submission status
useEffect(() => {

console.log("workingnnnnnnn",totalTime,"watched",watchedTime)
  const checkAndSubmitProgress = async () => {
    if (!sortedModules || sortedModules.length === 0 || !moduleId) return;

    const lastModuleId = sortedModules[sortedModules.length - 1]?.id;
    const isLastModule = moduleId === lastModuleId;

    if (isLastModule && watchedTime >= totalTime && totalTime > 0 && !hasSubmitted.current) {
      console.log("Last module fully watched! Saving progress...");
      hasSubmitted.current = true; // Mark as submitted
      await submitProgression(); 
      await dispatch(fetchProgress(mycourse.id)); 
    }
  };

  checkAndSubmitProgress();

}, [watchedTime, totalTime, moduleId, sortedModules]);



  // Initialize the video.js player once..... VideoPlayer........


   // Set the initial video URL to the first module's video

   const timeWatched = progress.length > 0 ? progress[0].time_watched ?? 0 : 0;
   useEffect(() => {
    if (sortedModules && sortedModules.length > 0) {
      setSelectedVideoUrl(sortedModules[0]?.media || "");
      setModuleTopic(sortedModules[0]?.topic); // Replace `media` with the actual field name
      setModuleId(sortedModules[0]?.id);
      setTotalTime(sortedModules[0]?.total_time);
      dispatch(getProgress(sortedModules[0]?.id))
      dispatch(fetchProgress(mycourse.id))
    }

  }, [mymodule]);








  useEffect(() => {
    if (!videoNode.current) return;
    // Initialize the video.js player
    if (!playerRef.current) {
      playerRef.current = videojs(videoNode.current, {
        muted: false,
        autoplay: true,
        controls: true,
        width: "100%",
        height: "500px",
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
      });
    }

    return () => {
      // Dispose the player instance on component unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  
  useEffect(() => {
    if (playerRef.current && selectedVideoUrl) {
      console.log("url",selectedVideoUrl)
            const player = playerRef.current;
            player.pause(); // Pause the current video
            player.src({ 
              src: selectedVideoUrl, 
              type: "application/x-mpegURL" 
            });
            player.load(); // Load the new video
        
            // Ensure play() is only called after the video is ready

                  // Set the previously watched time when metadata is loaded
              player.on("loadedmetadata", () => {
                if (timeWatched > 0) {
                  player.currentTime(timeWatched);
                }
                player.play().catch((error) => console.log("Error playing video:", error));
              });


          const updateTime = () => {
            setWatchedTime(player.currentTime()); // Update state with watched time
          };
          
          player.on("timeupdate", updateTime); // Listen for time updates

          return () => {
            player.off("timeupdate", updateTime); // Remove listener when unmounted
          };
         }
      }, [selectedVideoUrl]);
  



//...............................Comment section............................

  const [topComment,setTopComment] = useState({
    comment_text :"",
    parent_id : null,
    moduleId : null
  })
  const topCommentButton = async (e) =>{
    if (e) e.preventDefault();
    if (!topComment.comment_text.trim() || !moduleId) return;
    const updatedData = {...topComment,moduleId};
    try{
      await dispatch(handleComments(updatedData));
      setTopComment({
        comment_text:"",
        parent_id:null,
      })
      await dispatch(getComments({moduleId}));
    } catch(error){
      console.error("Error while submitting comment:", error);
    }

  };

  const commentButton = async (e) => {
    if (e) e.preventDefault();
    
    if (!commentData.comment_text.trim() || !moduleId) return;
  
    const updatedData = { ...commentData, moduleId };
    try {
      // Dispatch the action to submit the comment
      await dispatch(handleComments(updatedData));
  
      // Clear only the comment text and parent_id after submission
      setCommentData({
        comment_text: "",
        parent_id: null, // Reset after submitting a reply
      });
  
      // Fetch updated comments
      await dispatch(getComments({ moduleId }));
    } catch (error) {
      console.error("Error while submitting comment:", error);
    }
  };
  

  const DeleteComment = async(id) =>{
   
    await dispatch(deleteComments(id)).unwrap();
    dispatch(getComments({moduleId}))
  }





  const onReply = (parentId) => {
    setReplyingTo(parentId); // Set the active reply ID
  };

  






  const addComment = (text, parentId = null) => {
    if (!text.trim()) return;
  
    const newComment = {
      id: Date.now(),
      first_name: "User", // Replace with actual user name
      comment: text,
      parent_id: parentId, // Associate reply with parent comment
    };
  
    setCommentData([...comments, newComment]);
  };


  const updateComments = async(commentId) =>{
    const updatedData = updatedCommentText;
    await dispatch(updateComment({ commentId, updatedData })).unwrap(); 
    dispatch(getComments({ moduleId }));
  
  }
  
  const renderComments = (comments, parentId = null) => {
    const filteredComments = comments.filter((comment) => comment.parent === parentId);
    console.log("Filtered Comments:", filteredComments);
  
    if (filteredComments.length === 0) {
      return null; // If no comments, return nothing
    }
  
    return (
      <div>




        {filteredComments.map((comment) => (
          <div key={comment.id} style={{ marginLeft: parentId ? "30px" : "0" ,backgroundColor: "#f0f0f0",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "5px", }}>
            <p>
              <strong>{comment.first_name || "Anonymous"}</strong>
            </p>
            {editingCommentId === comment.id ? (
            <textarea
              className="form-control"
              value={updatedCommentText.comment_text}
              onChange={(e) => setUpdatedCommentText({...updatedCommentText,comment_text:e.target.value})}
              placeholder="Edit your comment"
            />
          ) : (
            <p>{comment.comment}</p>
          )}
  
            {/* Reply Button */}
            <Link
              to="#"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
            >
              Reply
            </Link>
            {profile && comment.profile === profile.id ? (
      <>
        <Link onClick={() => DeleteComment(comment.id)} style={{ marginLeft: "5px" }}>
          Delete
        </Link>

              {editingCommentId === comment.id ? (
                <>
                  <button
                    onClick={() => {
                      updateComments(comment.id);
                      setEditingCommentId(null); // Close textarea after saving
                    }}
                    style={{ marginLeft: "5px", backgroundColor: "green", color: "white", border: "none", padding: "5px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCommentId(null)}
                    style={{ marginLeft: "5px", backgroundColor: "red", color: "white", border: "none", padding: "5px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <Link
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setUpdatedCommentText({ comment_text: comment.comment }); // Pre-fill text area
                  }}
                  style={{ marginLeft: "5px" }}
                >
                  Edit
                </Link>
              )}
            </>
          ) : null}
            
  
            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div style={{ marginTop: "10px" }}>
                <textarea
                  className="form-control"
                  value={commentData.comment_text}
                  onChange={(e) =>
                    setCommentData({
                      ...commentData,
                      comment_text: e.target.value,
                      parent_id: comment.id, // Set parent for reply
                    })
                  }
                  placeholder="Write your reply here"
                ></textarea>
                <button
                  onClick={() => {
                    commentButton();
                    setReplyingTo(null); // Close reply box after submission
                  }}
                  style={{
                    marginTop: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Submit Reply
                </button>
              </div>
            )}
  
           
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginLeft: "20px", borderLeft: "2px solid #ccc", paddingLeft: "10px" }}>
                {renderComments(comment.replies, comment.id)}
              </div>
            )}
          </div>
        ))}



        
      </div>
    );
  };
  
  
  
  return (
    <div>
      <StudentCourseNavbar />

      {/* Render the video player */}
      <div data-vjs-player style={{ marginBottom: "20px" }}>
        <video
          ref={videoNode}
          className="video-js"
          style={{ width: "100%", height: "500px" }}
        ></video>
      </div>
      <div>
        <p style={{ marginLeft: "10px", fontWeight: "bold" }}>{moduleTopoic}</p>
      </div>

      <div style={{ marginTop: "60px" }}>
        <div></div>
        <nav style={{ marginLeft: "25%" }}>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              style={{ fontWeight: "bold" }}
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              Course Content
            </button>
            <button
              className="nav-link"
              style={{ fontWeight: "bold" }}
              id="nav-profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="false"
            >
              Overview
            </button>
            <button
              className="nav-link"
              style={{ fontWeight: "bold" }}
              id="nav-contact-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-contact"
              type="button"
              role="tab"
              aria-controls="nav-contact"
              aria-selected="false"
            >
              Reviews
            </button>
            <button
              className="nav-link"
              style={{ fontWeight: "bold" }}
              id="nav-disabled-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-disabled"
              type="button"
              role="tab"
              aria-controls="nav-disabled"
              aria-selected="false"
            >
              Comments
            </button>
          </div>
        </nav>

        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabIndex="0"
          >
            <div
              className="container"
              style={{
                width: "860px",
                paddingTop: "50px",
                paddingBottom: "50px",
              }}
            >
              {/* Accordion without data-bs-parent */}

              {/* ........................Modules................................ */}

              
              <div className="accordion" id="modulesAccordion">
                {sortedModules?.map((module, index) => (
                  <div className="accordion-item" key={module.id || index}>
                    <h2 className="accordion-header" id={`heading-${index}`}>
                      <button
                        className={`accordion-button ${
                          index === 0 ? "" : "collapsed"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${index}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={`collapse-${index}`}
                        onClick={(e) => {
                          const target = document.querySelector(
                            `#collapse-${index}`
                          );
                          if (target.classList.contains("show")) {
                            target.classList.remove("show");
                            e.currentTarget.setAttribute(
                              "aria-expanded",
                              "false"
                            );
                            e.currentTarget.classList.add("collapsed");
                          } else {
                            target.classList.add("show");
                            e.currentTarget.setAttribute(
                              "aria-expanded",
                              "true"
                            );
                            e.currentTarget.classList.remove("collapsed");
                          }
                        }}
                      >
                        {module.topic} {/* Module topic as heading */}
                      </button>
                    </h2>
                    <div
                      id={`collapse-${index}`}
                      className={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      aria-labelledby={`heading-${index}`}
                    >
                      <div className="accordion-body">
                        <ul>
                          {module.sub_topic && module.sub_topic.length > 0 ? (
                            <li
                              key={module.id}
                              style={{
                                display: "flex",
                                justifyContent: "space-between", // Distribute items: text on left, icon on right
                                alignItems: "center", // Center align vertically
                              }}
                            >
                              {module.sub_topic}
                              <button
                                key={module.id}
                                onClick={async () => {  // Make function async
                                  if (moduleId !== module.id) {
                                    await submitProgression(); // Ensure progress is submitted before fetching new data
                                  }
                                  
                                  setModuleTopic(module.topic);
                                  setSelectedVideoUrl(module.media);
                                  setModuleId(module.id);
                                  setTotalTime(module.total_time);
                                  setWatchedTime(0);
                              
                                  // Fetch progress AFTER state updates
                                  await dispatch(getProgress(module.id));
                                  await dispatch(fetchProgress(mycourse.id));
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  fill="currentColor"
                                  className="bi bi-play-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
                                </svg>
                              </button>
                            </li> // Display subtopics as list items
                          ) : (
                            <p>No subtopics available</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
            tabIndex="0"
          >
            <div
              className="container"
              style={{
                width: "860px",
                paddingTop: "50px",
                paddingBottom: "50px",
              }}
            >
              <h4>{mycourse?.name}</h4>
              <p style={{ fontWeight: "20px" }}>
              <StarRating rating={courseRating} /> Rating
                </p>
              <p style={{ fontWeight: "20px" }}>
                Created by{" "}
                {teacherprofile
                  ? teacherprofile.first_name + " " + teacherprofile.last_name
                  : ""}
              </p>
              <h5>Description</h5>
              <p>{mycourse?.description}</p>
            </div>
          </div>


          <div
            className="tab-pane fade"
            id="nav-contact"
            role="tabpanel"
            aria-labelledby="nav-contact-tab"
            tabIndex="0"  >
            <div
              className="container"
              style={{
                width: "860px",
                paddingTop: "50px",
                paddingBottom: "50px",
              }} >
               <p style={{ fontSize: "20px", fontWeight: "bold" }}>Reviews</p>

{/* .............................Feedback....................................... */}
<div>
      {allfeedback && allfeedback.length > 0 ? (
        allfeedback.map((feedback, index) => (
          <div key={index} style={{ borderBottom: "1px solid #ddd", padding: "10px 0" }}>
            {/* Display Name and Stars */}
            <p style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {feedback.first_name} {feedback.last_name}
              <span style={{ color: "#ffc107", marginLeft: "10px" }}>
                {"⭐".repeat(feedback.star)}
              </span>
            </p>

            {/* Edit Mode */}
            {editingFeedbackId === feedback.id ? (
              <div>
                <textarea
                  value={editedFeedback}
                  onChange={(e) => setEditedFeedback(e.target.value)}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
                <input
                  type="number"
                  value={editedStars}
                  min="1"
                  max="5"
                  onChange={(e) => setEditedStars(e.target.value)}
                  style={{ width: "50px", marginRight: "10px" }}
                />
                <button
                  onClick={() => {
                    updateFeedbackbutton(feedback.id, editedFeedback, editedStars);
                    setEditingFeedbackId(null);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingFeedbackId(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Normal Feedback Display */}
                <p>{feedback.feedback}</p>
                {/* Show Edit Button Only for Logged-in User */}
                {feedback.user === user.user_id  && (
                  <button
                    onClick={() => {
                      setEditingFeedbackId(feedback.id);
                      setEditedFeedback(feedback.feedback);
                      setEditedStars(feedback.star);
                    }}
                    className="btn btn-warning btn-sm"
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
            
            {/* ..................Feedback End.................. */}
            
            </div>
          </div>




          <div
            className="tab-pane fade"
            id="nav-disabled"
            role="tabpanel"
            aria-labelledby="nav-disabled-tab"
            tabIndex="0" >


              
            {/* <div
              className="container"
              style={{
                width: "860px",
                paddingTop: "50px",
                paddingBottom: "50px",
              }}
            >
              <h5>Module :{moduleTopoic}</h5>
              <p style={{ fontWeight: "20px" }}>Comments</p>

                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "lightgray",
                          padding: "10px",
                          margin: "10px 0",
                          borderRadius: "5px",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                          {comment.first_name || "Anonymous"} 
                        </p>
                        <p style={{ margin: 0 }}>{comment.comment}</p>
                        
                        <Link
                          to="#"
                          onClick={() =>
                            setReplyingTo(replyingTo === comment.id ? null : comment.id) // Toggle reply form visibility
                          }
                          style={{
                            textDecoration: "none",
                            color: "blue",
                            cursor: "pointer",
                          }}> Reply
                        </Link>
                        
                        
                        {replyingTo === comment.id && (
                          <div style={{ marginTop: "10px" }}>
                            <textarea
                              className="form-control"
                              value={commentData.comment_text}
                              onChange={(e) =>
                                setCommentData({
                                  ...commentData,
                                  comment_text: e.target.value,
                                  parent_id: comment.id, // Set the parent_id to this comment's ID
                                })
                              }
                              placeholder="Write your reply here"
                            ></textarea>
                            <button
                              onClick={() => {
                                commentButton(); // Submit reply
                                setReplyingTo(null); // Close the reply form after submission
                              }}
                              style={{
                                marginTop: "5px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                cursor: "pointer",
                              }}
                            >
                              Submit Reply
                            </button>
                          </div>
                        )}

                      
                                          {comment.replies &&
                                            comment.replies.length > 0 &&
                                            comment.replies.map((reply) => (
                                              <div
                                                key={reply.id}
                                                style={{
                                                  marginLeft: "20px",
                                                  padding: "10px",
                                                  borderLeft: "2px solid #ccc",
                                                }}
                                              >
                                                <p style={{ margin: 0, fontWeight: "bold" }}>
                                                  {reply.first_name || "Anonymous"}
                                                </p>
                                                <p style={{ margin: 0 }}>{reply.comment}</p>
                                              </div>
                                            ))}
                                        </div>
                                      ))
                                        ) : (
                                    <p style={{ color: "gray" }}>No Comments yet</p>
                                  )}


                  <div className="form-floating" style={{ display: "flex", marginTop: "20px" }}>
                    <textarea className="form-control"  value={commentData.comment_text}  onChange={(e) =>
                        setCommentData({
                          ...commentData,
                          comment_text: e.target.value,})} placeholder="Leave a comment here" id="floatingTextarea"
                    ></textarea>
                    <label htmlFor="floatingTextarea">Comment</label>

                    <div  style={{ display: "flex", justifyContent: "flex-end",marginTop: "10px", }}>
                      <button type="button" className="btn btn-outline-secondary" style={{
                          height: "40px",
                          marginLeft: "10px",
                        }} onClick={commentButton} >  Send </button>
                    </div>
                  </div> */}



                  
            {/* </div> */}
          
          


            <div
              className="container"
              style={{
                width: "860px",
                paddingTop: "50px",
                paddingBottom: "50px",
              }}
            >
          <div>
            <h5>Module :{moduleTopoic}</h5>
 
          <div>
                  {comments?.length > 0 ? renderComments(comments) : <p>No comments yet</p>}
                </div>
                  <textarea
                    className="form-control"
                    value={topComment.comment_text}
                    onChange={(e) => setTopComment({ ...topComment, comment_text: e.target.value })}
                    placeholder="Leave a comment here"
                  ></textarea>
                  <button onClick={topCommentButton} className="btn btn-outline-secondary" style={{ marginTop: "10px" }}>
                    Send
                  </button>

            </div>

        </div>

          </div>
       
        </div>
      </div>

      <StudentFooter />
    </div>
  );
};

export default Learning;
