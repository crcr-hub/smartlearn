import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { adminNotification } from '../../redux/authSlices'

function AdminNavbar() {
  const {adminnotification} = useSelector((state)=>state.auth)
  const count = adminnotification ? adminnotification.length : 0;
  console.log("admin Notification",adminnotification)
  const dispatch = useDispatch()
  useEffect (() =>{
    dispatch(adminNotification())
    const interval = setInterval(()=>{
      dispatch(adminNotification());
    },10000);
    return ()=>clearInterval(interval)
  },[dispatch])



  return (
<nav className="navbar navbar-expand-lg  bg-light navbar-dark" style={{height:"35px",
  marginBottom:"20px",
  borderRadius: "15px"
  }}>
    <div className="container" >
       
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
            
    <li>
    <div className="dropdown">
  
  <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"  style={{
                    height: "25px", 
                    lineHeight: "15px",  // Centers text vertically
                    padding: "0 10px",   // Adjusts padding for better spacing
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                Notifications 
                  {count && count > 0?(
                   <span class="badge text-bg-secondary"> {count}</span>
                  ):" "}
              </button>
            <ul className="dropdown-menu"   style={{width: "500px",
             right: "10%",
              
            }}>
             
              {adminnotification && adminnotification.length > 0 ? (
                adminnotification.map((notification,index)=>(
                  <Link   to={'/admin/pendingcourses/'} key={index} className="dropdown-item"   
                  style={{
                    display: "block",
                    whiteSpace: "normal", // Allows text to wrap
                    overflowWrap: "break-word", // Ensures words break properly
                    wordBreak: "break-word", // Prevents overflow from long words
                    padding: "10px",
                    borderBottom: "1px solid #ddd", // Optional: Adds separation between items
                  }}
                  >
                  {notification.message}  {/* Fix: Use correct variable name */}
                </Link>
                ))
              ):
              (
                <span>No Notification</span>
              )}
         </ul>
</div>
    </li>
    <li>
    <Link to={'/admin/reports/'}>   <button type="button" className="btn btn-primary"    style={{
                    height: "25px", 
                    lineHeight: "15px",  // Centers text vertically
                    padding: "0 10px",   // Adjusts padding for better spacing
                    display: "flex", 
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft:"10px"
                  }}>
              
              Reports 
              
                  
              </button></Link> 
    </li>
        
           

           
        </ul>
       
        </div>
    </div>
</nav>
  )
}

export default AdminNavbar
