import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; // Axios instance for API calls
import '../Styling/Appointment.css';

const ITEMS_PER_PAGE = 5; // Define items per page

const Appointment: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAppointments = async () => {
        const response = await api.get('/appointments', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.appointments; // Adjust according to your API response
    };

    const { data: appointments, isLoading, isError, error } = useQuery({
        queryKey: ['appointments'],
        queryFn: fetchAppointments,
    });

    const handleAddAppointment = () => {
        navigate('/add-appointment');
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    // Filter appointments based on the search query
    const filteredAppointments = searchQuery
        ? appointments?.filter((appointment: any) =>
            `${appointment.patientName} ${appointment.doctorName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
        : appointments;

    // Pagination logic
    const totalPages = Math.ceil((filteredAppointments?.length || 0) / ITEMS_PER_PAGE);
    const paginatedAppointments = filteredAppointments?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
        return <div>Error: {error?.message || 'Failed to load appointments'}</div>;
    }

    return (
        <div className="appointment-container">
            <div className="main-header">
                <h5>Appointments</h5>
                <button className="btn-add-appointment" onClick={handleAddAppointment}>
                    + Add Appointment
                </button>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="clear-btn" onClick={clearSearch}>
                    ✕
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Doctor Name</th>
                            <th>Appointment Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAppointments?.map((appointment: any, index: number) => (
                            <tr key={index}>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.doctorName}</td>
                                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <div
                                        className={`status-box ${appointment.status === 'Completed'
                                            ? 'status-completed'
                                            : appointment.status === 'Scheduled'
                                                ? 'status-scheduled'
                                                : 'status-pending'
                                            }`}
                                    >
                                        {appointment.status || 'Pending'}
                                    </div>
                                </td>
                                <td>{appointment.notes || 'N/A'}</td>
                                <td>
                                    <button className="action-button">...</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &laquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default Appointment;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './Appointment.css';

// const Appointment: React.FC = () => {
//     const [appointments, setAppointments] = useState<any[]>([]); // Initialize as an empty array
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     // Fetch appointment data
//     useEffect(() => {
//         const fetchAppointments = async () => {
//             try {
//                 const response = await axios.get('/appointments'); // Replace with your actual API endpoint
//                 if (Array.isArray(response.data)) {
//                     setAppointments(response.data); // Only set if it's an array
//                 } else {
//                     setAppointments([]); // Fallback to an empty array if the response is not an array
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching appointments:', err);
//                 setError('Failed to fetch appointments');
//                 setLoading(false);
//                 setAppointments([]); // Ensure appointments is set to an empty array in case of error
//             }
//         };

//         fetchAppointments();
//     }, []);

//     if (loading) {
//         return <div>Loading appointments...</div>;
//     }

//     if (error) {
//         return <div className="text-danger">Error: {error}</div>;
//     }

//     return (
//         <div className="appointment-container">
//             <h6>Appointments</h6>
//             <table className="appointment-table">
//                 <thead>
//                     <tr>
//                         <th>Appointment ID</th>
//                         <th>Patient Name</th>
//                         <th>Doctor Name</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {appointments.length > 0 ? (
//                         appointments.map((appointment) => (
//                             <tr key={appointment.id}>
//                                 <td>{appointment.id}</td>
//                                 <td>{appointment.patientName}</td>
//                                 <td>{appointment.doctorName}</td>
//                                 <td>{appointment.date}</td>
//                                 <td>{appointment.time}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan={5} style={{ textAlign: 'center' }}>
//                                 No appointments found
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default Appointment;
