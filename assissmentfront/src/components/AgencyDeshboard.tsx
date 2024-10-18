// AgencyDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogout } from '../services/operations/userAPI';

const AgencyDashboard = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state: any) => state.user);
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ['agency'],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:4401/api/v1/getAllSeekers`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }
    });

    const logout = useLogout(dispatch, navigate);

    const handleResponse = async (seekerId: any, action: string) => {
        try {
            await axios.post(`http://localhost:4401/api/v1/respondToSeeker`, {
                seekerId,
                action
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error responding to seeker:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Job Seekers for Your Agency</h1>

            <div className="md:grid-cols-2 lg:grid-cols-3">
                {data?.sekeers.map((seeker: any, i: number) => (
                    <div key={i} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <img
                            src={`http://localhost:4401/${seeker.profile_image}`}
                            alt={`${seeker.name}'s profile`}
                            className="w-24 h-24 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-lg font-semibold">{seeker.name}</h2>
                        <p className="text-gray-600">{seeker.email}</p>
                        <p className="text-gray-600">{seeker.phoneNo}</p>
                        <div>
                            <button onClick={() => handleResponse(seeker.id, 'accept')} className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">
                                Accept
                            </button>
                            <button onClick={() => handleResponse(seeker.id, 'decline')} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
                                Decline
                            </button>
                        </div>
                    </div>
                ))}

                <button type='button' onClick={logout} className='bg-blue-500 hover:bg-blue-700 text-white'>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AgencyDashboard;
