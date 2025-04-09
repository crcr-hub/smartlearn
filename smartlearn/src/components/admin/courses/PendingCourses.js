import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { adminNotification, clearAdminNotification, pendingCourses, updateApprove, viewCategory, viewTeachers } from '../../../redux/authSlices'

function PendingCourses() {
    const dispatch = useDispatch()
    const aprovalcourses = useSelector((state) => state.auth.aprovalcourses) || { courses: [] };

    const { category, loading:categoryLoading, error:categoryError } = useSelector((state) => state.auth);
    const {  user:fetchedTeachers, loading:teacherLoading, error:teacherError } = useSelector((state) => state.auth);
    const teachers = Array.isArray(fetchedTeachers) ? fetchedTeachers : [];
    
    console.log(aprovalcourses,teachers)
    const courseArray = Array.isArray(aprovalcourses)?aprovalcourses:[];
    useEffect(()=>{
        dispatch(pendingCourses())
    },[dispatch])

    useEffect(() => {
         dispatch(viewCategory());
         dispatch (viewTeachers());
         dispatch(clearAdminNotification());
          dispatch(adminNotification());
    }, [dispatch]);

    const getCategoryTitle = (categoryId) => {
        const categoryItem = category.find((cat) => cat.id === categoryId);
        return categoryItem ? categoryItem.title : "Unknown Category";
        };
            
    const getTeacherName = (teacherId) => {
        const teacherName = teachers.find((teacher) => teacher.profile.id === teacherId);
        return teacherName ? `${teacherName.profile.first_name} ${teacherName.profile.last_name}`  : "Unknown Teacher";
        };

 
    const handleApprove = (cid) =>{
        dispatch(updateApprove(cid))
    .unwrap()
    .then((response) => {
      console.log("Course approved:", response);
      dispatch(pendingCourses());
    })
    .catch((error) => {
      console.error("Error approving course:", error);
    });
    }
    const navigate = useNavigate();
    const viewModule = (courseId) =>{
      console.log("button",courseId)
     
      if (courseId){
        navigate(`/admin/viewmodule/${courseId}`);
      }
      
    }

  return (
    <div>
   
    <h3>Courses for approval</h3>

    <table class="table">
      <thead class="table-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Teacher</th>
          <th scope="col">Category</th>
          <th scope="col">Image</th>
          <th scope="col">Action</th>
          
        </tr>
      </thead>
      <tbody class="table-group-divider">

      {aprovalcourses && aprovalcourses.courses.length > 0 ? (
    aprovalcourses.courses.map((course) => ( 
        <tr key={course.id}>
          <td>{course.id}</td>
          <td>{course.name}</td>
          <td>{course.description}</td>
          <td>
            {Array.isArray(course.teacher)
              ? course.teacher.map((teacherId) => (
                  <span key={teacherId}>{getTeacherName(teacherId)}</span>
                ))
              : getTeacherName(course.teacher)}
          </td>
          <td>
            {Array.isArray(course.category)
              ? course.category.map((categoryId) => (
                  <span key={categoryId}>{getCategoryTitle(categoryId)}</span>
                ))
              : getCategoryTitle(course.category)}
          </td>
          <td>
            {course.images ? (
              <img
                src={`https://mysmartlearn.com/${course.images}`} // Path to the image
                alt={`Course ${course.name}`} // Alt text for the image
                style={{ width: '50px', height: '50px' }} // Styling for the image
              />
            ) : (
              "No Image"
            )}
          </td>
          <td>
            <Link to={`/admin/viewmodule/${course.id}`}>View Course</Link>
            <button onClick={() => {
                        handleApprove(course.id)}} className="btn btn-danger btn-sm">
                        {course.visible_status.private ? 'Private' : 'Public'}
                    </button>
          </td>
        </tr>
    ))
) : (
    <span>No Courses for approval</span>
)}

       
      </tbody>
    </table>
  </div>
  )
}

export default PendingCourses
