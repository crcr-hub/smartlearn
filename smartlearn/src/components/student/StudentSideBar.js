import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function StudentSideBar() {
    const location = useLocation()
  return (
    <aside className='col-md-3'>
                <div className='card'>
                    <h5 className='card-header'>Messages</h5>
                    <div className='list-group list-group-flush'>
                        <Link to="/tutorlist" className={`list-group-item list-group-item-action ${
                    location.pathname === "/tutorlist" ? "active" : ""
                  }`}>My Tutors</Link>
                        <Link to="/recent_m" className={`list-group-item list-group-item-action ${
                    location.pathname === "/recent_m" ? "active" : ""
                  }`}>Rcent Messages</Link>
                        <Link to="" className={`list-group-item list-group-item-action ${
                    location.pathname === "/select" || location.pathname.startsWith("/add_module/") ? "active" : ""
                  }`} >Message</Link>
                        
                    </div>
                   
                </div>
            </aside>
  )
}

export default StudentSideBar
