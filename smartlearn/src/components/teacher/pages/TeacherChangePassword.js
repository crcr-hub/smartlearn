import React, { useState } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch } from 'react-redux'
import { changePassword, logout } from '../../../redux/authSlices'
import Swal from 'sweetalert2';


function TeacherChangePassword() {
    const dispatch = useDispatch()
     const [errors, setErrors] = useState({})
      const [passwordData, setPasswordData] = useState({
                    current_password: "",
                    new_password: "",
                    confirm_password: "",
                })


         const handleChangePassword = async () => {
                        if (passwordData.new_password !== passwordData.confirm_password) {
                            setErrors({ ...errors, password: "Passwords do not match" });
                            return;
                        }
                    
                        try {
                            const result = await dispatch(changePassword(passwordData));
                    
                            if (changePassword.fulfilled.match(result)) {
                                setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
                                setErrors({});
                    
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success!',
                                    text: 'Password changed successfully',
                                    toast: true,
                                    position: 'top-end',
                                    timer: 3000,
                                    showConfirmButton: false,
                                });
                    
                                dispatch(logout()); // Logout only after success
                            } else {
                                throw new Error(result.payload?.error || 'Failed to change password');
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
                    };
  return (
    <div className='container mt-4'>
          <div className='row'>
          <TeacherSideBar/>
          <section className='col-md-9'>
          <div className="profile-header mb-4">
                        <h2 className="text-primary">Change Password</h2>
                       
            </div>

            <div className="card p-4">
            <div className="row mb-3">
            <div className="col-md-5">
            <div className="form-group">

         

                <div className="col-md-12">
                            
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="currentPassword"
                                    value={passwordData.current_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={passwordData.confirm_password}
                                    onChange={(e) =>{ setPasswordData({ ...passwordData, confirm_password: e.target.value });
                                    setErrors({});
                                
                                }}
                                />
                            </div>
                            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                            <div className="text-center mt-4">
                                <button className="btn btn-success" onClick={handleChangePassword}>
                                    Change Password
                                </button>
                                <button className="btn btn-secondary ms-2" onClick={() => {
                                    setErrors({});
                                    setPasswordData({confirm_password:"",new_password:"",current_password:"" })
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>


            </div>
            </div>
            </div>
            </div>
          </section>
          </div>
        
    </div>
  )
}

export default TeacherChangePassword
