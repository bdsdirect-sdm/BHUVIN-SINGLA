import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // Make sure to replace with the correct path to your Axios instance
import { Local } from '../environment/env'; // Your environment variable for endpoint
import { useNavigate } from 'react-router-dom';
import './DoctorList.css';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

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

  // Calculate the index of the last and first doctor for current page
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = data?.docList.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Pagination handler functions
  const nextPage = () => {
    if (currentPage < Math.ceil(data?.docList.length / doctorsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render the doctor list
  return (
    <div>
      {/* Doctor List Table */}
      <div className="table-section">
        <div className="header-container">
          <h6>Doctors List</h6>
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
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="prev"
        >
          &lt;
        </button>
        <span className="page-number">{currentPage}</span>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(data?.docList.length / doctorsPerPage)}
          className="next"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DoctorList;
