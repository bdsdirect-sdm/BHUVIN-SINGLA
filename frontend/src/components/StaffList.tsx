import React, { useState, useEffect } from 'react';
import './Staff.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Staff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]); // Ensure staffList is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch staff data from the backend API
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get('/staff-list?page=1&limit=10'); // Update with your endpoint
        setStaffList(response.data.staff || []); // Safeguard in case data is undefined
        setLoading(false);
      } catch (err) {
        console.error('Error fetching staff data:', err);
        setError('Failed to fetch staff data');
        setLoading(false);
      }
    };
    fetchStaffData();
  }, []);

  // Filter the staff list based on the search query
  const filteredStaffList = staffList.filter((staff: any) =>
    staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = () => {
    navigate('/add-staff');
  };

  if (loading) {
    return <div>Loading staff list...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="staff-container">
      {/* Heading with Staff List and Add Staff Button */}
      <div className="header-container">
        <h6>Staff List</h6>
        <button className="add-staff-btn" onClick={handleAddStaff}>+ Add Staff</button>
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
      </div>

      {/* Staff Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaffList.length > 0 ? (
              filteredStaffList.map((staff: any) => (
                <tr key={staff.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{staff.staffName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.contact}</td>
                  <td>{staff.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>No staff found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;



// import React, { useState } from 'react';
// import './Staff.css';
// import { useNavigate } from 'react-router-dom';
// const Staff: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [staffList] = useState([
//     { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123-456-7890', gender: 'Male' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', contact: '987-654-3210', gender: 'Female' },
//     { id: 3, name: 'Mark Wilson', email: 'mark@example.com', contact: '456-789-1234', gender: 'Male' },
//     // Add more staff data as needed
//   ]);

//   const navigate = useNavigate();

//   // Filter the staff list based on the search query
//   const filteredStaffList = staffList.filter(staff =>
//     staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.gender.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAddStaff = () => {
//     navigate('/add-staff');
//   }

//   return (
//     <div className="staff-container">
//       {/* Heading with Staff List and Add Staff Button */}
//       <div className="header-container">
//         <h6>Staff List</h6>
//         <button className="add-staff-btn" onClick={handleAddStaff} >+ Add Staff</button>
//       </div>

//       {/* Search Box */}
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search"
//           className="search-input"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
//         <button className="search-btn">Search</button>
//       </div>

//       {/* Staff Table */}
//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Select</th>
//               <th>Staff Name</th>
//               <th>Email</th>
//               <th>Contact</th>
//               <th>Gender</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStaffList.map((staff) => (
//               <tr key={staff.id}>
//                 <td>
//                   <input type="checkbox" />
//                 </td>
//                 <td>{staff.name}</td>
//                 <td>{staff.email}</td>
//                 <td>{staff.contact}</td>
//                 <td>{staff.gender}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Staff;
