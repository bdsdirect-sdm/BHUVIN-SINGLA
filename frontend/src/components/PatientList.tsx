// PatientList.tsx 
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; // Axios instance for API calls
import './PatientList.css';

const ReferralPatients: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [searchQuery, setSearchQuery] = useState('');

  const fetchPatientList = async () => {
    const response = await api.get('/patient-list', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.patientList;
  };

  const { data: patients, isLoading, isError, error } = useQuery({
    queryKey: ['patientList'],
    queryFn: fetchPatientList,
  });

  const handleAddReferral = () => {
    navigate('/add-patient');
  };

  const clearSearch = () => {
    setSearchQuery('');
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
    return <div>Error: {error?.message || 'Failed to load patient list'}</div>;
  }

  return (
    <div className="referral-container">
      <div className="main-header">
        <h5>Referred Patients</h5>
        <button className="btn-add-referral" onClick={handleAddReferral}>
          + Add Referral Patient
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
        <button className="search-btn">Search</button>
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
              <th>Status</th>
              <th>Consult Note</th>
              <th>Ready To Return</th>
              <th>Direct Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients?.map((patient: any, index: number) => (
              <tr key={index}>
                <td>{`${patient.firstname} ${patient.lastname}`}</td>
                <td>{new Date(patient.dob).toLocaleDateString()}</td>
                <td>{patient.disease}</td>
                <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
                <td>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
                <td>{`${patient.referedto?.firstname} ${patient.referedto?.lastname}`}</td>
                <td>
                  <div
                    className={`status-box ${patient.firstSurgery === 'Completed'
                      ? 'status-completed'
                      : patient.firstSurgery === 'Scheduled'
                        ? 'status-scheduled'
                        : 'status-pending'
                      }`}
                  >
                    {patient.firstSurgery || 'Pending'}
                  </div>
                </td>
                <td>{patient.consultNote || 'N/A'}</td>
                <td>{patient.referback ? 'Yes' : 'No'}</td>
                <td>
                  <a href="#" className="direct-message-link">
                    Link
                  </a>
                </td>
                <td>
                  <button className="action-button">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="pagination-btn">&laquo;</button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <button className="pagination-btn">&raquo;</button>
      </div>
    </div>
  );
};

export default ReferralPatients;



// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// import api from '../api/axiosInstance'; // Axios instance for API calls
// import './PatientList.css';

// const ReferralPatients: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   // Fetch patient list using React Query
//   const fetchPatientList = async () => {
//     const response = await api.get('/patient-list', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data.patientList;
//   };

//   const { data: patients, isLoading, isError, error } = useQuery({
//     queryKey: ['patientList'],
//     queryFn: fetchPatientList,
//     // onError: (err: any) => {
//     //   toast.error(err.response?.data?.message || 'Error fetching patient list');
//     // },
//   });

//   const handleAddReferral = () => {
//     navigate('/add-patient'); // Redirect to the "Add Patient" page
//   };

//   if (isLoading) {
//     return (
//       <div className="loading-container">
//         <div>Loading...</div>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return <div>Error: {error?.message || 'Failed to load patient list'}</div>;
//   }

//   return (
//     <div className="referral-container">
//       <div className="main-header">
//         <h5>Referred Patients</h5>
//         <button className="btn-add-referral" onClick={handleAddReferral}>
//           + Add Referral Patient
//         </button>
//       </div>

//       <div className='search-box'>

//       </div>

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Patient Name</th>
//               <th>DOB</th>
//               <th>Consult</th>
//               <th>Date Sent</th>
//               <th>Appointment Date</th>
//               <th>Doctor OD/MD</th>
//               <th>First Surgery</th>
//               <th>Consult Note</th>
//               <th>Ready To Return</th>
//               <th>Direct Message</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients?.map((patient: any, index: number) => (
//               <tr key={index}>
//                 <td>{`${patient.firstname} ${patient.lastname}`}</td>
//                 <td>{new Date(patient.dob).toLocaleDateString()}</td>
//                 <td>{patient.disease}</td>
//                 <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
//                 <td>{new Date(patient.appointmentDate).toLocaleDateString()}</td>
//                 <td>{`${patient.referedto?.firstname} ${patient.referedto?.lastname}`}</td>
//                 <td>
//                   <span
//                     className={
//                       patient.firstSurgery === 'Completed' ? 'completed' : 'pending'
//                     }
//                   >
//                     {patient.firstSurgery || 'Pending'}
//                   </span>
//                 </td>
//                 <td>{patient.consultNote || 'N/A'}</td>
//                 <td>{patient.referback ? 'Yes' : 'No'}</td>
//                 <td>
//                   <a href="#" className="direct-message-link">
//                     Link
//                   </a>
//                 </td>
//                 <td>
//                   <button className="action-button">...</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <button className="pagination-btn">&laquo;</button>
//         <button className="pagination-btn active">1</button>
//         <button className="pagination-btn">2</button>
//         <button className="pagination-btn">3</button>
//         <button className="pagination-btn">&raquo;</button>
//       </div>
//     </div>
//   );
// };

// export default ReferralPatients;