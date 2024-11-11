import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Dashboard: React.FC = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, []);

    const getUser = async () => {
        // try{
        console.log("Hello")
        const response = await api.get(`${Local.GET_USER}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Response-------->", response);
        return response;
        // }
        // catch(err){
        //     console.log("Error-------->", err);
        // }
    }

    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getUser
    })

    if (isLoading) {
        return (
            <>
                <div>Loading...</div>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </>
        )
    }

    if (isError) {
        return (
            <>
                <div>Error: {error.message}</div>
            </>
        )
    }
    console.log("Data--------->", data?.data);
    return (
        <div>
            <b>Doctor Name:</b> {data?.data.user.firstname} {data?.data.user.lastname} <br />
            <b>Doctor Type:</b> {(data?.data.user.doctype == 2) && (<>
                OD
            </>)}
            {(data?.data.user.doctype == 1) && (<>
                MD
            </>)}<br />
            <button onClick={() => window.location.href = '/add-address'}>
                Add Address
            </button>
        </div>
    )
}

export default Dashboard
