import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  transactions } from '../../redux/authSlices'
import { Link } from 'react-router-dom'

function Transactions() {
    const dispatch = useDispatch()
    const {transactions_data} = useSelector((state)=>state.auth)

    useEffect (()=>{
        dispatch(transactions())
    },[])

   
  return (
    <div>
      Transactions

          
<table class="table">
  <thead  class="table-dark">
    
    <tr>

      <th scope="col">Student Name</th>
      <th scope="col">No. Courses</th>
      <th scope="col">Tutor Share</th>
      <th scope="col">Admin Share</th>
      <th scope="col">Total</th>
      
    </tr>
   
 
  </thead>
  <tbody class="table-group-divider">
  {transactions_data?.student_transactions?.map((res) => (
          <tr key={res.student_id}>
            <td>
             <Link to={`/admin/stransaction/${res.student_id}`}>
              {res.student_name  }
               </Link>
            </td>
            <td>{res.total_courses}</td>
            <td>{res.teacher_share }</td>
            <td>{res.admin_share}</td>
            <td>{res.total_price}</td>
          </tr>
        ))}
     <tr>
        <td></td>
        <td style={{fontWeight:'bold'}}>Grand Total</td>
        <td style={{fontWeight:'bold'}}>{transactions_data?.grand_totals?.grand_teacher_share}</td>
        <td style={{fontWeight:'bold'}}>{transactions_data?.grand_totals?.grand_admin_share}</td>
        <td style={{fontWeight:'bold'}}>{transactions_data?.grand_totals?.grand_total_price}</td>
        
        
        
     </tr>
    
    
  </tbody>
</table>
    </div>
  )
}

export default Transactions
