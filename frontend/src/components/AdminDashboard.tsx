import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styling/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard Overview</h1>

            {/* Cards Section */}
            <div className="dashboard-row">
                <div className="dashboard-card">
                    <h2 className="card-title">Total Users</h2>
                    <p className="card-value">29</p>
                </div>
                <div className="dashboard-card">
                    <h2 className="card-title">Active Users</h2>
                    <p className="card-value">25</p>
                </div>
                <div className="dashboard-card">
                    <h2 className="card-title">Inactive Users</h2>
                    <p className="card-value">4</p>
                </div>
                <div className="dashboard-card">
                    <h2 className="card-title">Total Waves</h2>
                    <p className="card-value">125</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="table-container">
                <h2 className="table-title">Manage Users List</h2>
                <input
                    type="text"
                    className="table-search"
                    placeholder="Search with name, email, accesscode"
                />
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>shubhamtestref reftest</td>
                            <td>shubhamtestref@mailinator.com</td>
                            <td>9859856523</td>
                            <td>
                                <input type="checkbox" checked readOnly />
                            </td>
                            <td>
                                <span className="action-icons">👁️ ✏️ 🗑️</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>nitin dalakoti</td>
                            <td>nitin@yopmail.com</td>
                            <td>9859856523</td>
                            <td>
                                <input type="checkbox" checked readOnly />
                            </td>
                            <td>
                                <span className="action-icons">👁️ ✏️ 🗑️</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>shubham garg</td>
                            <td>garg@yopmail.com</td>
                            <td>9859856523</td>
                            <td>
                                <input type="checkbox" checked readOnly />
                            </td>
                            <td>
                                <span className="action-icons">👁️ ✏️ 🗑️</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>afzal hujki</td>
                            <td>afzalt6est@yopmail.com</td>
                            <td>9859856523</td>
                            <td>
                                <input type="checkbox" checked readOnly />
                            </td>
                            <td>
                                <span className="action-icons">👁️ ✏️ 🗑️</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Logout Button */}
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
