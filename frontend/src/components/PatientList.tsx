import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import './PatientList.css';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype = localStorage.getItem("doctype");
  const [page] = useState<number>(1);
  const [search] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchPatient = async (pageno: number, search: string) => {
    try {
      const response = await api.get(
        `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInput("");
      return response.data;
    } catch (err) {
      toast.error(`${err}`);
    }
  };

  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ["patient", page, search],
    queryFn: () => fetchPatient(page, search),
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Patient List", 14, 20);
    doc.setFontSize(12);
    doc.text(`Page: ${page}`, 14, 28);

    const tableData = Patients?.patientList?.map((patient: any, index: number) => [
      index + 1,
      `${patient?.firstname} ${patient?.lastname}`,
      patient?.disease,
      `${patient?.referedby?.firstname} ${patient?.referedby?.lastname}`,
      `${patient?.referedto?.firstname} ${patient?.referedto?.lastname}`,
      patient?.referback ? "Yes" : "No",
      patient?.referalstatus ? "Completed" : "Pending",
    ]);

    doc.autoTable({
      head: [["#", "Patient Name", "Disease", "Referred By", "Referred To", "Refer Back", "Status"]],
      body: tableData,
      startY: 35,
    });

    doc.save("Patient_List.pdf");
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return <div className="error-message">Error: {error.message}</div>;
  }

  return (
    <div className="patient-list-container">
      {/* Header Section */}
      <header className="header">
        <h4 className="heading-patients">Referral Patients</h4>
      </header>

      {/* Add Patient Button */}
      {doctype === "1" && (
        <div className="add-patient-btn-container">
          <button className="add-patient-btn" onClick={() => navigate("/add-patient")}>
            + Add Referral Patient
          </button>
        </div>
      )}

      {/* Search Input */}
      <input
        className="search-input"
        type="search"
        name="find"
        value={input}
        placeholder="Search"
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Patient Table */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>DOB</th>
            <th>Doctor OD/MD</th>
            <th>Referred On</th>
            <th>Appointment Date</th>
            <th>Surgery Date</th>
            <th>Direct Message</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Patients?.patientList?.map((patient: any, index: number) => (
            <tr key={index}>
              <td>{patient?.firstname} {patient?.lastname}</td>
              <td>{patient?.dob}</td>
              <td>{patient?.doctor}</td>
              <td>Dec-25-2024</td>
              <td>Dec-25-2024</td>
              <td>Dec-25-2024</td>
              <td>
                <button className="chat-link" onClick={() => navigate("/chat")}>
                  Message
                </button>
              </td>
              <td>Pending</td>
              <td>
                <button className="eye-btn" onClick={() => navigate(`/view-patient/${patient.id}`)}>
                  👁️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PDF Download Button */}
      <button className="download-pdf-btn" onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
};

export default PatientList;





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import api from "../api/axiosInstance";
// import { Local } from "../environment/env";
// import './PatientList.css';

// const PatientList: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const doctype = localStorage.getItem("doctype");
//   const [page, setPage] = useState<number>(1);
//   const [search, setSearch] = useState("");
//   const [input, setInput] = useState("");

//   useEffect(() => {
//     if (!token) navigate("/login");
//   }, [token, navigate]);

//   const fetchPatient = async (pageno: number, search: string) => {
//     try {
//       const response = await api.get(
//         `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setInput("");
//       return response.data;
//     } catch (err) {
//       toast.error(`${err}`);
//     }
//   };

//   const { data: Patients, error, isLoading, isError } = useQuery({
//     queryKey: ["patient", page, search],
//     queryFn: () => fetchPatient(page, search),
//   });

//   const generatePDF = () => {
//     const doc = new jsPDF();

//     doc.text("Patient List", 14, 20);
//     doc.setFontSize(12);
//     doc.text(`Page: ${page}`, 14, 28);

//     const tableData = Patients?.patientList?.map((patient: any, index: number) => [
//       index + 1,
//       `${patient?.firstname} ${patient?.lastname}`,
//       patient?.disease,
//       `${patient?.referedby?.firstname} ${patient?.referedby?.lastname}`,
//       `${patient?.referedto?.firstname} ${patient?.referedto?.lastname}`,
//       patient?.referback ? "Yes" : "No",
//       patient?.referalstatus ? "Completed" : "Pending",
//     ]);

//     doc.autoTable({
//       head: [["#", "Patient Name", "Disease", "Referred By", "Referred To", "Refer Back", "Status"]],
//       body: tableData,
//       startY: 35,

//     });

//     doc.save("Patient_List.pdf");
//   };

//   if (isLoading) {
//     return (
//       <div className="spinner-container">
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   if (isError) {
//     return <div className="error-message">Error: {error.message}</div>;
//   }

//   return (
//     <div className="patient-list-container">
//       <header className="header">
//         <h4 className="heading-patients">Referral Patient</h4>
//         {doctype === "2" && (
//           <button className="add-patient-btn" onClick={() => navigate("/add-patient")}>
//             + Add Referral Patient
//           </button>
//         )}
//       </header>


//       <input
//         className="search-input"
//         type="search"
//         name="find"
//         value={input}
//         placeholder="Search"
//         onChange={(e) => setInput(e.target.value)}
//       />

//       <button className="download-pdf-btn" onClick={generatePDF}>
//         Download PDF
//       </button>


//       <table className="patient-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Patient Name</th>
//             <th>Disease</th>
//             <th>Refer by</th>
//             <th>Refer to</th>
//             <th>Refer back</th>
//             <th>Status</th>
//             <th>Chat</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Patients?.patientList?.map((patient: any, index: number) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{patient?.firstname} {patient?.lastname}</td>
//               <td>{patient?.disease}</td>
//               <td>{patient?.referedby?.firstname} {patient?.referedby?.lastname}</td>
//               <td>{patient?.referedto?.firstname} {patient?.referedto?.lastname}</td>
//               <td>{patient?.referback ? "Yes" : "No"}</td>
//               <td>{patient?.referalstatus ? "Completed" : "Pending"}</td>
//               <td>
//                 <button className="chat-link" onClick={() => navigate("/chat")}>
//                   Link
//                 </button>
//               </td>
//               <td>
//                 <button className="view-btn" onClick={() => navigate("/view-patient")}>
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PatientList;
