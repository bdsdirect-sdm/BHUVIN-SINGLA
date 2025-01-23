import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            <div className="row mt-5">
                <div className="col d-flex justify-content-center">
                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
