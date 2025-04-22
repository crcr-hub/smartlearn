import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudent, updateBlockStatus, viewStudent } from '../../../redux/authSlices'
import { Link, useNavigate } from 'react-router-dom';

function ViewStudent() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {  userlist:students, loading, error } = useSelector((state) => state.auth);
    // console.log("Students:", students);
    const studentArray = Array.isArray(students) ? students : [];
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 15;
  
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = studentArray.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(studentArray.length / studentsPerPage);
    useEffect (()=>{
        dispatch (viewStudent());},[dispatch])
        const [blockStatus,setBlockstatus] = useState();

   
  // Handle Block/Unblock
    const handleBlockUnblock = (userId, currentStatus) => {
        const newStatus = !currentStatus; // Toggle block/unblock status
        dispatch(updateBlockStatus({userId, blockStatus: newStatus}))
        .unwrap()
        .then((response) => {
          dispatch (viewStudent());
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
              <th scope="col">No.</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Gender</th>
              <th scope="col">Email</th>
              <th scope="col">Qualification</th>
              <th scope="col">Place</th>
              <th scope="col">Mobile</th>
              <th scope="col">Joined Date</th>
              <th scope="col">Action</th>
            </tr>
          
        
          </thead>
          <tbody class="table-group-divider">
          {currentStudents.map((student , index) => (
                <tr key={student.id}>
                  <td>{indexOfFirstStudent + index + 1}</td>
                  <td>{student.profile.first_name}</td>
                  <td>{student.profile.last_name}</td>
                  <td>{student.profile.gender}</td>
                  <td>{student.user.email}</td>
                  <td>{student.profile.qualification}</td>
                  <td>{student.profile.place}</td>
                  <td>{student.profile.mobile}</td>
                  <td>{student.profile.date.split('T')[0]}</td>
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



{/* Pagination Controls */}
<div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="align-self-center">Page {currentPage} of {totalPages}</span>

        <button
          className="btn btn-secondary ms-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

            </div>
  )
}

export default ViewStudent
