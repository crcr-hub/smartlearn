import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTeacher } from '../../../redux/authSlices';

function AddTeacher() {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [userData,setUserData] = useState({
      username: "",
      password: "",
      password2 :"",
      email: "",
      role: "teacher",
      first_name: "",
      last_name: "",
      gender: "",
      qualification: "",
      place: "",
      mobile :"",
      experience :"",
      experience_in :"",
    })

    const handleChange = (e) => {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setUserData({ ...userData,username:userData.email });
      dispatch(addTeacher({ userData: userData, navigate }));
      
    };
  return (
                        <div style={{width:"800px",marginTop:"50px",marginLeft:"100px"}}>
                        <div><h4 style={{marginBottom:"50px"}}>Register Tutor</h4></div>
                    <form className="row g-3" onSubmit={handleSubmit}>

                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">First Name</label>
                        <input type="text" className="form-control" value={userData.first_name} 
                        onChange={(e)=>setUserData({...userData, first_name:e.target.value})} id="inputCity"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Last Name</label>
                        <input type="text" className="form-control" value={userData.last_name} 
                        onChange={(e) => setUserData({...userData,last_name:e.target.value})} id="inputCity"/>
                    </div>

                    <div className="col-md-6">
                        <label for="inputState" className="form-label">Gender</label>
                        <select id="inputState" className="form-select" name="gender" value={userData.gender} 
                        onChange={(e) => setUserData({...userData,gender:e.target.value})}>
                        <option selected>Choose...</option>
                        <option>Male</option>
                        <option>Female</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Qualification</label>
                        <input type="text" className="form-control" value={userData.qualification}
                        onChange={(e)=> setUserData({...userData,qualification:e.target.value})} id="inputCity"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Experience</label>
                        <input type="text" className="form-control" value={userData.experience}
                        onChange={(e)=> setUserData({...userData,experience:e.target.value})} id="inputCity"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Experience in</label>
                        <input type="text" className="form-control" value={userData.experience_in}
                        onChange={(e)=> setUserData({...userData,experience_in:e.target.value})} id="inputCity"/>
                    </div>

                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Place</label>
                        <input type="text" className="form-control" value={userData.place} 
                        onChange={(e) => setUserData({...userData,place:e.target.value})} id="inputCity"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputCity" className="form-label">Mobile</label>
                        <input type="text" className="form-control" value={userData.mobile} 
                        onChange={(e) => setUserData({...userData, mobile:e.target.value})} id="inputCity"/>
                    </div>

                    <div className="col-md-6">
                        <label for="inputEmail4" className="form-label">Email</label>
                        <input type="email" className="form-control" value={userData.email} 
                        onChange={(e) => setUserData({...userData,email:e.target.value})} id="inputEmail4"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputPassword4" className="form-label">Password</label>
                        <input type="password" className="form-control" value={userData.password} 
                        onChange={(e) => setUserData({...userData,password:e.target.value})} id="inputPassword4"/>
                    </div>
                    <div className="col-md-6">
                        <label for="inputPassword4" className="form-label">Repeat Password</label>
                        <input type="password" className="form-control" value={userData.password2} 
                        onChange={(e) => setUserData({...userData,password2:e.target.value})} id="inputPassword4"/>
                    </div>



                    <div className="col-10">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                    </form>
                    </div>
  )
}

export default AddTeacher
