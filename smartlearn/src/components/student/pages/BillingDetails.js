


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile, placeOrder } from "../../../redux/authSlices";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from "../../../utils/axiosInstances";


function BillingDetails() {
  const dispatch = useDispatch();
  const { user, cart, profile } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [billData, setBillData] = useState({
    user_housename: "",
    user_city: "",
    user_pincode: "",
    user_state:"",
  });
  const [errors, setErrors] = useState({}); 
  const validate = () =>{
    let newErrors = {};
    if (!billData.user_housename){newErrors.user_housename="House name is required";}
    if(!billData.user_city){newErrors.user_city="City Name required"}
    if(!billData.user_state){newErrors.user_state = 'State name required'}
    if(!billData.user_pincode){newErrors.user_pincode = 'pincode required'}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  const orderTotal = cart.offer_total ? cart.offer_total.toFixed(2) : "10.00"; // Fallback to $10 if undefined

  useEffect(() => {
    dispatch(fetchStudentProfile());

  }, [dispatch]);

  const handleRazorpayPayment = async (event) => {
    event.preventDefault();
    if (validate()) {
    try {
    
      const { data } = await axiosInstance.post('/create_razorpay_order/');
  
      const options = {
        key: "rzp_test_0ivBD82IWUdsoa",
        amount: data.amount,
        currency: data.currency,
        name: "smartLearn",
        description: "Course Payment",
        order_id: data.id, 
        handler: (response) => {
          const updatedBillData = {
            ...billData,
            payment: "Razorpay",
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
            signature: response.razorpay_signature,
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
    } catch (err) {
      console.error("Razorpay Order creation failed:", err);
    }
  }
  };
  



  const handlePaypalPayment = (details, data) => {
   
    const updatedBillData = {
      ...billData,
      payment: "paypal",
      payment_id: data.orderID, // PayPal Order ID
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
              <label className="form-label">{errors.user_housename?(
                <span style={{color:"red"}}>{errors.user_housename}</span>
              ):"House Name"}</label>
              <input
                type="text"
                value={billData.user_housename}
                onChange={(e) => {setBillData({ ...billData, user_housename: e.target.value })
                  if(errors.user_housename){
                    setErrors({...errors,user_housename:""})
                  }
              }}
                className="form-control"
                placeholder="Enter your house name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
              {errors.user_city?(
                <span style={{color:"red"}}>{errors.user_city}</span>
              ):"City"}
                
              </label>
              <input
                type="text"
                value={billData.user_city}
                onChange={(e) => {setBillData({ ...billData, user_city: e.target.value })
                if(errors.user_city){
                  setErrors({...errors,user_city:""})
                }
              }}
                className="form-control"
                placeholder="Enter your city"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
              {errors.user_state?(
                <span style={{color:"red"}}>{errors.user_state}</span>
              ):"State"}
              </label>
              <input
                type="text"
                value={billData.user_state}
                onChange={(e) => {setBillData({ ...billData, user_state: e.target.value })
                if(errors.user_state){
                  setErrors({...errors,user_state:""})
                }
              }}
                className="form-control"
                placeholder="Enter your state"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
              {errors.user_pincode?(
                <span style={{color:"red"}}>{errors.user_pincode}</span>
              ):"Pincode"}
              </label>
              <input
                type="text"
                value={billData.user_pincode}
                onChange={(e) => {setBillData({ ...billData, user_pincode: e.target.value })
                if(errors.user_pincode){
                  setErrors({...errors,user_pincode:""})
                }
              }}
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
