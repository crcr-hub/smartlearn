import React from 'react'
import NavbarTop from './NavbarTop'
import Carosel from './Carosel'
import Footer from './Footer'
import IndexCourses from './IndexCourses'


function Home() {
  return (
    <div >
        <NavbarTop/>
        <div className="container mt-2"> 
        <Carosel /></div>
        <div>
          <IndexCourses/>
      </div>
      <Footer/>
    </div>
  )
}

export default Home
