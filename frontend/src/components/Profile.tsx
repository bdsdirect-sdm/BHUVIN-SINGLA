import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import greenImage from '../Assets/green.jpg'; // Import the image
import '../Styling/Profile.css';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const getUser = async () => {
    try {
      const response = await api.get("http://localhost:4000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    console.log("Deleting address with ID:", addressId);
    try {
      const response = await api.delete(`http://localhost:4000/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:", response.data);
      toast.success("Address deleted successfully");
      refetch();
    }
    catch (error: any) {
      toast.error("Error deleting address");
      console.error("Error:", error);
    }
  };

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getUser,
  });

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="text-danger">
        <strong>Error:</strong> User data is missing or invalid.
      </div>
    );
  }

  const { user, addresses } = data;
  const addressList = addresses || [];

  const handleEditProfileClick = () => navigate('/edit-profile', { state: { user } });
  const handleAddAddressClick = () => navigate('/add-address');

  return (
    <>
      <div>
        <h5>Profile</h5>
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-info">
              <img src={greenImage} alt="Profile" className="profile-image" />
              <div>
                <b>{user.firstname} {user.lastname}</b><br />
                {user.doctype === 1 ? 'MD' : 'OD'}
              </div>
            </div>
            <div>
              <button className="btn-editprofile" onClick={handleEditProfileClick}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="user-details-container">
            <div className="user-details">
              <div className="user-detail-item"><b>Name:</b> {user.firstname} {user.lastname}</div>
              <div className="user-detail-item"><b>Gender:</b> {user.gender || 'Not Available'}</div>
              <div className="user-detail-item"><b>Phone:</b> {user.phone || 'Not Available'}</div>
              <div className="user-detail-item"><b>Email:</b> {user.email || 'Not Available'}</div>
            </div>
          </div>

          {/* Address Section */}
          <div className="user-address-container">
            <button className="add-address" onClick={handleAddAddressClick}>Add Address</button>
            <h4 className='profile-subheading'>Address Information</h4>
            {addressList.length > 0 ? (
              addressList.map((address: any, index: number) => (
                <div key={index} className="address-item">
                  <div className="address-content">
                    <p><b>Street:</b> {address.street || 'N/A'}</p>
                    <p><b>City:</b> {address.city || 'N/A'}</p>
                    <p><b>State:</b> {address.state || 'N/A'}</p>
                    <p><b>Country:</b> {address.country || 'N/A'}</p>
                  </div>
                  <button
                    className="btn-deleteaddress"
                    onClick={() => deleteAddress(address.uuid)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No addresses found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;



// import { useQuery } from '@tanstack/react-query';
// // import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import greenImage from '../Assets/green.jpg'; // Import the image
// import '../Styling/Profile.css';
// import { toast } from 'react-toastify';

// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   // Fetch user profile and addresses
//   const getUser = async () => {
//     try {
//       const response = await api.get("http://localhost:4000/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("API Response:", response.data);
//       return response.data; // Ensure correct response structure
//     } catch (error: any) {
//       console.error("Error fetching user data:", error);
//       throw error;
//     }
//   };


//   const deleteAddress = async (addressId: string) => {
//     console.log("Deleting address with ID:", addressId); // Debugging log
//     try {
//       const response = await api.delete(`http://localhost:4000/addresses/${addressId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("<<<<<<<<<Response>>>>>>>>>>>>>>>>>>>", response.data)

//       toast.success("Address deleted successfully");
//       refetch(); // Refresh data after deletion
//     } catch (error: any) {
//       toast.error("Error deleting address");
//       console.error("Error:", error);
//     }
//   };



//   const { data, isError, error, isLoading, refetch } = useQuery({
//     queryKey: ['dashboard'],
//     queryFn: getUser,
//   });

//   // Handle loading state
//   if (isLoading) {
//     return (
//       <div>
//         <p>Loading...</p>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   // Handle errors from the API
//   if (isError) {
//     return (
//       <div className="text-danger">
//         <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown Error'}
//       </div>
//     );
//   }

//   // Handle empty or malformed data
//   if (!data || !data.user) {
//     return (
//       <div className="text-danger">
//         <strong>Error:</strong> User data is missing or invalid.
//       </div>
//     );
//   }

//   // Safely destructure user data
//   const { user, addresses } = data;

//   // Handle missing addresses
//   const addressList = addresses || [];

//   const handleEditProfileClick = () => {
//     navigate('/edit-profile', { state: { user } });
//   };

//   const handleAddAddressClick = () => {
//     navigate('/add-address');
//   };

//   return (
//     <>
//       <div>
//         <h5>Profile</h5>
//         <div className="profile-container">
//           <div className="profile-header">
//             <div className="profile-info">
//               <img src={greenImage} alt="Profile" className="profile-image" />
//               <div>
//                 <b>{user.firstname} {user.lastname}</b><br />
//                 {user.doctype === 1 ? 'MD' : 'OD'}
//               </div>
//             </div>
//             <div>
//               <button className="btn-editprofile" onClick={handleEditProfileClick}>
//                 Edit Profile
//               </button>
//             </div>
//           </div>

//           {/* Profile Details Section */}
//           <div className="user-details-container">
//             <div className="user-details">
//               <div className="user-detail-item">
//                 <b>Name:</b> {user.firstname} {user.lastname}
//               </div>
//               <div className="user-detail-item">
//                 <b>Gender:</b> {user.gender || 'Not Available'}
//               </div>
//               <div className="user-detail-item">
//                 <b>Phone:</b> {user.phone || 'Not Available'}
//               </div>
//               <div className="user-detail-item">
//                 <b>Email:</b> {user.email || 'Not Available'}
//               </div>
//             </div>
//           </div>

//           {/* Address Section */}
//           <div className="user-address-container">
//             <button className="add-address" onClick={handleAddAddressClick}>
//               Add Address
//             </button>
//             <h4 className='profile-subheading'>Address Information</h4>
//             {addressList.length > 0 ? (
//               addressList.map((address: any, index: number) => (
//                 <div key={index} className="address-item">
//                   <p><b>Street:</b> {address.addressLine || 'N/A'}</p>
//                   <p><b>City:</b> {address.city || 'N/A'}</p>
//                   <p><b>State:</b> {address.state || 'N/A'}</p>
//                   <p><b>Country:</b> {address.country || 'N/A'}</p>
//                   <button
//                     className="btn-deleteaddress"
//                     onClick={() => {
//                       deleteAddress(address.uuid)
//                     }

//                     }
//                   >
//                     Delete Address
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p>No addresses found.</p>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;