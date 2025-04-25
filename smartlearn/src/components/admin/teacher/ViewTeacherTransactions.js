import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTeacher, teacherTransaction } from '../../../redux/authSlices';

function ViewTeacherTransactions() {
    const {id} = useParams();
    const dispatch = useDispatch()
    const  {teacher,loading,error} = useSelector((state)=>state.auth) 
    const  {teacherTransaction : data} = useSelector((state)=>state.auth)

    useEffect(()=>{
                dispatch(fetchTeacher(id));
                dispatch(teacherTransaction(id));
                
               
            },[dispatch,id]);

            if (!teacher || !teacher.profile) {
                return <div>No teacher data available.</div>;
            }
  return (
    <div>
      Transactions for <span style={{fontWeight:"bolder"}}>{teacher.profile?.first_name}</span>
      <span style={{fontWeight:"bolder",margin:"10px"}}>{teacher.profile?.last_name}</span>

      
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
            <td>{course.course_name}</td>
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
        <td style={{fontWeight:'bold'}}>Grand Total</td>
        <td style={{fontWeight:'bold'}}>{data?.grand_totals?.total_teacher_share}</td>
        <td style={{fontWeight:'bold'}}>{data?.grand_totals?.total_admin_share}</td>
        <td style={{fontWeight:'bold'}}>{data?.grand_totals?.total_teacher_share + 
       data?.grand_totals?.total_admin_share
            }</td>
     </tr>
    
    
  </tbody>
</table>
    </div>
  )
}

export default ViewTeacherTransactions
