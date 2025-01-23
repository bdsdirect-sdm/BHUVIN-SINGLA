import React, { useState } from 'react';
import '../styling/sidebar.css'; // Import custom styles
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Local from '../environment/env'; // Your local environment variables
import api from '../api/axiosInstance'; // Axios instance
import { toast } from 'react-toastify'; // For toast notifications
import Button from '../common/components/CommonButton'; // Custom Button component

const AdminLogin: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [passType, setPassType] = useState('password');
    const [passVisible, setPassVisible] = useState(false); // Toggles password visibility

    // API call to log in the admin
    const loginAdmin = async (formData: any) => {
        try {
            // Replace with your actual API path
            const response = await api.post(`${Local.AUTH_ADMIN_USER}`, formData);
            toast.success(response.data.message); // Display success message
            localStorage.setItem("token", response.data.token); // Store token in local storage
            localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info
            navigate('/admin/app/dashboard'); // Redirect to the dashboard after successful login
        } catch (err: any) {
            toast.error(`${err.response?.data?.message || "Something went wrong"}`);
            console.error(err); // Log error in console
        }
    };

    // Validation schema for form inputs
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters long")
            .required("Password is required")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/\d/, "Password must contain at least one number")
            .matches(/[\`~!@#$%^&*()?<>|:{}(),.]/, "Password must contain at least one special character"),
    });

    // Mutation hook for login
    const loginMutation = useMutation({
        mutationFn: loginAdmin,
    });

    // Form submit handler
    const submitHandler = (values: any) => {
        loginMutation.mutate(values);
    };

    return (
        <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="login-form-container">
                <div className="mb-4">
                    <h1 className="text-center">ADMIN LOGIN</h1>
                    <hr className="opacity-100 rounded" />
                </div>

                {/* Formik form handling */}
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={submitHandler}
                >
                    {() => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <Field type="email" name="email" className="form-control" placeholder="admin@example.com" />
                                <ErrorMessage name="email" component="div" className="text-danger" />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="form-control p-0 d-flex">
                                    <Field type={passType} name="password" className="form-control border-0 w-100" placeholder="*********" />
                                    {passVisible ? (
                                        <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => { setPassVisible(false); setPassType('password'); }}></i>
                                    ) : (
                                        <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => { setPassVisible(true); setPassType('text'); }}></i>
                                    )}
                                </div>
                                <ErrorMessage name="password" component="div" className="text-danger" />
                            </div>

                            <div className="mb-4">
                                {/* You can add a 'forgot password' link here */}
                                {/* <Link to="/admin/forgot-password">Forgot Password?</Link> */}
                            </div>

                            <Button text="LOGIN" type="submit" /> {/* Custom button */}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AdminLogin;


// import React, { useState } from 'react';
// import '../styling/sidebar.css';
// import * as Yup from 'yup';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useMutation } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import Local from '../environment/env';
// import api from '../api/axiosInstance';
// import { toast } from 'react-toastify';
// import Button from '../common/components/CommonButton';

// const AdminLogin: React.FC = () => {
//     const navigate = useNavigate();
//     const [passType, setPassType] = useState('password');
//     const [passVisible, setPassVisible] = useState(0);

//     const loginAdmin = async (formData: any) => {
//         try {
//             const response = await api.post(`${Local.AUTH_ADMIN_USER}`, formData);
//             toast.success(response.data.message);
//             localStorage.setItem("token", response.data.token);
//             localStorage.setItem("user", JSON.stringify(response.data.user));
//             navigate('admin/app/dashboard');
//         } catch (err: any) {
//             toast.error(`${err.response.data.message}`);
//             console.error(err);
//         }
//     };

//     const validationSchema = Yup.object().shape({
//         email: Yup.string().email("Invalid email").required("Email is required"),
//         password: Yup.string().required("Password is required")
//     });

//     const loginMutation = useMutation({
//         mutationFn: loginAdmin,
//     });

//     const submitHandler = (values: any) => {
//         loginMutation.mutate(values);
//     };

//     return (
//         <div className='h-100'>
//             <div className='position-absolute p-4 ms-5 mt-5'>
//                 <div className='mt-5 mb-5'>
//                     <h1 className='text-3xl text-center position-absolute top-0 pb-0 ms-5'>Admin Login</h1>
//                     <hr className='opacity-100 rounded ms-5 pt-0 mt-0' />
//                 </div>

//                 <div className='ms-5'>
//                     <Formik
//                         initialValues={{
//                             email: '',
//                             password: ''
//                         }}
//                         validationSchema={validationSchema}
//                         onSubmit={submitHandler}
//                     >
//                         {() => (
//                             <Form>
//                                 <div className='row mb-3'>
//                                     <div className='col'>
//                                         <label className='form-label'>Email</label>
//                                         <Field type="email" name="email" className="form-control" placeholder="admin@example.com" />
//                                         <ErrorMessage name="email" component="div" className="text-danger" />
//                                     </div>
//                                 </div>
//                                 <div className='row mb-3'>
//                                     <div className='col'>
//                                         <label className='form-label'>Password</label>
//                                         <div className='form-control p-0 d-flex'>
//                                             <Field type={passType} name="password" className="form-control border-0 w-100" placeholder="*********" />
//                                             {passVisible === 1 ? (
//                                                 <i className="bi bi-eye me-3 pt-1 text-secondary" onClick={() => {
//                                                     setPassVisible(0);
//                                                     setPassType('password');
//                                                 }}></i>
//                                             ) : (
//                                                 <i className="bi bi-eye-slash me-3 pt-1 text-secondary" onClick={() => {
//                                                     setPassVisible(1);
//                                                     setPassType('text');
//                                                 }}></i>
//                                             )}
//                                         </div>
//                                         <ErrorMessage name="password" component="div" className="text-danger" />
//                                     </div>
//                                 </div>
//                                 <div className='mb-4'>
//                                     <Link className='Link' to='/admin/register'>Don't have an account? Register</Link>
//                                 </div>
//                                 <Button text="LOGIN" type="submit" />
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLogin;
