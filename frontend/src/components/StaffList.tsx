import React, { useState, useEffect } from "react";
import "../Styling/Staff.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const Staff: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await api.get("/staff", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStaffList(response.data.staff || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError("Failed to fetch staff data");
        setLoading(false);
      }
    };
    fetchStaffData();
  }, [token]);

  const handleDeleteStaff = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const response = await api.delete(`staff/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data.message);
        setStaffList(staffList.filter((staff) => staff.uuid !== id));
      } catch (err) {
        console.error("Error deleting staff:", err);
        alert("Failed to delete staff member.");
      }
    }
  };

  const filteredStaffList = staffList.filter((staff: any) =>
    staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.gender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStaffList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStaffList = filteredStaffList.slice(startIndex, startIndex + itemsPerPage);

  const handleAddStaff = () => navigate("/add-staff");
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handlePageClick = (page: number) => setCurrentPage(page);

  if (loading) return <div>Loading staff list...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div className="staff-container">
      <div className="header-container">
        <h6>Staff List</h6>
        <button className="add-staff-btn" onClick={handleAddStaff}>
          + Add Staff
        </button>
      </div>

      <input
        type="text"
        placeholder="Search"
        className="search-input2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Gender</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStaffList.length > 0 ? (
              currentStaffList.map((staff: any) => (
                <tr key={staff.uuid}>
                  <td>{staff.staffName}</td>
                  <td>{staff.email}</td>
                  <td>{staff.contact}</td>
                  <td>{staff.gender}</td>
                  <td>
                    <button className="stafflist-delete-button" onClick={() => handleDeleteStaff(staff.uuid)}><MdDelete /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  No staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
          «
        </button>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          ‹
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          ›
        </button>
        <button onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>
          »
        </button>
      </div>
    </div>
  );
};

export default Staff;


// import React, { useState, useEffect } from "react";
// import "../Styling/Staff.css";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axiosInstance";

// const Staff: React.FC = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const token = localStorage.getItem("token");
//   const [staffList, setStaffList] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         const response = await api.get("/staff", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setStaffList(response.data.staff || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching staff data:", err);
//         setError("Failed to fetch staff data");
//         setLoading(false);
//       }
//     };
//     fetchStaffData();
//   }, []);

//   const filteredStaffList = staffList.filter((staff: any) =>
//     staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     staff.gender.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredStaffList.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentStaffList = filteredStaffList.slice(startIndex, startIndex + itemsPerPage);

//   const handleAddStaff = () => navigate("/add-staff");
//   const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
//   const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const handlePageClick = (page: number) => setCurrentPage(page);

//   if (loading) return <div>Loading staff list...</div>;
//   if (error) return <div className="text-danger">Error: {error}</div>;

//   return (
//     <div className="staff-container">
//       <div className="header-container">
//         <h6>Staff List</h6>
//         <button className="add-staff-btn" onClick={handleAddStaff}>
//           + Add Staff
//         </button>
//       </div>

//       <input
//         type="text"
//         placeholder="Search"
//         className="search-input2"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//       />

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               {/* <th>Select</th> */}
//               <th>Staff Name</th>
//               <th>Email</th>
//               <th>Contact</th>
//               <th>Gender</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentStaffList.length > 0 ? (
//               currentStaffList.map((staff: any) => (
//                 <tr key={staff.uuid.id}>
//                   {/* <td>
//                     <input type="checkbox" />
//                   </td> */}
//                   <td>{staff.staffName}</td>
//                   <td>{staff.email}</td>
//                   <td>{staff.contact}</td>
//                   <td>{staff.gender}</td>
//                   <td><button>Delete</button></td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>
//                   No staff found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <button onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
//           «
//         </button>
//         <button onClick={handlePreviousPage} disabled={currentPage === 1}>
//           ‹
//         </button>
//         {[...Array(totalPages)].map((_, index) => (
//           <button
//             key={index + 1}
//             className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
//             onClick={() => handlePageClick(index + 1)}
//           >
//             {index + 1}
//           </button>
//         ))}
//         <button onClick={handleNextPage} disabled={currentPage === totalPages}>
//           ›
//         </button>
//         <button onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>
//           »
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Staff;
