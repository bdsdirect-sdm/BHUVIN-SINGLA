// // Dashboard.tsx

// import { useQuery } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';
// import refferal_placed from '../Assets/5be148eb11e3f4de1fe4.svg';
// import refferal_completed from '../Assets/77540cee2e45a0c333cd.svg';
// import md from '../Assets/0685f1c668f1deb33e75.png';

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//     useEffect(() => {
//         if (!token) {
//             navigate("/login");
//         }
//     }, [token, navigate]);

//     // Fetch user data dynamically from the backend
//     const getUser = async () => {
//         const response = await api.get(`${Local.GET_USER}`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
//         return response.data; // Return the data from the API response
//     };

//     const { data, isError, error, isLoading } = useQuery({
//         queryKey: ['dashboard'],
//         queryFn: getUser,
//     });

//     const referralPatients = [
//         {
//             name: 'Abel Brenda',
//             dob: 'June-05-1990',
//             consult: 'Cataract',
//             dateSent: 'Apr-01-2024',
//             appointmentDate: 'June-01-2024',
//             doctor: 'Hal Brenda',
//             firstSurgery: 'Completed',
//             consultNote: 'Yes',
//             readyToReturn: 'Yes',
//         },
//         {
//             name: 'Bennet De',
//             dob: 'Apr-06-1984',
//             consult: 'Medical',
//             dateSent: 'Apr-01-2024',
//             appointmentDate: 'June-01-2024',
//             doctor: 'Gernett De',
//             firstSurgery: 'Completed',
//             consultNote: 'Yes',
//             readyToReturn: 'Yes',
//         },
//         {
//             name: 'Chains Nancy',
//             dob: 'Aug-16-1994',
//             consult: 'Corneal',
//             dateSent: 'Apr-01-2024',
//             appointmentDate: 'Nov-01-2024',
//             doctor: 'Harris Nancy',
//             firstSurgery: 'Pending',
//             consultNote: 'Yes',
//             readyToReturn: 'No',
//         },
//     ];

//     if (isLoading) {
//         return (
//             <>
//                 <div>Loading...</div>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//             </>
//         );
//     }

//     if (isError) {
//         return (
//             <>
//                 <div>Error: {error.message}</div>
//             </>
//         );
//     }

//     const handleAddReferral = () => {
//         navigate('/add-patient'); // Redirect to the "/add-patient" route
//     };

//     // Render dynamic data in the dashboard
//     return (
//         <div>
//             <h5>Dashboard</h5>
//             <div>
//                 <div className="row">
//                     <div className="column">
//                         <div className="card">
//                             <div className="card-content">
//                                 <div className="card-left">
//                                     <img src={refferal_placed} alt="Green" height="25px" width="25px" />
//                                     <p className="card-text">Referrals Placed</p>
//                                 </div>
//                                 <div className="card-right">
//                                     <p>{data?.referCount || 0}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="column">
//                         <div className="card">
//                             <div className="card-content">
//                                 <div className="card-left">
//                                     <img src={refferal_completed} alt="Green" height="25px" width="25px" />
//                                     <p className="card-text">Referrals Completed</p>
//                                 </div>
//                                 <div className="card-right">
//                                     <p>{data?.referCompleted || 0}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="column">
//                         <div className="card">
//                             <div className="card-content">
//                                 <div className="card-left">
//                                     <img src={md} alt="Green" height="25px" width="25px" />
//                                     <p className="card-text">Doctor OD/MD</p>
//                                 </div>
//                                 <div className="card-right">
//                                     <p>{data?.docCount || 0}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Dynamic Table */}
//             <div className="table-section">
//                 <div className="header-container">
//                     <h6>Referral Patient Table</h6>
//                     <button onClick={handleAddReferral} className="btn-addrefer">+ Add Referral Patient</button>
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
//                             {referralPatients.map((patient, index) => (
//                                 <tr key={index}>
//                                     <td>{patient.name}</td>
//                                     <td>{patient.dob}</td>
//                                     <td>{patient.consult}</td>
//                                     <td>{patient.dateSent}</td>
//                                     <td>{patient.appointmentDate}</td>
//                                     <td>{patient.doctor}</td>
//                                     <td>
//                                         <span
//                                             className={`status-box ${patient.firstSurgery === 'Completed'
//                                                 ? 'status-schedule'
//                                                 : 'status-pending'
//                                                 }`}
//                                         >
//                                             {patient.firstSurgery}
//                                         </span>
//                                     </td>

//                                     <td>{patient.consultNote}</td>
//                                     <td>{patient.readyToReturn}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

///////////////////////
import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import refferal_placed from '../Assets/5be148eb11e3f4de1fe4.svg';
import refferal_completed from '../Assets/77540cee2e45a0c333cd.svg';
import md from '../Assets/0685f1c668f1deb33e75.png';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch user data dynamically from the backend
    const getUserData = async () => {
        const response = await api.get(`${Local.GET_USER}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return the data from the API response
    };

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getUserData,
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

    const handleAddReferral = () => {
        navigate('/add-patient'); // Redirect to the "/add-patient" route
    };

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
                                    <img src={refferal_placed} alt="Green" height="25px" width="25px" />
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
                                    <img src={refferal_completed} alt="Green" height="25px" width="25px" />
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
                                    <img src={md} alt="Green" height="25px" width="25px" />
                                    <p className="card-text">Doctor OD/MD</p>
                                </div>
                                <div className="card-right">
                                    <p>{data?.docCount || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Table */}
            <div className="table-section">
                <div className="header-container">
                    <h6>Referral Patient Table</h6>
                    <button onClick={handleAddReferral} className="btn-addrefer">+ Add Referral Patient</button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>DOB</th>
                                <th>Consult</th>
                                <th>Date Sent</th>
                                <th>Appointment Date</th>
                                <th>Doctor OD/MD</th>
                                <th>First Surgery</th>
                                <th>Consult Note</th>
                                <th>Ready To Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.referralPatients?.length > 0 ? (
                                data.referralPatients.map((patient: any, index: number) => (
                                    <tr key={index}>
                                        <td>{patient.name}</td>
                                        <td>{patient.dob}</td>
                                        <td>{patient.consult}</td>
                                        <td>{patient.dateSent}</td>
                                        <td>{patient.appointmentDate}</td>
                                        <td>{patient.doctor}</td>
                                        <td>
                                            <span
                                                className={`status-box ${patient.firstSurgery === 'Completed'
                                                    ? 'status-schedule'
                                                    : 'status-pending'
                                                    }`}
                                            >
                                                {patient.firstSurgery}
                                            </span>
                                        </td>
                                        <td>{patient.consultNote}</td>
                                        <td>{patient.readyToReturn}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center">
                                        No referral data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
