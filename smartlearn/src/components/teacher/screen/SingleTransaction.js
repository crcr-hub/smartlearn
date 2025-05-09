import React from 'react'
import TeacherNavbar from '../TeacherNavbar'
import Footer from '../../indexpages/Footer'
import SingleTransactionPage from '../pages/SingleTransactionPage'

function SingleTransaction() {
  return (
    <div>
       <TeacherNavbar/>
       <SingleTransactionPage/>
            <div style={{marginTop:"50px"}}>
            <Footer/></div>
    </div>
  )
}

export default SingleTransaction
