import React, { useState } from 'react';
import './Staff.css';

const Staff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', contact: '123-456-7890', gender: 'Male' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', contact: '987-654-3210', gender: 'Female' },
    { id: 3, name: 'Mark Wilson', email: 'mark@example.com', contact: '456-789-1234', gender: 'Male' },
    // Add more staff data as needed
  ]);

  // Filter the staff list based on the search query
  const filteredStaffList = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="staff-container">
      {/* Heading with Staff List and Add Staff Button */}
      <div className="header-container">
        <h6>Staff List</h6>
        <button className="add-staff-btn" >+ Add Staff</button>
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
            {filteredStaffList.map((staff) => (
              <tr key={staff.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.contact}</td>
                <td>{staff.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
