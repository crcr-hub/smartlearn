import React, { useEffect, useState } from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentFooter from '../StudentFooter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudentProfile, updateStudentProfile } from '../../../redux/authSlices'

function ProfilePage() {
    const {profile}  = useSelector((state)=>state.auth)
    const [isEditing,setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        id:profile.id,
        first_name:"",
        last_name:"",
        gender:"",
        qualification:"",
        place:"",
        mobile:"",
    })
    

     const [originalProfileData, setOriginalProfileData] = useState({
            id : profile.id,
            first_name: '',
            last_name: '',
            place:"",
            qualification:"",
            gender:"", 
            mobile:"",
        });

    const dispatch = useDispatch()

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

    },[])

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
       
        // Here you can handle saving the updated data to the server or local state
        dispatch(updateStudentProfile(profileData));  // Use profileData directly
    dispatch(fetchStudentProfile()); 

    setOriginalProfileData(profileData);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setProfileData(originalProfileData); // Revert changes back to the original data
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
                                    <label htmlFor="firstName" className="form-label fs-6">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            value={profileData.first_name}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, first_name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.first_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.last_name}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, last_name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">Gender</label>
                                    {isEditing ? (
                                         <select id="inputState" className="form-select" name="gender" value={profileData.gender} 
                                         onChange={(e) => setProfileData({...profileData,gender:e.target.value})}>
                                         <option selected>Choose...</option>
                                         <option>Male</option>
                                         <option>Female</option>
                                         </select>
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.gender}</p>
                                    )}
                                </div>
                            </div>


                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">Place</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.place}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, place: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.place}</p>
                                    )}
                                </div>
                            </div>


                            <div className="col-md-5">
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">Qualification</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.qualification}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, qualification: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.qualification}</p>
                                    )}
                                </div>
                            </div>

                                <div className="col-md-5">
                                    <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">Mobile</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.mobile}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, mobile: e.target.value })
                                            }
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
