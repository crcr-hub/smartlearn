


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
