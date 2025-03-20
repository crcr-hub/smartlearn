import React from 'react'
import BillingNavbar from '../BillingNavbar'
import BillingDetails from '../pages/BillingDetails'

function BillingDetailsPage() {
  return (
    <div>
      <BillingNavbar/>
      <div className="container mt-2">  <BillingDetails/> </div>
     
    </div>
  )
}

export default BillingDetailsPage
