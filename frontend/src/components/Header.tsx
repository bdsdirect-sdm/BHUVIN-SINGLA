// // Header.tsx

// import React from 'react';
// import { Outlet, Link, useNavigate } from 'react-router-dom';
// import logo from '../Assets/title_logo.webp';
// import './Header.css';

// const Header: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userFirstName = localStorage.getItem("user_firstname");

//   const fullName = userFirstName ? `${userFirstName} ` : 'User';

//   return (
//     <>
//       <div className="layout">
//         {/* Sidebar */}
//         <div className="sidebar">
//           <ul className="nav-list">
//             {token && (
//               <>
//                 <li>
//                   <Link to="/dashboard" className="nav-link">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 16 16"
//                       width="20"
//                       height="20"
//                       className="nav-icon"
//                     >
//                       <path d="M2 16H5.34625V10.0578H10.6538V16H14V7L8 2.48075L2 7V16ZM0.5 17.5V6.25L8 0.605751L15.5 6.25V17.5H9.15375V11.5578H6.84625V17.5H0.5Z" fill="currentColor" />
//                     </svg>
//                     Dashboard
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/patient" className="nav-link">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 16 16"
//                       width="20"
//                       height="20"
//                       className="nav-icon"
//                     >
//                       <path d="M8 7.827C7.0375 7.827 6.21358 7.48425 5.52825 6.79875C4.84275 6.11342 4.5 5.2895 4.5 4.327C4.5 3.3645 4.84275 2.5405 5.52825 1.855C6.21358 1.16967 7.0375 0.827001 8 0.827001C8.9625 0.827001 9.78642 1.16967 10.4718 1.855C11.1573 2.5405 11.5 3.3645 11.5 4.327C11.5 5.2895 11.1573 6.11342 10.4718 6.79875C9.78642 7.48425 8.9625 7.827 8 7.827ZM8 6.327C8.55 6.327 9.02083 6.13117 9.4125 5.7395C9.80417 5.34783 10 4.877 10 4.327C10 3.777 9.80417 3.30617 9.4125 2.9145C9.02083 2.52283 8.55 2.327 8 2.327C7.45 2.327 6.97917 2.52283 6.5875 2.9145C6.19583 3.30617 6 3.777 6 4.327C6 4.877 6.19583 5.34783 6.5875 5.7395C6.97917 6.13117 7.45 6.327 8 6.327Z" fill="currentColor" />
//                     </svg>
//                     Patient
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/doctor" className="nav-link">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       width="20"
//                       height="20"
//                       className="nav-icon"
//                     >
//                       <path d="M11.4819 19.5C9.81744 19.5 8.39953 18.9163 7.22819 17.749C6.05686 16.5817 5.47119 15.1653 5.47119 13.5V12.9537C4.12119 12.7782 2.99203 12.1763 2.08369 11.148C1.17536 10.1198 0.721191 8.90383 0.721191 7.5V1.75H3.72119V0.75H5.22119V4.25H3.72119V3.25H2.22119V7.5C2.22119 8.6 2.61286 9.54167 3.39619 10.325C4.17953 11.1083 5.12119 11.5 6.22119 11.5C7.32119 11.5 8.26286 11.1083 9.04619 10.325C9.82953 9.54167 10.2212 8.6 10.2212 7.5V3.25H8.72119V4.25H7.22119V0.75H8.72119V1.75H11.7212V7.5C11.7212 8.90383 11.267 10.1198 10.3587 11.148C9.45036 12.1763 8.32119 12.7782 6.97119 12.9537V13.5C6.97119 14.75 7.40961 15.8125 8.28644 16.6875C9.16327 17.5625 10.228 18 11.4807 18Z" fill="currentColor" />
//                     </svg>
//                     Doctors
//                   </Link>
//                 </li>

//                 <li>
//                   <Link to="/chat" className="nav-link">
//                     <svg xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       width="20"
//                       height="20"
//                       className="nav-icon" >
//                       <path d="M15.35 17.6443L12.1807 14.45L13.225 13.4057L15.35 15.5307L19.6 11.2808L20.6443 12.35L15.35 17.6443ZM0.5 19.0385V2.30775C0.5 1.80258 0.675 1.375 1.025 1.025C1.375 0.675 1.80258 0.5 2.30775 0.5H17.6923C18.1974 0.5 18.625 0.675 18.975 1.025C19.325 1.375 19.5 1.80258 19.5 2.30775V9.25H18V2.30775C18 2.23075 17.9679 2.16025 17.9038 2.09625C17.8398 2.03208 17.7693 2 17.6923 2H2.30775C2.23075 2 2.16025 2.03208 2.09625 2.09625C2.03208 2.16025 2 2.23075 2 2.30775V15.3848L3.4 14H10.25V15.5H4.0385L0.5 19.0385Z" fill="currentColor" />
//                     </svg>
//                     Chat</Link></li>

//                 <li><Link to="/staff" className="nav-link">Staff</Link></li>
//                 {/* Add similar structure for other menu items */}
//               </>
//             )}
//           </ul>
//         </div>

//         {/* Main Content */}
//         <div className="main-content">
//           <header className="header">
//             <div className="container">
//               <Link to="/" className="logo">
//                 <img src={logo} alt="EyeRefer" height={50} />
//                 <b className="container-text">EYE REFER</b>
//               </Link>
//               <div className="auth-buttons">
//                 {token ? (
//                   <div className="dropdown">
//                     <button className="dropdown-toggle">Hi, {fullName}</button>
//                     <ul className="dropdown-menu">
//                       <li>
//                         <Link to="/profile" className="dropdown-item">
//                           Profile
//                         </Link>
//                       </li>
//                       <li>
//                         <a
//                           className="dropdown-item"
//                           onClick={() => {
//                             localStorage.clear();
//                             navigate("/login");
//                           }}
//                         >
//                           Logout
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                 ) : (
//                   <>
//                     <Link to="/login" className="btn btn-login">Login</Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           </header>
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Header;



import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/title_logo.webp';
import './Header.css'; // External CSS file for styles

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userFirstName = localStorage.getItem("user_firstname");
  // const userLastName = localStorage.getItem("user_lastname");


  const fullName = userFirstName ? `${userFirstName} ` : 'User'; // Fallback to 'User' if not available

  return (
    <>
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <ul className="nav-list">
            {token && (
              <>
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link to="/patient" className="nav-link">Patient</Link></li>
                {/* {doctype === "1" && (
                  <li><Link to="/appointment" className="nav-link">Appointments</Link></li>
                )} */}
                <li><Link to="/doctor" className="nav-link">Doctors</Link></li>
                <li><Link to="/chat" className="nav-link">Chat</Link></li>
                <li><Link to="/staff" className="nav-link">Staff</Link></li>
                {/* {doctype === "2" && (
                  <li><Link to="/add-patient" className="nav-link">Add Referral Patient</Link></li>
                )} */}
              </>
            )}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <header className="header">
            <div className="container">
              {/* Logo aligned to the left */}
              <Link to="/" className="logo">
                <img src={logo} alt="EyeRefer" height={50} />
                <b className='container-text'>EYE REFER</b>
              </Link>

              {/* Right Side (Hi User Dropdown) aligned to the right */}
              <div className="auth-buttons">
                {token ? (
                  <div className="dropdown">
                    <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Hi, {fullName}<br />
                      <span className="dropdown-smalltext">Welcome Back</span>
                    </button>
                    <ul className="dropdown-menu">
                      <li><Link to="/profile" className="dropdown-item">Profile</Link></li>
                      <li><Link to="/change-password" className="dropdown-item">Change Password</Link></li>
                      <li><a className="dropdown-item" onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                      }}>Logout</a></li>
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
