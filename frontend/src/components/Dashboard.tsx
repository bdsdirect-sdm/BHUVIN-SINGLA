import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import '../Styling/Dashboard.css';

// Image Imports
import refferal_placed from "../Assets/img1.svg";
import refferal_completed from "../Assets/img2.svg";
import md from "../Assets/img3.png";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [page, setPage] = useState<number>(1);
    const search = '';
    let totalPages: number;

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const getUser = async () => {
        try {
            const response = await api.get(`${Local.GET_USER}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response;
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const fetchPatients = async (pageno: number, search: string) => {
        try {
            const response = await api.get(
                `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return response.data;
        } catch (err: any) {
            console.error('Error fetching patients:', err.response?.data?.message);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
    });

    const {
        data: patientList,
        isLoading: patientLoading,
        isError: patientError,
    } = useQuery({
        queryKey: ['patient', page, search],
        queryFn: () => fetchPatients(page, search),
    });

    const viewNavigator = (patientUUID: string) => {
        localStorage.setItem('patientId', patientUUID);
        navigate('/view-patient');
    };

    const directChat = (
        patient: any,
        user1: any,
        user2: any,
        user: any,
        firstname: string,
        lastname: string
    ) => {
        const chatData = {
            patient,
            user1,
            user2,
            user,
            roomname: `${firstname} ${lastname}`,
        };
        localStorage.setItem('pname', chatData.roomname);
        localStorage.setItem('chatdata', JSON.stringify(chatData));
        navigate('/chat');
    };

    if (isLoading || patientLoading) {
        return (
            <div className="loading-icon">
                <div className="spinner-border text-primary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="fs-2">Loading...</div>
            </div>
        );
    }

    if (isError || patientError) {
        return (
            <>
                <div>Error: {error?.message}</div>
            </>
        );
    }

    totalPages = Math.ceil((patientList?.totalpatients || 0) / 10);

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-title">Dashboard</h3>

            <div className="dashboard-cards">


                {/* Referrals Placed Card */}
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-content">
                        <div className="card-left">
                            <p>Referrals Placed</p>
                            <div className="image-container">
                                <img src={refferal_placed} alt="Referrals Placed" />
                            </div>
                        </div>
                        <h3>{data?.data.referCount ?? 0}</h3>
                    </div>
                    <p className="card-text text-secondary">Last update: 18 Dec</p>
                </div>

                {/* Referrals Completed Card */}
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-content">
                        <div className="card-left">
                            <p>Referrals Completed</p>
                            <div className="image-container">
                                <img src={refferal_completed} alt="Referrals Completed" />
                            </div>
                        </div>
                        <h3>{data?.data.referCompleted ?? 0}</h3>
                    </div>
                    <p className="card-text text-secondary">Last update: 18 Dec</p>
                </div>

                {/* Doctor OD/MD Card */}
                <div className="card" onClick={() => navigate('/doctor')}>
                    <div className="card-content">
                        <div className="card-left">
                            <p>
                                {localStorage.getItem('doctype') === '1'
                                    ? 'Doctor OD/MD'
                                    : 'Doctor MD'}
                            </p>
                            <div className="image-container">
                                <img src={md} alt="Doctor OD/MD" />
                            </div>
                        </div>
                        <h3>{data?.data.docCount ?? 0}</h3>
                    </div>
                    <p className="card-text text-secondary">Last update: 18 Dec</p>
                </div>
            </div>


            <h5>Referrals Placed</h5>


            {/* Referral Patients Table */}


            <div className="header-container">

                {localStorage.getItem('doctype') === '2' && (
                    <button
                        className="btn-addrefer"
                        onClick={() => navigate('/add-patient')}
                    >
                        + Add Referral Patient
                    </button>
                )}
            </div>

            <table className="patient-table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>DOB</th>
                        <th>Disease</th>
                        <th>Date Sent</th>
                        <th>Appointment Date</th>
                        <th>Referred To</th>
                        <th>Status</th>
                        <th>Consult Note</th>
                        <th>Ready to Return</th>
                        <th>Direct Message</th>
                    </tr>
                </thead>
                <tbody>
                    {patientList?.patientList?.map((patient: any) => (
                        <tr key={patient.uuid}>
                            <td>{`${patient.firstname} ${patient.lastname}`}</td>
                            <td>Nov-21-2024</td>
                            <td>{patient.disease || '--'}</td>
                            <td>Nov-11-2024</td>
                            <td>{patient.patientId?.date || '--'}</td>
                            <td>{`${patient.referedto?.firstname || ''} ${patient.referedto?.lastname || ''}`}</td>
                            <td>
                                {patient.referalstatus === 1
                                    ? 'Completed'
                                    : 'Pending'}
                            </td>
                            <td>
                                <Link to="#" onClick={() => alert('Under Process')}>
                                    Yes
                                </Link>
                            </td>
                            <td>{patient.referback ? 'Yes' : 'No'}</td>
                            <td
                                className="chat-link"
                                onClick={() =>
                                    directChat(
                                        patient.uuid,
                                        patient.referedby?.uuid,
                                        patient.referedto?.uuid,
                                        data?.data.user.uuid,
                                        patient.firstname,
                                        patient.lastname
                                    )
                                }
                            >
                                Link
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Dashboard;


// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate, Link } from 'react-router-dom';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import '../Styling/Dashboard.css';

// import refferal_placed from "../Assets/img1.svg";
// import refferal_completed from "../Assets/img2.svg";
// import md from "../Assets/img3.png";

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');
//     const [page, setPage] = useState<number>(1);
//     const search = '';
//     let totalPages: number;

//     useEffect(() => {
//         if (!token) {
//             navigate('/login');
//         }
//     }, [token, navigate]);

//     const getUser = async () => {
//         try {
//             const response = await api.get(`${Local.GET_USER}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             return response;
//         } catch (err) {
//             console.error('Error fetching user:', err);
//         }
//     };

//     const fetchPatients = async (pageno: number, search: string) => {
//         try {
//             const response = await api.get(
//                 `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             return response.data;
//         } catch (err: any) {
//             console.error('Error fetching patients:', err.response?.data?.message);
//         }
//     };

//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ['user'],
//         queryFn: getUser,
//     });

//     const {
//         data: patientList,
//         isLoading: patientLoading,
//         isError: patientError,
//     } = useQuery({
//         queryKey: ['patient', page, search],
//         queryFn: () => fetchPatients(page, search),
//     });

//     const viewNavigator = (patientUUID: string) => {
//         localStorage.setItem('patientId', patientUUID);
//         navigate('/view-patient');
//     };

//     const directChat = (
//         patient: any,
//         user1: any,
//         user2: any,
//         user: any,
//         firstname: string,
//         lastname: string
//     ) => {
//         const chatData = {
//             patient,
//             user1,
//             user2,
//             user,
//             roomname: `${firstname} ${lastname}`,
//         };
//         localStorage.setItem('pname', chatData.roomname);
//         localStorage.setItem('chatdata', JSON.stringify(chatData));
//         navigate('/chat');
//     };

//     if (isLoading || patientLoading) {
//         return (
//             <div className="loading-icon">
//                 <div className="spinner-border text-primary me-2" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//                 <div className="fs-2">Loading...</div>
//             </div>
//         );
//     }

//     if (isError || patientError) {
//         return (
//             <>
//                 <div>Error: {error?.message}</div>
//             </>
//         );
//     }

//     totalPages = Math.ceil(patientList?.totalpatients / 10);

//     return (
//         <div className="dashboard-container">
//             <h3 className="dashboard-title">Dashboard</h3>

//             <div className="dashboard-cards">
//                 {/* Referrals Placed Card */}
//                 <div className="card">
//                     <div className="card-content">
//                         <div className="image-container bg-gradient">
//                             <img src={refferal_placed} alt="Referrals Placed" />
//                         </div>
//                         <div className="card-details">
//                             <h6>Referrals Placed</h6>
//                             <h3>5</h3>
//                             <p className="card-text">Last update: Dec 18</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Referrals Completed Card */}
//                 <div className="card">
//                     <div className="card-content">
//                         <div className="image-container bg-gradient">
//                             <img src={refferal_completed} alt="Referrals Completed" />
//                         </div>
//                         <div className="card-details">
//                             <h6>Referrals Completed</h6>
//                             <h3>0</h3>
//                             <p className="card-text">Last update: Dec 18</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* MD Card */}
//                 <div className="card">
//                     <div className="card-content">
//                         <div className="image-container bg-gradient">
//                             <img src={md} alt="MD" />
//                         </div>
//                         <div className="card-details">
//                             <h6>OD/MD</h6>
//                             <h3>68</h3>
//                             <p className="card-text">Last update: Dec 17</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <h5>Referrals Placed</h5>

//             {/* Referral Patients Table */}
//             <div className="patients-section">
//                 <div className="header-container">

//                     {localStorage.getItem('doctype') === '2' && (
//                         <button
//                             className="btn-addrefer"
//                             onClick={() => navigate('/add-patient')}
//                         >
//                             + Add Patient
//                         </button>
//                     )}
//                 </div>

//                 <table className="patient-table">
//                     <thead>
//                         <tr>
//                             <th>Patient Name</th>
//                             <th>DOB</th>
//                             <th>Disease</th>
//                             <th>Date Sent</th>
//                             <th>Appointment Date</th>
//                             <th>Referred To</th>
//                             <th>Status</th>
//                             <th>Consult Note</th>
//                             <th>Ready to Return</th>
//                             <th>Direct Message</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {patientList.patientList.map((patient: any) => (
//                             <tr key={patient.uuid}>
//                                 <td>{`${patient.firstname} ${patient.lastname}`}</td>
//                                 <td>Nov-21-2024</td>
//                                 <td>{patient.disease}</td>
//                                 <td>Nov-11-2024</td>
//                                 <td>{patient.patientId?.date || '--'}</td>
//                                 <td>{`${patient.referedto.firstname} ${patient.referedto.lastname}`}</td>
//                                 <td>
//                                     {patient.referalstatus === 1
//                                         ? 'Completed'
//                                         : 'Pending'}
//                                 </td>
//                                 <td>
//                                     <Link to="#" onClick={() => alert('Under Process')}>
//                                         Yes
//                                     </Link>
//                                 </td>
//                                 <td>{patient.referback ? 'Yes' : 'No'}</td>
//                                 <td
//                                     className="chat-link"
//                                     onClick={() =>
//                                         directChat(
//                                             patient.uuid,
//                                             patient.referedby.uuid,
//                                             patient.referedto.uuid,
//                                             data?.data.user.uuid,
//                                             patient.firstname,
//                                             patient.lastname
//                                         )
//                                     }
//                                 >
//                                     Link
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;