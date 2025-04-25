import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { StudentTransaction } from '../../redux/authSlices'

function STransaction() {
    const {sid} = useParams()
    const {studentTransaction_data} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()


    useEffect(()=>{
        dispatch(StudentTransaction(sid))
    },[dispatch,sid])
  return (
    <div>
     <p style={{fontWeight:"bold"}}>Student Name   : <span>{studentTransaction_data?.grand_totals?.student_name}</span></p>


             
<table class="table">
  <thead  class="table-dark">
    
    <tr>

      <th scope="col">Course</th>
      <th scope="col">Tutor</th>
      <th scope="col">Ordered at</th>
      <th scope="col">Payment Type</th>
      <th scope="col">Price</th>
      <th scope="col">Tutor Share</th>
      <th scope="col">Admin Share</th>
      
    </tr>
   
 
  </thead>
  <tbody class="table-group-divider">
  {studentTransaction_data?.transactions?.map((res) => (
          <tr key={res.student_id}>
            <td>
           {res.course_name}
            </td>
            <td>{res.teacher_name}</td>
            <td>{res.ordered_at }</td>
            <td>{res.payment_type}</td>
            <td>{res.offer_price}</td>
            <td>{res.teacher_share}</td>
            <td>{res.admin_share}</td>
          </tr>
        ))}
     <tr>
        <td></td>
        <td></td>
        <td></td>
        <td style={{fontWeight:'bold'}}>Grand Total</td>
         <td style={{fontWeight:'bold'}}>{studentTransaction_data?.grand_totals?.grand_total_price}</td>
        <td style={{fontWeight:'bold'}}>{studentTransaction_data?.grand_totals?.grand_teacher_share}</td>
        <td style={{fontWeight:'bold'}}>{studentTransaction_data?.grand_totals?.grand_admin_share}</td>
         
     </tr>
    
    
  </tbody>
</table>
    </div>
  )
}

export default STransaction
