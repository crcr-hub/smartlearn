import React, { useEffect, useState } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { fetchTutorCourse } from '../../../redux/authSlices';

function TeacherSelectACourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const {user:teacher} = useSelector((state)=>state.auth)
    const { tutorcourses, loading, error } = useSelector((state) => state.auth);
        const [courseID, setCourseID] = useState({
          id: "", 
        });


        useEffect(()=>{
           
            if (teacher?.profile_id) {
                dispatch(fetchTutorCourse(teacher.profile_id));
              } else {
                console.warn("Profile ID is missing");
              }
            
          },[dispatch, teacher?.profile_id])
        const handleSubmit = (e) => {
            e.preventDefault();
            if (courseID.id) {
              navigate(`/add_module/${courseID.id}`); // Navigate to Add Module page with courseId
            } else {
              alert("Please select a course.");
            }
          };

  return (
    <div className='container mt-4'>
        <div className='row' >
                <TeacherSideBar/>
                <section className='col-md-6'>
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
          tutorcourses.map((cat) => (
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
              Add/Update Modules
            </button>
          </div>
  </div>
                </section>
        </div>
    </div>
  )
}

export default TeacherSelectACourse
