import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchReciept } from '../../../redux/authSlices'


function Receipt() {
    const {oid} = useParams()
    const dispatch = useDispatch()
    const {reciept_data} = useSelector((state)=>state.auth)
    const {profile}  = useSelector((state)=>state.auth)
    console.log(reciept_data)
    useEffect(()=>{
        dispatch(fetchReciept(oid))
    },[dispatch])
  return (
    <div>
      <h1 style={{fontFamily:"timesnewroman",fontWeight:"normal"}}>Receipt</h1>
        <p style={{fontWeight:"bolder",fontSize:"20px",marginTop:"40px"}}>Receipt-<span style={{fontSize:"18px"}}> {reciept_data && reciept_data.data && reciept_data.data.length > 0 
    ? new Date(reciept_data.data[0].date).toLocaleDateString() 
    : ""}</span></p>
     
      
      <table class="table" style={{marginTop:"40px"}}>
  <thead>
  <tr>
  <td scope="col">
     <p style={{fontWeight:"bold", marginBottom: 0}}> Sold to: {profile?.first_name ? profile.first_name : "User"}</p>
  <div style={{marginLeft:"40px"}}>
  <p style={{ padding: "0", margin: 0 }}>
    {reciept_data && reciept_data.address ? reciept_data.address.housename : ""}
  </p>
  <p style={{ marginTop: 0,  padding: "0", marginBottom: 0 }}>
    {reciept_data && reciept_data.address ? reciept_data.address.city : ""}
  </p>
  <p style={{ marginTop: 0,  padding: "0", marginBottom: 0 }}>
    {reciept_data && reciept_data.address ? reciept_data.address.state : ""}
  </p>
  <p style={{ marginTop: 0,  padding: "0", marginBottom: 0 }}>
    {reciept_data && reciept_data.address ? reciept_data.address.pincode : ""}
  </p></div>
</td>
      <th scope="col"></th>
      <th scope="col"></th>
   
      <th scope="col"><p>Order :#{reciept_data && reciept_data.data && reciept_data.data.length > 0 
    ?reciept_data.data[0].payment_id:""}</p>
      <p>Date :{reciept_data && reciept_data.data && reciept_data.data.length > 0 
    ? new Date(reciept_data.data[0].date).toLocaleDateString() 
    : ""}</p>
      </th>
    
    </tr>
    <tr>
    <th scope="col">Item</th>
      <th scope="col">quantity</th>
      <th scope="col">Price</th>
      <th scope="col">Price Paid</th>
     
    
    </tr>
  </thead>
  <tbody>
    {reciept_data && reciept_data.data && reciept_data.data.length > 0 ? (
      reciept_data.data.map((item, index) => (
        <tr key={index}>
          <td>{item.course}</td>
          <td>{item.item}</td>
          <td>
            <svg
              style={{ marginBottom: "2px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-currency-rupee"
              viewBox="0 0 16 16"
            >
              <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
            </svg>
            {item.price}
          </td>
          <td><svg
              style={{ marginBottom: "2px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-currency-rupee"
              viewBox="0 0 16 16"
            >
              <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
            </svg>{item.offer_price}</td>
         
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5">No Orders</td>
      </tr>
    )}
    <tr>
        <td></td>
        <td></td>
        <th>Total Amount</th>
        <th><svg
              style={{ marginBottom: "2px" }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-currency-rupee"
              viewBox="0 0 16 16"
            >
              <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
            </svg>{reciept_data && reciept_data.total? reciept_data.total : "N/A"}</th>
    </tr>
  </tbody>
  </table>
    
    </div>
  )
}

export default Receipt
