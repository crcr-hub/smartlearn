import React, { useEffect, useState } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorProfile, updateTProfile } from '../../../redux/authSlices';

function TeacherProfile() {
     // State to toggle between view and edit modes
     const {tprofile:teacher} = useSelector((state) =>state.auth)
     const [isEditing, setIsEditing] = useState(false);

     // State to store the profile details
     const [profileData, setProfileData] = useState({
        
            first_name: 'Something',
            last_name: 'Your Last Name',
            place :"",
            qualification:"",
            experience:"",
            experience_in:"",
            gender:"", 
     });

     const [originalProfileData, setOriginalProfileData] = useState({
        first_name: '',
        last_name: '',
        place :"",
        qualification:"",
        experience:"",
        experience_in:"",
        gender:"", 
    });

    const dispatch = useDispatch()
        
    useEffect(() => {
        dispatch(fetchTutorProfile()); // Fetch profile data on mount
    }, [])

    useEffect(()=>{
        if (teacher) {
         
            const initialProfileData = {
                first_name: teacher.first_name || '',
                last_name: teacher.last_name || '',
                place: teacher.place || "",
                gender : teacher.gender || "",
                experience : teacher.experience || "",
                experience_in : teacher.experience_in || "",
                qualification : teacher.qualification || "",
            };
            
            // Set both profileData and originalProfileData
            setProfileData(initialProfileData);
            setOriginalProfileData(initialProfileData);
        }

    },[teacher,dispatch])

    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Handle save action (or submit the edited data)
    const handleSaveClick = () => {
        setIsEditing(false);
        setOriginalProfileData(profileData);
        dispatch(updateTProfile(profileData))
        dispatch(fetchTutorProfile());
        // Here you can handle saving the updated data to the server or local state
       
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setProfileData(originalProfileData); // Revert changes back to the original data
    };
  return (
    <div className='container mt-4'>
        <div className='row'>
        <TeacherSideBar/>
        <section className='col-md-9'>
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
                                    <label htmlFor="lastName" className="form-label fs-6">Experience</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.experience}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, experience: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.experience}</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-5">
                                    <div className="form-group">
                                    <label htmlFor="lastName" className="form-label fs-6">experience_in</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            value={profileData.experience_in}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, experience_in: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <p className="form-control-static fs-6">{profileData.experience_in}</p>
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
        </section>


        </div>
    </div>
  )
}

export default TeacherProfile
