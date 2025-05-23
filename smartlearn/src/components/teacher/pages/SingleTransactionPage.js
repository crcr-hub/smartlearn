import React, { useEffect } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { singleTransaction } from '../../../redux/authSlices'
import { useParams } from 'react-router-dom'

function SingleTransactionPage() {
    const dispatch = useDispatch()
    const {cid} = useParams()
    const {singleTransaction_data} = useSelector((state)=>state.auth)
    useEffect(()=>{
        dispatch(singleTransaction(cid))
    },[dispatch])
  return (
    <div className='container mt-4'>
    <div className='row'>
<TeacherSideBar/>

          <section className='col-md-9'>

          {singleTransaction_data ? 
                        
<table class="table">
  <thead  class="table-dark">
    
    <tr>

      <th scope="col">Student Name</th>
      <th scope="col">Date/Time Purchased</th>
      <th scope="col">Payment Type</th>
      <th scope="col">Original Price</th>
      <th scope="col">Tutor Share</th>
      <th scope="col">Admin Share</th>
      <th scope="col">PurchasedTotal Price </th>
      
    </tr>
   
 
  </thead>

  <tbody class="table-group-divider">
  {singleTransaction_data?.orders.map((course) => (
          <tr key={course.course_id}>
            <td> {course.student_name}</td>
            <td>{course.date1}</td>
            <td>{course.payment_type}</td>
            <td>{course.original_price}</td>
            <td>{course.tutor_share}</td>
            <td>{course.admin_share}</td>
            <td>{course.offer_price }</td>
          </tr>
        ))}
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td><h6>Grand Total</h6></td>
        <td><h6>{singleTransaction_data?.grand_tutor}</h6></td>
        <td><h6>{singleTransaction_data?.grand_admin}</h6></td>
        <td><h6>{singleTransaction_data?.grand_total}</h6></td>
       
     </tr>
    
    
  </tbody>
</table>
  
  :"Loading"}
 
          </section>
          </div>
    </div>
  )
}

export default SingleTransactionPage
