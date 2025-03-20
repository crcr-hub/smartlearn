import React from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentWishlist from '../pages/StudentWishlist'
import StudentFooter from '../StudentFooter'

function StudentWishlistPage() {
  return (
    <div>
        <StudentNavbar />
       <div className="container mt-2">  <StudentWishlist /> </div>
       <StudentFooter/>
    </div>
  )
}

export default StudentWishlistPage
