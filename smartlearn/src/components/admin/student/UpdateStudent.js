import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchStudent, updateStudentData } from '../../../redux/authSlices';

function UpdateStudent() {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const  {student,loading,error} = useSelector((state)=>state.auth) 

// if (loading) return <p>Loading...</p>;
// if (error) return <p>Error: {error}</p>;
// if (!student) return <p>No student data available</p>;

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
      mobile :""
});


useEffect(() => {
    if (student?.profile && student?.user) {

        setUserData((prevData) => ({
            ...prevData,
            
        username: student.user.username || '',
        email: student.user.email || '',
        first_name: student.profile.first_name || '',
        last_name: student.profile.last_name || '',
        gender: student.profile.gender || 'Male',
        qualification: student.profile.qualification || '',
        place: student.profile.place || '',
        mobile: student.profile.mobile || '',
      }));
    }
  }, [student]);

    useEffect(()=>{
        dispatch(fetchStudent(id));
    },[dispatch,id]);

const handleSubmit =(e) =>{
    e.preventDefault();
    const updatedData = { ...userData, username: userData.email }
    dispatch(updateStudentData({id, updatedData ,navigate}))

}

  return (
<div style={{width:"800px",marginTop:"50px",marginLeft:"100px"}}>
      <div><h4 style={{marginBottom:"50px"}}>Update Your Student</h4></div>
      {student?.profile && student?.user ? (
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
      <label for="inputCity" className="form-label">Mobile</label>
      <input type="text" className="form-control" onChange={(e) => setUserData({...userData,mobile:e.target.value})} value={userData.mobile}   id="inputCity"/>
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
        <p>Fetching student data...</p>
      )}
  </div>
  )
}

export default UpdateStudent
