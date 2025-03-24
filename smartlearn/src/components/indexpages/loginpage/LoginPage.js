import React,{ useState } from 'react'
import side from "../../../assets/images/side.jpg"
import { useDispatch, useSelector } from 'react-redux'; 
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
  import { useNavigate } from 'react-router-dom';


  import { loginUser } from '../../../redux/authSlices';

function LoginPage() {
    const dispatch = useDispatch(); // Initialize the dispatch function to dispatch actions
  const { loading, error } = useSelector(state => state.auth);  // Get loading and error from auth state
  const navigate = useNavigate(); 

  const [email, setEmail] = useState('');  // Local state for email
  const [password, setPassword] = useState('');  // Local state for password

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the login action (you need to pass the navigate function if needed)
    dispatch(loginUser({ email, password ,navigate}));
  };

  return (
    <MDBContainer className='my-5'>
    <MDBCard>

      <MDBRow className='g-0 d-flex align-items-center'>

        <MDBCol md='4'>
          <MDBCardImage src={side} alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
        </MDBCol>
        
                    <MDBCol md='6'>
                    <div style={{ marginLeft: '100px' }} >
                    <h2 className="fw-bold mb-5">SignIn</h2>
                    <MDBCardBody >
                    <form onSubmit={handleSubmit}>
                        <MDBInput wrapperClass='mb-4' label='Email address' id='form1' type='email' value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                        <MDBInput wrapperClass='mb-4' label='Password' id='form2' type='password' value={password}
                    onChange={(e) => setPassword(e.target.value)} />

                        <div className="d-flex justify-content-between mx-4 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <a href="!#">Forgot password?</a>
                        </div>

                        {/* <MDBBtn className="mb-4 w-100"    style={{
                                                  transform: 'none',
                                                  boxShadow: 'none',
                                                  transition: 'none'
                                                }}>Sign in</MDBBtn> */}

                <button type='submit'
                  className="btn btn-primary mb-4 w-100" 
                  style={{
                    transform: 'none',
                    boxShadow: 'none',
                    transition: 'none'
                  }}
                >
                  Sign in
                </button>
                    </form>
                    </MDBCardBody>
                    </div>
                    </MDBCol>
 

      </MDBRow>

    </MDBCard>
  </MDBContainer>
  )
}

export default LoginPage
