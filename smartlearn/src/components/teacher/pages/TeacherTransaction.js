import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { tutorTransactions } from '../../../redux/authSlices'
import TeacherSideBar from '../TeacherSideBar'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import { Link } from 'react-router-dom'

function TeacherTransaction() {
    const {teacherTransaction:data} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(tutorTransactions())
    },[])
   
  return (
    <div>
         <TeacherNavbar/>
    <div className='container mt-3'>
    <div className='row'>
        <TeacherSideBar/>
        <section className='col-md-12' style={{width:"75%"}}>
             
<table class="table">
  <thead  class="table-dark">
    
    <tr>

      <th scope="col">Course Name</th>
      <th scope="col">No. Students</th>
      <th scope="col">Offer Price</th>
      <th scope="col">Tutor Share</th>
      <th scope="col">Admin Share</th>
      <th scope="col">Total</th>
      
    </tr>
   
 
  </thead>
  <tbody class="table-group-divider">
  {data?.courses?.map((course) => (
          <tr key={course.course_id}>
            <td>
              <Link to={`/singleT/${course.course_id}`}>
              {course.course_name}
              </Link>
              </td>
            <td>{course.purchase_count}</td>
            <td>{course.offer_price}</td>
            <td>{course.teacher_share}</td>
            <td>{course.admin_share}</td>
            <td>{course.total_revenue}</td>
          </tr>
        ))}
     <tr>
        <td></td>
        <td></td>
        <td><h6>Grand Total</h6></td>
        <td><h6>{data?.grand_totals?.total_teacher_share}</h6></td>
        <td><h6>{data?.grand_totals?.total_admin_share}</h6></td>
        <td><h6>{data?.grand_totals?.total_teacher_share + 
       data?.grand_totals?.total_admin_share
            }</h6></td>
     </tr>
    
    
  </tbody>
</table>

            </section>
    </div>

    </div>
    <Footer/>
    </div>

  )
}

export default TeacherTransaction
