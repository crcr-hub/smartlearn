import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { fetchTutorProfile, handleNotification, logout, logoutUser, recentMessages } from '../../redux/authSlices';
function TeacherNavbar() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {tprofile} = useSelector((state)=>state.auth) 
     const {notifications} = useSelector((state)=>state.auth)
      const {user} = useSelector((state)=> state.auth)
  console.log("profile",tprofile)
    useEffect(()=>{
      dispatch(fetchTutorProfile());
      if (user?.user_id) {
      dispatch(handleNotification(user.user_id));
       const interval = setInterval(() => {
                dispatch(handleNotification(user.user_id));
              }, 10000); // 10 seconds
        
              // Cleanup function to clear the interval on unmount
              return () => clearInterval(interval);
    }},[dispatch])


    useEffect(() => {
      if (notifications?.notification?.some(notif => notif.notification_type === "message")) {
        dispatch(recentMessages());
      }
    }, [notifications, dispatch]);

        const handleLogout = () => {
          dispatch(logoutUser(navigate));
          navigate("/", { replace: true }); // Redirect and replace history
        };
  return (
<nav className="navbar navbar-expand-lg  bg-dark navbar-dark">
    <div className="container">
        <a className="navbar-brand" href="#">SmartLEARN</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
            <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="/tutorhome">
            Home
            </Link>
            </li>
            



              <li className="nav-item dropdown position-relative">
              <div style={{ padding: "5px 10px", margin: "0 10px", display: "inline-block" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            color: "grey",
                            cursor: "pointer",
                            marginTop: "5px",
                          }}
                          width="25"
                          height="25"
                          fill="currentColor"
                          className="bi bi-bell"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                        </svg>
                        {notifications?.notification?.length > 0 &&(
                             <span
                             style={{
                               position: "absolute",
                               top: "8px",
                               right: "20px",
                               backgroundColor: "red",
                               borderRadius: "50%",
                               width: "10px",
                               height: "10px",
                               display: "block",
                               border: "2px solid white",
                             }}
                           ></span>

                        )}
                       
                  </div>
                              
            <ul className="dropdown-menu" data-bs-auto-close="false" 
            style={{width: "500px",
              left: "50%",
              transform: "translateX(-50%)",
            }}>
              
                  
                 <span style={{marginLeft:"5px"}}>Notification</span>
                 
                  <li>
                  {notifications?.notification?.length > 0 ?(
                   notifications.notification.map((notif,index)=>( 
                    <Link className="dropdown-item"
                    to={notif.notification_type === "message" ? "/tutrecent_m" : "#"}>
                      You have {notif.message_count} message From {notif.sender_first_name}
                    </Link>
                   ))

                   ):( <span className="dropdown-item">No Notifications</span>)}
                    
                  </li>
                  
                </ul>
            </li>

            
        
            <li className="nav-item">
            <Link to="/tutordashboard" className="nav-link " aria-disabled="true">Dashboard</Link>
            </li>
            

            <li class="nav-item dropdown">
          <Link class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {tprofile?.first_name ? tprofile.first_name : "Unknown User"}
          </Link>
          <ul className="dropdown-menu">
          <li><Link to="/teacherprofile" className="dropdown-item" >Profile</Link></li>
          <li><Link to="/tutrecent_m" className="dropdown-item" >Messages</Link></li>
          <li>
         
         </li>
            
            <li></li>
            <li><hr className="dropdown-divider"/></li>
            <li> <button type="button"
          style={{marginLeft:"15px",width:"90%"}}
          onClick={handleLogout} class="btn btn-secondary">Logout</button></li>
          </ul>
        </li>
        </ul>
       
        </div>
    </div>
</nav>

  )
}

export default TeacherNavbar
