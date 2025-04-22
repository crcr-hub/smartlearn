import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function TeacherSideBar() {
    const location = useLocation()
  return (

            
        <aside className='col-md-2'>
                <div className='card'>
                    <h5 className='card-header'>Dashboard</h5>
                    <div className='list-group list-group-flush'>
                    <Link to="/tutordashboard" className={`list-group-item list-group-item-action ${
                    location.pathname === "/tutordashboard" ? "active" : ""
                  }`}>Dashboard</Link>
                        <Link to="/mycourse" className={`list-group-item list-group-item-action ${
                    location.pathname === "/mycourse" ? "active" : ""
                  }`}>MyCourses</Link>
                        <Link to="/teacheraddcourse" className={`list-group-item list-group-item-action ${
                    location.pathname === "/teacheraddcourse" ? "active" : ""
                  }`}>Add a Course</Link>
                        <Link to="/select" className={`list-group-item list-group-item-action ${
                    location.pathname === "/select" || location.pathname.startsWith("/add_module/") ? "active" : ""
                  }`} >Modules</Link>
                        <Link to="/teacherprofile" className={`list-group-item list-group-item-action ${
                    location.pathname === "/teacherprofile" ? "active" : ""
                  }`}>Profile settings</Link>
                        <Link to="" className='list-group-item list-group-item-action'>Change Password</Link>
                        
                        <Link to="/liststudent" className={`list-group-item list-group-item-action ${
                    location.pathname === "/liststudent" ? "active" : ""
                  }`}>List Your Students</Link>
                        <Link to="/tutrecent_m" className={`list-group-item list-group-item-action ${
                    location.pathname === "/tutrecent_m" ? "active" : "" }`}>Recent Messages</Link>
                    
                    <Link to="/teacherTransactions" className={`list-group-item list-group-item-action ${
                    location.pathname === "/teacherTransactions" ? "active" : "" }`}>Transactions</Link>
                    </div>
                   
                </div>
            </aside>
               
       
  )
}

export default TeacherSideBar
