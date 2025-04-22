import React, { useState } from 'react'
import side1 from "../../assets/images/side1.jpg"
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox
  }
  from 'mdb-react-ui-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  sentOtp, verifyOtp } from '../../redux/authSlices';
import { useDispatch, useSelector } from 'react-redux';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import Swal from 'sweetalert2';

function VerifyOtp() {
     const dispatch = useDispatch(); // Initialize the dispatch function to dispatch actions
        const navigate = useNavigate(); 
        const [otp, setOtp] = useState('');
        const location = useLocation();
        const email = location.state?.email || '';
      
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
               
              const resultAction = await dispatch(verifyOtp({email,otp}));
              if (verifyOtp.fulfilled.match(resultAction)) {
                Swal.fire({
                  icon: 'success',
                  title: 'OTP sent!',
                  text: 'Success',
                  toast: true,
                  position: 'top-end',
                  timer: 3000,
                  showConfirmButton: false,
                });
                // Optionally navigate to OTP verification page
                 //navigate('/');
                 navigate('/resetpwd', { state: { email } });
              } else {
                throw new Error(resultAction.payload?.error || 'Failed to send OTP');
              }
            } catch (err) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'Something went wrong',
                toast: true,
                position: 'top-end',
                timer: 4000,
                showConfirmButton: false,
              });
            }
          };
  return (
    <div>
    <NavbarTop/>
<MDBContainer className='my-5'>
<MDBCard>

  <MDBRow className='g-0 d-flex align-items-center'>

    <MDBCol md='4'>
      <MDBCardImage src={side1} alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
    </MDBCol>
    
                <MDBCol md='6'>
                <div style={{ marginLeft: '100px' }} >
                <h2 className="fw-bold mb-5">Forgot Password</h2>
                <MDBCardBody >
                <form onSubmit={handleSubmit}>
                    <MDBInput wrapperClass='mb-4' label='Enter your OTP' id='form1' type='text' value={otp}
                onChange={(e) => setOtp(e.target.value)}/>
                   

                   


            <button type='submit'
              className="btn btn-primary mb-4 w-100" 
              style={{
                transform: 'none',
                boxShadow: 'none',
                transition: 'none'
              }}
            >
              Verify your OTP
            </button>
                            <div className="text-center" >
                                           <Link  to="/register"><p>Don't have an Account? SignUp Here</p></Link> 
                            </div>
                </form>
                </MDBCardBody>
                </div>
                </MDBCol>


  </MDBRow>

</MDBCard>
</MDBContainer>
<Footer/>
</div>
  )
}

export default VerifyOtp
