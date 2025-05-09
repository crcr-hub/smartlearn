import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { FetchCart, fetchStudentProfile, handleNotification, logoutUser, recentMessages } from '../../redux/authSlices';

function StudentNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state)=> state.auth)
    const {cart} = useSelector((state)=> state.auth)
    const {profile}  = useSelector((state)=>state.auth)
    const {notifications} = useSelector((state)=>state.auth)
    const count = cart?.cart?.length || 0;
    useEffect(() => {
  
      if (user?.user_id) {
        dispatch(FetchCart(user.user_id));
        dispatch(fetchStudentProfile());
        dispatch(handleNotification(user.user_id));
       
        const interval = setInterval(() => {
          dispatch(handleNotification(user.user_id));
        }, 10000); // 10 seconds
  
        // Cleanup function to clear the interval on unmount
        return () => clearInterval(interval);
      
      }
    }, [dispatch, user?.user_id]);

    useEffect(() => {
      if (notifications?.notification?.some(notif => notif.notification_type === "message")) {
        dispatch(recentMessages());
      }
    }, [notifications, dispatch]);



       const handleLogout = () => {
            dispatch(logoutUser(navigate));
           // Redirect and replace history
          };
  return (
      
    <nav className="navbar navbar-expand-lg  bg-dark navbar-dark">
    <div className="container">
        <Link to="/home" className="navbar-brand" href="#">SmartLEARN</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="d-flex" role="search">
            <input style={{width:"400px"}} className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
            <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="/mylearning">
            My Learnings
            </Link>
            </li>




            <li className="nav-item">
            <Link className="nav-link" to="/wishlist">
            <button type="button" className="btn btn-outline-secondary btn-sm">WishList</button>
            </Link>
            </li>
             <li className="nav-item">
                        <Link className="nav-link " aria-current="page" to="/cartpage">
                        <div style={{ position: "relative", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-cart3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                  </svg>
                  {count > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "5px",
                        fontSize: "12px",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
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
                    to={notif.notification_type === "message" ? "/recent_m" : "#"}>
                      You have {notif.message_count} message From {notif.sender_first_name}
                    </Link>
                   ))

                   ):( <span className="dropdown-item">No Notifications</span>)}
                    
                  </li>
                  
                </ul>
            </li>



            <li className="nav-item dropdown">
           <div style={{border:"5px"}}>
             
                </div>
            </li>
            
            <li className="nav-item">
           
            <button type="button" className="btn btn-secondary btn-sm nav-link"  onClick={handleLogout}>LogOut</button>
           
            </li>
            <li className="nav-item dropdown">
            <button 
            className="nav-link dropdown-toggle"  role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {profile?.first_name? profile.first_name:"User"}
            </button>
            <ul className="dropdown-menu" data-bs-auto-close="false">
              
                  <li>
                    <Link className="dropdown-item" to="/sprofile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/mylearning">
                      My Learnings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/wishlist">
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/cartpage">
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/tutorlist">
                      Message
                    </Link>
                  </li>
                </ul>
            </li>
           
          
            <li className='nav-item'>
           

            </li>
           
           
        </ul>
       
        </div>
    </div>
</nav>


  )
}

export default StudentNavbar
