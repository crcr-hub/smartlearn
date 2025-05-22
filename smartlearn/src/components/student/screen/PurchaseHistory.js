import React from 'react'
import StudentNavbar from '../StudentNavbar'
import StudentFooter from '../StudentFooter'
import PurchaseHistoryPage from '../pages/PurchaseHistoryPage'

function PurchaseHistory() {
  return (
    <div>
      <StudentNavbar />
       <div className="container mt-2">  
      <PurchaseHistoryPage/>
         </div>
       <StudentFooter/>
    </div>
  )
}

export default PurchaseHistory
