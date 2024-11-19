// Profile.tsx

import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import greenImage from '../Assets/green.jpg';  // Import the image
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();  // Hook for navigating programmatically
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [token, navigate]);

  const getUser = async () => {
    const response = await api.get(`${Local.GET_USER}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;  // Ensure you return the correct response data
  };

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getUser,
  });

  // Show a loading state while fetching data
  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  }

  // Handle errors if the data fetching fails
  if (isError) {
    return (
      <div className="text-danger">
        <strong>Error:</strong> {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  // Handle case when data is not available or structured as expected
  if (!data || !data.user) {
    return (
      <div className="text-danger">
        <strong>Error:</strong> User data is missing or invalid.
      </div>
    );
  }

  // Destructure user data for easier access
  const { user } = data;
  console.log(user);
  // Function to handle the Edit Profile button click
  const handleEditProfileClick = () => {
    navigate('/edit-profile', { state: { user } }); // Navigate to Edit Profile page
  };

  return (
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
            <button className="btn-editprofile" onClick={handleEditProfileClick}>Edit Profile</button>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="user-details-container">
          <div className="user-details">
            <div className="user-detail-item">
              <b>Name:</b> {user.firstname} {user.lastname}
            </div>
            <div className="user-detail-item">
              <b>Gender:</b> {user.gender || 'Not Available'}
            </div>
            <div className="user-detail-item">
              <b>Phone:</b> {user.phone || 'Not Available'}
            </div>
            <div className="user-detail-item">
              <b>Email:</b> {user.email || 'Not Available'}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="user-address-container">
          <h4>Address Information</h4>

          {user.address && user.address.length > 0 ? (
            user.address.map((address: any, index: number) => (
              <div key={index}>
                <p><b>Street:</b> {address.addressLine || 'N/A'}</p>
                <p><b>City:</b> {address.city || 'N/A'}</p>
                <p><b>State:</b> {address.state || 'N/A'}</p>
                <p><b>Country:</b> {address.country || 'N/A'}</p>
              </div>
            ))
          ) : (
            <div className="sub-div">No address information available.</div>
          )}

          <Link to={'/add-address'} className="add-address">
            Add address
          </Link>

          <div>hi
            {user.Addresses.map((address: any) => (
              <>
                {address.street}<br />
                {address.state} <br />
                {address.pincode} <br /> <hr />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
