import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link } from 'react-router-dom';
import { teacherBlockStatus, viewCourses, viewTeachers } from '../../../redux/authSlices';

function ViewTeacher() {


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {  userlist:teachers, loading, error } = useSelector((state) => state.auth);
    const {courses} = useSelector((state)=>state.auth)
   
   
    useEffect (()=>{
        dispatch (viewTeachers());
         dispatch(viewCourses());
      },[dispatch])
    
      const courseCount = (teacherId) => {
        if (!Array.isArray(courses)) {
          return 0; // Return 0 if courses is undefined or not an array
      }
      return courses.filter((course) => course.teacher === teacherId).length;
      };

        
    const [blockStatus,setBlockstatus] = useState();

    const teacherArray = Array.isArray(teachers) ? teachers : [];
   
  // Handle Block/Unblock
  const handleBlockUnblock = (userId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle block/unblock status
    dispatch(teacherBlockStatus({ userId, blockStatus: newStatus }))
        .unwrap()
        .then((response) => {
          dispatch (viewTeachers()); // Navigate after update
        })
        .catch((error) => {
            console.error('Error updating block status:', error);
        });
};
  


  return (
    <div>
      <table class="table">
  
</table><h3>Tutors</h3>


<table class="table">
  <thead  class="table-dark">
    
    <tr>
      <th scope="col">ID</th>
      <th scope="col">First Name</th>
      <th scope="col">Last Name</th>
      <th scope="col">Gender</th>
      <th scope="col">Email</th>
      <th scope="col">Qualification</th>
      <th scope="col">Experience</th>
      <th scope="col">Experience In</th>
      <th scope="col">Place</th>
      <th scope="col">No.Courses</th>
      <th scope="col">Action</th>
    </tr>
   
 
  </thead>
  <tbody class="table-group-divider">
  {teacherArray.map((teacher) => (
        <tr key={teacher.id}>
          <td>{teacher.user.id}</td>
          <td>{teacher.profile.first_name}</td>
          <td>{teacher.profile.last_name}</td>
          <td>{teacher.profile.gender}</td>
          <td>{teacher.user.email}</td>
          <td>{teacher.profile.qualification}</td>
          <td>{teacher.profile.experience}</td>
          <td>{teacher.profile.experience_in}</td>
          <td>{teacher.profile.place}</td>
          <td>{courseCount(teacher.profile.id)} </td>
          <td>
            {/* <Link To={`/teacher/${teacher.user.id}`}  className="btn btn-warning btn-sm">Update</Link> */}
            <Link style={{margin:"5px"}} to={`/admin/teacher/${teacher.user.id}`} className="btn btn-warning btn-sm">Update</Link>
            {/* <button onClick={()=>(dispatch(fetchteacher({ id: teacher.user.id, navigate })))} className="btn btn-danger btn-sm">
                Update
            </button> */}
            
            <button  onClick={() => {
                handleBlockUnblock(teacher.user.id, teacher.user.block_status)}} className="btn btn-danger btn-sm">
                {teacher.user.block_status ? 'Aprove' : 'Block'}
            </button>
            <Link style={{margin:"5px"}} to={`/admin/teachertransactions/${teacher.user.id}`} className="btn btn-primary btn-sm">Transactions</Link>
          </td>
        </tr>
      ))}
     
    
    
  </tbody>
</table>
    </div>
  )
}

export default ViewTeacher
