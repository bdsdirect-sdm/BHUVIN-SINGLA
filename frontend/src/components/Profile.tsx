import React, { useState, useEffect, useRef } from "react";
import "../styling/Profile.css";
import api from "../api/axiosInstance";
import Local from "../environment/env";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const fileInputRef = useRef(null);
  const token = localStorage.getItem('token');
  const [activeTab, setActiveTab] = useState<"basic" | "personal">("basic");
  const [profileData, setProfileData] = useState<any>({
    user: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      address_one: "",
      address_two: "",
      city: "",
      state: "",
      zip_code: "",
      dob: "",
      gender: "",
      martial_status: "",
      social_security: "",
      social: "",
      kids: ""

    }
  });

  const fetchProfileData = async () => {
    try {
      const response = await api.get(`${Local.GET_PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("helooooooooooooooo", response.data);
      if (response.status === 200) {
        setProfileData(response.data);
      } else {
        console.error("Failed to fetch profile data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle field input changes
  const handleInputChange = (section: string, field: string, value: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Save updated profile data
  const handleSaveChanges = async () => {
    try {
      const response = await api.post(`${Local.UPDATE_PROFILE}`, profileData.user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success(`${response.data.message}`);
      } else {
        console.error("Failed to update profile:", response.statusText);
        alert("There was an error updating your profile.");
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  const updatePhoto = async (data: any) => {
    try {
      const response = await api.post(`${Local.UPDATE_PROFILE_PHOTO}`, data, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      fetchProfileData();
      toast.success(`${response.data.message}`)
    }
    catch (err: any) {
      toast.error(`${err.response.data.message}`)
    }
  }

  function profile_photo_update(file: any) {

    const formdata = new FormData();
    formdata.append('profile_photo', file);
    updatePhoto(formdata);
  }



  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-bg-text">My Profile</div>
        {profileData.user?.profile_photo && (
          <img
            src={`${Local.BASE_URL}${profileData.user?.profile_photo}`}
            alt='User Profile'
            className='rounded-circle border'
            style={{ width: '100px', height: '100px' }}
            data-bs-toggle='dropdown'
            aria-expanded='false'
          />
        )}
        {!profileData.user?.profile_photo && (
          <img
            src={`https://api.dicebear.com/5.x/initials/svg?seed=${profileData.user?.firstname} ${profileData.user?.lastname}`}
            alt='User Profile'
            className='rounded-circle border'
            style={{ width: '100px', height: '100px' }}
            data-bs-toggle='dropdown'
            aria-expanded='false'
          />
        )}
        <div className="profile-info">
          {/* <p className="profile-text">Upload a New Photo</p> */}
          {/* <button className="change-picture-button">Change Picture</button> */}

          <button className='change-picture-button  btn btn-light h-11 w-44 ms-[32vw] mt-[-11px]' onClick={() => fileInputRef?.current?.click()} >Change Picture</button>

          <input ref={fileInputRef}
            type="file"
            accept='image/jpg, image/png, image/jpeg'
            hidden onChange={(e: any) => { profile_photo_update(e.currentTarget.files[0]) }} />


        </div>
      </div>

      <h5>Change Information</h5>

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
              <input
                type="text"
                id="firstname"
                placeholder="First Name"
                value={profileData.user.firstname}
                onChange={(e) =>
                  handleInputChange("user", "firstname", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Last Name *</label>
              <input
                type="text"
                id="lastname"
                placeholder="Last Name"
                value={profileData.user.lastname}
                onChange={(e) =>
                  handleInputChange("user", "lastname", e.target.value)
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Enter Email *</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={profileData.user.email}
                onChange={(e) =>
                  handleInputChange("user", "email", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="text"
                id="phone"
                placeholder="Phone Number"
                value={profileData.user.phone}
                onChange={(e) =>
                  handleInputChange("user", "phone", e.target.value)
                }
              />
            </div>

          </div>

          <div className="form-row">



            {/* Address Section */}
            <div className="form-group">
              <label htmlFor="addressOne">Address One *</label>
              <input
                type="text"
                id="addressOne"
                placeholder="Address One"
                value={profileData.user.address_one}
                onChange={(e) =>
                  handleInputChange("user", "address_one", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="addressTwo">Address Two</label>
              <input
                type="text"
                id="addressTwo"
                placeholder="Address Two"
                value={profileData.user.address_two}
                onChange={(e) =>
                  handleInputChange("user", "address_two", e.target.value)
                }
              />

            </div>


          </div>


          <div className="form-row">



            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                placeholder="City"
                value={profileData.user.city}
                onChange={(e) =>
                  handleInputChange("user", "city", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                placeholder="State"
                value={profileData.user.state}
                onChange={(e) =>
                  handleInputChange("user", "state", e.target.value)
                }
              />
            </div>

          </div>

          <div className="form-row">



            <div className="form-group">
              <label htmlFor="zip">Home Zip Code *</label>
              <input
                type="text"
                id="zip"
                placeholder="Zip Code"
                value={profileData.user.zip_code}
                onChange={(e) =>
                  handleInputChange("user", "zip_code", e.target.value)
                }
              />
            </div>
          </div>
        </form>
      ) : (
        <form className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">DOB *</label>
              <input
                type="date"
                id="dob"
                value={profileData.user.dob}
                onChange={(e) =>
                  handleInputChange("user", "dob", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <input
                type="text"
                id="gender"
                placeholder="Gender"
                value={profileData.user.gender}
                onChange={(e) =>
                  handleInputChange("user", "gender", e.target.value)
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="martialStatus">Marital Status</label>
              <input
                type="text"
                id="martialStatus"
                placeholder="Marital Status"
                value={profileData.user.martial_status}
                onChange={(e) =>
                  handleInputChange("user", "martial_status", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialSecurity">Social Security (Numbers only)</label>
              <input
                type="text"
                id="socialSecurity"
                placeholder="Social Security"
                value={profileData.user.social_security}
                onChange={(e) =>
                  handleInputChange(
                    "user",
                    "social_security",
                    e.target.value
                  )
                }
              />
            </div>



          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="social">Social</label>
              <input
                type="text"
                id="social"
                placeholder="FaceBook"
                value={profileData.user.social}
                onChange={(e) =>
                  handleInputChange("user", "social", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="kids">Kids (If Any)</label>
              <input
                type="number"
                id="kids"
                placeholder="Number of Kids"
                value={profileData.user.kids}
                onChange={(e) =>
                  handleInputChange("user", "kids", e.target.value)
                }
              />
            </div>
          </div>
        </form>
      )
      }

      <div className="update-button-container">
        <button onClick={handleSaveChanges} className="update-button">
          Update
        </button>
      </div>
    </div >
  );
};

export default Profile;
