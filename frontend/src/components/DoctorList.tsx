import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // Make sure to replace with the correct path to your Axios instance
import { Local } from '../environment/env'; // Your environment variable for endpoint
import { useNavigate } from 'react-router-dom';
import './DoctorList.css';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Function to fetch the doctor list
  const fetchDoctorList = async () => {
    const response = await api.get(`${Local.GET_DOC_LIST}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the doctor list data from the API response
  };

  // Use React Query to fetch the doctor list
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['doctorList'],
    queryFn: fetchDoctorList,
  });

  // Handle loading state
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

  // Handle error state
  if (isError) {
    return (
      <>
        <div>Error: {error.message}</div>
      </>
    );
  }

  // Filter doctors based on search query
  const filteredDoctors = searchQuery
    ? data?.docList.filter((doctor: any) =>
      `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : data?.docList;

  // Pagination logic
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors?.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredDoctors?.length / doctorsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* Doctor List Table */}
      <div className="table-section">
        <div className="header-container">
          <h6>Doctors List</h6>
        </div>

        {/* Search Box */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          <button className="search-btn">Search</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Referral Placed</th>
                <th>Referral Completed</th>
                <th>Avg Time of Contact</th>
                <th>Avg Time of Consult</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Doctype</th> {/* Added new Doctype column */}
              </tr>
            </thead>
            <tbody>
              {currentDoctors?.map((doctor: any, index: number) => (
                <tr key={index}>
                  <td>{doctor.firstname + ' ' + doctor.lastname}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.doctype === 1 ? 'MD' : 'OD'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="page-arrow">
            &lt;
          </button>
          {Array.from({ length: Math.ceil(filteredDoctors?.length / doctorsPerPage) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}>
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredDoctors?.length / doctorsPerPage)}
            className="page-arrow">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;