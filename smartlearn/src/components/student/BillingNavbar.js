import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FetchCart } from '../../redux/authSlices';

function BillingNavbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
   

       const handleCancel = () => {
           navigate("/cartpage")
           // Redirect and replace history
          };
  return (
    <nav className="navbar navbar-expand-lg  bg-dark navbar-dark">
    <div className="container">
        <a className="navbar-brand" href="#">SmartLEARN</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
       
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >
           

            
            <li className="nav-item">
           
            <button type="button" className="btn btn-secondary btn-sm nav-link"  onClick={handleCancel}>Cancel</button>
           
            </li>
        
         
        </ul>
       
        </div>
    </div>
</nav>


  )
}

export default BillingNavbar
