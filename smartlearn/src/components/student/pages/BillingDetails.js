// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { createOrder, fetchStudentProfile, placeOrder } from '../../../redux/authSlices';
// import { useNavigate } from 'react-router-dom';

// function BillingDetails() {
//     const dispatch = useDispatch()
//     const {user} = useSelector((state)=>state.auth)
//     const {cart} = useSelector((state)=>state.auth)
//     const {profile}  = useSelector((state)=>state.auth)
//     const navigate = useNavigate()
//     const { cartCourseDetails, loading } = useSelector((state) => state.auth);
//     const validCourses = cartCourseDetails.filter(Boolean);
//     const {teachers} = useSelector((state)=>state.auth)
//     const [billData,setBillData] = useState({
//       user_housename:"",
//       user_city :"",
//       user_pincode:"",
//       total_price :cart.offer_total,
// })

// useEffect(()=>{
//    dispatch(fetchStudentProfile());
// // Dynamically load PayPal SDK
// const script = document.createElement("script");
// script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD";
// script.async = true;
// script.onload = () => {
//   if (window.paypal) {
//     window.paypal.Buttons({
//       createOrder: (data, actions) => {
//         return actions.order.create({
//           purchase_units: [
//             {
//               amount: { value: cart.offer_total },
//             },
//           ],
//         });
//       },
//       onApprove: async (data, actions) => {
//         const order = await actions.order.capture();
//         const updatedBillData = {
//           ...billData,
//           payment: "paypal",
//           paypal_order_id: order.id,
//         };
//         dispatch(placeOrder(updatedBillData));
//         alert("Payment successful via PayPal!");
//         navigate("/mylearning");
//       },
//       onError: (err) => {
//         console.error("PayPal Error:", err);
//       },
//     }).render("#paypal-button-container");
//   }
// };
// document.body.appendChild(script);
// }, [dispatch, cart.offer_total]);


//     const handlePayment = async (event) => {
//       event.preventDefault();
//       const amount = cart.offer_total * 100; // Convert to paisa (INR)
    
//       const options = {
//         key: "rzp_test_0ivBD82IWUdsoa", // Replace with your Razorpay Key ID
//         amount: amount,
//         currency: "INR",
//         name: "smartLearn",
//         description: "Course Payment",
//         handler: (response) => {
//           const updatedBillData = {
//             ...billData,
//             payment: "razorpay",
//             razorpay_order_id: response.razorpay_payment_id, // Optional
            
//           };
//           dispatch(placeOrder(updatedBillData));
//           alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
//           navigate("/mylearning"); // Redirect user after successful payment
//         },
//         prefill: {
//           name: user?.username || "John Doe",
//           email: user?.email || "johndoe@example.com",
//           contact:profile?.mobile || "9999999999",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };
    
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     };
    





  
//   return (
//     <div class="container mt-4">
//    <form className="row g-3" > 
//    {/* onSubmit={handlePayment} */}
//     <div class="row">
//       {/* <!-- Left Column: Billing Address and Payment Information --> */}
//       <div class="col-md-8" style={{marginBottom:"50px"}}>
//         <div class="mb-4">
//           <h4>Billing Address</h4>
         
//             <div class="col-md-6">
//               <label for="houseName" class="form-label">House Name</label>
//               <input type="text" value={billData.user_housename}
//               onChange={(e)=>{setBillData({...billData,user_housename:e.target.value})}}
//               class="form-control" id="houseName" placeholder="Enter your house name" />
//             </div>
//             <div class="col-md-6">
//               <label for="place" class="form-label">Place</label>
//               <input type="text" class="form-control" id="place" placeholder="Enter your place" />
//             </div>
//             <div class="col-md-6">
//               <label for="city" class="form-label">City</label>
//               <input type="text" class="form-control"
//               value={billData.user_city}
//               onChange={(e)=>{
//                 setBillData({
//                   ...billData,user_city:e.target.value
//                 })
//               }}
//               id="city" placeholder="Enter your city" />
//             </div>
//             <div class="col-md-6">
//               <label for="state" class="form-label">State</label>
//               <input type="text" class="form-control" id="state" placeholder="Enter your state" />
//             </div>
//             <div class="col-md-6">
//               <label for="pincode" class="form-label">Pincode</label>
//               <input type="text" class="form-control"
//               value={billData.user_pincode}
//               onChange={(e)=>{
//                 setBillData({...billData,user_pincode:e.target.value})
//               }}
//               id="pincode" placeholder="Enter your pincode" />
//             </div>
         
//         </div>
//         <div>
//           <h4>Payment Information</h4>
//           <div class="card p-3">
//             <div class="mb-3">
//               <label for="cardNumber" class="form-label">Card Number</label>
//               <input type="text" class="form-control" id="cardNumber" placeholder="Enter your card number" />
//             </div>
//             <div class="mb-3">
//               <label for="cardHolder" class="form-label">Cardholder Name</label>
//               <input type="text" class="form-control" id="cardHolder" placeholder="Enter cardholder name" />
//             </div>
//             <div class="row">
//               <div class="col-md-6">
//                 <label for="expiryDate" class="form-label">Expiry Date</label>
//                 <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" />
//               </div>
//               <div class="col-md-6">
//                 <label for="cvv" class="form-label">CVV</label>
//                 <input type="text" class="form-control" id="cvv" placeholder="CVV" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
  
