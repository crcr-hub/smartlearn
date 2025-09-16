import React , { useState } from 'react'
import side1 from "../../../assets/images/side1.jpg"
import "./dot.css"
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
import { Link, useNavigate } from 'react-router-dom';
import {  registerOtp } from '../../../redux/authSlices';
import { useDispatch} from 'react-redux';
import NavbarTop from '../NavbarTop';
import Footer from '../Footer';
import Swal from 'sweetalert2';

function GetOtp() {
     const dispatch = useDispatch(); // Initialize the dispatch function to dispatch actions
        const navigate = useNavigate(); 
        const [email, setEmail] = useState('');
        const [loading, setLoading] = useState(false);
      
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true)
            try {
              const resultAction = await dispatch(registerOtp({ email }));
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
                
                navigate('/verifyregisterotp', { state: { email } });
              } else {
                throw new Error(resultAction.payload?.email || 'Failed to send OTP');
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
                    <h2 className="fw-bold mb-5">Register</h2>
                    <MDBCardBody >
                    <form onSubmit={handleSubmit}>
                        <MDBInput wrapperClass='mb-4' label='Enter Email address' id='form1' type='email' value={email}
                    onChange={(e) => setEmail(e.target.value)}/>

                <button type='submit'
                  className="btn btn-primary mb-4 w-100" 
                  style={{
                    transform: 'none',
                    boxShadow: 'none',
                    transition: 'none'
                  }}
                  disabled={loading}
                >{loading ?(
                  <span>
                    Sending<span className='dot'>.</span>
                    <span className='dot'>.</span>
                    <span className='dot'>.</span>
                    <span className='dot'>.</span>
                  </span>
                ): ("Get OTP")}
                  
                </button>
                                <div className="text-center" >
                                               <Link  to="/loginpage"><p>Already have an Account? Login Here</p></Link> 
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

export default GetOtp
