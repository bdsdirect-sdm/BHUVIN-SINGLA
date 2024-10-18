// SeekerDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogout } from '../services/operations/userAPI';

const SeekerDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state: any) => state.user);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['seekerDashboard'],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:4401/api/v1/getMyAgency`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }
    });

    const logout = useLogout(dispatch, navigate);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>Error fetching data: {error?.message}</div>;
    }

    return (
        <>
            <main>
                <section>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {data.agency.profile_image && (
                            <img
                                src={`http://localhost:4401/${data.agency.profile_image}`}
                                alt='Profile'
                                style={{
                                    borderRadius: '50%',
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    marginRight: '20px'
                                }}
                            />
                        )}
                        <div>
                            <h1>Your Agency Dashboard</h1>
                            {data.agency.firstName && (
                                <>
                                    Agency: {data.agency.firstName}<br />
                                    Email: {data.agency.email}<br />
                                    Phone: {data.agency.phoneNo}
                                </>
                            )}
                        </div>
                    </div>
                </section>
                <button type='button' onClick={logout}>
                    Logout
                </button>
            </main>
        </>
    );
}

export default SeekerDashboard;
