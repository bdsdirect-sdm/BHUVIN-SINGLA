import { GoHome, GoHomeFill } from "react-icons/go";
import { MdOutlinePersonalInjury, MdOutlinePersonPin, MdOutlineMarkChatRead } from "react-icons/md";
import { BiBookReader } from "react-icons/bi";
import { GrGroup } from "react-icons/gr";
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import logo from "../Assets/title_logo.webp";
import "../Styling/Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userFirstName = localStorage.getItem("user_firstname");
  const doctype = localStorage.getItem("doctype"); // Retrieve doctype from local storage

  const fullName = userFirstName ? `${userFirstName}` : "User"; // Fallback to 'User' if not available

  return (
    <>
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link home-icon">
              </Link>
            </li>
            {token && (
              <>
                <li>
                  <Link to="/dashboard" className="nav-link">
                    <GoHome size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/patient" className="nav-link">
                    <MdOutlinePersonalInjury size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                    Patient
                  </Link>
                </li>
                {doctype === "1" && (
                  <li>
                    <Link to="/appointment" className="nav-link">
                      <BiBookReader size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                      Appointments
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/doctor" className="nav-link">
                    <MdOutlinePersonPin size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="nav-link">
                    <MdOutlineMarkChatRead size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                    Chat
                  </Link>
                </li>
                <li>
                  <Link to="/staff" className="nav-link">
                    <GrGroup size={20} style={{ marginRight: "8px" }} /> {/* Icon before text */}
                    Staff
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <header className="header header-color">
            <div className="container">
              <Link to="/" className="logo">
                <img src={logo} alt="EyeRefer" height={50} />
                <b className="container-text">EYE REFER</b>
              </Link>

              <div className="auth-buttons">
                {token ? (
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Hi, {fullName}
                      <br />
                      <span className="dropdown-smalltext">Welcome Back</span>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/profile" className="dropdown-item">Profile</Link>
                      </li>
                      <li>
                        <Link to="/change-password" className="dropdown-item">Change Password</Link>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                          }}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-login">Login</Link>
                    <Link to="/" className="btn btn-signup">Sign-up</Link>
                  </>
                )}
              </div>
            </div>
          </header>

          <br />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Header;




// import React from 'react';
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import logo from '../Assets/title_logo.webp';
// import './Header.css'; // External CSS file for styles

// const Header: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userFirstName = localStorage.getItem("user_firstname");
//   // const userLastName = localStorage.getItem("user_lastname");


//   const fullName = userFirstName ? `${userFirstName} ` : 'User'; // Fallback to 'User' if not available

//   return (
//     <>
//       <div className="layout">
//         {/* Sidebar */}
//         <div className="sidebar">
//           <ul className="nav-list">
//             {token && (
//               <>
//                 <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
//                 <li><Link to="/patient" className="nav-link">Patient</Link></li>
//                 {/* {doctype === "1" && (
//                   <li><Link to="/appointment" className="nav-link">Appointments</Link></li>
//                 )} */}
//                 <li><Link to="/doctor" className="nav-link">Doctors</Link></li>
//                 <li><Link to="/chat" className="nav-link">Chat</Link></li>
//                 <li><Link to="/staff" className="nav-link">Staff</Link></li>
//                 {/* {doctype === "2" && (
//                   <li><Link to="/add-patient" className="nav-link">Add Referral Patient</Link></li>
//                 )} */}
//               </>
//             )}
//           </ul>
//         </div>

//         {/* Main Content Area */}
//         <div className="main-content">
//           <header className="header">
//             <div className="container">
//               {/* Logo aligned to the left */}
//               <Link to="/" className="logo">
//                 <img src={logo} alt="EyeRefer" height={50} />
//                 <b className='container-text'>EYE REFER</b>
//               </Link>

//               {/* Right Side (Hi User Dropdown) aligned to the right */}
//               <div className="auth-buttons">
//                 {token ? (
//                   <div className="dropdown">
//                     <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//                       Hi, {fullName}<br />
//                       <span className="dropdown-smalltext">Welcome Back</span>
//                     </button>
//                     <ul className="dropdown-menu">
//                       <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
//                       <li><Link to="/change-password" className="dropdown-item">Change Password</Link></li>
//                       <li><a className="dropdown-item" onClick={() => {
//                         localStorage.clear();
//                         navigate("/login");
//                       }}>Logout</a></li>
//                     </ul>
//                   </div>
//                 ) : (
//                   <>
//                     <Link to="/login" className="btn btn-login">Login</Link>
//                     <Link to="/" className="btn btn-signup">Sign-up</Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </header>

//           <br />
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Header;
