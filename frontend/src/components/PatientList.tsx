import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import eyeLogo from "../Assets/eye_logo.png";

import "../Styling/PatientList.css";

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype = localStorage.getItem("doctype");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch patient API
  const fetchPatient = async (pageno: number, searchQuery: string) => {
    try {
      const response = await api.get(
        `${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      toast.error(`Error fetching patients: ${err}`);
    }
  };

  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ["patient", page, search],
    queryFn: () => fetchPatient(page, search),
  });

  // Generate PDF
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
      <header className="header">
        <h4 className="heading-patients">Referral Patients</h4>
      </header>

      {/* Actions Section */}
      <div className="actions-container">
        <input
          className="search-input"
          type="text"
          value={search}
          placeholder="Search patients..."
          onChange={(e) => setSearch(e.target.value)}
        />
        {doctype === "2" && (
          <button className="add-patient-btn" onClick={() => navigate("/add-patient")}>
            + Add Referral Patient
          </button>
        )}
        <button className="download-pdf-btn" onClick={generatePDF}>
          Download PDF
        </button>
      </div>

      {/* Patients Table */}
      <table className="patient-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Disease</th>
            <th>Referred By</th>
            <th>Referred To</th>
            <th>Refer Back</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Patients?.patientList?.map((patient: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{`${patient?.firstname} ${patient?.lastname}`}</td>
              <td>{patient?.disease}</td>
              <td>{`${patient?.referedby?.firstname} ${patient?.referedby?.lastname}`}</td>
              <td>{`${patient?.referedto?.firstname} ${patient?.referedto?.lastname}`}</td>
              <td>{patient?.referback ? "Yes" : "No"}</td>
              <td>
                <span
                  className={`status-tag ${patient?.referalstatus ? "status-completed" : "status-pending"}`}
                >
                  {patient?.referalstatus ? "Completed" : "Pending"}
                </span>
              </td>
              <td>
                <button
                  className="eye-btn"
                  onClick={() => navigate(`/view-patient/${patient.id}`)}
                >
                  <img src={eyeLogo} alt="View Patient" className="eye-logo" height="25px" width="25px" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="page-info">Page {page}</span>
        <button
          className="pagination-btn"
          disabled={!Patients?.hasNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientList;
