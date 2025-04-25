import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { viewCourses } from '../../../redux/authSlices';

function SelectACourse() {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tutorcourses, loading, error } = useSelector((state) => state.auth);
     const {courses,courseloading,courseerror} = useSelector((state)=>state.auth)
        const [courseID, setCourseID] = useState({
          id: "", 
        });
        const handleSubmit = (e) => {
            e.preventDefault();
            if (courseID.id) {
              navigate(`/admin/viewmodule/${courseID.id}`); // Navigate to Add Module page with courseId
            } else {
              alert("Please select a course.");
            }
          };
              const courseArray = Array.isArray(courses)?courses:[];
          
              useEffect(()=>{
                  dispatch(viewCourses());
              },[dispatch])
    

  return (
    <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
       <div className="d-flex align-items-center gap-2"> {/* Flex container */}
    <div className="flex-grow-1"> {/* Dropdown takes most of the width */}
      <label htmlFor="inputState" className="form-label">Select Course</label>
      <select 
        id="inputState" 
        className="form-select" 
        name="category" 
        value={courseID.id}
        onChange={(e) => setCourseID({ id: e.target.value })}
      >
        <option value="">Choose...</option>
        {loading ? (
          <option>Loading...</option>
        ) : error ? (
          <option>Error loading categories</option>
        ) : (
          courseArray.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))
        )}
      </select>
    </div>
     <div style={{ marginTop: "30px" }}>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              View/Update Modules
            </button>
          </div>
  </div>
    </div>
  )
}

export default SelectACourse
