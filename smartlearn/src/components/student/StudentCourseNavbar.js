import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { getAllFeedback, getFeedback, handleFeedback, logoutUser } from '../../redux/authSlices';
import RatingModal from './pages/RatingModal';

function StudentCourseNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mycourse } = useSelector((state) => state.auth);
    const {progressPercentage} = useSelector((state)=>state.auth)
    const progress = progressPercentage.progress
    const {feedback} = useSelector((state)=>state.auth)
    const [showModal, setShowModal] = useState(false);
    const handleSubmit = async (rating, feedback) => {
       
        
        const updatedData = {
          course_id: mycourse.id,
          star: rating,
          feedback: feedback,
        };
      
        try {
          // Dispatch action to submit feedback
          await dispatch(handleFeedback(updatedData));
      
          // Close modal after submitting feedback
          setShowModal(false);
      
          // Fetch updated feedback list
          dispatch(getFeedback(mycourse.id));
          dispatch(getAllFeedback(mycourse.id))
        } catch (error) {
          console.error("Error submitting feedback:", error);
        }
      };
      
    
       const handleLogout = () => {
            dispatch(logoutUser(navigate));
           // Redirect and replace history
          }
  return (
<nav className="navbar navbar-expand-lg  bg-dark navbar-dark">
    <div className="container">
        <Link className="navbar-brand" to='/home/'>SmartLEARN</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
       
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
          
        {progress >= 90 && (
          <li className="nav-item">
            <button type="button" className="btn btn-secondary btn-sm nav-link" onClick={() => 
                {
                    if (feedback && feedback.length > 0) {
                      alert("Feedback already submitted!");
                    } else {
                      setShowModal(true);
                    }
                  }}>
              Leave Rating
            </button>
          </li>
        )}
            <li className="nav-item dropdown position-relative"> 
                <div style={{
                            color: "grey",
                            cursor: "pointer",
                            marginTop:"8px",
                           paddingLeft:"10px",
                           paddingRight:"10px"  
                          }}>
                            Progress
                          </div>

                           <ul className="dropdown-menu" data-bs-auto-close="false" 
                            style={{width: "350px",
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}>
                                 
                                  <li>
                                  <div className="progress" role="progressbar" aria-label="Info striped example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                    <div className="progress-bar progress-bar-striped bg-info text-dark" style={{width: `${progress}%`}}>
                                    <span style={{marginBottom:"15px"}}>{progress}%</span> 
                                    </div>
                                    </div>

                                    
                                  </li>
                                  
                                </ul>

            </li>
            
            <li className="nav-item">
           
            <button type="button" className="btn btn-secondary btn-sm nav-link"  onClick={handleLogout}>LogOut</button>
           
            </li>
           
            
        </ul>
       
        </div>
    </div>
    <RatingModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
</nav>

  )
}

export default StudentCourseNavbar
