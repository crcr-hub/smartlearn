import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { fetchCategory, viewCategory, viewCourses, viewTeachers } from '../../../redux/authSlices'

function ViewCourses() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {courses,loading,error} = useSelector((state)=>state.auth)
    const { category, loading:categoryLoading, error:categoryError } = useSelector((state) => state.auth);
    const {  user:fetchedTeachers, loading:teacherLoading, error:teacherError } = useSelector((state) => state.auth);
    const teachers = Array.isArray(fetchedTeachers) ? fetchedTeachers : [];
    
    useEffect (()=>{
        dispatch (viewTeachers());},[dispatch])
     
  
    const courseArray = Array.isArray(courses)?courses:[];

    useEffect(()=>{
        dispatch(viewCourses());
    },[dispatch])

    useEffect(() => {
        dispatch(viewCategory());
            }, [dispatch]);

    const getCategoryTitle = (categoryId) => {
        const categoryItem = category.find((cat) => cat.id === categoryId);
        return categoryItem ? categoryItem.title : "Unknown Category";
            };

    const getTeacherName = (teacherId) => {
                const teacherName = teachers.find((teacher) => teacher.profile.id === teacherId);
                return teacherName ? `${teacherName.profile.first_name} ${teacherName.profile.last_name}`  : "Unknown Teacher";
                    };

  return (
    <div>
   
    <h3>View Courses</h3>

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
        {courseArray.map((course) => (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.name}</td>
            <td>{course.description}</td>
            <td>{Array.isArray(course.teacher)
                ? course.teacher.map((teacherId) => (
                    <span key={teacherId}>{getCategoryTitle(teacherId)}</span>
                  ))
                : getTeacherName(course.teacher)}</td>


             <td>  {Array.isArray(course.category)
                ? course.category.map((categoryId) => (
                    <span key={categoryId}>{getCategoryTitle(categoryId)}</span>
                  ))
                : getCategoryTitle(course.category)}</td> 
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
          
            
              
              <Link
                to={`/admin/course/${course.id}`}
                className="btn btn-warning btn-sm"
              >
                Update
              </Link>
           
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ViewCourses
