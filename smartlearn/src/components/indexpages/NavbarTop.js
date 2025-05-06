import React, { useEffect } from 'react'
import { Link} from 'react-router-dom'
import './NavbarTop.css';
import { useDispatch } from 'react-redux';
import { viewCategory } from '../../redux/authSlices';
import { useSelector } from 'react-redux';

function NavbarTop() {

    const dispatch = useDispatch()

    const {  category:categories} = useSelector((state) => state.auth);
    
    useEffect (()=>{
         dispatch (viewCategory());},[dispatch])
       

    const categoryArray = Array.isArray(categories) ? categories : [];
  return (
          
    <nav className="navbar navbar-expand-lg  bg-dark navbar-dark">
    <div className="container">
        <Link to="/" className="navbar-brand">SmartLEARN</Link>
        <div className="dropdown">
            <Link to="/" className="navbar-item me-3">Explore</Link>
                <div className="dropdown-menu">
                {categoryArray.map((category) => ( 
                

                    <div className="dropdown-item">
                    <span className="submenu-title">
                        <Link className="dropdowns-item" style={{textDecoration:"none"}}>{category.title}</Link></span>
                    <div className="submenu">
                        <Link to="" className="submenu-item">Option 1 Sub 1</Link>
                        <Link to="" className="submenu-item">Option 1 Sub 2</Link>
                        <Link to="" className="submenu-item">Option 1 Sub 3</Link>
                    </div>
                    </div>
                    
                ))}
                </div>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <form className="d-flex" role="search">
            <input className="form-control me-2 " style={{ width: '400px ' }} type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0"   >

        <li className="nav-item">
            <Link to='/teacherregister' className="nav-link " aria-current="page" >
            Teach on SmartLEARN
            </Link>
            </li>
            
            <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            </Link>
            </li>

           




            <li className="nav-item">
            <Link className="nav-link" to="/loginpage">
            <button type="button" className="btn btn-outline-secondary btn-sm">LogIn</button>
            </Link>




            
            </li>
            <li className="nav-item">
            <Link className="nav-link" to="/register">
            <button type="button" className="btn btn-secondary btn-sm">SignUp</button>
            </Link>
            </li>
           
           
        </ul>
       
        </div>
    </div>
</nav>



  )
}

export default NavbarTop
