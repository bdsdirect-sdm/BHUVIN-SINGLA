import React, { useState } from "react";
import "../styling/Profile.css";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "personal">("basic");

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-image"
        />
        <div>
          <p>Upload a New Photo</p>
          <button className="change-picture-button">Change Picture</button>
        </div>
      </div>

      <h5>Change Information</h5>

      {/* Form Section */}
      <div className="form-section">


        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Details
          </button>
          <button
            className={`tab ${activeTab === "personal" ? "active" : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Details
          </button>
        </div>

        {/* Form */}
        {activeTab === "basic" ? (
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name *</label>
                <input type="text" id="firstname" placeholder="First Name" />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name *</label>
                <input type="text" id="lastname" placeholder="Last Name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Enter Email *</label>
                <input type="email" id="email" placeholder="Email" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Mobile Number *</label>
                <input type="text" id="phone" placeholder="Phone Number" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="addressOne">Address One *</label>
                <input type="text" id="addressOne" placeholder="Address One" />
              </div>
              <div className="form-group">
                <label htmlFor="addressTwo">Address Two</label>
                <input type="text" id="addressTwo" placeholder="Address Two" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input type="text" id="city" placeholder="City" />
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input type="text" id="state" placeholder="State" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zip">Home Zip Code *</label>
                <input type="text" id="zip" placeholder="Zip Code" />
              </div>
            </div>

            <div className="update-button-container">
              <button className="update-button" type="submit">
                Update
              </button>
            </div>

          </form>
        ) : (
          <form className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">DOB *</label>
                <input type="date" id="dob" />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <input type="text" id="gender" placeholder="Gender" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maritalStatus">Marital Status</label>
                <input type="text" id="maritalStatus" placeholder="Married" />
              </div>
              <div className="form-group">
                <label htmlFor="socialSecurity">
                  Social Security (Numbers Only)
                </label>
                <input
                  type="text"
                  id="socialSecurity"
                  placeholder="Social Security"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="social">Social</label>
                <input type="text" id="social" placeholder="Facebook" />
              </div>
              <div className="form-group">
                <label htmlFor="kids">Kids (If Any)</label>
                <input type="number" id="kids" placeholder="1" />
              </div>
            </div>

            <div className="update-button-container">
              <button className="update-button" type="submit">
                Update
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