//       {/* <!-- Right Column: Payment Summary and Pay Now Button --> */}
//       <div class="col-md-4">
//         <div class="card p-3">
//           <h4>Summary</h4>
//           <ul class="list-group list-group-flush">
//             <li class="list-group-item d-flex justify-content-between">
//               <span>Subtotal</span>
//               <span><svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
//                                 <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                                   </svg>{cart.total_price}</span>
//             </li>
//             <li class="list-group-item d-flex justify-content-between">
//               <span>Discount</span>
//               <span style={{color:"green"}}><svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
//                                 <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                                   </svg>{cart.discount}</span>
//             </li>
            
//             <li class="list-group-item d-flex justify-content-between fw-bold">
//               <span>Total</span>
//               <span><svg style={{marginBottom:"1px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
//                                 <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
//                                   </svg>{cart.offer_total}</span>
//             </li>
//           </ul>
//           <button onClick={handlePayment} type='submit' class="btn btn-primary mt-3 w-100" >Pay Now</button>
//           <div id="paypal-button-container" className="mt-3">Paypal</div>
//         </div>
//       </div>
//     </div>
//     </form>
//   </div>
  

//   )
// }

// export default BillingDetails



import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile, placeOrder } from "../../../redux/authSlices";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


function BillingDetails() {
  const dispatch = useDispatch();
  const { user, cart, profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [billData, setBillData] = useState({
    user_housename: "",
    user_city: "",
    user_pincode: "",
    total_price: cart.offer_total,
  });
  console.log(billData)
  const orderTotal = cart.offer_total ? cart.offer_total.toFixed(2) : "10.00"; // Fallback to $10 if undefined

  useEffect(() => {
    dispatch(fetchStudentProfile());

  }, [dispatch]);

  const handleRazorpayPayment = (event) => {
    event.preventDefault();
    const amount = cart.offer_total * 100; // Convert to paisa

    const options = {
      key: "rzp_test_0ivBD82IWUdsoa",
      amount: amount,
      currency: "INR",
      name: "smartLearn",
      description: "Course Payment",
      handler: (response) => {
        const updatedBillData = {
          ...billData,
          payment: "razorpay",
          razorpay_order_id: response.razorpay_payment_id,
        };
        dispatch(placeOrder(updatedBillData));
        alert("Payment successful via Razorpay!");
        navigate("/mylearning");
      },
      prefill: {
        name: user?.username || "John Doe",
        email: user?.email || "johndoe@example.com",
        contact: profile?.mobile || "9999999999",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaypalPayment = (details, data) => {
    console.log("PayPal Payment Successful:", details, data);
    const updatedBillData = {
      ...billData,
      payment: "paypal",
      paypal_order_id: data.orderID, // PayPal Order ID
    };
    dispatch(placeOrder(updatedBillData));
    alert("Payment successful via PayPal!");
    navigate("/mylearning");
  };


  return (
    <div className="container mt-4">
      <form className="row g-3">
        <div className="row">
          <div className="col-md-8">
            <h4>Billing Address</h4>
            <div className="col-md-6">
              <label className="form-label">House Name</label>
              <input
                type="text"
                value={billData.user_housename}
                onChange={(e) => setBillData({ ...billData, user_housename: e.target.value })}
                className="form-control"
                placeholder="Enter your house name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">City</label>
              <input
                type="text"
                value={billData.user_city}
                onChange={(e) => setBillData({ ...billData, user_city: e.target.value })}
                className="form-control"
                placeholder="Enter your city"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                value={billData.user_pincode}
                onChange={(e) => setBillData({ ...billData, user_pincode: e.target.value })}
                className="form-control"
                placeholder="Enter your pincode"
              />
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h4>Summary</h4>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₹{cart.total_price}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Discount</span>
                  <span style={{ color: "green" }}>₹{cart.discount}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span>₹{cart.offer_total}</span>
                </li>
              </ul>

              {/* Razorpay Payment Button */}
              <button onClick={handleRazorpayPayment} className="btn btn-primary mt-3 w-100">
                Pay with Razorpay
              </button>

              {/* PayPal Button Container */}
              <PayPalScriptProvider options={{ "client-id": "AYKFeJjNUHsG9U3bmEWOStFL7V0uLOxq3D4KPu4IX3KBgJ1n7QbJrmIJMGRY4RtEtJDtOqTvyryO7Wde", currency: "USD" }}>
              <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                if (!orderTotal || isNaN(orderTotal) || orderTotal <= 0) {
                  alert("Invalid payment amount. Please try again.");
                  return;
                  }
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: orderTotal,
                      },
              },
            ],
            });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    handlePaypalPayment(details, data);
                  });
                }}
              />

              </PayPalScriptProvider>

            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default BillingDetails;
