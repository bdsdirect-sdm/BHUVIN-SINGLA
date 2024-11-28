import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance'; // Axios instance for API calls
import './PatientList.css';

const ITEMS_PER_PAGE = 5; // Define items per page

const ReferralPatients: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter patients based on the search query
  const filteredPatients = searchQuery
    ? patients?.filter((patient: any) =>
      `${patient.firstname} ${patient.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    : patients;

  // Pagination logic
  const totalPages = Math.ceil((filteredPatients?.length || 0) / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients?.slice(
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
            {paginatedPatients?.map((patient: any, index: number) => (
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

export default ReferralPatients;
