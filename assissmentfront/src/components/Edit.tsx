// import React, { useEffect, useState } from 'react'
// import SignupOrEditForm from './SignupLoginForm'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// // import { Toast } from 'react-toastify/dist/components'
// // import toast from "react-toastify"
// // import { get } from 'http'
// // import Signup from './Signup'
// // import Login from './Login'


// let initialValues = {
//   firstName : "",
//   lastName:"",
//   email:"",
//   dateOfBirth:"",
//   gender:"",
//   phoneNo:""

// }

// const Edit:React.FC= ()=> {
//     const [data,setData] = useState(null);

//     const navigate = useNavigate();

//     const token = localStorage.getItem("bearerToken");
//     const getValues = async()=>{
//       try{
//         const response = await axios.get('http://localhost:3001/user/profile',
//           {
//             headers:{
//               "Authorization":`Bearer ${token}`
//             }
//           }
//         )
//         // toast.success("successfully updated")
//         const userdata = response?.data?.user;
//         setData(userdata);
//       } catch(error){
//         console.log("Unable to send data");
//       }
//     }

//     const handleOnSubmit = async(values:any)=>{
//       try{
//         const  response = await axios.put('http://localhost:3001/user/updateProfile',values,
//           {
//             headers:{
//               "Authorization":`Bearer ${token}`
//             }
//           }
//         );
//         navigate("/signup")
//       }
//       catch(error){
//         console.log(error)
//       }
//     }

//     useEffect(()=>{
//       getValues();
//     },[])

//     // console.log
//     return (<div>
//     <div>
//      {data && <SignupOrEditForm mode={"edit"}  initialValues={data} handleOnSubmit = {handleOnSubmit}/>}
//     </div>
//   </div>)
// }

// export default Edit;


export {};