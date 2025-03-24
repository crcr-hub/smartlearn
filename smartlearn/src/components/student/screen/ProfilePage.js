import React, { useEffect, useState } from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentFooter from '../StudentFooter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentProfile, updateStudentProfile } from '../../../redux/authSlices'

function ProfilePage() {
    const {profile}  = useSelector((state)=>state.auth)
    const [isEditing,setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        id: profile?.id || '',
        first_name:"",
        last_name:"",
        gender:"",
        qualification:"",
        place:"",
        mobile:"",
    })
    

     const [originalProfileData, setOriginalProfileData] = useState({
            id: profile?.id || '',
            first_name: '',
            last_name: '',
            place:"",
            qualification:"",
            gender:"", 
            mobile:"",
        });

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchStudentProfile()); // Fetch profile data on mount
    }, []);

    console.log("profilesssss",profile)

    useEffect(()=>{
        if(profile){
            const initialProfileData = {
                id : profile.id || '',
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                place: profile.place || "",
                gender : profile.gender || "",
                qualification : profile.qualification || "",
                mobile:profile.mobile || "",
            };

            setProfileData(initialProfileData);
            setOriginalProfileData(initialProfileData);
        }

    },[profile])

    const handleEditClick = () => {
        setIsEditing(true);
    };

     const [errors, setErrors] = useState({});    
      const containsHTMLTags = (input) => /<[^>]*>/.test(input);
      const validate = () => {
            let newErrors = {};
        
            if (!profileData.first_name) {
              newErrors.first_name = "First name is required";}
            else if (containsHTMLTags(profileData.first_name)){
              newErrors.first_name = "Invalid input (No HTML tags allowed)";
    
            }
            if (!profileData.last_name) {newErrors.last_name = "Last name is required";}
            else if (containsHTMLTags(profileData.last_name)) {
              newErrors.last_name = "Invalid input (No HTML tags allowed)";
          }
            if (profileData.gender === "") newErrors.gender = "Gender is required";
            if (!profileData.qualification) newErrors.qualification = "Qualification is required";
            if (!profileData.place) newErrors.place = "Place is required";
            if (!profileData.mobile){newErrors.mobile = "Mobile number is required";} 
            else if (!/^\d{10}$/.test(profileData.mobile)){newErrors.mobile = "Mobile number must be 10 digits";} 
           
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0; // Valid if no errors
          };

    const handleSaveClick = () => {
       
       if (validate()){
        setIsEditing(false);
        dispatch(updateStudentProfile(profileData));  // Use profileData directly
        dispatch(fetchStudentProfile()); 

        setOriginalProfileData(profileData);
    }
        // Here you can handle saving the updated data to the server or local state
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setProfileData(originalProfileData); // Revert changes back to the original data
        setErrors({})
    };
  return (
    <div>
        <StudentNavbar />
       <div className="container mt-2">  
       <div className="profile-header mb-4">
        <h2 className="text-primary">Profile</h2>
        <p className="text-muted">View and update your profile details</p>
    </div>
    <div className="card p-4">
                        <div className="row mb-3">
                            {/* First Name */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    
                                {/* <MDBCol col='6'>
              
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
   
            </MDBCol> */}
                                    
                                    
                                    <label htmlFor="firstName" className="form-label fs-6">

                                    {
                              errors.first_name ? (
                                <span style={{ color: "red" }}>{errors.first_name}</span>
                              ) : (
                                "First Name"
                              )
                            }

                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={profileData.first_name}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, first_name: e.target.value });
                                                if (errors.first_name) {
                                                    setErrors({ ...errors, first_name: "" });
                                                  }
                                            }}
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.first_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.last_name ? (
                                <span style={{ color: "red" }}>{errors.last_name}</span>
                              ) : (
                                "Last Name"
                              )
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.last_name}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, last_name: e.target.value });
                                                if (errors.last_name){
                                                    setErrors({...errors,last_name:""})
                                                }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.gender ? (
                                <span style={{ color: "red" }}>{errors.gender}</span>
                              ) : ( "Gender")
                            }
                                    </label>
                                    {isEditing ? (
                                         <select id="inputState" className="form-select" name="gender" value={profileData.gender} 
                                         onChange={(e) => {setProfileData({...profileData,gender:e.target.value});
                                         if (errors.gender){
                                            setErrors({...errors,gender:""})
                                           }
                                         }}>
                                         <option value="">Choose...</option>
                                         <option value="Male">Male</option>
                                         <option value="Female">Female</option>
                                         </select>
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.gender}</p>
                                    )}
                                </div>
                            </div>


                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">

                                    {
                              errors.place ? (<span style={{ color: "red" }}>{errors.place}</span>
                              ) : ("Place")
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.place}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, place: e.target.value });
                                                if(errors.place){
                                                    setErrors({...errors,place:""})
                                                  }
                                            } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.place}</p>
                                    )}
                                </div>
                            </div>


                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.qualification ? (
                                <span style={{ color: "red" }}>{errors.qualification}</span>
                              ) : ("Qualification")
                            } 
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.qualification}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, qualification: e.target.value });
                                                if (errors.qualification){
                                                    setErrors({...errors,qualification:""})
                                                  }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.qualification}</p>
                                    )}
                                </div>
                            </div>

                                <div className="col-md-5">
                                    <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">
                                    {
                              errors.mobile ? (<span style={{ color: "red" }}>{errors.mobile}</span>
                              ) : ("Mobile")
                            }
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.mobile}
                                            onChange={(e) =>{
                                                setProfileData({ ...profileData, mobile: e.target.value });
                                                if(errors.mobile){
                                                    setErrors({...errors,mobile:""})
                                                  }
                                           } }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.mobile}</p>
                                    )}
                                </div>
                            </div>
                            


                        </div>

                        {/* Edit/Save button */}
                        {/* Edit/Save/Cancel button */}
                        <div className="text-center mt-4">
                            {isEditing ? (
                                <>
                                    <button className="btn btn-success" onClick={handleSaveClick}>
                                        Save Changes
                                    </button>
                                    <button className="btn btn-secondary ms-2" onClick={handleCancelClick}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={handleEditClick}>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>


         </div>
       <StudentFooter/>
    </div>
  )
}

export default ProfilePage
