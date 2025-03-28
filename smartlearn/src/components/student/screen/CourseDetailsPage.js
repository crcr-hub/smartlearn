import React, { useEffect } from 'react'
import StudentNavbar from '../StudentNavbar'
import CourseDetails from '../pages/CourseDetails'
import StudentFooter from '../StudentFooter'
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, AddToWishlist, FetchCart } from '../../../redux/authSlices';
import { useNavigate } from 'react-router-dom';

function CourseDetailsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { course, courseLoading, courseError } = useSelector((state) => state.auth); // Assuming course details are in state
  const {user} = useSelector((state)=> state.auth)
  const {cart} = useSelector((state)=> state.auth)
  const { teacherprofile } = useSelector((state) => state.auth);
  const isInCart = Array.isArray(cart.cart) && cart.cart.some((item) => item.course === (course?.course?.id || ""));


  useEffect(() => {
    if (user?.user_id) {
      dispatch(FetchCart(user.user_id));
    }
  }, [dispatch, user?.user_id]);


  const addToWishlist = () =>{
    if(user?.user_id){
     
      const wishlistData = { userId: user.user_id, courseId: course?.course? course.course.id :null };
      dispatch(AddToWishlist(wishlistData))
    }
   
    
  }



  const addToCart = ()=>{
    if(user?.user_id){
     
    const cartData = { userId: user.user_id, courseId: course?.course? course.course.id :null };
    dispatch(AddToCart(cartData)).then(() => {
      // Re-fetch the cart to update the UI
      dispatch(FetchCart(user.user_id));
    });
  }
  else{
    navigate("/loginpage")
  }
  }
  const gotoCart=()=>{
    navigate("/cartpage")
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <StudentNavbar />
    <div style={{ display: "flex", flex: 1 }}>
      <div style={{ flex: 1 }}>
        <CourseDetails />
      </div>
      {/* Sidebar positioned on the right */}
      <div
        style={{
          position: "fixed",
          right: "150px",
          top: "60px", // Adjust the top position based on your Navbar height
          width: "350px",
          minHeight: "400px",
          backgroundColor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "5px",
          zIndex: "1000", // Make sure the sidebar stays above other elements
        }}
      >
       
        <img src={course?.course?.images ? `http://localhost:8000${course.course.images}` : ""} className="card-img-top" alt={course?.course?.title? course.course.title : ""} style={{paddingBottom:"10px"}}/>
        <p>Price Details</p>
        <div style={{display:"flex"}}>
         
        <h5 style={{fontWeight:"bold",color:"red",textDecoration: "line-through",marginLeft: "10px" }}>
        <svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
           {course?.course?.price? course.course.price : "Loading"} 
          </h5>
          <h5 style={{fontWeight:"bold",color:"green", marginRight: "20px" }}>
            
          <svg style={{marginBottom:"1px",marginLeft: "20px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                                <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                                  </svg>
            {course?.course?.offer_price? course.course.offer_price:"Loading"} 
            </h5>
        </div>
        {isInCart ? (
                <button  onClick={gotoCart}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "darkblue",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Go to Cart
      </button>
            ) : (
              <button
              onClick={addToCart}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "darkblue",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          )}
   
        <button onClick={addToWishlist}
          style={{ 
            width: "100%",
            padding: "10px",
            backgroundColor: "darkblue",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add to Wishlist
        </button>
        
      </div>
    </div>
    <StudentFooter />
  </div>
  )
}

export default CourseDetailsPage
