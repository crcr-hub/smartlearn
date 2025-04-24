import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addCourses, addModule, fetchCourse, fetchModules, fetchTutorCourse, publishCourse, updateModule } from '../../../redux/authSlices';
import TeacherSideBar from '../TeacherSideBar';
import Cropper from 'react-easy-crop';



const TeacherAddModul = ({ selectedCourseId }) => {
          const dispatch = useDispatch();
          const { id } = useParams();
          const { modules } = useSelector((state) => state.auth);
          const { course, courseLoading, courseError } = useSelector((state) => state.auth); 
          const sortedModules = [...modules].sort((a, b) => a.number - b.number);
          const [videoUploading, setVideoUploading] = useState(false);
          const [newModule, setNewModule] = useState({
            topic: "",
            sub_topic: "",
            number: null,
            media: "",
          });
          const [loading, setLoading] = useState(false);
          const [editingRow, setEditingRow] = useState(null); // Tracks the row being edited
          const [editData, setEditData] = useState({}); // Stores the data being edited
          const [rowLoading, setRowLoading] = useState(null);
            const { user: teacher } = useSelector((state) => state.auth);

          const handleEditClick = (module) => {
            setEditingRow(module.id); // Set the current row in edit mode
            setEditData({
              id: module.id, // Ensure ID is included
              number: module.number || "", // Default empty string if undefined
              topic: module.topic || "",
              sub_topic: module.sub_topic || "",
              course: module.course || "", // Ensure course is not missing
              media: module.media || null, // Keep previous media reference
            });
          };

          const [pollingActive, setPollingActive] = useState(true);

          const handleSaveClick = async () => {
            if (editData.topic && editData.sub_topic && editData.number) {
              setRowLoading(editingRow);
              setEditingRow(null);
          
              try {
                await dispatch(updateModule(editData));
                
                // Restart polling to track processing status
                setPollingActive(true);
          
                // Fetch updated modules immediately
                dispatch(fetchModules(id));
          
              } catch (error) {
                alert("Failed to update module!");
              } finally {
                setRowLoading(null);
              }
            } else {
              alert("Please fill all the fields.");
            }
          };
          

          useEffect(() => {
            dispatch(fetchModules(id));
            dispatch(fetchCourse(id));
            const interval = setInterval(() => {
              if (pollingActive) {
                dispatch(fetchModules(id)).then((response) => {
                  // Check if all modules are "Completed"
                  const allCompleted = response.payload.every(
                    (module) => module.processing_status === "Completed"
                  );
        
                  if (allCompleted) {
                    clearInterval(interval);
                    setPollingActive(false);
                  }
                });
              }
            }, 5000); // Poll every 5 seconds
        
            return () => clearInterval(interval);
          }, [dispatch, id, pollingActive]);
     
         


          const handleAddModule = async () => {
            if (newModule.topic && newModule.sub_topic && newModule.number && newModule.media) {
              setVideoUploading(true);  
          
              try {
                await dispatch(addModule({ ...newModule, course: id }));
                setNewModule({ topic: "", sub_topic: "", number: "", media: "" }); 
                document.getElementById("fileInput").value = "";
                
                // Restart polling to check the new module's processing status
                setPollingActive(true);
              } catch (error) {
                alert("Failed to upload video!");
              } finally {
                setVideoUploading(false);
              }
            } else {
              alert("Please fill all the fields.");
            }
          };

          const navigate = useNavigate()
     
     
     
          const publishButton = () => {
            if (modules.length === 0) {
              alert("You must add at least one module before publishing the course.");
              return;
            }
          
            if (course && course.course.id) {
              dispatch(publishCourse(course.course.id))
                .unwrap()
                .then(() => {
                  // Optional: If teacher.profile_id is available, fetch updated data
                  if (teacher?.profile_id) {
                    dispatch(fetchTutorCourse(teacher.profile_id))
                      .unwrap()
                      .then(() => {
                        navigate('/mycourse');
                      });
                  } else {
                    navigate('/mycourse'); // fallback if teacher data isn't ready
                  }
                })
                .catch((error) => {
                  console.error("Error publishing course:", error);
                  alert("Something went wrong while publishing.");
                });
            }
          };
          
          

  return (
    <div className='container mt-4'>
    <div className='row'>
<TeacherSideBar/>
<section className='col-md-9'>
<div style={{ overflowX: "auto", maxHeight: "600px", overflowY: "scroll" ,width:"1000px"}}>
              {courseLoading ? (
                <h3>Loading course data...</h3>
              ) : (
                <h3>Modules for Course: {course?.course?.name}</h3>
              )}
            <table className="table" >
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>Module Number</th>
                    <th>Topic</th>
                    <th>Subtopic</th>
                    <th style={{ width: "100px" }}>Media URL</th>
                    <th style={{ width: "100px" }}>Action</th> 
                  </tr>
                </thead>
                <tbody>
    

        {/* Existing modules */}
        {sortedModules.map((module) => (
          <tr key={module.id}>
            {editingRow === module.id ? (
              <>
               
                <td>
                  <input
                    type="text"
                    value={editData.number}
                    onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                  />
                </td>
                <td style={{width:"350px"}}>
                <textarea  className="form-control"  style={{width:"200px"}}
                    value={editData.topic}
                    onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                  />
                </td>
                <td style={{width:"350px"}}>
                  <textarea  className="form-control"
                    value={editData.sub_topic}
                    onChange={(e) => setEditData({ ...editData, sub_topic: e.target.value })}
                    style={{width:"200px"}}
                  />
                </td>
                <td style={{width:"200px"}}>
              <input
                type="file"
                id="fileInput" 
                accept="video/*"
                onChange={(e) => setEditData({ ...editData, media: e.target.files[0] })}
              />
            </td>
                <td>
                  <button className="btn btn-success" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingRow(null)} // Cancel editing
                  >
                    Cancel
                  </button>
                </td>
              </>
            ) : (
              <>
                {/* Plain text for rows not being edited */}
                <td>{module.number}</td>
                <td style={{width:"350px"}}>{module.topic}</td>
                <td style={{width:"350px"}}>{module.sub_topic}</td>
                <td   style={{
            width: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            
            {module.processing_status === "Completed" ? (
              typeof module.media === "string" && module.media.length > 20
                ? module.media.substring(0, 20) + "..."
                : module.media
            ) : module.processing_status === "Converting Video" ? (
              <span style={{ color: "orange" }}>Converting your video...</span>
            ) : (
              <span style={{ color: "blue" }}>Uploading... Please wait</span>
            )}
            </td>
                <td  style={{width:"250px"}}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditClick(module)}
                    disabled={module.processing_status !== "Completed" || rowLoading === module.id}
                    >
                      
                      {rowLoading === module.id || module.processing_status !== "Completed" ? "Updating..." : "Update"}
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}








    {/* Row for adding new module */}
    <tr>
      <td>
        <input
          type="text"
          placeholder="Module Number"
          value={newModule.number}
          onChange={(e) => setNewModule({ ...newModule, number: e.target.value })}
        />
      </td>
      <td>
      <textarea
            className="form-control"
            id="description"
            rows="3"
            placeholder='Topic'
          value={newModule.topic}
          onChange={(e) => setNewModule({ ...newModule, topic: e.target.value })}
        />
      </td>
      <td>
      <textarea
            className="form-control"
            id="description"
            rows="3"
           
          placeholder="Subtopic"
          value={newModule.sub_topic}
          onChange={(e) => setNewModule({ ...newModule, sub_topic: e.target.value })}
        />
      </td>
      

            <td>
              <input
                type="file"
                id="fileInput" 
                accept="video/*"
                onChange={(e) => setNewModule({ ...newModule, media: e.target.files[0] })}
              />
            </td>
     
      <td>
        <button className="btn btn-primary" onClick={handleAddModule}>Add Next</button>
        <button className="btn btn-success" onClick={handleAddModule}>Save</button>
       
      </td>
    </tr>
   
    {course.course && (
  <>
    {(course.course.visible_status === "Private" ||
      course.course.visible_status === "private" ||
      course.course.visible_status === "Hold") && (
      <tr>
        <td></td>
        <td>
          <button className="btn btn-primary" onClick={publishButton}>
            {course.course.visible_status === "Hold" ? "Resubmit" : "Publish Now"}
          </button>
        </td>
      </tr>
    )}

    {course.course.visible_status === "Rejected" && (
      <tr>
        <td colSpan="2" style={{ color: "red", fontWeight: "bold" }}>
          Your course has been rejected. Please contact the admin.
        </td>
      </tr>
    )}
  </>
)}

    
  </tbody>
</table>
           
          </div>
            </section></div>
          </div>
        );
};

export default TeacherAddModul;



