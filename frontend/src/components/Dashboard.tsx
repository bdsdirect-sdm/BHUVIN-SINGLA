import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dassboard.css'; // Ensure the CSS file is named correctly
import greenImage from '../Assets/green.jpg';  // Import the image

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch user data dynamically from the backend
    const getUser = async () => {
        const response = await api.get(`${Local.GET_USER}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // Return the data from the API response
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

    // Render dynamic data in the dashboard
    return (
        <div>
            <h5>Dashboard</h5>
            <div>
                <div className="row">
                    <div className="column">
                        <div className="card">
                            <div className="card-content">
                                <div className="card-left">
                                    <img src={greenImage} alt="Green" height="25px" width="25px" />
                                    <p className="card-text">Referrals Placed</p>
                                </div>
                                <div className="card-right">
                                    <p>{data?.referCount || 0}</p> {/* Dynamically display the referral count */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="card">
                            <div className="card-content">
                                <div className="card-left">
                                    <img src={greenImage} alt="Green" height="25px" width="25px" />
                                    <p className="card-text">Referrals Completed</p>
                                </div>
                                <div className="card-right">
                                    <p>{data?.referCompleted || 0}</p> {/* Dynamically display the referrals completed */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="column">
                        <div className="card">
                            <div className="card-content">
                                <div className="card-left">
                                    <img src={greenImage} alt="Green" height="25px" width="25px" />
                                    <p className="card-text">Doctor OD/MD</p>
                                </div>
                                <div className="card-right">
                                    <p>{data?.docCount || 0}</p> {/* Dynamically display the doctor count */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="header-container">
                    <div>
                        <h6>Referral Patient</h6>
                    </div>
                    <div>
                        <button className="btn-addrefer">+ Add Referral Patient</button>
                    </div>
                </div>
            </div>
            {/* <b>Doctor Name:</b> {data?.data.user.firstname} {data?.data.user.lastname} <br /> */}
            {/* <b>Doctor Type:</b> {(data?.data.user.doctype == 2) ? "OD" : "MD"}<br /> */}
            {/* <button onClick={() => window.location.href = '/add-address'}>
                Add Address
            </button> */}
        </div>
    );
};

export default Dashboard;
