// //DoctorList.tsx
// import React, { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import api from '../api/axiosInstance'; // Ensure correct path to Axios instance
// import { Local } from '../environment/env'; // Environment variable for endpoint
// import { useNavigate } from 'react-router-dom';
// import '../Styling/DoctorList.css';

// const DoctorList: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [searchQuery, setSearchQuery] = useState(''); // State for search query
//   const [currentPage, setCurrentPage] = useState(1);
//   const doctorsPerPage = 5;

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   // Function to fetch the doctor list
//   const fetchDoctorList = async () => {
//     const response = await api.get(`${Local.GET_DOC_LIST}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data; // Return the doctor list data from the API response
//   };

//   // Use React Query to fetch the doctor list
//   const { data, isError, error, isLoading } = useQuery({
//     queryKey: ['doctorList'],
//     queryFn: fetchDoctorList,
//   });

//   // Handle loading state
//   if (isLoading) {
//     return (
//       <>
//         <div>Loading...</div>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </>
//     );
//   }

//   // Handle error state
//   if (isError) {
//     return (
//       <>
//         <div>Error: {error.message}</div>
//       </>
//     );
//   }

//   // Filter doctors based on search query
//   const filteredDoctors = searchQuery
//     ? data?.docList.filter((doctor: any) =>
//       `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     : data?.docList;

//   // Pagination logic
//   const indexOfLastDoctor = currentPage * doctorsPerPage;
//   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
//   const currentDoctors = filteredDoctors?.slice(indexOfFirstDoctor, indexOfLastDoctor);

//   const nextPage = () => {
//     if (currentPage < Math.ceil(filteredDoctors?.length / doctorsPerPage)) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div>
//       <div className="table-section">
//         <div className="header-container">
//           <h6>OD/MD</h6>
//         </div>

//         {/* Search Box */}
//         <div className='main-div'>
//           <div className="search-container2">
//             <h5>Doctor</h5>
//             <input
//               type="text"
//               placeholder="Search"
//               className="search-input-doctor"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>

//           {/* Table */}
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Doctor Name</th>
//                   <th>Referral Placed</th>
//                   <th>Referral Completed</th>
//                   <th>Avg Time of Contact</th>
//                   <th>Avg Time of Consult</th>
//                   <th>Phone</th>
//                   <th>Email</th>
//                   <th>Doctype</th>
//                   {/* <th>Action</th> */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentDoctors?.map((doctor: any, index: number) => (
//                   <tr key={index}>
//                     <td>{doctor.firstname + ' ' + doctor.lastname}</td>
//                     <td>-</td>
//                     <td>-</td>
//                     <td>-</td>
//                     <td>-</td>
//                     <td>{doctor.phone}</td>
//                     <td>{doctor.email}</td>
//                     <td>{doctor.doctype === 1 ? 'MD' : 'OD'}</td>
//                     {/* <td>
//                       <button className="action-btn"> &#58393; </button>
//                     </td> */}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination Controls */}
//         <div className="pagination">
//           <button
//             onClick={prevPage}
//             disabled={currentPage === 1}
//             className="page-arrow">
//             &lt;
//           </button>
//           {Array.from({ length: Math.ceil(filteredDoctors?.length / doctorsPerPage) }, (_, i) => (
//             <button
//               key={i + 1}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}>
//               {i + 1}
//             </button>
//           ))}
//           <button
//             onClick={nextPage}
//             disabled={currentPage === Math.ceil(filteredDoctors?.length / doctorsPerPage)}
//             className="page-arrow">
//             &gt;
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorList;

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // Ensure correct path to Axios instance
import { Local } from '../environment/env'; // Environment variable for endpoint
import { useNavigate } from 'react-router-dom';
import '../Styling/DoctorList.css';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const fetchDoctorList = async () => {
    const response = await api.get(`${Local.GET_DOC_LIST}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['doctorList'],
    queryFn: fetchDoctorList,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const filteredDoctors = searchQuery
    ? data?.docList.filter((doctor: any) =>
      `${doctor.firstname} ${doctor.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : data?.docList;

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
    <div className="doctor-list-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-box"
        />
        <button className="search-clear-button">X</button>
        <button className="search-submit-button">Search</button>
      </div>

      <div className="table-section">
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
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors?.map((doctor: any, index: number) => (
              <tr key={index}>
                <td>{`${doctor.firstname} ${doctor.lastname}`}</td>
                <td>0</td>
                <td>0</td>
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

      <div className="pagination-section">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &lt;
        </button>
        {Array.from({ length: Math.ceil(filteredDoctors?.length / doctorsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(filteredDoctors?.length / doctorsPerPage)}
          className="pagination-button"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default DoctorList;
