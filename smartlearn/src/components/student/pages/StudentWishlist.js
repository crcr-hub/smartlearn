import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AddToCart, AddToWishlist, FetchCart, FetchWishlist, removeCartItem, removeWishlistItem } from '../../../redux/authSlices';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
function StudentWishlist() {
       const [activeTab, setActiveTab] = useState("wishlist"); // Default to 'cart'
      const  navigate = useNavigate()

       const dispatch = useDispatch()
       const {user} = useSelector((state)=>state.auth)
       const {cart} = useSelector((state)=>state.auth)
       const {wishlist} = useSelector((state)=>state.auth)
      
     const hasUnavailableItems = cart.cart_data?.some(course => course?.status?.toLowerCase() !== 'public');
    
       useEffect (()=>{

           if (user.user_id){
               dispatch(FetchCart(user.user_id));
               dispatch(FetchWishlist(user.user_id));
              
           }
       },[dispatch,user?.user_id? user.user_id :""])

       const handleWishlistRemove = (id) =>{
        if (user.user_id){
            dispatch(removeWishlistItem({ wishlist_item_id: id, user_id: user.user_id })).then(() => {
              dispatch(FetchWishlist(user.user_id));
              dispatch(FetchCart(user.user_id));
            });
        }
    
      }
       

       const StarRating = ({ rating }) => {
       
           const validRating = Number.isFinite(rating) ? rating : 0; // Ensure rating is a number
           const maxStars = 5;
           const fullStars = Math.floor(validRating); 
           const hasHalfStar = validRating % 1 !== 0; 
           const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0); 
         
           return (
             <span style={{ color: "gold", fontSize: "20px" }}>
               {[...Array(fullStars)].map((_, i) => <FaStar key={i} />)}
               {hasHalfStar && <FaStarHalfAlt />}
               {[...Array(emptyStars)].map((_, i) => <FaRegStar key={i} />)}
             </span>
           );
         }; 
   
         const gotobilling=()=>{
        
          navigate('/billing')
        }

     // handle remove link
     const handleRemove = (id) => {
      if (user.user_id){
             dispatch(removeCartItem({ cart_item_id: id, user_id: user.user_id })).then(() => {
                         dispatch(FetchCart(user.user_id));
                         dispatch(FetchWishlist(user.user_id));
                       });
         }
     
    };
    
 
   
      // Handle tab switching
      const handleTabChange = (tab) => {
        setActiveTab(tab);
      };
    
      const addToCart = (courseId) =>{
        const cartData = { userId: user.user_id, courseId: courseId? courseId :null };
          dispatch(AddToCart(cartData)).then(() => {
               // Re-fetch the cart to update the UI
               dispatch(FetchCart(user.user_id));
              dispatch(FetchWishlist(user.user_id));
             });
      }


      const goToWishlist = () =>{
        handleTabChange("wishlist")
       
      }
      const moveToWishlist = (courseId) =>{
            if(user?.user_id){
              const wishlistData = { userId: user.user_id, courseId: courseId? courseId :null };
              dispatch(AddToWishlist(wishlistData)).then(() => {
                dispatch(FetchCart(user.user_id));
                dispatch(FetchWishlist(user.user_id));
              });
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


      <div>
        {activeTab === "cart" && (
          <div>

                  
               {!cart.cart_data?.length ? (
                    <p>No items in your Cart.</p>
                      ):(
                     <div>
                         <p>cart items </p>
                        {cart.cart_data.map((course, index) => {
            

                                    return (
                                        <div key={index} style={{  height: "120px", marginBottom: "10px", display: "flex" }}>
                                        <div style={{ width: "25%", margin: "10px", borderRight: "5px solid black", 
                                             display: "flex",        // Enable flexbox
                                             justifyContent: "center", // Center horizontally
                                             alignItems: "center",
                                        }}>
                                        
                                            
                                            <img onClick={()=>handleOnClick(course.id)}   src={course?.image? `https://mysmartlearn.com/${course.image}` : null} className="card-img-top"  style={{    // Make the image take the full width of the div
                                                height: "100px",
                                                cursor:"pointer",
                                                width:"150px",  
                                                objectFit: "cover"}} />
                                        
                                        </div>
                                        <div style={{width:"40%" , margin: "10px", borderRight: "5px solid black"}}>
                                           <h5 style={{fontWeight:"bold"}}>{course?.course_name? course.course_name:""}</h5> 
                                           <h6>by :{course.by? course.by:""}</h6>
                                           <p style={{ fontWeight: "20px", color: "white" }}>
                                          <StarRating rating={course.rating} /> Rating
                                          </p>
                                        </div>
                                        <div style={{width:"15%" , margin: "10px", borderRight: "5px solid black"}}>
                                           <p><Link onClick={()=>handleRemove(course.cid)}>Remove</Link></p> 

                                           {course?.in_wishlist?
                                          <>
                                          <Link onClick={() => goToWishlist()}>Go to Wishlist</Link>
                                          </>:<Link onClick={()=> moveToWishlist(course.id)}>Move to Wishlist</Link>
                                          }
                                            
                                        </div>
                                        <div style={{width:"25%", margin: "10px"}}>
                                        {course?.status?.toLowerCase() === 'public'?
                            <>                            <h6 style={{fontWeight:"bold"}}>Price <span style={{ marginLeft: "50px" }}>
                                
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
                                </>

                            
                            : (  <span style={{ fontWeight: "bold", color: "red" }}>Item Not Available</span>)}
                            
                                        </div>
                                        </div>
                                    );
                                    })}


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
                                display: "flex",        // Enable flexbox
                                justifyContent: "center", // Center horizontally
                                alignItems: "center",
                            }}>
                            
                            
                            <button 
  className='primary' 
  disabled={hasUnavailableItems}
  onClick={() => {
    if (!hasUnavailableItems) navigate('/billing');
  }}
  style={{ 
    cursor: hasUnavailableItems ? 'not-allowed' : 'pointer',
    opacity: hasUnavailableItems ? 0.6 : 1
  }}
>
  <h5 style={{fontWeight:"bold"}}>
    <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
    </svg>
    {cart?.offer_total ? cart.offer_total : ""}
  </h5>
  CheckOut Now
</button>
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
                    return (
                      <div key={index} style={{  height: "120px", marginBottom: "10px", display: "flex" }}>
                      <div style={{ width: "25%", margin: "10px", borderRight: "5px solid black", 
                           display: "flex",        // Enable flexbox
                           justifyContent: "center", // Center horizontally
                           alignItems: "center",
                      }}>
                      
                          
                          <img onClick={()=>handleOnClick(items.id)} src={items?.image? `https://mysmartlearn.com/${items.image}` : null} className="card-img-top"  style={{    // Make the image take the full width of the div
                              height: "100px",
                               width:"150px",  
                              cursor:"pointer",
                              objectFit: "cover"}} />
                      
                      </div>
                      <div style={{width:"40%" , margin: "10px", borderRight: "5px solid black"}}>
                         <h5 style={{fontWeight:"bold"}}>{items?.course_name? items.course_name:""}</h5> 
                         <h6>by :{items.by}</h6>
                         <p style={{ fontWeight: "20px", color: "white" }}>
                                          <StarRating rating={items.rating} /> Rating
                                          </p>
                      </div>
                      <div style={{width:"15%" , margin: "10px", borderRight: "5px solid black"}}>
                      {items?.id && (
              <p><Link onClick={() => handleWishlistRemove(items.wid)}>Remove</Link></p>
                      )}
                         {items?.is_enrolled?
                         <>
                          <Link to="/mylearning">Go to Mylearning</Link>
                         </>
                         :items.in_cart ? (
                      <Link to="/cartpage">Go to cart</Link>
                    ) : (
                      <Link onClick={() => addToCart(items.id)}>Add to Cart</Link>
                    )}
                      </div>
                      <div style={{width:"25%", margin: "10px"}}>
                      {items?.status?.toLowerCase() === 'public'? 
                                  <>
                                   <h6 style={{fontWeight:"bold"}}>Price <span style={{ marginLeft: "50px" }}>
                                      
                                      :
                                      <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                        </svg>
                                      {items?.price ? items.price : ""}</span></h6>
                                  <h6 style={{fontWeight:"bold"}}>Offer Price <span style={{ marginLeft: "10px" }}>
                                      :
                                      <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                      <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                        </svg>
                                      {items?.offer_price ? items.offer_price : ""}</span></h6>
                                  
            
                                  </>
                                  :(<span style={{ fontWeight: "bold", color: "red" }}>Item Not Available</span>)}
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

export default StudentWishlist
