import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { LIGHT_THEME } from "../../../constants/ThemeConstants";
import LogoBlue from "../../../assets/images/logo_blue.svg";
import LogoWhite from "../../../assets/images/logo_white.svg";
import { matchPath } from "react-router-dom";
import {
    MdOutlineAttachMoney,
    MdOutlineBarChart,
    MdOutlineClose,
    MdOutlineGridView,
    MdOutlineLogout,
    MdOutlinePayment,
  } from "react-icons/md";

  import { MDBAccordion, MDBAccordionItem } from 'mdb-react-ui-kit';
  import {useLocation, Link } from "react-router-dom";
  import "./Sidebar.scss"
  import { SidebarContext } from "../../../context/SidebarContext";
  import { useDispatch } from 'react-redux';
  import { logoutUser } from "../../../redux/authSlices";
  import { useNavigate } from "react-router-dom";
  
const Sidebar = () => {
    const { theme } = useContext(ThemeContext);
    const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
    const navbarRef = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    // closing the navbar when clicked outside the sidebar area
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        event.target.className !== "sidebar-oepn-btn"
      ) {
        closeSidebar();
      }
    };
  
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const handleLogout = () => {
      dispatch(logoutUser(navigate));
     // Redirect and replace history
    };
  
    return (
      <nav
        className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
        ref={navbarRef}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img src={theme === LIGHT_THEME ? LogoBlue : LogoWhite} alt="" />
            <span className="sidebar-brand-text">smartLEARN</span>
          </div>
          <button className="sidebar-close-btn"  onClick={closeSidebar}>
          <MdOutlineClose size={24} />
          </button>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-menu">
            <ul className="menu-list">
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-30px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/adminhome" className={`menu-link ${
                    location.pathname === "/admin/adminhome" ? "active" : ""
                  }`}>
                   
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={18} />
                  </span>
                  <span className="menu-link-text">Dashboard</span>
                </Link>
              </li>
             
            </ul>
          </div>


          <MDBAccordion initialActive={1}>
      <MDBAccordionItem collapseId={1} headerTitle='Student Managemnt'>
      <div className="sidebar-menu" style={{ marginRight: "-20px" }}>
            <ul className="menu-list">
              <li className="menu-item " style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/viewstudent" className={`menu-link ${
                    location.pathname === "/admin/viewstudent" ? "active" : ""
                  }`}>
                   
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={20} />
                  </span>
                  <span className="menu-link-text">View Student</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/addstudent" className={`menu-link ${
                    location.pathname === "/admin/addstudent" ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                    <MdOutlineBarChart size={20} />
                  </span>
                  <span className="menu-link-text">Add a Student</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <div to="" className={`menu-link ${
                     matchPath("/admin/student/:id", location.pathname) ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                    <MdOutlineAttachMoney size={20} />
                  </span>
                  <span className="menu-link-text">Update Student</span>
                </div>
              </li>
         
            </ul>
          </div>
      </MDBAccordionItem>
      <MDBAccordionItem collapseId={2} headerTitle='Teacher Management'>
      <div className="sidebar-menu" style={{ marginRight: "-20px" }}>
            <ul className="menu-list">
              <li className="menu-item " style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/viewteacher" className={`menu-link ${
                    location.pathname === "/admin/viewteacher" ? "active" : ""
                  }`}>
                   
                  <span className="menu-link-icon">
                  
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
                  </svg>
                </span>
                  <span className="menu-link-text">View Teachers</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/addteacher" className={`menu-link ${
                    location.pathname === "/admin/addteacher" ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                    <MdOutlineBarChart size={20} />
                  </span>
                  <span className="menu-link-text">Add a Teacher</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <div  className={`menu-link ${
                     matchPath("/admin/teacher/:id", location.pathname) ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mortarboard" viewBox="0 0 16 16">
                    <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
                    <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
                  </svg>
                  </span>
                  <span className="menu-link-text">Update a Teacher</span>
                </div>
              </li>
         
            </ul>
          </div>


      </MDBAccordionItem>
      <MDBAccordionItem collapseId={3} headerTitle='Course Management'>
        
      <div className="sidebar-menu" style={{ marginRight: "-20px" }}>
            <ul className="menu-list">



            <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/pendingcourses" className={`menu-link ${
                    location.pathname === "/admin/pendingcourses" ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stack" viewBox="0 0 16 16">
  <path d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.6.6 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.6.6 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.6.6 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535z"/>
  <path d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.6.6 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0z"/>
</svg>
                  </span>
                  <span className="menu-link-text">Pending Courses</span>
                </Link>
              </li>





              <li className="menu-item " style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/viewcategory" className={`menu-link ${
                    location.pathname === "/admin/viewcategory" ? "active" : ""
                  }`}>
                   
                  <span className="menu-link-icon">
                    <MdOutlineGridView size={20} />
                  </span>
                  <span className="menu-link-text">View Category</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/addcategory" className={`menu-link ${
                    location.pathname === "/admin/addcategory" ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags" viewBox="0 0 16 16">
  <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/>
  <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>
</svg>
                  </span>
                  <span className="menu-link-text">Add Category</span>
                </Link>
              </li>
              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/viewcourses" className={`menu-link ${
                    location.pathname === "/admin/viewcourses" || location.pathname.startsWith('/admin/viewacourse') ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window-sidebar" viewBox="0 0 16 16">
  <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
  <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v2H1V3a1 1 0 0 1 1-1zM1 13V6h4v8H2a1 1 0 0 1-1-1m5 1V6h9v7a1 1 0 0 1-1 1z"/>
</svg>
                  </span>
                  <span className="menu-link-text">View Courses</span>
                </Link>
              </li>

              

              <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <Link to="/admin/selectcourse" className={`menu-link ${
                    location.pathname === "/admin/selectcourse" || location.pathname.startsWith("/admin/viewmodule/") ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16">
  <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>
                  </span>
                  <span className="menu-link-text">Modules</span>
                </Link>
              </li>


              {/* <li className="menu-item" style={{
          width: "220px",  // Set width as per your requirement
          height: "40px",  // Adjust height as needed
          padding: "0",    // Optional: Remove padding if you want
          marginLeft: "-50px", // Align it to the left by removing any left margin
        }}>
                <div  className={`menu-link ${
                     matchPath("/admin/course/:id", location.pathname) ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16">
  <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>
                  </span>
                  <span className="menu-link-text">Update Course</span>
                </div>
              </li> */}
         
            </ul>
          </div>

      </MDBAccordionItem>
    </MDBAccordion>
  
          <div className="sidebar-menu sidebar-menu2">
            <ul className="menu-list">
            <li className="menu-item"></li>
             
              <li className="menu-item">
                <Link to="/admin/transactions"  className={`menu-link ${
                    location.pathname === "/admin/transactions" || location.pathname.startsWith("/admin/teachertransactions/") || location.pathname.startsWith("/admin/stransaction/") ? "active" : ""
                  }`}>
                  <span className="menu-link-icon">
                    <MdOutlinePayment size={20} />
                  </span>
                  <span className="menu-link-text">Transactions</span>
                </Link>
              </li>
              
              <li className="menu-item">
              <button onClick={handleLogout} className="menu-link">
                  <span className="menu-link-icon">
                    <MdOutlineLogout size={20} />
                  </span>
                  <span className="menu-link-text">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Sidebar;
  