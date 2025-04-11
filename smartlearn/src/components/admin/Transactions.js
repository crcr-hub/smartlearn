import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { transactions } from '../../redux/authSlices'

function Transactions() {
    const dispatch = useDispatch()
    const {transactions_data} = useSelector((state)=>state.auth)
    console.log(transactions_data)
    useEffect (()=>{
        dispatch(transactions())
    },[])
  return (
    <div>
      Transactions

          
<table class="table">
  <thead  class="table-dark">
    
    <tr>

      <th scope="col">Tutor Name</th>
      <th scope="col">No. Courses</th>
      <th scope="col">No. Students</th>
      <th scope="col">Tutor Share</th>
      <th scope="col">Admin Share</th>
      <th scope="col">Total</th>
      
    </tr>
   
 
  </thead>
  <tbody class="table-group-divider">
  {transactions_data?.response?.map((res) => (
          <tr key={res.teacher_id}>
            <td>{res.teacher_name}
                <span style={{marginLeft:"5px"}}>{res.teacher_lastname}</span>
            </td>
            <td>{res.course_count}</td>
            <td>{res.student_count}</td>
            <td>{res.teacher_share}</td>
            <td>{res.admin_share}</td>
            <td>{res.total_revenue}</td>
          </tr>
        ))}
     <tr>
        <td></td>
        <td></td>
        <td>Grand Total</td>
        <td>{transactions_data?.teacher_share}</td>
        <td>{transactions_data?.admin_share}</td>
        <td>{transactions_data?.grand_total}</td>
        
     </tr>
    
    
  </tbody>
</table>
    </div>
  )
}

export default Transactions
