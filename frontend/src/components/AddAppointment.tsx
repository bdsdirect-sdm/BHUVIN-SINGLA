import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "../Styling/AddAppointment.css";

const AddAppointment: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [patientName, setPatientName] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Navigate to appointment list or another page after successful addition
            navigate("/appointment");
        } catch (err) {
            setError("Failed to add appointment. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="add-appointment-container">
            <div className="header-container">
                <h6>Add Appointment</h6>
            </div>

            {error && <div className="text-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label htmlFor="patientName">Patient Name</label>
                    <input
                        type="text"
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="appointmentDate">Appointment Date</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="type">Type</label>
                    <input
                        type="text"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Appointment"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/appointment")}
                        className="cancel-btn"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAppointment;
