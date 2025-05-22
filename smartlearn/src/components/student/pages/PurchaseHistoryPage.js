import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchOrder } from '../../../redux/authSlices'

function PurchaseHistoryPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {order_items} = useSelector((state)=>state.auth)
    console.log("order",order_items)
    useEffect(()=>{
        dispatch(fetchOrder())
    },[dispatch])

    const buttonClick = (oid) =>{
        navigate(`/receipt/${oid}`)
    }
  return (
    <div>
         <ul className="nav nav-underline">
        <li className="nav-item">
          <Link className="nav-link active" to="#" >
            <span style={{fontWeight:"bold",fontSize:"25px"}}> Orders</span>
          </Link>
        </li>
      </ul>
    
   
      <table class="table" >
  <thead>
    <tr>
    <th scope="col">No.</th>
      <th scope="col">Courses</th>
      <th scope="col">Date</th>
      <th scope="col">Payment Type</th>
      <th scope="col">Total Price</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
  {order_items && order_items.length > 0 ? (
      order_items.map((item, index) => (
        <tr key={index}>
            <td scope="row">{index+1}</td>
          <td>
            {item.courses.map((course, i) => (
              <div key={i}>{course.course}</div>
            ))}
          </td>
          <td>{new Date(item.date).toLocaleString()}</td>
          <td>{item.type || "N/A"}</td>
          <td>     <svg style={{marginBottom:"1px",marginLeft: "20px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>{item.total || "N/A"}</td>
        
        <td><button type="button" class="btn btn-outline-primary" onClick={()=>buttonClick(item.oid)}>Receipt</button></td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4">No orders found</td>
      </tr>
    )}
  </tbody>
</table>
    </div>
  )
}

export default PurchaseHistoryPage
