// JobSeekersList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JobSeekersList: React.FC<{ agencyName: string }> = ({ agencyName }) => {
    const [jobSeekers, setJobSeekers] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchJobSeekers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/agency/job-seekers/${agencyName}`);
            setJobSeekers(response.data);
        } catch (error) {
            console.error("Error fetching job seekers:", error);
            toast.error("Failed to fetch job seekers.");
        }
    };

    useEffect(() => {
        fetchJobSeekers();
    }, [agencyName]);

    return (
        <div>
            <h2>Job Seekers List</h2>
            <ul>
                {jobSeekers.map((seeker) => (
                    <li key={seeker.id}>
                        {seeker.firstName} {seeker.lastName} - {seeker.email}
                        {/* Optionally, add buttons for accepting/declining requests */}
                        <button onClick={() => navigate(`/profile/${seeker.id}`)}>View Profile</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobSeekersList;
