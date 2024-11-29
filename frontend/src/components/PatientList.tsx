import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import { Local } from "../environment/env";
import './PatientList.css';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const doctype = localStorage.getItem("doctype");
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  let totalPages;

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

  totalPages = Math.ceil(Patients?.totalpatients / 10);

  return (
    <div className="patient-list-container">
      <header className="header">
        <h4 className="heading-patients">Referred Patients</h4>
        {doctype === "2" && (
          <button className="add-patient-btn" onClick={() => navigate("/add-patient")}>
            + Add Referral Patient
          </button>
        )}
      </header>

      <div className="search-container">
        <input
          className="search-input"
          type="search"
          name="find"
          value={input}
          placeholder="Search"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={(e) => {
            setSearch(input);
            setPage(1);
            e.preventDefault();
          }}
        >
          Search
        </button>
      </div>

      <table className="patient-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Patient Name</th>
            <th>Disease</th>
            <th>Refer by</th>
            <th>Refer to</th>
            <th>Refer back</th>
            <th>Status</th>
            <th>Chat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Patients?.patientList?.map((patient: any, index: number) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{patient?.firstname} {patient?.lastname}</td>
              <td>{patient?.disease}</td>
              <td>{patient?.referedby?.firstname} {patient?.referedby?.lastname}</td>
              <td>{patient?.referedto?.firstname} {patient?.referedto?.lastname}</td>
              <td>{patient?.referback ? "Yes" : "No"}</td>
              <td>{patient?.referalstatus ? "Completed" : "Pending"}</td>
              <td>
                <button className="chat-link" onClick={() => navigate("/chat")}>
                  Link
                </button>
              </td>
              <td>
                <button className="view-btn" onClick={() => navigate("/view-patient")}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page < 2}
        >
          Prev
        </button>
        <button
          className="pagination-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PatientList;


// import { useQuery } from '@tanstack/react-query';
// import { Local } from '../environment/env';
// import api from '../api/axiosInstance';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { queryClient } from '../main';

// const PatientList: React.FC = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const doctype = localStorage.getItem("doctype");
//   const [page, setPage] = useState<number>(1);
//   const [search, setSearch] = useState('');
//   const [Input, setInput] = useState('');
//   let totalPages;

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     }

//   }, []);


//   const viewNavigator = (patientUUID: any) => {
//     localStorage.setItem("patientId", patientUUID);
//     navigate("/view-patient");
//   }

//   const updateNavigator = (patientUUID: any) => {
//     localStorage.setItem("patientId", patientUUID);
//     navigate("/update-patient");
//   }


//   const directChat = (patient: any, user1: any, user2: any, user: any, firstname: any, lastname: any) => {
//     const chatdata = {
//       patient: patient,
//       user1: user1,
//       user2: user2,
//       user: user,
//       roomname: `${firstname} ${lastname}`
//     };
//     localStorage.setItem("pname", chatdata.roomname);
//     localStorage.setItem('chatdata', JSON.stringify(chatdata));
//     navigate('/chat')
//     return;
//   }

//   const fetchPatient = async (pageno: any, search: any) => {
//     try {
//       const response = await api.get(`${Local.GET_PATIENT_LIST}?page=${pageno}&limit=10&find=${search}`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })
//       // console.log("Listing------------------------------------------------>", response.data)
//       setInput('');
//       return response.data;
//     }
//     catch (err) {
//       toast.error(`${err}`);
//     }
//   }

//   const { data: Patients, error, isLoading, isError } = useQuery({
//     queryKey: ['patient', page, search],
//     queryFn: () => fetchPatient(page, search)
//   })

//   if (isLoading) {
//     return (
//       <>
//         <div>Loading...</div>
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </>
//     )
//   }

//   if (isError) {
//     return (
//       <>
//         <div className='text-danger' >Error: {error.message}</div>
//       </>
//     )
//   }
//   // console.log(search);
//   // console.log(Input);
//   console.log("Patient-List------------>", Patients);
//   totalPages = Math.ceil(Patients?.totalpatients / 10);
//   console.log("xx ", totalPages);
//   return (
//     <>

