import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styling/Appointment.css';

const Appointment: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <div className="header-container">
                <h5>Referral Patients</h5>
                {localStorage.getItem('doctype') === '1' && (
                    <button
                        className="btn-addrefer"
                        onClick={() => navigate('/add-appointment')} >
                        + Add Appointment
                    </button>
                )}
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button">Search</button>
            </div>


            <table className="appointment-table">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Complete Appointment</th>
                        <th>Cancel Appointment</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Row 1 */}
                    <tr>
                        <td>John Doe</td>
                        <td>2024-12-18</td>
                        <td>General Checkup</td>
                        <td>Pending</td>
                        <td>
                            <button className="complete-btn">Complete</button>
                        </td>
                        <td>
                            <button className="cancel-btn">Cancel</button>
                        </td>
                    </tr>
                    {/* Row 2 */}
                    <tr>
                        <td>Jane Smith</td>
                        <td>2024-12-19</td>
                        <td>Dental Checkup</td>
                        <td>Completed</td>
                        <td>
                            <button className="complete-btn">Complete</button>
                        </td>
                        <td>
                            <button className="cancel-btn">Cancel</button>
                        </td>
                    </tr>
                    {/* Row 3 */}
                    <tr>
                        <td>Michael Johnson</td>
                        <td>2024-12-20</td>
                        <td>Eye Examination</td>
                        <td>Cancelled</td>
                        <td>
                            <button className="complete-btn">Complete</button>
                        </td>
                        <td>
                            <button className="cancel-btn">Cancel</button>
                        </td>
                    </tr>
                    {/* No Data Fallback */}
                </tbody>
            </table>
        </div>
    );
};

export default Appointment;



// import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/axiosInstance'; // Axios instance for API calls
// import '../Styling/Appointment.css';

// const ITEMS_PER_PAGE = 5; // Define items per page

// const Appointment: React.FC = () => {
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');

//     const [searchQuery, setSearchQuery] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);

//     const fetchAppointments = async () => {
//         const response = await api.get('/appointments', {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         return response.data.appointments; // Adjust according to your API response
//     };

//     const { data: appointments, isLoading, isError, error } = useQuery({
//         queryKey: ['appointments'],
//         queryFn: fetchAppointments,
//     });

//     const handleAddAppointment = () => {
//         navigate('/add-appointment');
//     };

//     const clearSearch = () => {
//         setSearchQuery('');
//     };

//     // Filter appointments based on the search query
//     const filteredAppointments = searchQuery
//         ? appointments?.filter((appointment: any) =>
//             `${appointment.patientName} ${appointment.doctorName}`
//                 .toLowerCase()
//                 .includes(searchQuery.toLowerCase())
//         )
//         : appointments;

//     // Pagination logic
//     const totalPages = Math.ceil((filteredAppointments?.length || 0) / ITEMS_PER_PAGE);
//     const paginatedAppointments = filteredAppointments?.slice(
//         (currentPage - 1) * ITEMS_PER_PAGE,
//         currentPage * ITEMS_PER_PAGE
//     );

//     const handlePageChange = (page: number) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//         }
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
//         return <div>Error: {error?.message || 'Failed to load appointments'}</div>;
//     }

//     return (
//         <div className="appointment-container">
//             <div className="main-header">
//                 <h5>Appointments</h5>
//                 <button className="btn-add-appointment" onClick={handleAddAppointment}>
//                     + Add Appointment
//                 </button>
//             </div>

//             <div className="search-container">
//                 <input
//                     type="text"
//                     placeholder="Search"
//                     className="search-input"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 <button className="clear-btn" onClick={clearSearch}>
//                     ✕
//                 </button>
//             </div>

//             <div className="table-container">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Patient Name</th>
//                             <th>Doctor Name</th>
//                             <th>Appointment Date</th>
//                             <th>Time</th>
//                             <th>Status</th>
//                             <th>Notes</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {paginatedAppointments?.map((appointment: any, index: number) => (
//                             <tr key={index}>
//                                 <td>{appointment.patientName}</td>
//                                 <td>{appointment.doctorName}</td>
//                                 <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
//                                 <td>{appointment.time}</td>
//                                 <td>
//                                     <div
//                                         className={`status-box ${appointment.status === 'Completed'
//                                             ? 'status-completed'
//                                             : appointment.status === 'Scheduled'
//                                                 ? 'status-scheduled'
//                                                 : 'status-pending'
//                                             }`}
//                                     >
//                                         {appointment.status || 'Pending'}
//                                     </div>
//                                 </td>
//                                 <td>{appointment.notes || 'N/A'}</td>
//                                 <td>
//                                     <button className="action-button">...</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="pagination">
//                 <button
//                     className="pagination-btn"
//                     disabled={currentPage === 1}
//                     onClick={() => handlePageChange(currentPage - 1)}
//                 >
//                     &laquo;
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                     <button
//                         key={i}
//                         className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
//                         onClick={() => handlePageChange(i + 1)}
//                     >
//                         {i + 1}
//                     </button>
//                 ))}
//                 <button
//                     className="pagination-btn"
//                     disabled={currentPage === totalPages}
//                     onClick={() => handlePageChange(currentPage + 1)}
//                 >
//                     &raquo;
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Appointment;

