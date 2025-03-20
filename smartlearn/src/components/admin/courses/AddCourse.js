import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCourses, viewCategory, viewTeachers } from '../../../redux/authSlices';

function AddCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
// fields = ['id','category','teacher','name','description','requirements','images']
        const [courseData,setCoursData] = useState({
            category:"",
            teacher:"",
            name:"",
            description:"",
            requirements:"",
            image : "",

        })

                    // Categories state from Redux
                    const { category, loading, error } = useSelector((state) => state.auth);
                    const { user, loading: teacherLoading, error: teacherError } = useSelector((state) => state.auth);
                 

                    // Fetch categories when the component mounts
                    useEffect(() => {
                        dispatch(viewCategory());
                        dispatch(viewTeachers());
                    }, [dispatch]);

                    const handleFileChange = (e) => {
                        setCoursData({ ...courseData, image: e.target.files[0] });
                      };
                    
            const handleSubmit = (e) =>{
                e.preventDefault();
                dispatch(addCourses({courseData,navigate}))
                 } 

  return (
                   
                   
                   <div style={{width:"800px",marginTop:"50px",marginLeft:"100px"}}>
                        <div><h4 style={{marginBottom:"50px"}}>Add Course</h4></div>
                        <form className="row g-3" onSubmit={handleSubmit}>




                        <div className="col-md-6">
                        <label for="inputState" className="form-label">Select Category</label>
                        <select id="inputState" className="form-select" name="gender" value={courseData.category} 
                        onChange={(e) => setCoursData({...courseData,category:e.target.value})}>
                            <option value="">Choose...</option>
                                        {loading ? (
                                        <option>Loading...</option>
                                        ) : error ? (
                                        <option>Error loading categories</option>
                                        ) : (
                                        category.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                            {cat.title}
                                            </option>    
                                            ))
                                         )}
                           
                        </select>
                        </div>

                        
                        <div className="col-md-6">
                        <label for="inputState" className="form-label">Select a Tutor</label>
                        <select id="inputState" className="form-select" name="gender" value={courseData.teacher} 
                        onChange={(e) => setCoursData({...courseData,teacher:e.target.value})}>
                            <option value="">Choose...</option>
                                        {loading ? (
                                        <option>Loading...</option>
                                        ) : error ? (
                                        <option>Error loading categories</option>
                                        ) : (
                                            Array.isArray(user) && user.length > 0 ? (
                                                user.map((userItem) => (
                                                    <option key={userItem.profile.id} value={userItem.profile.id}>
                                                        {userItem.profile.first_name} {userItem.profile.last_name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>No tutors available</option>
                                            )
                                         )}
                           
                        </select>
                        </div>

                        <div className="col-md-6">
                        <label for="inputCity" className="form-label">Name</label>
                        <input type="text" className="form-control" value={courseData.name} 
                        onChange={(e)=>setCoursData({...courseData, name:e.target.value})} id="inputCity"/>
                        </div>   
                        <div></div>    
                        <div class="col-md-6">
                    <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"  value={courseData.description}
                     onChange={(e) => setCoursData({...courseData, description:e.target.value})}></textarea>
                    </div>     

                    <div class="col-md-6">
                    <label for="exampleFormControlTextarea1" class="form-label">Requirements</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"  value={courseData.requirements}
                     onChange={(e) => setCoursData({...courseData, requirements:e.target.value})}></textarea>
                    </div>      
                    <div class="col-mb-6">
                    <label for="formFileMultiple" class="form-label">Select Image</label>
                    <input class="form-control"     name="images"
                        accept="image/jpeg,image/png,image/gif" type="file" onChange={handleFileChange} id="formFileMultiple" multiple/>
                    </div>  

                      

                        {/* 
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
                        </div> */}



                        <div className="col-10">
                        <button type="submit" className="btn btn-primary">Register</button>
                        </div>
                    </form>
                    </div>
  )
}

export default AddCourse