//       <br />
//       <div className='d-flex' >

//         <input className='form-control w-25 border border-dark mx-3 mb-5' type="search" name="find" value={Input} onChange={(e: any) => { setInput(e.target.value) }} />
//         <button className='btn btn-outline-dark mb-5' type="submit"
//           onClick={(e: any) => {
//             setSearch(Input);
//             setPage(1);
//             e.preventDefault();
//           }}
//         >Search</button>
//       </div>

//       {doctype == '2' && (
//         <>
//           <button type="button" className='btn btn-primary py-2 float-end' onClick={() => {
//             navigate('/add-patient')
//           }}>+ Add Referral Patient </button>
//           <br /><br />
//         </>
//       )}
//       <hr />


//       <table className="table">
//         <thead>
//           <tr>
//             <th scope="col">#</th>
//             <th scope="col">Patient Name</th>
//             <th scope="col">Disease</th>
//             <th scope="col">Refer by</th>
//             <th scope="col">Refer to</th>
//             <th scope="col">Refer back</th>
//             <th scope="col">Status</th>
//             <th scope="col">Chat</th>
//             <th scope="col">Action </th>
//           </tr>
//         </thead>
//         <tbody>
//           {Patients?.patientList?.map((patient: any, index: number) => (
//             <>
//               <tr>
//                 <td className='fw-bold' > {index + 1} </td>
//                 <td>{patient?.firstname} {patient?.lastname}</td>
//                 <td> {patient?.disease} </td>
//                 <td> {patient?.referedby.firstname} {patient?.referedby?.lastname} </td>
//                 <td> {patient?.referedto.firstname} {patient?.referedto?.lastname} </td>
//                 <td> {patient?.referback && ("yes")} {patient?.referback == false && ("No")} </td>
//                 <td> {patient?.referalstatus && (<p className='text-success'>Completed</p>)} {patient?.referalstatus == false && (<p className='text-warning'>Pending</p>)} </td>
//                 <td> <p className='text-primary text-decoration-underline chng-pointer' onClick={() => {
//                   directChat(patient.uuid, patient.referedby.uuid, patient.referedto.uuid, Patients.user.uuid, patient.firstname, patient.lastname);
//                 }} >Link</p> </td>
//                 <td>
//                   <div>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye text-primary" viewBox="0 0 16 16"
//                       onClick={() => { viewNavigator(patient.uuid) }}
//                     >
//                       <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
//                       <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
//                     </svg>

//                     {doctype == '2' &&
//                       // (patient.isseen==true) &&     // Pending (Hide edit and delete after appointment is made)
//                       (
//                         <>
//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen mx-2" viewBox="0 0 16 16"
//                             onClick={() => { updateNavigator(patient.uuid) }}
//                           >
//                             <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
//                           </svg>

//                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash text-danger" viewBox="0 0 16 16" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
//                             <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
//                             <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
//                           </svg>

//                         </>
//                       )}
//                     <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
//                       <div className="modal-dialog">
//                         <div className="modal-content">
//                           <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="staticBackdropLabel">Delete Patient</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                           </div>
//                           <div className="modal-body">
//                             Are you Sure?
//                           </div>
//                           {/* <div className="modal-footer">
//                             <button type="button" className="btn btn-primary" onClick={() => { deletePatient(patient.uuid) }} data-bs-dismiss="modal">Yes</button>
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
//                           </div> */}
//                         </div>
//                       </div>
//                     </div>

//                   </div>
//                 </td>
//               </tr>
//             </>
//           ))}
//         </tbody>
//       </table>


//       <button className='btn btn-outline-dark mx-3' onClick={() => {
//         setPage((prev) => prev - 1)
//       }} disabled={page < 2 ? true : false} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-left" viewBox="0 0 16 16">
//           <path fill-rule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223" />
//         </svg> Prev</button>

//       <button className='btn btn-outline-dark mx-3' onClick={() => {
//         setPage((prev) => prev + 1)
//       }} disabled={page >= totalPages ? true : false}
//       >Next <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="0 0 16 16">
//           <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
//         </svg></button>


//     </>
//   )
// }

// export default PatientList


