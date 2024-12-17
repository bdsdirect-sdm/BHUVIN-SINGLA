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

    totalPages = Math.ceil(patientList?.totalpatients / 10);

    return (
        <div className="dashboard-container">
            <h3 className="dashboard-title">Dashboard</h3>

            {/* Cards Section */}
            <div className="dashboard-cards">
                {/* Referrals Placed Card */}
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-content">
                        <div className="card-left">
                            <p>Referrals Placed</p>
                            <div className="image-container">
                                <img
                                    src={refferal_placed}
                                    alt="Referrals Placed"
                                    height="50px"
                                    width="50px"
                                />
                            </div>
                            <h3>{data?.data.referCount}</h3>
                        </div>
                        <p className="card-text text-secondary">Last update: 17 Dec</p>
                    </div>
                </div>

                {/* Referrals Completed Card */}
                <div className="card" onClick={() => navigate('/patient')}>
                    <div className="card-content">
                        <div className="card-left">
                            <p>Referrals Completed</p>
                            <div className="image-container">
                                <img
                                    src={refferal_completed}
                                    alt="Referrals Placed"
                                    height="50px"
                                    width="50px"
                                />
                            </div>

                            <h3>{data?.data.referCompleted}</h3>
                        </div>
                        <p className="card-text text-secondary">Last update: 17 Dec</p>
                    </div>
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
                                <img src={md} alt="Doctor OD/MD" height="50px" width="50px" />
                            </div>
                            <h3>{data?.data.docCount}</h3>
                        </div>
                        <p className="card-text text-secondary">Last update: 17 Dec</p>
                    </div>
                </div>
            </div>

            {/* Referral Patients Table */}
            <div className="patients-section">
                <div className="header-container">
                    <h5>Referral Patients</h5>
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
                        {patientList.patientList.map((patient: any) => (
                            <tr key={patient.uuid}>
                                <td>{`${patient.firstname} ${patient.lastname}`}</td>
                                <td>Nov-21-2024</td>
                                <td>{patient.disease}</td>
                                <td>Nov-11-2024</td>
                                <td>{patient.patientId?.date || '--'}</td>
                                <td>{`${patient.referedto.firstname} ${patient.referedto.lastname}`}</td>
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
                                            patient.referedby.uuid,
                                            patient.referedto.uuid,
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
        </div>
    );
};

export default Dashboard;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
// import { Bar, Pie, Line } from 'react-chartjs-2';

// import api from "../api/axiosInstance";
// import { Local } from "../environment/env";
// import "../Styling/Dashboard.css";
// // import "./PatientList.css";

// import refferal_placed from "../Assets/5be148eb11e3f4de1fe4.svg";
// import refferal_completed from "../Assets/77540cee2e45a0c333cd.svg";
// import md from "../Assets/0685f1c668f1deb33e75.png";

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");
//     const doctype = localStorage.getItem("doctype");
//     const [page, setPage] = useState<number>(1);
//     const [search, setSearch] = useState("");
//     const [input, setInput] = useState("");

//     useEffect(() => {
//         if (!token) navigate("/login");
//     }, [token, navigate]);

//     const fetchUserData = async () => {
//         const response = await api.get(`${Local.GET_USER}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return response.data;
//     };

//     const fetchPatient = async (pageno: number, search: string) => {
//         try {
//             const response = await api.get(
//                 `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             setInput("");
//             return response.data;
//         } catch (err) {
//             toast.error(`${err}`);
//         }
//     };

//     const {
//         data: userData,
//         isError: userError,
//         error: userErrorMsg,
//         isLoading: userLoading,
//     } = useQuery({
//         queryKey: ["dashboard"],
//         queryFn: fetchUserData,
//     });

//     const {
//         data: Patients,
//         error: patientError,
//         isLoading: patientLoading,
//         isError: patientIsError,
//     } = useQuery({
//         queryKey: ["patient", page, search],
//         queryFn: () => fetchPatient(page, search),
//     });

//     if (userLoading || patientLoading) {
//         return (
//             <div className="loading-container">
//                 <div>Loading...</div>
//                 <div className="spinner-border text-primary" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                 </div>
//             </div>
//         );
//     }

//     if (userError) {
//         return <div>Error: {userErrorMsg?.message || "Failed to load user data"}</div>;
//     }

//     if (patientIsError) {
//         return <div>Error: {patientError?.message || "Failed to load patient data"}</div>;
//     }

//     // Data for charts
//     const pieData = {
//         labels: ["Referrals Placed", "Referrals Completed", "Doctors OD/MD"],
//         datasets: [
//             {
//                 label: "# of Data Points",
//                 data: [
//                     userData?.referCount || 0,
//                     userData?.referCompleted || 0,
//                     userData?.docCount || 0,
//                 ],
//                 backgroundColor: ["#58EBB3", "#5BE6D4", "#5AE2F5"],
//                 hoverBackgroundColor: ["#58EBB3", "#5BE6D4", "#5AE2F5"],
//             },
//         ],
//     };

//     const barData = {
//         labels: ["Referrals Placed", "Referrals Completed", "Doctors OD/MD"],
//         datasets: [
//             {
//                 label: "Count",
//                 data: [
//                     userData?.referCount || 0,
//                     userData?.referCompleted || 0,
//                     userData?.docCount || 0,
//                 ],
//                 backgroundColor: ["#58EBB3", "#5BE6D4", "#5AE2F5"],
//             },
//         ],
//     };

//     const lineData = {
//         labels: ["Placed", "Completed", "Doctors"],
//         datasets: [
//             {
//                 label: "Trends",
//                 data: [
//                     userData?.referCount || 0,
//                     userData?.referCompleted || 0,
//                     userData?.docCount || 0,
//                 ],
//                 fill: false,
//                 borderColor: "#4bc0c0",
//             },
//         ],
//     };

//     return (
//         <div className="main-content-dashboard">
//             <h5>Dashboard</h5>
//             <div className="row">
//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={refferal_placed} alt="Referrals Placed" height="30px" width="30px" />
//                                 <p className="card-text"><b>Referrals Placed</b></p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{userData?.referCount || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={refferal_completed} alt="Referrals Completed" height="30px" width="30px" />
//                                 <p className="card-text"><b>Referrals Completed</b></p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{userData?.referCompleted || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="column">
//                     <div className="card">
//                         <div className="card-content">
//                             <div className="card-left">
//                                 <img src={md} alt="Doctor OD/MD" height="30px" width="30px" />
//                                 <p className="card-text"><b>Doctor OD/MD</b></p>
//                             </div>
//                             <div className="card-right">
//                                 <p>{userData?.docCount || 0}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Charts Row */}
//             {/* <div className="charts-row">
//                 <div className="chart-container">
//                     <Pie data={pieData} />
//                 </div>
//                 <div className="chart-container">
//                     <Bar data={barData} />
//                 </div>
//                 <div className="chart-container">
//                     <Line data={lineData} />
//                 </div>
//             </div> */}

//             {/* Referral Patient Table */}
//             <div className="patient-list-container">
//                 <header className="header">
//                     <h3 className="heading-patients-dashboard">Referral Patient</h3>
//                     {doctype === "1" && (
//                         <button className="add-patient-btn-dashboard" onClick={() => navigate("/add-patient")}>
//                             + Add Appointment
//                         </button>
//                     )}
//                 </header>
//                 <table className="patient-table">
//                     <thead>
//                         <tr>
//                             <th>Patient Name</th>
//                             <th>Disease</th>
//                             <th>Refer by</th>
//                             <th>Refer to</th>
//                             <th>Refer back</th>
//                             <th>Status</th>
//                             <th>Chat</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {Patients?.patientList?.map((patient: any, index: number) => (
//                             <tr key={index}>
//                                 <td>{patient?.firstname} {patient?.lastname}</td>
//                                 <td>{patient?.disease}</td>
//                                 <td>{patient?.referedby?.firstname} {patient?.referedby?.lastname}</td>
//                                 <td>{patient?.referedto?.firstname} {patient?.referedto?.lastname}</td>
//                                 <td>{patient?.referback ? "Yes" : "No"}</td>
//                                 <td>{patient?.referalstatus ? "Completed" : "Pending"}</td>
//                                 <td>
//                                     <a className="chat-link" onClick={() => navigate("/chat")}>Link</a>
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
