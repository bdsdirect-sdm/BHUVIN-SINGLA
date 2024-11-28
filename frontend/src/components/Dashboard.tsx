import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Local } from '../environment/env';
import './Dashboard.css';

import refferal_placed from '../Assets/5be148eb11e3f4de1fe4.svg';
import refferal_completed from '../Assets/77540cee2e45a0c333cd.svg';
import md from '../Assets/0685f1c668f1deb33e75.png';
import ReferralPatients from './PatientList';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Redirect to login if token is missing
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch user and referral patient data
    const getUserData = async () => {
        const response = await api.get(`${Local.GET_USER}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getUserData,
    });

    // Handle navigation to add referral
    // const handleAddReferral = () => {
    //     navigate('/add-patient');
    // };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div>Error: {error?.message || 'Failed to load data'}</div>;
    }

    return (
        <div>
            <h5>Dashboard</h5>
            <div className="row">
                <div className="column">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-left">
                                <img src={refferal_placed} alt="Referrals Placed" height="25px" width="25px" />
                                <p className="card-text">Referrals Placed</p>
                            </div>
                            <div className="card-right">
                                <p>{data?.referCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-left">
                                <img src={refferal_completed} alt="Referrals Completed" height="25px" width="25px" />
                                <p className="card-text">Referrals Completed</p>
                            </div>
                            <div className="card-right">
                                <p>{data?.referCompleted || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="column">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-left">
                                <img src={md} alt="Doctor OD/MD" height="25px" width="25px" />
                                <p className="card-text">Doctor OD/MD</p>
                            </div>
                            <div className="card-right">
                                <p>{data?.docCount || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Patient Table Section */}
            <ReferralPatients />  {/* Include ReferralPatients component here */}
        </div>
    );
};

export default Dashboard;


// import React, { useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axiosInstance';
// import { Local } from '../environment/env';
// import './Dashboard.css';

// import refferal_placed from '../Assets/5be148eb11e3f4de1fe4.svg';
// import refferal_completed from '../Assets/77540cee2e45a0c333cd.svg';
// import md from '../Assets/0685f1c668f1deb33e75.png';

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');

//     // Redirect to login if token is missing
//     useEffect(() => {
//         if (!token) {
//             navigate('/login');
//         }
//     }, [token, navigate]);

//     // Fetch user and referral patient data
//     const getUserData = async () => {
//         const response = await api.get(`${Local.GET_USER}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return response.data;
//     };

//     const { data, isError, error, isLoading } = useQuery({
//         queryKey: ['dashboard'],
//         queryFn: getUserData,
//     });

//     // Handle navigation to add referral
//     const handleAddReferral = () => {
//         navigate('/add-patient');
//     };

//     if (isLoading) {
//         return (
//             <div className="loading-container">
//                 <div>Loading...</div>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (isError) {
//         return <div>Error: {error?.message || 'Failed to load data'}</div>;
//     }

//     return (
//         <div>
//             <h5>Dashboard</h5>
//             <div className="row">
//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={refferal_placed} alt="Referrals Placed" height="25px" width="25px" />
//                                 <p className="card-text">Referrals Placed</p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{data?.referCount || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={refferal_completed} alt="Referrals Completed" height="25px" width="25px" />
//                                 <p className="card-text">Referrals Completed</p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{data?.referCompleted || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={md} alt="Doctor OD/MD" height="25px" width="25px" />
//                                 <p className="card-text">Doctor OD/MD</p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{data?.docCount || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Referral Patient Table */}
//             <div className="table-section">
//                 <div className="header-container">
//                     <h6>Referral Patient Table</h6>
//                     <button onClick={handleAddReferral} className="btn-addrefer">
//                         + Add Referral Patient
//                     </button>
//                 </div>
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Patient Name</th>
//                                 <th>DOB</th>
//                                 <th>Consult</th>
//                                 <th>Date Sent</th>
//                                 <th>Appointment Date</th>
//                                 <th>Doctor OD/MD</th>
//                                 <th>First Surgery</th>
//                                 <th>Consult Note</th>
//                                 <th>Ready To Return</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {data?.referralPatients?.length > 0 ? (
//                                 data.referralPatients.map((patient: any, index: number) => (
//                                     <tr key={index}>
//                                         <td>{patient.name}</td>
//                                         <td>{new Date(patient.dob).toLocaleDateString()}</td>
//                                         <td>{patient.consult}</td>
//                                         <td>{new Date(patient.dateSent).toLocaleDateString()}</td>
//                                         <td>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
//                                         <td>{patient.doctor}</td>
//                                         <td>
//                                             <span
//                                                 className={`status-box ${patient.firstSurgery === 'Completed'
//                                                     ? 'status-completed'
//                                                     : 'status-pending'
//                                                     }`}
//                                             >
//                                                 {patient.firstSurgery || 'Pending'}
//                                             </span>
//                                         </td>
//                                         <td>{patient.consultNote || 'N/A'}</td>
//                                         <td>{patient.readyToReturn ? 'Yes' : 'No'}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={9} className="text-center">
//                                         No referral data available.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;