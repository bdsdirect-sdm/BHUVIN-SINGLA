import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import greenImage from '../Assets/green.jpg';  // Import the image
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const getUser = async () => {
    const response = await api.get(`${Local.GET_USER}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  };

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getUser,
  });

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

  if (isError) {
    return (
      <>
        <div>Error: {error.message}</div>
      </>
    );
  }

  return (
    <div>
      <h5>Profile</h5>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <img src={greenImage} alt="Profile" className="profile-image" />
            <div>
              <b>{data?.data.user.firstname}</b><br />
              {data?.data.user.doctype === 1 ? 'md' : 'od'}
            </div>
          </div>
          <div>
            <button className="btn-editprofile">Edit Profile</button>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="user-details-container">
          <div className="user-details">
            <div className="user-detail-item">
              <b>Name:</b> {data?.data.user.lastname}
            </div>
            <div className="user-detail-item">
              <b>Gender:</b> {data?.data.user.gender}
            </div>
            <div className="user-detail-item">
              <b>Phone:</b> {data?.data.user.phone}
            </div>
            <div className="user-detail-item">
              <b>Email:</b> {data?.data.user.email}
            </div>
          </div>
        </div>

        <div>
          <h6>Address Information</h6>

        </div>

      </div>
    </div>
  );
};

export default Profile;
