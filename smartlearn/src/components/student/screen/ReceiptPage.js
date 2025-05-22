import React from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentFooter from '../StudentFooter'
import Receipt from '../pages/Receipt'

function ReceiptPage() {
  return (
    <div>
      <StudentNavbar/>
      <div className="container mt-2">
        <Receipt/>
      </div>
      <StudentFooter/>
    </div>
  )
}

export default ReceiptPage
