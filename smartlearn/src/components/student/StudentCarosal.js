import React from 'react'
import image13 from "../../assets/images/image13.jpg";
import image14 from "../../assets/images/image14.jpg";
import image12 from "../../assets/images/image12.jpg";
function StudentCarosal() {
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
    <div className="carousel-indicators">
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div className="carousel-inner" >
      <div className="carousel-item active" data-bs-interval="4500">
        <img src={image13}   className="d-block w-100" alt="..." />
        <div className="carousel-caption d-none d-md-block">
          <h3>THE FUTURE BELONGS </h3>
          <p><h5>to those who learn more skills and combine them in creative ways</h5></p>
        </div>
      </div>
      <div className="carousel-item" data-bs-interval="4000">
      <img src={image14}   className="d-block w-100" alt="..." />
        <div className="carousel-caption d-none d-md-block" style={{marginBottom:"310px",backgroundColor:"red",width:"50%",marginRight:"380px"}} >
   
          <h3 style={{color:"white",fontFamily:"revert"}}> ONE OF THE MOST IMPORTANT AREAS </h3>
          <p>we can develop as professionals is competence in accessing and sharing knowledge</p>
        </div>
      </div>
      <div className="carousel-item"  data-bs-interval="4000">
      <img src={image12}   className="d-block w-100" alt="..." />
        <div className="carousel-caption d-none d-md-block" style={{marginBottom:"310px",width:"60%",marginLeft:"280px"}}>
          <h3 style={{color:"white",fontFamily:"cursive"}}>ONLINE LEARNING</h3>
          <p><h5> is not the next big thing, it is the now big thing </h5></p>
        </div>
      </div>
    </div>
    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
  )
}

export default StudentCarosal
