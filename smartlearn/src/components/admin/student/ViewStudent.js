import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudent, updateBlockStatus, viewStudent } from '../../../redux/authSlices'
import { Link, useNavigate } from 'react-router-dom';

function ViewStudent() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {  userlist:students, loading, error } = useSelector((state) => state.auth);
    // console.log("Students:", students);
    useEffect (()=>{
        dispatch (viewStudent());},[dispatch])
        const [blockStatus,setBlockstatus] = useState();

    const studentArray = Array.isArray(students) ? students : [];
  // Handle Block/Unblock
    const handleBlockUnblock = (userId, currentStatus) => {
        const newStatus = !currentStatus; // Toggle block/unblock status
        dispatch(updateBlockStatus({userId, blockStatus: newStatus}))
        .unwrap()
        .then((response) => {
      navigate('/admin/viewstudent'); // Navigate after update
    })
    .catch((error) => {
      console.error('Error updating block status:', error);
    });
    // Log response
    
  

    
        
    };
    useEffect(() => {
        console.log('Updated students:', students);
      }, [students]);
            
  return (
            <div>
              <table class="table">
          <thead class="table-dark">
            ...
          </thead>
          <tbody>
            ...
          </tbody>
        </table><h3>Students</h3>


        <table class="table">
          <thead  class="table-dark">
            
            <tr>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Gender</th>
              <th scope="col">Email</th>
              <th scope="col">Qualification</th>
              <th scope="col">Place</th>
              <th scope="col">Mobile</th>
              <th scope="col">Courses</th>
              <th scope="col">Action</th>
            </tr>
          
        
          </thead>
          <tbody class="table-group-divider">
          {studentArray.map((student) => (
                <tr key={student.id}>
                  <td>{student.user.id}</td>
                  <td>{student.profile.first_name}</td>
                  <td>{student.profile.last_name}</td>
                  <td>{student.profile.gender}</td>
                  <td>{student.user.email}</td>
                  <td>{student.profile.qualification}</td>
                  <td>{student.profile.place}</td>
                  <td>{student.profile.mobile}</td>
                  <td>{student.courses}</td>
                  <td>
                    {/* <Link To={`/student/${student.user.id}`}  className="btn btn-warning btn-sm">Update</Link> */}
                    <Link to={`/admin/student/${student.user.id}`} className="btn btn-warning btn-sm">Update</Link>
                    {/* <button onClick={()=>(dispatch(fetchStudent({ id: student.user.id, navigate })))} className="btn btn-danger btn-sm">
                        Update
                    </button> */}
                    
                    <button onClick={() => {
                        handleBlockUnblock(student.user.id, student.user.block_status)}} className="btn btn-danger btn-sm">
                        {student.user.block_status ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            
            
            
          </tbody>
        </table>
            </div>
  )
}

export default ViewStudent
