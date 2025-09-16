import React, { useState } from 'react'
import side1 from "../../../assets/images/side1.jpg";
import "./dot.css";
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput,
  }
  from 'mdb-react-ui-kit';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavbarTop from '../NavbarTop';
import Footer from '../Footer';
import Swal from 'sweetalert2';
import { registerOtp, verifyRegisterOtp } from '../../../redux/authSlices';

function VerifyRegisterOtp() {
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const [otp, setOtp] = useState('');
    const location = useLocation();
    const email = location.state?.email || '';
    const [loading,setLoading] = useState(false);


    const buttonClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
           
          const resultAction = await dispatch(registerOtp({email,otp}));
          if (registerOtp.fulfilled.match(resultAction)) {
            Swal.fire({
                             icon: 'success',
                             title: 'OTP sent!',
                             text: 'Check your email for the OTP.',
                             toast: true,
                             position: 'top-end',
                             timer: 3000,
                             showConfirmButton: false,
                           });
            // Optionally navigate to OTP verification page
             //navigate('/');
            // navigate('/resetpwd', { state: { email } });
          } else {
            throw new Error(resultAction.payload?.error ||resultAction.payload?.email || 'Failed to send OTP');
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
        }finally{
            setLoading(false);
        }
      };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
          const resultAction = await dispatch(verifyRegisterOtp({email,otp}));
          if (verifyRegisterOtp.fulfilled.match(resultAction)) {
            Swal.fire({
              icon: 'success',
              text: 'Verified',
              toast: true,
              position: 'top-end',
              timer: 3000,
              showConfirmButton: false,
            });
            // Optionally navigate to OTP verification page
             //navigate('/');
             navigate('/register', { state: { email } });
          } else {
            throw new Error(resultAction.payload?.error ||resultAction.payload?.otp || 'Failed to Verify OTP');
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
            <h2 className="fw-bold mb-5">Verify Your OTP</h2>
            <MDBCardBody >
            <form onSubmit={handleSubmit}>
                
            <div style={{display:"flex"}}>
                <MDBInput wrapperClass='mb-2' style={{width:"400px"}} label='Enter your OTP' id='form1' type='text' value={otp}
            onChange={(e) => setOtp(e.target.value)}/>
                <button type='button'
                onClick={buttonClick}
          className="btn btn-info  w-20"  
          style={{
            transform: 'none',
            boxShadow: 'none',
            transition: 'none',
            height :"40px"
          }}
          disabled = {loading}
        >
          {loading ? (
                <span>
                Sending<span className='dot'>.</span>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
              </span>
            ):("Resend OTP")}
        </button>
               </div>
        <button type='submit'
          className="btn btn-primary mb-4 w-100" 
          style={{
            transform: 'none',
            boxShadow: 'none',
            transition: 'none'
          }}
          disabled={loading}
        >Verify your OTP
            {/* {loading ? (
                <span>
                Sending<span className='dot'>.</span>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
                <span className='dot'>.</span>
              </span>
            ):("Verify your OTP")} */}
          
        </button>
                        <div className="text-center" >
                                      <Link  to="/loginpage"><p>Already have Account? SignIn Here</p></Link> 
                                      
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

export default VerifyRegisterOtp
