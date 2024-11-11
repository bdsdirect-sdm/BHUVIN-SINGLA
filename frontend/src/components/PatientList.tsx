import { useQuery } from '@tanstack/react-query';
import { Local } from '../environment/env';
import api from '../api/axiosInstance';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PatientList:React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[])

  const fetchPatient = async() => {
    try{
      const response = await api.get(`${Local.GET_PATIENT_LIST}`, {
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      return response.data;
    }
    catch(err){
      toast.error(`${err}`);
    }
  }
 
  const { data: Patients, error, isLoading, isError } = useQuery({
    queryKey: ['patient'],
    queryFn: fetchPatient
  })

  if(isLoading){
    return(
      <>
        <div>Loading...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}

  if(isError){
    return(
      <>
      <div className='text-danger' >Error: {error.message}</div>
      </>
      )}

  console.log("Patient-List------------>", Patients);
  return (
    <>
    <table className="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Patient Name</th>
      <th scope="col">Disease</th>
      <th scope="col">Refer by</th>
      <th scope="col">Refer to</th>
      <th scope="col">Refer back</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    {Patients.patientList.map((patient:any,index:number) =>(
      <>
      <tr>
        <td className='fw-bold' > {index+1} </td>
        <td>{patient.firstname} {patient.lastname}</td>
        <td> {patient.disease} </td>
        <td> {patient.referedby.firstname} {patient.referedby.lastname} </td>
        <td> {patient.referedto.firstname} {patient.referedto.lastname} </td>
        <td> {patient.referback && ("yes")} {patient.referback==false && ("No")} </td>
        <td> {patient.referalstatus && ("Completed")} {patient.referalstatus==false && ("Pending")} </td>
      </tr>
      </>
    ))}
  </tbody>
</table>
    </>
  )
}

export default PatientList
