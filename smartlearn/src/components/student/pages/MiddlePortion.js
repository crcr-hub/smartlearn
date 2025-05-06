import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeacherProfile } from '../../../redux/authSlices';


function MiddlePortion({ courseData, modules, onSelectVideo }) {
  
  const dispatch = useDispatch()
  const { teacherprofile } = useSelector((state) => state.auth);
  const sortedModules = [...modules].sort((a, b) => a.number - b.number);
      useEffect(() => {
        if (courseData) {
          dispatch(fetchTeacherProfile(courseData.teacher)); // Fetch teacher profile when course is available
        }
      }, [dispatch, courseData]);
 
  return (
    <div style={{ marginTop: "60px" }}>
      <div>


      </div>
      <nav style={{marginLeft:"25%"}}>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button className="nav-link active"  style={{ fontWeight: "bold" }} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true" >Course Content</button>
                <button className="nav-link"  style={{ fontWeight: "bold" }} id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Overview</button>
                <button className="nav-link"  style={{ fontWeight: "bold" }} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Reviews</button>
                <button className="nav-link"  style={{ fontWeight: "bold" }} id="nav-disabled-tab" data-bs-toggle="tab" data-bs-target="#nav-disabled" type="button" role="tab" aria-controls="nav-disabled" aria-selected="false" disabled>Disabled</button>
            </div>
        </nav>
        <div className="tab-content" id="nav-tabContent" >
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                  <div className='container ' style={{width:"860px",paddingTop:"50px",paddingBottom:"50px"}}>
                                {sortedModules?.map((module, index) => (
                                  <div className="accordion" >
                                  <div className="accordion-item" key={module.id || index}>
                                  <h2 className="accordion-header" id={`heading-${index}`}>
                                    <button
                                      className="accordion-button"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#collapse-${index}`}
                                      aria-expanded="false"
                                      aria-controls={`collapse-${index}`}
                                    >
                                      {module.topic} {/* Module topic as heading */}

                                     
                                    </button>
                                  </h2>
                                  <div
                                    id={`collapse-${index}`}
                                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                    aria-labelledby={`heading-${index}`}
                                    data-bs-parent="#modulesAccordion"
                                  >
                                    <div className="accordion-body">
                                      <ul>
                                        {module.sub_topic && module.sub_topic.length > 0 ? (
                                          
                                            <li key={module.id}
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between", // Distribute items: text on left, icon on right
                                              alignItems: "center",           // Center align vertically
                                            }}
                                            >{module.sub_topic}
                                            
                                          <button  onClick={() => onSelectVideo(module.media)} > <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
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
                                </div>
                                ))}

                                </div>


                </div>
                <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                <div className='container ' style={{width:"860px",paddingTop:"50px",paddingBottom:"50px"}}>

                                <h4>{courseData?.name}</h4>
                                <p style={{ fontWeight: "20px"}}>Rating</p>
                        <p style={{ fontWeight: "20px"}}>
                          Created by {teacherprofile ? teacherprofile.first_name + " " + teacherprofile.last_name : ""}
                        </p>
                        <h5>Description</h5>
                        <p>
                         {courseData.description}
                        </p>
                </div>
                </div>
                <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">...</div>
                <div class="tab-pane fade" id="nav-disabled" role="tabpanel" aria-labelledby="nav-disabled-tab" tabindex="0">...</div>
        </div>
    </div>
  )
}

export default MiddlePortion
