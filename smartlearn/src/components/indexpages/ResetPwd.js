import React, { useState } from 'react'
import side1 from "../../assets/images/side1.jpg"
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
import {  ResetPassword} from '../../redux/authSlices';
import { useDispatch } from 'react-redux';
import NavbarTop from './NavbarTop';
import Footer from './Footer';
import Swal from 'sweetalert2';

function ResetPwd() {
   const dispatch = useDispatch()
   const navigate = useNavigate()
    const [errors, setErrors] = useState({}); 
     const location = useLocation();
    const email = location.state?.email || '';
    const [userData,setUserData] = useState({
        email: email,
        password: "",
        password2 :"",})
    
    const validate = () => {
        let newErrors = {};
        if (!userData.password){ newErrors.password = "Password is required";}
        else if (userData.password.length < 6) {newErrors.password = "Password must be at least 6 characters";}
        if (userData.password !== userData.password2) newErrors.password2 = "Passwords do not match";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

      const handleSubmit = async (e) => {
                  e.preventDefault();
                  if (validate()) {
                  try {
                     
                    const resultAction = await dispatch(ResetPassword({userData}));
                    if (ResetPassword.fulfilled.match(resultAction)) {
                      Swal.fire({
                        icon: 'success',
                        text: 'SuccessFully Changed',
                        toast: true,
                        position: 'top-end',
                        timer: 3000,
                        showConfirmButton: false,
                      });

                       navigate('/loginpage');
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
                     <MDBInput wrapperClass='mb-2' label={
                                                  errors.password ? (
                                                    <span style={{ color: "red" }}>{errors.password}</span>
                                                  ) : ( "New Password")
                                                } value={userData.password} 
                          onChange={(e) => {setUserData({...userData,password:e.target.value});
                          if(errors.password){
                            setErrors({...errors,password:""})
                          }
                          }} id='form4' type='password'/>

                      <MDBInput wrapperClass='mb-2' label={
                                                  errors.password2 ? (
                                                    <span style={{ color: "red" }}>{errors.password2}</span>
                                                  ) : ( "Repeat New Password")
                                                } value={userData.password2} 
                          onChange={(e) => {setUserData({...userData,password2:e.target.value});
                          if(errors.password2){
                            setErrors({...errors,password2:""})
                          }
                          }} id='form4' type='password'/>

                   


            <button type='submit'
              className="btn btn-primary mb-4 w-100" 
              style={{
                transform: 'none',
                boxShadow: 'none',
                transition: 'none'
              }}
            >
              Submit
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

export default ResetPwd
