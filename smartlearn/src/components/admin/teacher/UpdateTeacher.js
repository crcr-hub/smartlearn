import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTeacher, updateTeacherData } from '../../../redux/authSlices';

function UpdateTeacher() {

    const {id} = useParams();
    console.log("id:",id)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const  {teacher:teachers,loading,error} = useSelector((state)=>state.auth) 



    const [userData,setUserData] = useState({
          username: "",
          password: "",
          password2 :"",
          email: "",
          first_name: "",
          last_name: "",
          gender: "Male",
          qualification: "",
          place: "",
          experience:"",
          experience_in:"",
    });

    useEffect(() => {
       
        if (teachers?.profile && teachers?.user) {
    
            setUserData((prevData) => ({
                ...prevData,
                
            username: teachers.user.username || '',
            email: teachers.user.email || '',
            first_name: teachers.profile.first_name || '',
            last_name: teachers.profile.last_name || '',
            gender: teachers.profile.gender || '',
            qualification: teachers.profile.qualification || '',
            experience : teachers.profile.experience || '',
            experience_in: teachers.profile.experience_in || '',
            place: teachers.profile.place || '',
         
          }));
        }
      }, [teachers]);
    
        useEffect(()=>{
            
            dispatch(fetchTeacher(id));
        },[dispatch,id]);
        console.log(teachers)
    const handleSubmit =(e) =>{
        e.preventDefault();
        const updatedData = { ...userData, username: userData.email }
        dispatch(updateTeacherData({id, updatedData ,navigate}))
    
    }
  return (
<div style={{width:"800px",marginTop:"50px",marginLeft:"100px"}}>
      <div><h4 style={{marginBottom:"50px"}}>Update Tutor</h4></div>
      {teachers?.profile && teachers?.user ? (
    <form className="row g-3"  onSubmit={handleSubmit}>
    {/* onSubmit={handleSubmit} */}
    <div className="col-md-6">
      <label for="inputCity" className="form-label" >First Name</label>
      <input type="text" className="form-control" value={userData.first_name} onChange={(e) =>setUserData({...userData,first_name:e.target.value})}  id="inputCity"/>
    </div>
    <div className="col-md-6">
      <label for="inputCity" className="form-label">Last Name</label>
      <input type="text" className="form-control" value={userData.last_name} onChange={(e) => setUserData({...userData,last_name:e.target.value})}  id="inputCity"/>
    </div>

    <div className="col-md-6">
      <label for="inputState" className="form-label">Gender</label>
      <select id="inputState" className="form-select" name="gender" onChange={(e) => setUserData({...userData,gender:e.target.value})} >
      <option selected>{userData.gender === 'Male' ? 'Male' : 'Female'}</option>
        <option>Male</option>
        <option>Female</option>
      </select>
    </div>

    <div className="col-md-6">
      <label for="inputCity" className="form-label">Qualification</label>
      <input type="text" className="form-control" onChange={(e)=> setUserData({...userData,qualification:e.target.value})} value={userData.qualification}  id="inputCity"/>
    </div>
    <div className="col-md-6">
      <label for="inputCity" className="form-label">Place</label>
      <input type="text" className="form-control" onChange={(e) => setUserData({...userData,place:e.target.value})}  value={userData.place}  id="inputCity"/>
    </div>
    <div className="col-md-6">
      <label for="inputCity" className="form-label">Experience</label>
      <input type="text" className="form-control" onChange={(e) => setUserData({...userData,experience:e.target.value})} value={userData.experience}   id="inputCity"/>
    </div>
    <div className="col-md-6">
      <label for="inputCity" className="form-label">Experience In</label>
      <input type="text" className="form-control" onChange={(e) => setUserData({...userData,experience_in:e.target.value})} value={userData.experience_in}   id="inputCity"/>
    </div>


    <div className="col-md-6">
      <label for="inputEmail4" className="form-label">Email</label>
      <input type="email" className="form-control" onChange={(e) => setUserData({...userData,email:e.target.value})} value={userData.email}  id="inputEmail4"/>
    </div>
   
   


    <div className="col-10">
      <button type="submit" className="btn btn-primary">Update</button>
    </div>
  </form>
    ) : (
        <p>Fetching Teachers data...</p>
      )}
  </div>
  )
}

export default UpdateTeacher
