import React, { useState, useEffect } from "react";
import "../styling/Profile.css";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"basic" | "personal">("basic");
  const [profileData, setProfileData] = useState<any>({
    user: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      addressOne: "",
      addressTwo: "",
      city: "",
      state: "",
      zip: "",
    },
    preference: {
      dob: "",
      gender: "",
      maritalStatus: "",
      socialSecurity: "",
      social: "",
      kids: "",
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/getprofile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProfileData({
            user: {
              firstname: data.user.firstname || "555",
              lastname: data.user.lastname || "",
              email: data.user.email || "",
              phone: data.user.phone || "",
              addressOne: data.user.addressOne || "",
              addressTwo: data.user.addressTwo || "",
              city: data.user.city || "",
              state: data.user.state || "",
              zip: data.user.zip || "",
            },
            preference: {
              dob: data.preference.dob || "",
              gender: data.preference.gender || "",
              maritalStatus: data.preference.maritalStatus || "",
              socialSecurity: data.preference.socialSecurity || "",
              // social: data.preference.social || "",
              // kids: data.preference.kids || "",
            },
          });
        } else {
          console.error("Failed to fetch profile data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (section: string, field: string, value: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/updateprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        console.error("Failed to update profile:", data.message);
        alert("There was an error updating your profile.");
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-bg-text">My Profile</div>
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <p className="profile-text">Upload a New Photo</p>
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
                <label htmlFor="phone">Mobile Number *</label>
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
              <div className="form-group">
                <label htmlFor="addressOne">Address One *</label>
                <input
                  type="text"
                  id="addressOne"
                  placeholder="Address One"
                  value={profileData.user.addressOne}
                  onChange={(e) =>
                    handleInputChange("user", "addressOne", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressTwo">Address Two</label>
                <input
                  type="text"
                  id="addressTwo"
                  placeholder="Address Two"
                  value={profileData.user.addressTwo}
                  onChange={(e) =>
                    handleInputChange("user", "addressTwo", e.target.value)
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
                  value={profileData.user.zip}
                  onChange={(e) =>
                    handleInputChange("user", "zip", e.target.value)
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
                  value={profileData.preference.dob}
                  onChange={(e) =>
                    handleInputChange("preference", "dob", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <input
                  type="text"
                  id="gender"
                  placeholder="Gender"
                  value={profileData.preference.gender}
                  onChange={(e) =>
                    handleInputChange("preference", "gender", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maritalStatus">Marital Status</label>
                <input
                  type="text"
                  id="maritalStatus"
                  placeholder="Married"
                  value={profileData.preference.maritalStatus}
                  onChange={(e) =>
                    handleInputChange("preference", "maritalStatus", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="socialSecurity">
                  Social Security (Numbers Only)
                </label>
                <input
                  type="text"
                  id="socialSecurity"
                  placeholder="Social Security"
                  value={profileData.preference.socialSecurity}
                  onChange={(e) =>
                    handleInputChange("preference", "socialSecurity", e.target.value)
                  }
                />
              </div>
            </div>
          </form>
        )}

        <div className="update-button-container">
          <button onClick={handleSaveChanges} className="update-button">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;



// import React, { useState } from "react";
// import "../styling/Profile.css";

// const Profile: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<"basic" | "personal">("basic");

//   return (
//     <div className="profile-container">
//       {/* Header Section */}
//       <div className="profile-header">
//         <div className="profile-bg-text">My Profile</div>
//         <img
//           src="https://via.placeholder.com/100"
//           alt="Profile"
//           className="profile-image"
//         />
//         <div className="profile-info">
//           <p className="profile-text">Upload a New Photo</p>
//           <button className="change-picture-button">Change Picture</button>
//         </div>
//       </div>


//       <h5>Change Information</h5>

//       {/* Form Section */}
//       <div className="form-section">


//         {/* Tabs */}
//         <div className="tabs">
//           <button
//             className={`tab ${activeTab === "basic" ? "active" : ""}`}
//             onClick={() => setActiveTab("basic")}
//           >
//             Basic Details
//           </button>
//           <button
//             className={`tab ${activeTab === "personal" ? "active" : ""}`}
//             onClick={() => setActiveTab("personal")}
//           >
//             Personal Details
//           </button>
//         </div>

//         {/* Form */}
//         {activeTab === "basic" ? (
//           <form className="profile-form">
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="firstname">First Name *</label>
//                 <input type="text" id="firstname" placeholder="First Name" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="lastname">Last Name *</label>
//                 <input type="text" id="lastname" placeholder="Last Name" />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="email">Enter Email *</label>
//                 <input type="email" id="email" placeholder="Email" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="phone">Mobile Number *</label>
//                 <input type="text" id="phone" placeholder="Phone Number" />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="addressOne">Address One *</label>
//                 <input type="text" id="addressOne" placeholder="Address One" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="addressTwo">Address Two</label>
//                 <input type="text" id="addressTwo" placeholder="Address Two" />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="city">City *</label>
//                 <input type="text" id="city" placeholder="City" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="state">State *</label>
//                 <input type="text" id="state" placeholder="State" />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="zip">Home Zip Code *</label>
//                 <input type="text" id="zip" placeholder="Zip Code" />
//               </div>
//             </div>

//             <div className="update-button-container">
//               <button className="update-button" type="submit">
//                 Update
//               </button>
//             </div>

//           </form>
//         ) : (
//           <form className="profile-form">
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="dob">DOB *</label>
//                 <input type="date" id="dob" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="gender">Gender *</label>
//                 <input type="text" id="gender" placeholder="Gender" />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="maritalStatus">Marital Status</label>
//                 <input type="text" id="maritalStatus" placeholder="Married" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="socialSecurity">
//                   Social Security (Numbers Only)
//                 </label>
//                 <input
//                   type="text"
//                   id="socialSecurity"
//                   placeholder="Social Security"
//                 />
//               </div>
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="social">Social</label>
//                 <input type="text" id="social" placeholder="Facebook" />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="kids">Kids (If Any)</label>
//                 <input type="number" id="kids" placeholder="1" />
//               </div>
//             </div>

//             <div className="update-button-container">
//               <button className="update-button" type="submit">
//                 Update
//               </button>
//             </div>

//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;
