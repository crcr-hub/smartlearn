import React, { useState } from 'react'
import side from "../../../assets/images/side.jpg"
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRow,
    MDBCol,
  }
  from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import {  Link, useNavigate } from 'react-router-dom';
import { addStudent } from '../../../redux/authSlices';


function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [userData,setUserData] = useState({
        username: "",
        password: "",
        password2 :"",
        email: "",
        role: "student",
        first_name: "",
        last_name: "",
        gender: "",
        qualification: "",
        place: "",
        mobile :""
      })
  const [errors, setErrors] = useState({});    
  const containsHTMLTags = (input) => /<[^>]*>/.test(input);
  const validate = () => {
        let newErrors = {};
    
        if (!userData.first_name) {
          newErrors.first_name = "First name is required";}
        else if (containsHTMLTags(userData.first_name)){
          newErrors.first_name = "Invalid input (No HTML tags allowed)";

        }
        if (!userData.last_name) {newErrors.last_name = "Last name is required";}
        else if (containsHTMLTags(userData.last_name)) {
          newErrors.last_name = "Invalid input (No HTML tags allowed)";
      }
        if (userData.gender === "") newErrors.gender = "Gender is required";
        if (!userData.qualification) newErrors.qualification = "Qualification is required";
        if (!userData.place) newErrors.place = "Place is required";
        if (!userData.mobile){newErrors.mobile = "Mobile number is required";} 
        else if (!/^\d{10}$/.test(userData.mobile)){newErrors.mobile = "Mobile number must be 10 digits";} 
        
        if (!userData.email) {newErrors.email = "Email is required";}
        else if (!/\S+@\S+\.\S+/.test(userData.email)) {newErrors.email = "Enter a valid email";}
        if (!userData.password){ newErrors.password = "Password is required";}
        else if (userData.password.length < 6) {newErrors.password = "Password must be at least 6 characters";}
        if (userData.password !== userData.password2) newErrors.password2 = "Passwords do not match";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Valid if no errors
      };

  const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
          // console.log("Form Submitted", userData.email);
          // Submit the form or handle registration logic here
          // setUserData({ ...userData,username:userData.email });
          dispatch(addStudent({ userData: { ...userData, username: userData.email }, navigate }));
        }
       
        
      };
  
  return (
 <MDBContainer fluid className='my-5'>
 <form onSubmit={handleSubmit}>
      <MDBRow className='g-0 align-items-center'  style={{ marginTop: "-80px", position: "relative" }}>
        
        
      <MDBCol col='6' style={{marginTop:"-100px"}}>
          <img src={side} class="w-55 rounded-4 shadow-4" alt="" fluid/>
        </MDBCol>
        
        
        <MDBCol col='6'>

          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)',  backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-1 shadow-5 text-center' > 

              <h2 className="fw-bold mb-5">SignUp</h2>
         
              <MDBRow>
                <MDBCol col='6'>
              
                  <MDBInput wrapperClass='mb-2' label=
                            {
                              errors.first_name ? (
                                <span style={{ color: "red" }}>{errors.first_name}</span>
                              ) : (
                                "First Name"
                              )
                            }
      onChange={(e)=>{setUserData({...userData, first_name:e.target.value});
      if (errors.first_name) {
        setErrors({ ...errors, first_name: "" });
      }
      }} type='text' />
       
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.last_name ? (
                                <span style={{ color: "red" }}>{errors.last_name}</span>
                              ) : (
                                "Last Name"
                              )
                            } value={userData.last_name} 
      onChange={(e) => {setUserData({...userData,last_name:e.target.value})
                            if (errors.last_name){
                                setErrors({...errors,last_name:""})
                            }
                            
      
      }} id='form2' type='text'/>
                </MDBCol>
              </MDBRow>
              <MDBRow>
              



<MDBCol col="6">
      <div className="mb-2">
        
        <select
          id="genderSelect"
          className="form-select"
          value={userData.gender} 
      onChange={(e) => {setUserData({...userData,gender:e.target.value})
      if (errors.gender){
        setErrors({...errors,gender:""})
       }
      }} >
          <option value="">
         Choose..
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <label htmlFor="genderSelect" className="form-label">
        {
                              errors.gender ? (
                                <span style={{ color: "red" }}>{errors.gender}</span>
                              ) : (
                                "Select Gender"
                              )
                            }
        </label>
      </div>

    
    </MDBCol>



                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.qualification ? (
                                <span style={{ color: "red" }}>{errors.qualification}</span>
                              ) : ("Qualification")
                            }  value={userData.qualification}
                          onChange={(e)=> {setUserData({...userData,qualification:e.target.value});
                          if (errors.qualification){
                            setErrors({...errors,qualification:""})
                          }
                          }} id='form2' type='text'/>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.place ? (<span style={{ color: "red" }}>{errors.place}</span>
                              ) : ("Place")
                            } value={userData.place} 
      onChange={(e) => {setUserData({...userData,place:e.target.value});
      if(errors.place){
        setErrors({...errors,place:""})
      }
      }} id='form1' type='text'/>
                </MDBCol>

                <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-2' label= {
                              errors.mobile ? (<span style={{ color: "red" }}>{errors.mobile}</span>
                              ) : ("Mobile")
                            }  value={userData.mobile} 
      onChange={(e) => {setUserData({...userData, mobile:e.target.value});
      if(errors.mobile){
        setErrors({...errors,mobile:""})
      }
      }} id='form2' type='text'/>
                </MDBCol>
              </MDBRow>

              <MDBInput wrapperClass='mb-2' label= {
                              errors.email ? (
                                <span style={{ color: "red" }}>{errors.email}</span>
                              ) : ( "Email")
                            }  value={userData.email} 
      onChange={(e) => {setUserData({...userData,email:e.target.value});
      if(errors.email){
        setErrors({...errors,email:""})
      }
      }} id='form3' type='email'/>
              <MDBInput wrapperClass='mb-2' label={
                              errors.password ? (
                                <span style={{ color: "red" }}>{errors.password}</span>
                              ) : ( "Password")
                            } value={userData.password} 
      onChange={(e) => {setUserData({...userData,password:e.target.value});
      if(errors.password){
        setErrors({...errors,password:""})
      }
      }} id='form4' type='password'/>
      <MDBInput wrapperClass='mb-2' label={
                              errors.password2 ? (
                                <span style={{ color: "red" }}>{errors.password2}</span>
                              ) : ( "Repeat Password")
                            } value={userData.password2} 
      onChange={(e) => {setUserData({...userData,password2:e.target.value});
      if(errors.password2){
        setErrors({...errors,password2:""})
      }
      }} id='form4' type='password'/>

        <button className="btn btn-primary w-100 mb-2" style={{ height: '40px' }}>
          Sign Up
        </button>

              {/* <MDBBtn className='w-100 mb-2' size='md'>sign up</MDBBtn> */}

              <div className="text-center">

               <Link  to="/loginpage"><p>Already have Account? SignIn Here</p></Link> 

               

              </div>

            </MDBCardBody>
          </MDBCard>
        </MDBCol>

       

      </MDBRow>
      </form>

    </MDBContainer>
  )
}

export default RegisterPage
