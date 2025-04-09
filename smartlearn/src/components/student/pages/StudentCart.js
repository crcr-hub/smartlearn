import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { AddToCart, AddToWishlist, FetchCart, fetchCartCourses, fetchCourse, FetchWishlist, removeCartItem, removeWishlistItem } from '../../../redux/authSlices';
import CourseDetails from './CourseDetails';
import "./StudentCart.css"

function StudentCart() {
    const [activeTab, setActiveTab] = useState("cart"); // Default to 'cart'
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector((state)=>state.auth)
    const {cart} = useSelector((state)=>state.auth)
    const {courses,loading:courserLoaading,error:courseError} = useSelector((state)=>state.auth)
    const { cartCourseDetails, loading } = useSelector((state) => state.auth);
     const {wishlist} = useSelector((state)=>state.auth)

   
    const validCourses = cartCourseDetails.filter(Boolean);
    const {teachers} = useSelector((state)=>state.auth)

       
    useEffect (()=>{
        if (user.user_id){
            FetchCart(user.user_id);
            dispatch(FetchWishlist(user.user_id));
        }
    },[dispatch,user?.user_id? user.user_id :""])

    
    useEffect(() => {
        // Fetch course details for all courses in the cart
        if (cart?.cart?.length > 0) {
          const courseIds = cart.cart.map((item) => item.course); // Extract course IDs from cart
          dispatch(fetchCartCourses(courseIds));
        }
      }, [dispatch, cart?.cart?.course]);

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  // handle remove link
  const handleRemove = (id) =>{
    if (user.user_id){
        dispatch(removeCartItem({ cart_item_id: id, user_id: user.user_id }));
    }

  }
  
      const addToCart = (courseId) =>{
        const cartData = { userId: user.user_id, courseId: courseId? courseId :null };
          dispatch(AddToCart(cartData)).then(() => {
               // Re-fetch the cart to update the UI
               dispatch(FetchCart(user.user_id));
             });
      }

  
       const handleWishlistRemove = (id) =>{ 
        if (user.user_id){
            dispatch(removeWishlistItem({ wishlist_item_id: id, user_id: user.user_id }));
        }
      }

      const moveToWishlist = (courseId) =>{
                  if(user?.user_id){
                    const wishlistData = { userId: user.user_id, courseId: courseId? courseId :null };
                    dispatch(AddToWishlist(wishlistData))
                  }   
            }
      
      const handleOnClick =(courseId)=>{
        navigate(`/coursedetails/${courseId}`)
      }


  return (
   <div>
      {/* Navigation Links */}
      <ul className="nav nav-underline">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
            to="#"
            onClick={() => handleTabChange("wishlist")}
          >
            <span style={{fontWeight:"bold",fontSize:"25px"}}> WishList</span> 
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === "cart" ? "active" : ""}`}
            to="#"
            onClick={() => handleTabChange("cart")}
          >
           <span style={{fontWeight:"bold",fontSize:"25px"}}> Shopping Cart</span> 
          </Link>
        </li>
      
      </ul>

      {/* Dynamic Heading */}
      {/* <h1>{activeTab === "cart" ? "Your Cart" : "WishList"}</h1> */}

      {/* Dynamic Content */}
      <div>
        {activeTab === "cart" && (
          <div>
                {!cart.cart?.length ? (
                  <p>No items in your Cart.</p>
    ):(
          <div>
            <p>cart items</p>
            {cart.cart.map((items, index) => {

            const course = validCourses?.find(course => course.id === items.course);
            const teacher = teachers?.find(teacher => teacher.id === course?.teacher);
                        return (
                            <div key={index} style={{  height: "120px", marginBottom: "10px", display: "flex" }}>
                            <div style={{ width: "25%", margin: "10px", borderRight: "5px solid black", 
                                 display: "flex",        // Enable flexbox
                                 justifyContent: "center", // Center horizontally
                                 alignItems: "center",
                            }}>
                            
                                
                                <img onClick={()=>handleOnClick(course.id)}  src={course?.images? `https://mysmartlearn.com/${course.images}` : null} className="card-img-top"  style={{width: "100%",    // Make the image take the full width of the div
                                    height: "100px",
                                    cursor:"pointer",
                                    width:"150px",  
                                    objectFit: "cover"}} />
                            
                            </div>
                            <div style={{width:"40%" , margin: "10px", borderRight: "5px solid black"}}>
                               <h5 style={{fontWeight:"bold"}}>{course?.name? course.name:""}</h5> 
                               <h6>by :{teacher?.first_name? teacher.first_name:""}</h6>
                               <h6>Rating</h6>
                            </div>
                            <div style={{width:"15%" , margin: "10px", borderRight: "5px solid black"}}>
                               <p><Link onClick={()=>handleRemove(items.id)}>Remove</Link></p> 
                                <Link onClick={()=> moveToWishlist(course.id)}>Move to Wishlist</Link>
                            </div>
                            <div style={{width:"25%", margin: "10px"}}>
                            <h6 style={{fontWeight:"bold"}}>Price <span style={{ marginLeft: "50px" }}>
                                
                                :
                                <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
                                {course?.price ? course.price : ""}</span></h6>
                            <h6 style={{fontWeight:"bold"}}>Offer Price <span style={{ marginLeft: "10px" }}>
                                :
                                <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
                                {course?.offer_price ? course.offer_price : ""}</span></h6>
                            
                            </div>
                            </div>
                        );
                        })}
            {/* {cart.cart.map((items)=>(
                const course = cartCourseDetails?.courses?.find(course => course.id === items.course);
            <div style={{backgroundColor:"red",height:"200px",marginBottom:"10px",display:"flex"}}>
                <div style={{width:"25%",backgroundColor:"yellow",margin:"10px",borderRight:"5px solid black"}}>
                    <h6>{items.course}
                        {items.course === cartCourseDetails?.courses?.id? cartCourseDetails.name:""}
                    </h6>
                </div>
                <div style={{width:"50%",backgroundColor:"green"}}></div>
                <div style={{width:"25%",backgroundColor:"yellow"}}></div>
            </div>
            ))} */}
            
            <div  style={{  height: "120px", marginBottom: "10px", display: "flex"}}>
                            <div style={{ width: "25%", margin: "10px", borderTop: "1px solid black",
                                 display: "flex",        // Enable flexbox
                                 justifyContent: "center", // Center horizontally
                                 alignItems: "center",
                            }}>
                            
                               
                                
                            </div>
                            <div style={{width:"40%" , margin: "10px", borderTop: "1px solid black"}}>
                               
                            </div>
                            <div style={{width:"15%" , margin: "10px", borderTop: "1px solid black",
                           
                                display: "flex",        // Enable flexbox
                                justifyContent: "center", // Center horizontally
                                alignItems: "center",
                            }}>
                            <h5 style={{fontWeight:"bold"}}> Grand Total</h5>
                            </div>
                            <div style={{width:"25%", margin: "10px", border: "1px solid black",
                                margin: "10px",
                                display: "flex",        // Enable flexbox
                                justifyContent: "center", // Center horizontally
                                alignItems: "center",
                            }}>
                            
                            
                            <button className='primary'><h5 style={{fontWeight:"bold"}} onClick={() => navigate('/billing')}>
                            <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
                                {cart?.offer_total? cart.offer_total:""}</h5>CheckOut Now</button>
                            </div>
                            </div>
          
          
          </div>
    )}
          </div>
        )}
        {activeTab === "wishlist" && (
          <div>
          


                        <div>
                
                
                        {!wishlist || wishlist.length === 0 ? (
                          <p>No items in your wishlist.</p>
                        ) : (
                          
                          <div>
                            <p>wishlist items</p>
                              {wishlist?.map((items, index) => {
                                const course = courses?.find((course) => course.id === items.course);
                                const teacher = teachers?.find(teacher => teacher.id === course?.teacher);
                                return (
            
            
            
            
                                  <div key={index} style={{  height: "120px", marginBottom: "10px", display: "flex" }}>
                                  <div style={{ width: "25%", margin: "10px", borderRight: "5px solid black", 
                                       display: "flex",        // Enable flexbox
                                       justifyContent: "center", // Center horizontally
                                       alignItems: "center",
                                  }}>
                                  
                                      
                                      <img  src={course?.images? `https://mysmartlearn.com/${course.images}` : null} className="card-img-top"  style={{width: "100%",    // Make the image take the full width of the div
                                          height: "100px",
                                          width:"150px",  
                                          objectFit: "cover"}} />
                                  
                                  </div>
                                  <div style={{width:"40%" , margin: "10px", borderRight: "5px solid black"}}>
                                     <h5 style={{fontWeight:"bold"}}>{course?.name? course.name:""}</h5> 
                                     <h6>by :{teacher?.first_name? teacher.first_name:""}</h6>
                                     <h6>Rating</h6>
                                  </div>
                                  <div style={{width:"15%" , margin: "10px", borderRight: "5px solid black"}}>
                                     <p><Link onClick={()=>handleWishlistRemove(items.id)}>Remove</Link></p> 
                                      <Link onClick={()=>addToCart(course.id)}>Add To Cart</Link>
                                  </div>
                                  <div style={{width:"25%", margin: "10px"}}>
                                  <h6 style={{fontWeight:"bold"}}>Price <span style={{ marginLeft: "50px" }}>
                                      
                                      :
                                      <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                        </svg>
                                      {course?.price ? course.price : ""}</span></h6>
                                  <h6 style={{fontWeight:"bold"}}>Offer Price <span style={{ marginLeft: "10px" }}>
                                      :
                                      <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                        </svg>
                                      {course?.offer_price ? course.offer_price : ""}</span></h6>
                                  
            
            
            
                                      
                                  </div>
                                  </div>
            
            
            
            
                                
                                    
                                  
                                );
                  })}
              
              </div>
            )}
            
            
               
                </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentCart
