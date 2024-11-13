import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import logo from '../Assets/title_logo.webp';
import './Header.css'; // External CSS file for styles

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype: any = localStorage.getItem("doctype");
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
                {doctype === "1" && (
                  <li><Link to="/appointment" className="nav-link">Appointments</Link></li>
                )}
                <li><Link to="/doctor" className="nav-link">Doctors</Link></li>
                <li><Link to="/chat" className="nav-link">Chat</Link></li>
                <li><Link to="/staff" className="nav-link">Staff</Link></li>
                {doctype === "2" && (
                  <li><Link to="/add-patient" className="nav-link">Add Referral Patient</Link></li>
                )}
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
