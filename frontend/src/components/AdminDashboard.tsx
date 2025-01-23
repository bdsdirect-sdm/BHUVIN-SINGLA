import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/AdminDashboard.css'

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user token and navigate to login page
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate('/admin/login'); // Redirect to login page
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <h1 className="text-center">Welcome to the Admin Dashboard</h1>
                    <p className="text-center">Manage your platform settings and view analytics here.</p>
                </div>
            </div>

            {/* Four boxes in one line */}
            <div className="row mt-5">
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-header">Total Users</div>
                        <div className="card-body">
                            <h5 className="card-title">1000</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-header">Active Users</div>
                        <div className="card-body">
                            <h5 className="card-title">800</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-header">Inactive Users</div>
                        <div className="card-body">
                            <h5 className="card-title">200</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-header">Total Waves</div>
                        <div className="card-body">
                            <h5 className="card-title">50</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout button */}
            <div className="row mt-5">
                <div className="col d-flex justify-content-center">
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
